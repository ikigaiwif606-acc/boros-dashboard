'use client';

import { useI18n } from '@/lib/i18n';
import { formatTimeAgo } from '@/lib/formatters';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  lastUpdated: number | null;
}

export default function Header({ lastUpdated }: HeaderProps) {
  const { t, locale } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2030] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-black">
            TC
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{t('siteName')}</h1>
            <p className="text-xs text-gray-500">{t('siteSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              {t('lastUpdated')} {formatTimeAgo(lastUpdated, locale)}
            </div>
          )}
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
