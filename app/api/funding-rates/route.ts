import { NextResponse } from 'next/server';

const ASSETS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
const BINANCE_BASE = process.env.BINANCE_FAPI_BASE || 'https://fapi.binance.com';
const HL_BASE = process.env.HYPERLIQUID_API_BASE || 'https://api.hyperliquid.xyz';

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
      results[asset].binance = {
        rawRate,
        annualizedAPR: rawRate * 3 * 365 * 100,
        nextFundingTime: data.nextFundingTime,
        interval: '8h',
        fetchedAt: now,
      };
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

  return NextResponse.json({
    timestamp: new Date(now).toISOString(),
    assets: results,
  });
}
