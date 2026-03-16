'use client';

import { useI18n } from '@/lib/i18n';
import { useBorosMarkets, useFundingRates } from '@/lib/hooks/useData';
import { formatAPR } from '@/lib/formatters';
import { CardSkeleton } from './LoadingSkeleton';
import type { BorosMarket } from '@/lib/types';

function MarketCard({ market, underlyingAPR }: { market: BorosMarket; underlyingAPR: number | null }) {
  const { t } = useI18n();

  const implied = market.impliedAPR;
  const gap = implied != null && underlyingAPR != null ? implied - underlyingAPR : null;

  let sentiment = t('fairValue');
  let sentimentColor = 'text-gray-400';
  if (gap != null) {
    if (gap > 2) {
      sentiment = t('marketExpectsHigher');
      sentimentColor = 'text-teal-400';
    } else if (gap < -2) {
      sentiment = t('marketExpectsLower');
      sentimentColor = 'text-red-400';
    }
  }

  return (
    <div className="min-w-[280px] flex-shrink-0 rounded-xl border border-[#1e2030] bg-[#12131a] p-5 transition-colors hover:border-[#2a2b40]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-white">{market.name}</h3>
        <span className="rounded-full bg-[#1e2030] px-2 py-0.5 text-xs text-gray-400">
          {market.daysToMaturity}d
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{t('impliedAPR')}</span>
          <span className="font-mono text-lg font-semibold text-white">
            {implied != null ? `${implied.toFixed(1)}%` : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{t('underlyingAPR')}</span>
          <span className="font-mono text-sm text-gray-300">
            {underlyingAPR != null ? formatAPR(underlyingAPR) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[#1e2030] pt-2">
          <span className="text-sm text-gray-500">{t('gap')}</span>
          <span
            className={`font-mono text-sm font-semibold ${
              gap != null && gap > 0 ? 'text-teal-400' : gap != null && gap < 0 ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {gap != null ? `${gap > 0 ? '+' : ''}${gap.toFixed(1)}% ${gap > 0 ? '\u2191' : '\u2193'}` : '—'}
          </span>
        </div>
      </div>

      <p className={`mb-4 text-xs ${sentimentColor}`}>{sentiment}</p>

      <a
        href={`https://boros.pendle.finance/trade?ref=TALKCHAIN`}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg bg-teal-500/20 py-2 text-center text-sm font-medium text-teal-400 transition-colors hover:bg-teal-500/30"
      >
        {t('tradeOnBoros')} &rarr;
      </a>
    </div>
  );
}

export default function BorosMarketCards() {
  const { data: borosData, isLoading: borosLoading } = useBorosMarkets();
  const { data: fundingData } = useFundingRates();
  const { t } = useI18n();

  if (borosLoading) {
    return (
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">{t('borosMarkets')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[280px]">
              <CardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!borosData?.markets?.length) {
    return (
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">{t('borosMarkets')}</h2>
        <div className="rounded-xl border border-[#1e2030] bg-[#12131a] p-8 text-center text-gray-500">
          {t('marketsUnavailable')}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-white">{t('borosMarkets')}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {borosData.markets.map(market => {
          const exchangeKey = market.platformName?.toLowerCase();
          const assetKey = market.assetSymbol;
          const underlyingAPR =
            fundingData?.assets?.[assetKey]?.[exchangeKey]?.annualizedAPR ?? null;

          return (
            <MarketCard key={market.id} market={market} underlyingAPR={underlyingAPR} />
          );
        })}
      </div>
    </section>
  );
}
