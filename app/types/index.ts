export interface Result {
  v: number; // Volume
  vw: number; // Volume-weighted average price
  o: number; // Open price
  c: number; // Close price
  h: number; // High price
  l: number; // Low price
  t: number; // Timestamp
  n: number; // Number of transactions
}

export interface ChartData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: Result[];
  status: string;
  request_id: string;
  count: number;
}

// export interface FormattedData {
//   id: string;
//   color: string;
//   data: Array<{
//     x: string; // Formatted date
//     y: number; // Close price
//   }>;
// }

export interface FormattedDataPoint {
  x: string;
  y: number;
}

export interface FormattedData {
  id: string;
  data: FormattedDataPoint[];
}

export interface TickerResults {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  market_cap: number;
  phone_number: string;
  address: {
    address1: string;
    city: string;
    state: string;
    postal_code: string;
  };
  description: string;
  sic_code: string;
  sic_description: string;
  ticker_root: string;
  homepage_url: string;
  total_employees: number;
  list_date: string;
  branding: {
    logo_url: string;
    icon_url: string;
  };
  share_class_shares_outstanding: number;
  weighted_shares_outstanding: number;
  round_lot: number;
}

export interface TickerData {
  request_id: string;
  results: TickerResults[];
  status: string;
}

export interface LoaderData {
  chartData: ChartData;
  tickerData: TickerData;
}

export interface PriceChangeInfo {
  percentage: number;
  startPrice: number;
  endPrice: number;
}

export interface TransformedChartData {
  chartLines: FormattedData[];
  priceChange: PriceChangeInfo;
}