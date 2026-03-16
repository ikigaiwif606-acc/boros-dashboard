'use client';

import { useI18n } from '@/lib/i18n';
import { useOpportunities } from '@/lib/hooks/useData';
import { exchangeDisplayName } from '@/lib/formatters';
import type { OpportunitySignal } from '@/lib/types';

function SignalCard({ signal }: { signal: OpportunitySignal }) {
  const { t } = useI18n();

  if (signal.type === 'cross_exchange_spread') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <span className="text-xl">&#x1F525;</span>
        <div>
          <span className="font-semibold text-amber-400">{t('arbSignal')}</span>
          <span className="ml-2 text-gray-300">
            {signal.asset} — {signal.spread}% {t('spreadBetween')}{' '}
            {exchangeDisplayName(signal.higher || '')} ({signal.higherAPR}%) &amp;{' '}
            {exchangeDisplayName(signal.lower || '')} ({signal.lowerAPR}%)
          </span>
        </div>
      </div>
    );
  }

  if (signal.type === 'negative_funding') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
        <span className="text-xl">&#x26A0;&#xFE0F;</span>
        <div>
          <span className="font-semibold text-red-400">{t('negativeFunding')}</span>
          <span className="ml-2 text-gray-300">
            {signal.asset} on {exchangeDisplayName(signal.exchange || '')}: {signal.rate}%
          </span>
        </div>
      </div>
    );
  }

  if (signal.type === 'implied_underlying_divergence') {
    const isBullish = signal.direction === 'bullish_premium';
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
          isBullish
            ? 'border-teal-500/30 bg-teal-500/10'
            : 'border-red-500/30 bg-red-500/10'
        }`}
      >
        <span className="text-xl">{isBullish ? '\u{1F4C8}' : '\u{1F4C9}'}</span>
        <div>
          <span className={`font-semibold ${isBullish ? 'text-teal-400' : 'text-red-400'}`}>
            {isBullish ? t('bullishPremium') : t('bearishDiscount')}
          </span>
          <span className="ml-2 text-gray-300">
            {signal.market}: Implied {signal.impliedAPR}% vs Underlying {signal.underlyingAPR}% (Gap: {signal.gap}%)
          </span>
        </div>
      </div>
    );
  }

  return null;
}

export default function OpportunityBanner() {
  const { data } = useOpportunities();

  if (!data?.signals?.length) return null;

  return (
    <div className="space-y-2">
      {data.signals.map((signal, i) => (
        <SignalCard key={i} signal={signal} />
      ))}
    </div>
  );
}
