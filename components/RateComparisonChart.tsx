'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useI18n } from '@/lib/i18n';
import { useFundingHistory } from '@/lib/hooks/useData';
import { ChartSkeleton } from './LoadingSkeleton';

interface ChartPoint {
  time: string;
  timestamp: number;
  binance?: number;
  hyperliquid?: number;
}

function processData(history: { timestamp: number; source: string; annualizedAPR: number }[]): ChartPoint[] {
  // Group by hourly buckets
  const buckets = new Map<string, ChartPoint>();

  for (const point of history) {
    const date = new Date(point.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        time: `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`,
        timestamp: point.timestamp,
      });
    }
    const bucket = buckets.get(key)!;
    if (point.source === 'binance') {
      bucket.binance = Math.round(point.annualizedAPR * 10) / 10;
    } else if (point.source === 'hyperliquid') {
      bucket.hyperliquid = Math.round(point.annualizedAPR * 10) / 10;
    }
  }

  return Array.from(buckets.values()).sort((a, b) => a.timestamp - b.timestamp);
}

export default function RateComparisonChart() {
  const { t } = useI18n();
  const [asset, setAsset] = useState('BTC');
  const [days, setDays] = useState(7);
  const { data, isLoading } = useFundingHistory(asset, days);

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">{t('rateChart')}</h2>
        <ChartSkeleton />
      </section>
    );
  }

  const chartData = data?.history ? processData(data.history) : [];

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">{t('rateChart')}</h2>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-[#1e2030] bg-[#12131a] p-0.5 text-sm">
            {[7, 30].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  days === d ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {d === 7 ? t('days7') : t('days30')}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-[#1e2030] bg-[#12131a] p-0.5 text-sm">
            {['BTC', 'ETH'].map(a => (
              <button
                key={a}
                onClick={() => setAsset(a)}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  asset === a ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e2030] bg-[#12131a] p-4">
        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            {t('loading')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
              <XAxis
                dataKey="time"
                stroke="#4a4b5c"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#4a4b5c"
                tick={{ fontSize: 11 }}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12131a',
                  border: '1px solid #1e2030',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`]}
              />
              <ReferenceLine y={0} stroke="#4a4b5c" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="binance"
                stroke="#3b82f6"
                name="Binance"
                dot={false}
                strokeWidth={1.5}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="hyperliquid"
                stroke="#00D4AA"
                name="Hyperliquid"
                dot={false}
                strokeWidth={1.5}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
