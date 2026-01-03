import React from 'react';

type StatusVariant = 'available' | 'out' | 'hold' | 'service' | 'ready' | 'cleaning' | 'overdue' | 'due-soon' | 'ok' | 'late';

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const styles = {
    available: 'bg-green-100 text-green-700',
    ready: 'bg-green-100 text-green-700',
    ok: 'bg-green-100 text-green-700',
    out: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    late: 'bg-red-100 text-red-700',
    'due-soon': 'bg-amber-100 text-amber-700',
    hold: 'bg-gray-100 text-gray-700',
    service: 'bg-gray-100 text-gray-700',
    cleaning: 'bg-blue-100 text-blue-700'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}