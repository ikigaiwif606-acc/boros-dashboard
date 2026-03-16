export interface ExchangeRate {
  rawRate: number;
  annualizedAPR: number;
  nextFundingTime: number | null;
  interval: string;
  fetchedAt: number;
}

export interface FundingRatesResponse {
  timestamp: string;
  assets: Record<string, Record<string, ExchangeRate>>;
}

export interface BorosMarket {
  id: number;
  name: string;
  symbol: string;
  assetSymbol: string;
  platformName: string;
  maturity: number;
  daysToMaturity: number;
  impliedAPR: number | null;
  midAPR: number | null;
  floatingAPR: number | null;
  markAPR: number | null;
  lastTradedAPR: number | null;
  bestBid: number | null;
  bestAsk: number | null;
  volume24h: number | null;
  nextSettlementTime: number | null;
  status: string;
  error?: boolean;
}

export interface BorosMarketsResponse {
  markets: BorosMarket[];
  fetchedAt: string;
  error?: string;
}

export interface OpportunitySignal {
  type: 'cross_exchange_spread' | 'negative_funding' | 'implied_underlying_divergence';
  asset?: string;
  exchange?: string;
  market?: string;
  spread?: number;
  higher?: string;
  lower?: string;
  higherAPR?: number;
  lowerAPR?: number;
  rate?: number;
  impliedAPR?: number;
  underlyingAPR?: number;
  gap?: number;
  direction?: 'bullish_premium' | 'bearish_discount';
  severity: 'high' | 'medium';
}

export interface OpportunitiesResponse {
  signals: OpportunitySignal[];
  fetchedAt: string;
}

export interface FundingHistoryPoint {
  timestamp: number;
  source: string;
  annualizedAPR: number;
}

export interface FundingHistoryResponse {
  asset: string;
  days: number;
  history: FundingHistoryPoint[];
}
