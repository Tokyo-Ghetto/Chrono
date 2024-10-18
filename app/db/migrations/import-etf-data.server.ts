import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../index.server";
import type { ETFDataResponse } from "~/types/etf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importETFData() {
  const client = await pool.connect();
  try {
    const jsonData = fs.readFileSync(
      path.join(__dirname, "../../../data/ticker_data.json"),
      "utf-8"
    );
    const data: ETFDataResponse = JSON.parse(jsonData);

    const values = data.results
      .map(
        (etf) => `(
    '${etf.ticker}',
    '${etf.name.replace(/'/g, "''")}',
    '${etf.market}',
    '${etf.locale}',
    '${etf.primary_exchange}',
    '${etf.type}',
    ${etf.active},
    '${etf.currency_name}',
    ${etf.composite_figi ? `'${etf.composite_figi}'` : "NULL"},
    ${etf.share_class_figi ? `'${etf.share_class_figi}'` : "NULL"},
    ${etf.cik ? `'${etf.cik}'` : "NULL"},
    '${etf.last_updated_utc}'
  )`
      )
      .join(",");

    const query = `
      INSERT INTO etf_info (
        ticker, name, market, locale, primary_exchange, type, active,
        currency_name, composite_figi, share_class_figi, cik, last_updated_utc
      )
      VALUES ${values}
      ON CONFLICT (ticker) DO UPDATE SET
        name = EXCLUDED.name,
        market = EXCLUDED.market,
        locale = EXCLUDED.locale,
        primary_exchange = EXCLUDED.primary_exchange,
        type = EXCLUDED.type,
        active = EXCLUDED.active,
        currency_name = EXCLUDED.currency_name,
        composite_figi = EXCLUDED.composite_figi,
        share_class_figi = EXCLUDED.share_class_figi,
        cik = EXCLUDED.cik,
        last_updated_utc = EXCLUDED.last_updated_utc
    `;

    await client.query(query);
    console.log("ETF data imported successfully");
  } catch (error) {
    console.error("Error importing ETF data:", error);
    throw error;
  } finally {
    client.release();
  }
}
