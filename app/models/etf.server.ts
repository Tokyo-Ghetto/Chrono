import { pool } from "~/db/index.server";
import type { ETF } from "~/types/etf";

export async function getETFByTicker(ticker: string): Promise<ETF | null> {
  const client = await pool.connect();
  try {
    const result = await client.query<ETF>(
      `SELECT etf_cache.*, etf_info.name 
      FROM etf_cache 
      INNER JOIN etf_info on etf_cache.ticker=etf_info.ticker WHERE etf_cache.ticker = $1`,
      [ticker]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getCachedETFData(ticker: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT etf_cache.*, etf_info.name 
      FROM etf_cache 
      INNER JOIN etf_info on etf_cache.ticker=etf_info.ticker WHERE etf_cache.ticker = $1`,
      [ticker]
    );
    if (result.rows[0]) {
      console.log(`Data for ${ticker} retrieved from cache`);
    } else {
      console.log(`No cached data found for ${ticker}`);
    }
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

// Check if cache is older than 5 minutes
export async function isCacheStale(ticker: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT last_updated FROM etf_cache WHERE ticker = $1",
      [ticker]
    );
    if (result.rows.length === 0) return true;
    const lastUpdated = new Date(result.rows[0].last_updated);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastUpdated < fiveMinutesAgo;
  } finally {
    client.release();
  }
}
