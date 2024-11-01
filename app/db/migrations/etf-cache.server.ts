import { pool } from "../index.server";

export async function upsertETFCacheData(
  ticker: string,
  lastPrice: number,
  priceChangePercentage: number,
  chartData: any
) {
  const client = await pool.connect();
  try {
    const query = `
        INSERT INTO etf_cache (ticker, last_price, price_change_percentage, chart_data, last_updated)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (ticker) 
        DO UPDATE SET 
          last_price = EXCLUDED.last_price,
          price_change_percentage = EXCLUDED.price_change_percentage,
          chart_data = EXCLUDED.chart_data,
          last_updated = CURRENT_TIMESTAMP;
      `;
    await client.query(query, [
      ticker,
      lastPrice,
      priceChangePercentage,
      JSON.stringify(chartData),
    ]);
    console.log(`Cache generated/updated for ${ticker}`);
  } catch (error) {
    console.error(`Error updating cache for ${ticker}:`, error);
  } finally {
    client.release();
  }
}
