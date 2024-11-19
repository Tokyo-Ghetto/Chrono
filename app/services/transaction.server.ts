import { pool } from "~/db/index.server";

type TransactionType = "BUY" | "SELL";

interface TransactionDetails {
  userId: string;
  ticker: string;
  type: TransactionType;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  commission?: number;
}

export async function createTransaction(details: TransactionDetails) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const transactionQuery = `
      INSERT INTO transactions 
        (user_id, ticker, type, shares, price_per_share, total_amount, commission)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const transactionResult = await client.query(transactionQuery, [
      details.userId,
      details.ticker,
      details.type,
      details.shares,
      details.pricePerShare,
      details.totalAmount,
      details.commission || 0,
    ]);

    // Update or create portfolio holding
    const holdingQuery = `
      INSERT INTO portfolio_holdings 
        (user_id, ticker, total_shares, average_cost)
      VALUES 
        ($1, $2, $3, $4)
      ON CONFLICT (user_id, ticker) 
      DO UPDATE SET
        total_shares = CASE
          WHEN portfolio_holdings.total_shares = 0 
          THEN EXCLUDED.total_shares
          ELSE portfolio_holdings.total_shares + EXCLUDED.total_shares
        END,
        average_cost = CASE
          WHEN portfolio_holdings.total_shares = 0 
          THEN EXCLUDED.average_cost
          ELSE (portfolio_holdings.average_cost * portfolio_holdings.total_shares + $4 * $3) 
               / (portfolio_holdings.total_shares + $3)
        END,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const holdingResult = await client.query(holdingQuery, [
      details.userId,
      details.ticker,
      details.shares,
      details.pricePerShare,
    ]);

    await client.query("COMMIT");

    return {
      transaction: transactionResult.rows[0],
      holding: holdingResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}
