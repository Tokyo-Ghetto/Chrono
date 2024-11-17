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

export async function createUserTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        settings JSONB DEFAULT '{"currency": "USD", "notifications": true}'::jsonb
      );

      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(user_id),
        ticker VARCHAR(10) NOT NULL,
        type VARCHAR(4) NOT NULL CHECK (type IN ('BUY', 'SELL')),
        shares DECIMAL(20,8) NOT NULL,
        price_per_share DECIMAL(20,2) NOT NULL,
        total_amount DECIMAL(20,2) NOT NULL,
        commission DECIMAL(10,2) DEFAULT 0,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        holding_id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(user_id),
        ticker VARCHAR(10) NOT NULL,
        total_shares DECIMAL(20,8) NOT NULL DEFAULT 0,
        average_cost DECIMAL(20,2) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, ticker)
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_user_id ON portfolio_holdings(user_id);
    `);
    console.log("User tables created successfully");
  } catch (error) {
    console.error("Error creating user tables:", error);
    throw error;
  } finally {
    client.release();
  }
}
