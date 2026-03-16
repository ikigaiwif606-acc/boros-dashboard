'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Locale = 'zh' | 'en';

export const translations: Record<Locale, Record<string, string>> = {
  zh: {
    siteName: 'Boros 资金费率仪表板',
    siteSubtitle: 'TalkChain Today',
    lastUpdated: '最后更新',
    secondsAgo: '秒前',
    minutesAgo: '分钟前',
    fundingRateTable: '资金费率一览',
    asset: '资产',
    exchange: '交易所',
    annualizedAPR: '年化利率',
    rawRate: '原始费率',
    spread: '利差',
    nextFunding: '下次结算',
    dataUnavailable: '数据不可用',
    borosMarkets: 'Boros 市场',
    impliedAPR: '隐含年化',
    underlyingAPR: '实际年化',
    gap: '差值',
    daysToMaturity: '到期天数',
    marketExpectsHigher: '市场预期费率走高',
    marketExpectsLower: '市场预期费率走低',
    fairValue: '公允价值',
    tradeOnBoros: '前往 Boros 交易',
    marketsUnavailable: 'Boros 市场暂时不可用，请稍后再试。',
    rateChart: '费率走势图',
    days7: '7天',
    days30: '30天',
    arbSignal: '资金费率套利信号',
    bullishPremium: 'Boros 市场看多溢价',
    bearishDiscount: 'Boros 市场看空折价',
    negativeFunding: '资金费率转负',
    spreadBetween: '之间存在年化利差',
    strategies: '交易策略',
    bullishFunding: '看多资金费率',
    bearishFunding: '看空资金费率',
    hedgeFunding: '对冲资金费率',
    lockYield: '锁定套利收益',
    howToExecute: '操作步骤',
    step: '步骤',
    riskWarning: '风险提示',
    riskWarningText: '杠杆交易可能导致本金损失，请谨慎操作。在 Boros 上交易前请确保充分了解清算机制。',
    liveDataUnavailable: '连接实时数据以查看当前费率',
    poweredBy: '数据来源于',
    disclaimer: '本仪表板仅供参考和教育目的，不构成任何投资建议。资金费率交易涉及重大损失风险。用户应在做出任何交易决定之前自行研究。',
    loading: '加载中...',
    error: '加载失败',
    retry: '重试',
  },
  en: {
    siteName: 'Boros Funding Rate Dashboard',
    siteSubtitle: 'TalkChain Today',
    lastUpdated: 'Last updated',
    secondsAgo: 's ago',
    minutesAgo: 'min ago',
    fundingRateTable: 'Funding Rates Overview',
    asset: 'Asset',
    exchange: 'Exchange',
    annualizedAPR: 'Annualized APR',
    rawRate: 'Raw Rate',
    spread: 'Spread',
    nextFunding: 'Next Funding',
    dataUnavailable: 'Data unavailable',
    borosMarkets: 'Boros Markets',
    impliedAPR: 'Implied APR',
    underlyingAPR: 'Underlying APR',
    gap: 'Gap',
    daysToMaturity: 'Days to Maturity',
    marketExpectsHigher: 'Market expects higher funding',
    marketExpectsLower: 'Market expects lower funding',
    fairValue: 'Fair value',
    tradeOnBoros: 'Trade on Boros',
    marketsUnavailable: 'Boros markets temporarily unavailable. Please check back soon.',
    rateChart: 'Rate History',
    days7: '7D',
    days30: '30D',
    arbSignal: 'Funding Rate Arbitrage Signal',
    bullishPremium: 'Boros Bullish Premium',
    bearishDiscount: 'Boros Bearish Discount',
    negativeFunding: 'Funding Rate Turned Negative',
    spreadBetween: 'annualized spread between',
    strategies: 'Trading Strategies',
    bullishFunding: 'Bullish on Funding Rates',
    bearishFunding: 'Bearish on Funding Rates',
    hedgeFunding: 'Hedge Funding Exposure',
    lockYield: 'Lock in Cash & Carry Yield',
    howToExecute: 'How to Execute',
    step: 'Step',
    riskWarning: 'Risk Warning',
    riskWarningText: 'Leveraged trading may result in loss of capital. Ensure you understand the liquidation mechanics before trading on Boros.',
    liveDataUnavailable: 'Connect to live data to see current rates',
    poweredBy: 'Powered by',
    disclaimer: 'This dashboard is for informational and educational purposes only. It does not constitute investment advice. Funding rate trading involves significant risk of loss. Users should conduct their own research before making any trading decisions.',
    loading: 'Loading...',
    error: 'Failed to load',
    retry: 'Retry',
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh',
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string) => translations[locale][key] || key;

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  const { t } = useContext(I18nContext);
  return t;
}
