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

export async function createETFCachePrice() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS etf_cache_price (
        id SERIAL PRIMARY KEY,
        ticker VARCHAR(10) NOT NULL UNIQUE,
        last_price NUMERIC(10, 2),
        price_change_percentage NUMERIC(5, 2),
        -- chart_data JSONB,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_ticker
          FOREIGN KEY(ticker) 
          REFERENCES etf_info(ticker)
          ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_etf_cache_price_ticker ON etf_cache_price(ticker);
    `);
    console.log("ETF price cache table created successfully");
  } catch (error) {
    console.error("Error creating ETF price cache table:", error);
  } finally {
    client.release();
  }
}

export async function createETFCacheChart() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS etf_cache_chart (
        id SERIAL PRIMARY KEY,
        ticker VARCHAR(10) NOT NULL,
        timeframe VARCHAR(5) NOT NULL, 
        chart_data JSONB,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (ticker, timeframe),
        CONSTRAINT fk_ticker
          FOREIGN KEY(ticker) 
          REFERENCES etf_info(ticker)
          ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_etf_cache_chart_ticker ON etf_cache_chart(ticker);
    `);
    console.log("ETF chart data cache table created successfully");
  } catch (error) {
    console.error("Error creating ETF chart data cache table:", error);
  } finally {
    client.release();
  }
}
