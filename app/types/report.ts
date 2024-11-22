export interface PortfolioReportData {
  userName: string;
  reportDate: string;
  portfolioSummary: {
    totalValue: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
    numberOfHoldings: number;
  };
  holdings: {
    symbol: string;
    name: string;
    shares: number;
    averageCost: number;
    currentPrice: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercentage: number;
  }[];
  performanceMetrics: {
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
    volatility: number;
    sharpeRatio: number;
  };
}
