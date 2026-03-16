export function formatAPR(apr: number | null | undefined): string {
  if (apr == null) return '—';
  const sign = apr >= 0 ? '+' : '';
  return `${sign}${apr.toFixed(1)}%`;
}

export function formatRawRate(rate: number | null | undefined): string {
  if (rate == null) return '—';
  return `${(rate * 100).toFixed(4)}%`;
}

export function formatTimeAgo(timestamp: number, locale: 'zh' | 'en'): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) {
    return locale === 'zh' ? `${diff}秒前` : `${diff}s ago`;
  }
  const mins = Math.floor(diff / 60);
  return locale === 'zh' ? `${mins}分钟前` : `${mins}min ago`;
}

export function formatCountdown(targetTime: number): string {
  const diff = Math.max(0, targetTime - Date.now());
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function exchangeDisplayName(key: string): string {
  const names: Record<string, string> = {
    binance: 'Binance',
    hyperliquid: 'Hyperliquid',
    bybit: 'Bybit',
    okx: 'OKX',
    gate: 'Gate',
  };
  return names[key.toLowerCase()] || key;
}
