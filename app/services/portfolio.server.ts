import { pool } from "~/db/index.server";

export interface PortfolioHolding {
  ticker: string;
  total_shares: number;
  average_cost: number;
  last_updated: Date;
  current_price: number;
  name: string;
  total_value: number;
  total_gain_loss: number;
  gain_loss_percentage: number;
}

export async function getPortfolioHoldings(
  userId: string
): Promise<PortfolioHolding[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        ph.ticker,
        ph.total_shares,
        ph.average_cost,
        ph.last_updated,
        ecp.last_price as current_price,
        ei.name,
        (ph.total_shares * ecp.last_price) as total_value,
        (ph.total_shares * ecp.last_price) - (ph.total_shares * ph.average_cost) as total_gain_loss,
        ((ecp.last_price - ph.average_cost) / ph.average_cost * 100) as gain_loss_percentage
      FROM portfolio_holdings ph
      JOIN etf_info ei ON ph.ticker = ei.ticker
      JOIN etf_cache_price ecp ON ph.ticker = ecp.ticker
      WHERE ph.user_id = $1 AND ph.total_shares > 0
      ORDER BY total_value DESC;
    `;

    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching portfolio holdings:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getPortfolioSummary(userId: string) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        SUM(ph.total_shares * ecp.last_price) as total_portfolio_value,
        SUM((ph.total_shares * ecp.last_price) - (ph.total_shares * ph.average_cost)) as total_gain_loss,
        CASE 
          WHEN SUM(ph.total_shares * ph.average_cost) > 0 
          THEN (SUM((ph.total_shares * ecp.last_price) - (ph.total_shares * ph.average_cost)) / 
                SUM(ph.total_shares * ph.average_cost)) * 100
          ELSE 0 
        END as total_gain_loss_percentage
      FROM portfolio_holdings ph
      JOIN etf_cache_price ecp ON ph.ticker = ecp.ticker
      WHERE ph.user_id = $1 AND ph.total_shares > 0;
    `;

    const result = await client.query(query, [userId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    throw error;
  } finally {
    client.release();
  }
}
