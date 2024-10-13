import { pool } from "./index.server";

export async function createETFTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS etf_info (
        id SERIAL PRIMARY KEY,
        ticker VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        market VARCHAR(50),
        locale VARCHAR(10),
        primary_exchange VARCHAR(10),
        type VARCHAR(10),
        active BOOLEAN,
        currency_name VARCHAR(10),
        cik VARCHAR(10),
        composite_figi VARCHAR(12),
        share_class_figi VARCHAR(12),
        last_updated_utc TIMESTAMP WITH TIME ZONE
      );

      CREATE INDEX IF NOT EXISTS idx_etfs_ticker ON etf_info(ticker);
    `);
    console.log("ETF information table created successfully");
  } catch (error) {
    console.error("Error creating ETF table:", error);
  } finally {
    client.release();
  }
}
