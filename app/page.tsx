'use client';

import { useFundingRates } from '@/lib/hooks/useData';
import Header from '@/components/Header';
import OpportunityBanner from '@/components/OpportunityBanner';
import FundingRateTable from '@/components/FundingRateTable';
import BorosMarketCards from '@/components/BorosMarketCards';
import RateComparisonChart from '@/components/RateComparisonChart';
import StrategyExplainer from '@/components/StrategyExplainer';
import Footer from '@/components/Footer';

export default function Home() {
  const { data } = useFundingRates();
  const lastUpdated = data?.timestamp ? new Date(data.timestamp).getTime() : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header lastUpdated={lastUpdated} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6">
        <OpportunityBanner />
        <FundingRateTable />
        <BorosMarketCards />
        <RateComparisonChart />
        <StrategyExplainer />
      </main>
      <Footer />
    </div>
  );
}
