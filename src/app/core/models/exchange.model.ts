export interface CurrentExchangeRateResponse {
  success: boolean;
  from: string;
  to: string;
  exchangeRate: number;
  lastUpdatedAt: string;
  bidPrice: number;
  askPrice: number;
  rateLimitExceeded?: boolean;
}

export interface DailyExchangeRate {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface DailyExchangeRateResponse {
  success: boolean;
  from: string;
  to: string;
  data: DailyExchangeRate[];
  lastUpdatedAt: string;
  rateLimitExceeded?: boolean;
}
