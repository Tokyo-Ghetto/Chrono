import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { createUser } from "~/services/user.server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/remix/api.server";

export const loader: LoaderFunction = async () => {
  return new Response("Webhook endpoint is working", { status: 200 });
};

export const action: ActionFunction = async ({ request }) => {
  console.log("Received webhook:", {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  });

  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const WEBHOOK_SECRET = process.env.VITE_CLERK_WEBHOOK_SECRET?.trim();
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const svix_id = request.headers.get("svix-id") ?? "";
  const svix_timestamp = request.headers.get("svix-timestamp") ?? "";
  const svix_signature = request.headers.get("svix-signature") ?? "";

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return json({ message: "Error occurred -- no svix headers" }, 400);
  }

  try {
    const rawBody = await request.text();
    console.log("Webhook payload:", rawBody);
    console.log("Webhook secret:", WEBHOOK_SECRET);

    const payloadHeaders = {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    };
    console.log("Verification headers:", payloadHeaders);

    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the payload
    const evt = wh.verify(rawBody, payloadHeaders) as WebhookEvent;
    console.log("Verified event:", evt);

    // Handle the webhook
    const { type } = evt;
    const eventData = evt.data;

    switch (type) {
      case "user.created":
        if (
          "email_addresses" in eventData &&
          Array.isArray(eventData.email_addresses)
        ) {
          await createUser(
            eventData.id,
            eventData.email_addresses[0]?.email_address || ""
          );
          console.log("User created successfully:", eventData.id);
        }
        break;
      default:
        console.log("Unhandled webhook type:", type);
    }

    return json({ message: "Webhook processed successfully" }, 200);
  } catch (error) {
    console.error("Webhook verification error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return json(
      {
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400
    );
  }
};
