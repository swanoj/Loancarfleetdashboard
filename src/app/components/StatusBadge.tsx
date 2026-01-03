import React from 'react';

type StatusVariant = 'available' | 'out' | 'hold' | 'service' | 'ready' | 'cleaning' | 'overdue' | 'due-soon' | 'ok' | 'late';

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const styles = {
    available: 'bg-[#10B98120] text-[#10B981]',
    ready: 'bg-[#10B98120] text-[#10B981]',
    ok: 'bg-[#10B98120] text-[#10B981]',
    out: 'bg-[#3B82F620] text-[#3B82F6]',
    overdue: 'bg-[#EF444420] text-[#EF4444]',
    late: 'bg-[#EF444420] text-[#EF4444]',
    'due-soon': 'bg-[#F59E0B20] text-[#F59E0B]',
    hold: 'bg-[#6B728020] text-[#6B7280]',
    service: 'bg-[#6B728020] text-[#6B7280]',
    cleaning: 'bg-[#3B82F620] text-[#3B82F6]'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
