'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { formatTimeAgo } from '@/lib/formatters';

export default function DataFreshness({ timestamp }: { timestamp: number | null }) {
  const { locale } = useI18n();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  if (!timestamp) return null;

  return (
    <span className="text-xs text-gray-600">
      {formatTimeAgo(timestamp, locale)}
    </span>
  );
}
