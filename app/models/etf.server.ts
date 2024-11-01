import { pool } from "~/db/index.server";
import type { ETF } from "~/types/etf";

export async function getETFByTicker(ticker: string): Promise<ETF | null> {
  const client = await pool.connect();
  try {
    const result = await client.query<ETF>(
      `SELECT etf_cache_price.*, etf_info.name 
      FROM etf_cache_price 
      INNER JOIN etf_info on etf_cache_price.ticker = etf_info.ticker 
      WHERE etf_cache_price.ticker = $1`,
      [ticker]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getCachedETFData(
  ticker: string,
  timeframe: string = "1W"
) {
  const client = await pool.connect();
  try {
    const priceResult = await client.query(
      `SELECT etf_cache_price.*, etf_info.name 
      FROM etf_cache_price 
      INNER JOIN etf_info on etf_cache_price.ticker = etf_info.ticker 
      WHERE etf_cache_price.ticker = $1`,
      [ticker]
    );

    const chartResult = await client.query(
      `SELECT chart_data 
      FROM etf_cache_chart 
      WHERE ticker = $1 AND timeframe = $2`,
      [ticker, timeframe]
    );

    if (priceResult.rows[0]) {
      console.log(`Data for ${ticker} retrieved from cache`);
    } else {
      console.log(`No cached data found for ${ticker}`);
    }

    return {
      ...priceResult.rows[0],
      chart_data: chartResult.rows[0]?.chart_data || null,
    };
  } finally {
    client.release();
  }
}

export async function isCacheStale(
  ticker: string,
  timeframe: string = "1W"
): Promise<boolean> {
  const client = await pool.connect();
  try {
    const priceResult = await client.query(
      "SELECT last_updated FROM etf_cache_price WHERE ticker = $1",
      [ticker]
    );
    const chartResult = await client.query(
      "SELECT last_updated FROM etf_cache_chart WHERE ticker = $1 AND timeframe = $2",
      [ticker, timeframe]
    );

    if (priceResult.rows.length === 0 || chartResult.rows.length === 0)
      return true;

    const priceLastUpdated = new Date(priceResult.rows[0].last_updated);
    const chartLastUpdated = new Date(chartResult.rows[0].last_updated);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    return (
      priceLastUpdated < fiveMinutesAgo || chartLastUpdated < fiveMinutesAgo
    );
  } finally {
    client.release();
  }
}
