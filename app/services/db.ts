// import { Pool } from "pg";
// // import { TimeframeKey } from "./polygon";
// // import { ETFCache, TickerCache } from "../types/db-types";

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
// });

// // Initialize database tables
// export async function initDatabase() {
//   const client = await pool.connect();
//   try {
//     await client.query(`
//         CREATE TABLE IF NOT EXISTS etf_cache (
//           id SERIAL PRIMARY KEY,
//           ticker VARCHAR(10) NOT NULL,
//           timeframe VARCHAR(5) NOT NULL,
//           data JSONB NOT NULL,
//           last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//           UNIQUE(ticker, timeframe)
//         );

//         CREATE TABLE IF NOT EXISTS ticker_cache (
//           id SERIAL PRIMARY KEY,
//           ticker VARCHAR(10) NOT NULL UNIQUE,
//           data JSONB NOT NULL,
//           last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//         );

//         CREATE INDEX IF NOT EXISTS idx_etf_cache_ticker_timeframe ON etf_cache(ticker, timeframe);
//         CREATE INDEX IF NOT EXISTS idx_ticker_cache_ticker ON ticker_cache(ticker);
//       `);
//   } finally {
//     client.release();
//   }
// }
