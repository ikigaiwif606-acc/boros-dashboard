import { NextResponse } from 'next/server';

const ASSETS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
const BINANCE_BASE = process.env.BINANCE_FAPI_BASE || 'https://fapi.binance.com';
const HL_BASE = process.env.HYPERLIQUID_API_BASE || 'https://api.hyperliquid.xyz';
const BOROS_BASE = process.env.BOROS_API_BASE || 'https://api.boros.finance';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, Record<string, unknown>> = {};
  const now = Date.now();

  // Binance — fetch all symbols
  const binancePromises = ASSETS.map(async (symbol) => {
    try {
      const res = await fetch(
        `${BINANCE_BASE}/fapi/v1/premiumIndex?symbol=${symbol}`,
        { next: { revalidate: 60 } }
      );
      const data = await res.json();
      const asset = symbol.replace('USDT', '');
      if (!results[asset]) results[asset] = {};

      const rawRate = parseFloat(data.lastFundingRate);
      if (!isNaN(rawRate)) {
        results[asset].binance = {
          rawRate,
          annualizedAPR: rawRate * 3 * 365 * 100,
          nextFundingTime: data.nextFundingTime,
          interval: '8h',
          fetchedAt: now,
        };
      }
    } catch {
      // Binance failed for this symbol
    }
  });

  // Hyperliquid — single call gets all markets
  const hlPromise = (async () => {
    try {
      const res = await fetch(HL_BASE + '/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
        next: { revalidate: 60 },
      });
      const [meta, assetCtxs] = await res.json();

      for (const asset of ['BTC', 'ETH', 'SOL']) {
        const idx = meta.universe.findIndex((u: { name: string }) => u.name === asset);
        if (idx === -1) continue;
        if (!results[asset]) results[asset] = {};

        const rawRate = parseFloat(assetCtxs[idx].funding);
        results[asset].hyperliquid = {
          rawRate,
          annualizedAPR: rawRate * 24 * 365 * 100,
          nextFundingTime: null,
          interval: '1h',
          fetchedAt: now,
        };
      }
    } catch {
      // Hyperliquid failed
    }
  })();

  await Promise.all([...binancePromises, hlPromise]);

  // Fallback: use Boros floatingAPR as exchange rate source when direct API fails
  // Boros floatingApr IS the real-time exchange funding rate for each market
  try {
    const borosRes = await fetch(`${BOROS_BASE}/open-api/v1/markets`, {
      next: { revalidate: 60 },
    });
    const borosJson = await borosRes.json();

    for (const market of borosJson.results || []) {
      const asset = market.metadata?.assetSymbol;
      const platform = market.metadata?.platformName?.toLowerCase();
      const floatingApr = market.data?.floatingApr;

      if (!asset || !platform || floatingApr == null) continue;
      if (!results[asset]) results[asset] = {};

      // Only fill in if direct exchange API didn't return data
      if (!results[asset][platform]) {
        // floatingApr is a decimal (e.g. 0.077 = 7.7%), convert to percentage
        const apr = floatingApr * 100;
        // Determine interval based on platform
        const interval = platform === 'binance' ? '8h' : platform === 'hyperliquid' ? '1h' : '8h';
        // Back-calculate raw rate from APR
        const periodsPerDay = interval === '1h' ? 24 : 3;
        const rawRate = apr / (periodsPerDay * 365 * 100);

        results[asset][platform] = {
          rawRate,
          annualizedAPR: apr,
          nextFundingTime: market.data?.nextSettlementTime
            ? market.data.nextSettlementTime * 1000
            : null,
          interval,
          fetchedAt: now,
          source: 'boros', // flag that this came from Boros fallback
        };
      }
    }
  } catch {
    // Boros fallback failed — no worries, we still have what we have
  }

  return NextResponse.json({
    timestamp: new Date(now).toISOString(),
    assets: results,
  });
}
