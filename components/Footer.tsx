'use client';

import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[#1e2030] bg-[#0a0a0f] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            {t('poweredBy')}{' '}
            <a
              href="https://boros.pendle.finance/markets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300"
            >
              Pendle Boros
            </a>
          </div>
          <div className="flex gap-4">
            <a
              href="https://boros.pendle.finance/markets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 transition-colors hover:text-teal-400"
            >
              Trade on Boros
            </a>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-gray-600">{t('disclaimer')}</p>
      </div>
    </footer>
  );
}
