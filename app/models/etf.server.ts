import { pool } from "~/db/index.server";
import type { ETF } from "~/types/etf";
import { TIMEFRAMES, type TimeframeKey } from "~/services/polygon";

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
      console.log(`Data for ${ticker} retrieved from cache: ${timeframe}`);
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

function getStalenessThreshold(timeframe: TimeframeKey): number {
  const config = TIMEFRAMES[timeframe as TimeframeKey];

  // Convert timespan and multiplier to milliseconds
  switch (config.timespan) {
    case "minute":
      return config.multiplier * 60 * 1000;
    case "hour":
      return config.multiplier * 60 * 60 * 1000;
    case "day":
      return config.multiplier * 24 * 60 * 60 * 1000;
    default:
      return 5 * 60 * 1000; // 5 min default if unknown timeframe
  }
}

export async function isCacheStale(
  ticker: string,
  timeframe: TimeframeKey = "1W"
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

    // Get staleness threshold based on timeframe
    const threshold = getStalenessThreshold(timeframe);
    const thresholdDate = new Date(Date.now() - threshold);

    return priceLastUpdated < thresholdDate || chartLastUpdated < thresholdDate;
  } finally {
    client.release();
  }
}
