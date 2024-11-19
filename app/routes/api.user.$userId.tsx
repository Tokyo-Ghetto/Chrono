import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getUser } from "~/services/user.server";
import { getAuth } from "@clerk/remix/ssr.server";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  // If no userId, user is not authenticated
  if (!userId) {
    return json({ message: "Unauthorized" }, 401);
  }

  // Only allow users to access their own data
  if (userId !== args.params.userId) {
    return json({ message: "Forbidden" }, 403);
  }

  const user = await getUser(userId);
  return json({ user });
};
