'use client';

import { useQuery } from '@tanstack/react-query';
import { API_URL, fetchHealth } from '@/lib/api';

export function ApiStatus() {
  const enabled = API_URL !== '';
  const { isSuccess, isError, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    enabled,
  });

  let label = 'API: belum dikonfigurasi';
  let dot = 'bg-slate-300';
  if (enabled && isLoading) {
    label = 'API: memeriksa…';
    dot = 'bg-amber-400';
  } else if (isSuccess) {
    label = 'API: online';
    dot = 'bg-emerald-500';
  } else if (isError) {
    label = 'API: tidak terjangkau';
    dot = 'bg-red-500';
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
