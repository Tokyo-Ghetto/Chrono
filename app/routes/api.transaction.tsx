import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { createTransaction } from "~/services/transaction.server";

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await args.request.formData();
    const transaction = await createTransaction({
      userId,
      ticker: formData.get("ticker") as string,
      type: formData.get("type") as "BUY" | "SELL",
      shares: Number(formData.get("shares")),
      pricePerShare: Number(formData.get("pricePerShare")),
      totalAmount: Number(formData.get("totalAmount")),
    });

    return json({ success: true, transaction });
  } catch (error) {
    console.error("Transaction error:", error);
    return json({ error: "Failed to process transaction" }, { status: 500 });
  }
};
