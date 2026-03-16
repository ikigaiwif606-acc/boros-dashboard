'use client';

import useSWR from 'swr';
import type {
  FundingRatesResponse,
  BorosMarketsResponse,
  OpportunitiesResponse,
  FundingHistoryResponse,
} from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFundingRates() {
  return useSWR<FundingRatesResponse>('/api/funding-rates', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}

export function useBorosMarkets() {
  return useSWR<BorosMarketsResponse>('/api/boros-markets', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}

export function useOpportunities() {
  return useSWR<OpportunitiesResponse>('/api/opportunities', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}

export function useFundingHistory(asset: string, days: number) {
  return useSWR<FundingHistoryResponse>(
    `/api/funding-history?asset=${asset}&days=${days}`,
    fetcher,
    {
      refreshInterval: 1800000,
      revalidateOnFocus: false,
    }
  );
}
