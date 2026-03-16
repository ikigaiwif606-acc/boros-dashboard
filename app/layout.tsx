import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Boros 资金费率仪表板 | Boros Funding Rate Dashboard — TalkChain Today',
  description:
    '实时追踪 Binance、Hyperliquid 等交易所资金费率，对比 Pendle Boros 隐含年化收益率，发现套利和对冲机会。Track real-time funding rates across exchanges and discover Boros yield trading opportunities.',
  keywords: 'Boros, Pendle, funding rate, 资金费率, crypto, DeFi, yield trading, arbitrage',
  openGraph: {
    title: 'Boros Funding Rate Dashboard — TalkChain Today',
    description:
      'Track funding rates across Binance, Hyperliquid, and Pendle Boros. Discover yield trading opportunities.',
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@TalkChainToday',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
