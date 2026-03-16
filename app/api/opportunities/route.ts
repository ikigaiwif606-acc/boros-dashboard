import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const signals: Record<string, unknown>[] = [];

  let fundingData: { assets: Record<string, Record<string, { annualizedAPR: number }>> } = { assets: {} };
  try {
    const fundingRes = await fetch(`${baseUrl}/api/funding-rates`);
    fundingData = await fundingRes.json();
  } catch {
    return NextResponse.json({ signals: [], fetchedAt: new Date().toISOString() });
  }

  for (const [asset, exchanges] of Object.entries(fundingData.assets)) {
    if (!exchanges) continue;

    // Cross-exchange spread
    const rates = Object.entries(exchanges)
      .filter(([, data]) => data?.annualizedAPR != null)
      .map(([name, data]) => ({ name, apr: data.annualizedAPR }));

    if (rates.length >= 2) {
      const maxRate = rates.reduce((a, b) => (a.apr > b.apr ? a : b));
      const minRate = rates.reduce((a, b) => (a.apr < b.apr ? a : b));
      const spread = maxRate.apr - minRate.apr;

      if (spread > 5.0) {
        signals.push({
          type: 'cross_exchange_spread',
          asset,
          spread: Math.round(spread * 10) / 10,
          higher: maxRate.name,
          lower: minRate.name,
          higherAPR: Math.round(maxRate.apr * 10) / 10,
          lowerAPR: Math.round(minRate.apr * 10) / 10,
          severity: spread > 10 ? 'high' : 'medium',
        });
      }
    }

    // Negative funding
    for (const [exchange, data] of Object.entries(exchanges)) {
      if (data?.annualizedAPR < 0) {
        signals.push({
          type: 'negative_funding',
          asset,
          exchange,
          rate: Math.round(data.annualizedAPR * 10) / 10,
          severity: 'medium',
        });
      }
    }
  }

  // Boros implied vs underlying divergence
  try {
    const borosRes = await fetch(`${baseUrl}/api/boros-markets`);
    const borosData = await borosRes.json();

    for (const market of borosData.markets || []) {
      if (market.impliedAPR == null) continue;

      const asset = market.assetSymbol;
      const exchange = market.platformName?.toLowerCase();

      if (asset && exchange && fundingData.assets[asset]?.[exchange]) {
        const underlyingAPR = fundingData.assets[asset][exchange].annualizedAPR;
        const gap = market.impliedAPR - underlyingAPR;

        if (Math.abs(gap) > 5.0) {
          signals.push({
            type: 'implied_underlying_divergence',
            market: market.name,
            impliedAPR: Math.round(market.impliedAPR * 10) / 10,
            underlyingAPR: Math.round(underlyingAPR * 10) / 10,
            gap: Math.round(gap * 10) / 10,
            direction: gap > 0 ? 'bullish_premium' : 'bearish_discount',
            severity: Math.abs(gap) > 10 ? 'high' : 'medium',
          });
        }
      }
    }
  } catch {
    // Boros unavailable
  }

  return NextResponse.json({ signals, fetchedAt: new Date().toISOString() });
}
