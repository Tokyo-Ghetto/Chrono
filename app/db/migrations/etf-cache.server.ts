import { pool } from "../index.server";

export async function upsertETFCacheData(
  ticker: string,
  lastPrice: number,
  priceChangePercentage: number,
  chartData: object,
  timeframe: string = "1W"
) {
  const client = await pool.connect();
  try {
    // Update price cache
    const priceQuery = `
      INSERT INTO etf_cache_price (ticker, last_price, price_change_percentage, last_updated)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (ticker) 
      DO UPDATE SET 
        last_price = EXCLUDED.last_price,
        price_change_percentage = EXCLUDED.price_change_percentage,
        last_updated = CURRENT_TIMESTAMP;
    `;
    await client.query(priceQuery, [ticker, lastPrice, priceChangePercentage]);

    // Update chart cache
    const chartQuery = `
      INSERT INTO etf_cache_chart (ticker, timeframe, chart_data, last_updated)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (ticker, timeframe) 
      DO UPDATE SET 
        chart_data = EXCLUDED.chart_data,
        last_updated = CURRENT_TIMESTAMP;
    `;
    await client.query(chartQuery, [
      ticker,
      timeframe,
      JSON.stringify(chartData),
    ]);

    console.log(`Cache generated/updated for ${ticker}: ${timeframe}`);
  } catch (error) {
    console.error(`Error updating cache for ${ticker}:`, error);
  } finally {
    client.release();
  }
}
