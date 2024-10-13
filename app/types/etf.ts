export interface ETF {
  id: number;
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: number;
  composite_figi?: string;
  share_class_figi?: string;
  last_updated_utc: Date;
}

export interface ETFDataResponse {
  results: ETF[];
  status?: string;
  request_id?: string;
  count?: number;
  next_url?: string;
}
