import { NextResponse } from 'next/server';

const BOROS_BASE = process.env.BOROS_API_BASE || 'https://api.boros.finance';

export const dynamic = 'force-dynamic';

interface BorosAPIMarket {
  marketId: number;
  imData: {
    name: string;
    symbol: string;
    maturity: number;
    tickStep: number;
  };
  metadata: {
    name: string;
    assetSymbol: string;
    platformName: string;
  };
  data: {
    volume24h: number;
    markApr: number;
    lastTradedApr: number;
    midApr: number;
    bestBid: number;
    bestAsk: number;
    floatingApr: number;
    longYieldApr: number;
    nextSettlementTime: number;
    timeToMaturity: number;
    assetMarkPrice: number;
    ammImpliedApr?: number;
  };
  state: string;
}

export async function GET() {
  try {
    const res = await fetch(`${BOROS_BASE}/open-api/v1/markets`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();

    const markets = (json.results || []).map((m: BorosAPIMarket) => {
      const daysToMaturity = Math.ceil(
        (m.imData.maturity * 1000 - Date.now()) / 86400000
      );

      return {
        id: m.marketId,
        name: `${m.metadata.assetSymbol}USDT-${m.metadata.platformName}`,
        symbol: m.imData.symbol,
        assetSymbol: m.metadata.assetSymbol,
        platformName: m.metadata.platformName,
        maturity: m.imData.maturity * 1000,
        daysToMaturity: Math.max(0, daysToMaturity),
        impliedAPR: m.data.midApr != null ? m.data.midApr : null,
        midAPR: m.data.midApr,
        floatingAPR: m.data.floatingApr,
        markAPR: m.data.markApr,
        lastTradedAPR: m.data.lastTradedApr,
        bestBid: m.data.bestBid,
        bestAsk: m.data.bestAsk,
        volume24h: m.data.volume24h,
        nextSettlementTime: m.data.nextSettlementTime,
        status: m.state,
      };
    });

    return NextResponse.json({
      markets,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { markets: [], error: 'Boros API unavailable' },
      { status: 502 }
    );
  }
}
