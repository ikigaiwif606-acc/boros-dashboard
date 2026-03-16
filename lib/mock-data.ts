import type { FundingRatesResponse, BorosMarketsResponse, OpportunitiesResponse } from './types';

export const MOCK_FUNDING_RATES: FundingRatesResponse = {
  timestamp: new Date().toISOString(),
  assets: {
    BTC: {
      binance: {
        rawRate: 0.00042,
        annualizedAPR: 45.99,
        nextFundingTime: Date.now() + 4 * 60 * 60 * 1000,
        interval: '8h',
        fetchedAt: Date.now(),
      },
      hyperliquid: {
        rawRate: 0.00013,
        annualizedAPR: 113.88,
        nextFundingTime: null,
        interval: '1h',
        fetchedAt: Date.now(),
      },
    },
    ETH: {
      binance: {
        rawRate: 0.00031,
        annualizedAPR: 33.95,
        nextFundingTime: Date.now() + 4 * 60 * 60 * 1000,
        interval: '8h',
        fetchedAt: Date.now(),
      },
      hyperliquid: {
        rawRate: 0.00009,
        annualizedAPR: 78.84,
        nextFundingTime: null,
        interval: '1h',
        fetchedAt: Date.now(),
      },
    },
    SOL: {
      binance: {
        rawRate: 0.00068,
        annualizedAPR: 74.46,
        nextFundingTime: Date.now() + 4 * 60 * 60 * 1000,
        interval: '8h',
        fetchedAt: Date.now(),
      },
      hyperliquid: {
        rawRate: 0.00021,
        annualizedAPR: 183.96,
        nextFundingTime: null,
        interval: '1h',
        fetchedAt: Date.now(),
      },
    },
  },
};

export const MOCK_BOROS_MARKETS: BorosMarketsResponse = {
  markets: [
    {
      id: 23,
      name: 'BTCUSDT-Binance',
      symbol: 'BINANCE-BTCUSDT-27MAR2026',
      assetSymbol: 'BTC',
      platformName: 'Binance',
      maturity: Date.now() + 106 * 86400000,
      daysToMaturity: 106,
      impliedAPR: 12.4,
      midAPR: 12.4,
      floatingAPR: 4.6,
      markAPR: 12.1,
      lastTradedAPR: 12.3,
      bestBid: 11.8,
      bestAsk: 13.0,
      volume24h: 245000,
      nextSettlementTime: Date.now() + 3600000,
      status: 'Normal',
    },
    {
      id: 24,
      name: 'ETHUSDT-Binance',
      symbol: 'BINANCE-ETHUSDT-27MAR2026',
      assetSymbol: 'ETH',
      platformName: 'Binance',
      maturity: Date.now() + 106 * 86400000,
      daysToMaturity: 106,
      impliedAPR: 8.7,
      midAPR: 8.7,
      floatingAPR: 3.2,
      markAPR: 8.5,
      lastTradedAPR: 8.6,
      bestBid: 8.2,
      bestAsk: 9.2,
      volume24h: 128000,
      nextSettlementTime: Date.now() + 3600000,
      status: 'Normal',
    },
    {
      id: 40,
      name: 'ETHUSDT-Hyperliquid',
      symbol: 'HYPERLIQUID-ETHUSDT-27MAR2026',
      assetSymbol: 'ETH',
      platformName: 'Hyperliquid',
      maturity: Date.now() + 72 * 86400000,
      daysToMaturity: 72,
      impliedAPR: 15.2,
      midAPR: 15.2,
      floatingAPR: 8.1,
      markAPR: 15.0,
      lastTradedAPR: 15.1,
      bestBid: 14.8,
      bestAsk: 15.6,
      volume24h: 89000,
      nextSettlementTime: Date.now() + 3600000,
      status: 'Normal',
    },
  ],
  fetchedAt: new Date().toISOString(),
};

export const MOCK_OPPORTUNITIES: OpportunitiesResponse = {
  signals: [
    {
      type: 'cross_exchange_spread',
      asset: 'BTC',
      spread: 67.9,
      higher: 'hyperliquid',
      lower: 'binance',
      higherAPR: 113.9,
      lowerAPR: 46.0,
      severity: 'high',
    },
  ],
  fetchedAt: new Date().toISOString(),
};

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
