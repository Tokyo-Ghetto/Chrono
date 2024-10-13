import { pool } from "~/db/index.server";
import type { ETF } from "~/types/etf";

export async function getETFByTicker(ticker: string): Promise<ETF | null> {
  const client = await pool.connect();
  try {
    const result = await client.query<ETF>(
      "SELECT * FROM etf_info WHERE ticker = $1",
      [ticker]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
