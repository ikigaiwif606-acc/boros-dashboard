'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useFundingRates, useBorosMarkets } from '@/lib/hooks/useData';

interface StrategyProps {
  titleKey: string;
  subtitleEn: string;
  steps: string[];
  riskText: string;
  mathExample: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

function StrategyCard({ titleKey, subtitleEn, steps, riskText, mathExample, isOpen, onToggle }: StrategyProps) {
  const { t, locale } = useI18n();

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12131a] transition-colors hover:border-[#2a2b40]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <span className="font-semibold text-white">{t(titleKey)}</span>
          {locale === 'zh' && (
            <span className="ml-2 text-sm text-gray-500">{subtitleEn}</span>
          )}
        </div>
        <span className={`text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          &#x25B6;
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-[#1e2030] px-5 py-4">
          <h4 className="mb-3 text-sm font-medium text-gray-400">{t('howToExecute')}</h4>
          <ol className="mb-4 space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span className="flex-shrink-0 font-mono text-teal-400">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>

          {mathExample && (
            <div className="mb-4 rounded-lg bg-[#0a0a0f] p-3 font-mono text-xs text-gray-400">
              {mathExample}
            </div>
          )}

          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-xs font-medium text-red-400">{t('riskWarning')}</p>
            <p className="mt-1 text-xs text-red-300/70">{riskText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StrategyExplainer() {
  const { t, locale } = useI18n();
  const { data: fundingData } = useFundingRates();
  const { data: borosData } = useBorosMarkets();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const btcBinance = fundingData?.assets?.BTC?.binance;
  const btcBoros = borosData?.markets?.find(m => m.assetSymbol === 'BTC' && m.platformName === 'Binance');

  const impliedStr = btcBoros?.impliedAPR != null ? `${btcBoros.impliedAPR.toFixed(1)}%` : '—';
  const underlyingStr = btcBinance?.annualizedAPR != null ? `${btcBinance.annualizedAPR.toFixed(1)}%` : '—';
  const daysStr = btcBoros?.daysToMaturity?.toString() ?? '—';
  const hasLiveData = btcBoros?.impliedAPR != null && btcBinance?.annualizedAPR != null;

  const strategies = [
    {
      titleKey: 'bullishFunding',
      subtitleEn: 'Bullish on Funding Rates',
      steps: locale === 'zh'
        ? [
            '在 Boros 上存入抵押品（如 BTC）',
            '开仓做多 YU（Yield Unit）',
            '你支付隐含年化（固定），收取实际资金费率（浮动）',
          ]
        : [
            'Deposit collateral (e.g. BTC) on Boros',
            'Open a Long YU position on your chosen market',
            'You pay the Implied APR (fixed) and receive the Underlying APR (floating)',
          ],
      mathExample: hasLiveData
        ? `BTCUSDT-Binance: Implied ${impliedStr}, Underlying ${underlyingStr}, ${daysStr} days to maturity`
        : null,
      riskText: locale === 'zh'
        ? '如果隐含年化大幅下跌，可能面临清算风险。Mark APR 使用 TWAP 计算。'
        : 'Liquidation if Implied APR crashes. Mark APR uses TWAP, not last trade price.',
    },
    {
      titleKey: 'bearishFunding',
      subtitleEn: 'Bearish on Funding Rates',
      steps: locale === 'zh'
        ? [
            '在 Boros 上存入抵押品',
            '开仓做空 YU（Yield Unit）',
            '你收取隐含年化（固定），支付实际资金费率（浮动）',
          ]
        : [
            'Deposit collateral on Boros',
            'Open a Short YU position',
            'You receive the Implied APR (fixed) and pay the Underlying APR (floating)',
          ],
      mathExample: hasLiveData
        ? `BTCUSDT-Binance: Implied ${impliedStr}, Underlying ${underlyingStr}`
        : null,
      riskText: locale === 'zh'
        ? '如果隐含年化大幅上涨，可能面临清算风险。'
        : 'Liquidation if Implied APR spikes upward.',
    },
    {
      titleKey: 'hedgeFunding',
      subtitleEn: 'Hedge Funding Exposure',
      steps: locale === 'zh'
        ? [
            '你在交易所做空永续合约（如 Binance 空 BTCUSDT），获得浮动资金费率收入',
            '在 Boros 做多相同仓位的 YU',
            '在 Boros 上：支付固定（隐含），收取浮动（实际资金费率）',
            '净效果：浮动收入变为固定收入，锁定在隐含年化水平',
          ]
        : [
            'You\'re short BTCUSDT on an exchange, receiving variable funding',
            'Long YU on Boros for the same notional',
            'On Boros: you pay fixed (implied), receive floating (actual funding)',
            'Net effect: your floating income becomes fixed at the Implied APR',
          ],
      mathExample: null,
      riskText: locale === 'zh'
        ? '如果实际资金费率低于锁定利率，你仍需支付固定费率。'
        : 'If funding drops below your locked rate, you still pay the fixed rate.',
    },
    {
      titleKey: 'lockYield',
      subtitleEn: 'Lock in Cash & Carry Yield',
      steps: locale === 'zh'
        ? [
            '你持有现货 BTC + 做空 BTCUSDT 永续（Delta 中性，赚取资金费率）',
            '在 Boros 做空相同仓位的 YU',
            '在 Boros 上：收取固定（隐含），支付浮动（实际资金费率）',
            '你的浮动资金费率收入被替换为固定收入',
          ]
        : [
            'You hold spot BTC + short BTCUSDT perp (delta-neutral, earning funding)',
            'Short YU on Boros for same notional',
            'On Boros: you receive fixed (implied), pay floating (actual funding)',
            'Your variable funding income is replaced with fixed income at Implied APR',
          ],
      mathExample: null,
      riskText: locale === 'zh'
        ? '在波动期间隐含年化大幅飙升时，Boros 侧存在清算风险。'
        : 'Liquidation risk on Boros side if implied APR spikes during volatility.',
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-white">{t('strategies')}</h2>
      <div className="space-y-3">
        {strategies.map((strategy, i) => (
          <StrategyCard
            key={strategy.titleKey}
            {...strategy}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
      {!hasLiveData && (
        <p className="mt-3 text-center text-xs text-gray-600">{t('liveDataUnavailable')}</p>
      )}
    </section>
  );
}
