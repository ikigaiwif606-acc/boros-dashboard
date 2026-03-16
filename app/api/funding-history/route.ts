import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get('asset') || 'BTC';
  const days = parseInt(searchParams.get('days') || '7');

  const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
  const history: { timestamp: number; source: string; annualizedAPR: number }[] = [];

  // Binance historical
  try {
    const symbol = `${asset}USDT`;
    const res = await fetch(
      `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&startTime=${startTime}&limit=1000`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    for (const item of data) {
      history.push({
        timestamp: item.fundingTime,
        source: 'binance',
        annualizedAPR: parseFloat(item.fundingRate) * 3 * 365 * 100,
      });
    }
  } catch {
    // Binance history failed
  }

  // Hyperliquid historical
  try {
    const res = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'fundingHistory', coin: asset, startTime }),
      next: { revalidate: 1800 },
    });
    const data = await res.json();
    for (const item of data) {
      history.push({
        timestamp: item.time,
        source: 'hyperliquid',
        annualizedAPR: parseFloat(item.fundingRate) * 24 * 365 * 100,
      });
    }
  } catch {
    // Hyperliquid history failed
  }

  history.sort((a, b) => a.timestamp - b.timestamp);

  return NextResponse.json({ asset, days, history });
}
