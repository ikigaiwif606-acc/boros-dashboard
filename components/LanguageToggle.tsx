'use client';

import { useI18n } from '@/lib/i18n';

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center rounded-lg border border-[#1e2030] bg-[#12131a] p-0.5 text-sm">
      <button
        onClick={() => setLocale('zh')}
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === 'zh'
            ? 'bg-teal-500/20 text-teal-400'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === 'en'
            ? 'bg-teal-500/20 text-teal-400'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}
