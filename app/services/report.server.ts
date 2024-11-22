import type { PortfolioReportData } from "~/types/report";
import { getUser } from "~/services/user.server";
import {
  getPortfolioHoldings,
  getPortfolioSummary,
} from "~/services/portfolio.server";

export const generateReportData = async (
  userId: string
): Promise<PortfolioReportData> => {
  // Fetch all required data in parallel
  const [user, holdings, summary] = await Promise.all([
    getUser(userId),
    getPortfolioHoldings(userId),
    getPortfolioSummary(userId),
  ]);

  // Transform the data to match the report format
  return {
    userName: `${user?.first_name} ${user?.last_name}` || "User",
    reportDate: new Date().toISOString(),
    portfolioSummary: {
      totalValue: summary.total_portfolio_value,
      totalGainLoss: summary.total_gain_loss,
      totalGainLossPercentage: summary.total_gain_loss_percentage,
      numberOfHoldings: holdings.length,
    },
    holdings: holdings.map((holding) => ({
      symbol: holding.ticker,
      name: holding.name,
      shares: Number(holding.total_shares),
      averageCost: holding.average_cost,
      currentPrice: holding.current_price,
      totalValue: holding.total_value,
      gainLoss: holding.total_gain_loss,
      gainLossPercentage: Number(holding.gain_loss_percentage),
    })),
    performanceMetrics: {
      // These could be fetched from another service if available
      dailyReturn: 0.5,
      weeklyReturn: 1.2,
      monthlyReturn: 2.8,
      yearlyReturn: 12.5,
      volatility: 15.3,
      sharpeRatio: 1.8,
    },
  };
};
