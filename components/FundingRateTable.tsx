'use client';

import { useI18n } from '@/lib/i18n';
import { useFundingRates } from '@/lib/hooks/useData';
import { formatAPR, formatRawRate, formatCountdown } from '@/lib/formatters';
import { TableSkeleton } from './LoadingSkeleton';
import DataFreshness from './DataFreshness';
import { useEffect, useState } from 'react';

function CountdownCell({ targetTime }: { targetTime: number | null }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!targetTime) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime) return <span className="text-gray-600">—</span>;
  return <span className="font-mono text-xs text-gray-500">{formatCountdown(targetTime)}</span>;
}

function RateCell({ apr, rawRate }: { apr: number | null | undefined; rawRate: number | null | undefined }) {
  if (apr == null) return <span className="text-gray-600">—</span>;
  const color = apr >= 0 ? 'text-teal-400' : 'text-red-400';
  return (
    <div>
      <span className={`font-mono font-semibold ${color}`}>{formatAPR(apr)}</span>
      {rawRate != null && (
        <span className="ml-1.5 text-xs text-gray-600">({formatRawRate(rawRate)})</span>
      )}
    </div>
  );
}

export default function FundingRateTable() {
  const { data, error, isLoading } = useFundingRates();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <section className="rounded-xl border border-[#1e2030] bg-[#12131a] p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">{t('fundingRateTable')}</h2>
        <TableSkeleton />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-xl border border-[#1e2030] bg-[#12131a] p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">{t('fundingRateTable')}</h2>
        <p className="text-gray-500">{t('error')}</p>
      </section>
    );
  }

  const assets = Object.entries(data.assets);

  return (
    <section className="rounded-xl border border-[#1e2030] bg-[#12131a] p-5">
      <h2 className="mb-4 text-lg font-semibold text-white">{t('fundingRateTable')}</h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2030] text-left text-gray-500">
              <th className="pb-3 font-medium">{t('asset')}</th>
              <th className="pb-3 font-medium">Binance (8h)</th>
              <th className="pb-3 font-medium">Hyperliquid (1h)</th>
              <th className="pb-3 font-medium">{t('spread')}</th>
              <th className="pb-3 font-medium">{t('nextFunding')}</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(([asset, exchanges]) => {
              const binance = exchanges.binance as { annualizedAPR: number; rawRate: number; nextFundingTime: number; fetchedAt: number } | undefined;
              const hl = exchanges.hyperliquid as { annualizedAPR: number; rawRate: number; fetchedAt: number } | undefined;

              const aprs = [binance?.annualizedAPR, hl?.annualizedAPR].filter((v): v is number => v != null);
              const spread = aprs.length >= 2 ? Math.max(...aprs) - Math.min(...aprs) : null;

              return (
                <tr key={asset} className="border-b border-[#1e2030]/50">
                  <td className="py-3">
                    <span className="font-semibold text-white">{asset}</span>
                  </td>
                  <td className="py-3">
                    <RateCell apr={binance?.annualizedAPR} rawRate={binance?.rawRate} />
                    <DataFreshness timestamp={binance?.fetchedAt ?? null} />
                  </td>
                  <td className="py-3">
                    <RateCell apr={hl?.annualizedAPR} rawRate={hl?.rawRate} />
                    <DataFreshness timestamp={hl?.fetchedAt ?? null} />
                  </td>
                  <td className="py-3">
                    {spread != null ? (
                      <span className={`font-mono font-semibold ${spread > 5 ? 'text-amber-400' : 'text-gray-400'}`}>
                        {spread.toFixed(1)}%{spread > 5 ? ' \u26A1' : ''}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    <CountdownCell targetTime={binance?.nextFundingTime ?? null} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {assets.map(([asset, exchanges]) => {
          const binance = exchanges.binance as { annualizedAPR: number; rawRate: number; nextFundingTime: number; fetchedAt: number } | undefined;
          const hl = exchanges.hyperliquid as { annualizedAPR: number; rawRate: number; fetchedAt: number } | undefined;
          const aprs = [binance?.annualizedAPR, hl?.annualizedAPR].filter((v): v is number => v != null);
          const spread = aprs.length >= 2 ? Math.max(...aprs) - Math.min(...aprs) : null;

          return (
            <div key={asset} className="rounded-lg border border-[#1e2030]/50 bg-[#0a0a0f] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{asset}</span>
                {spread != null && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${spread > 5 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-400'}`}>
                    {t('spread')}: {spread.toFixed(1)}%{spread > 5 ? ' \u26A1' : ''}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Binance (8h)</div>
                  <RateCell apr={binance?.annualizedAPR} rawRate={binance?.rawRate} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Hyperliquid (1h)</div>
                  <RateCell apr={hl?.annualizedAPR} rawRate={hl?.rawRate} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
