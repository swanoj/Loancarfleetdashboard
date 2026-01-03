import React from 'react';

interface KPICardProps {
  label: string;
  value: number | string;
  sublabel: string;
  accentColor?: 'coral' | 'blue' | 'amber' | 'red' | 'green' | 'neutral';
  urgent?: boolean;
  onClick?: () => void;
}

export function KPICard({ label, value, sublabel, accentColor, urgent, onClick }: KPICardProps) {
  const accentColors = {
    coral: 'border-l-[#F97066]',
    blue: 'border-l-[#3B82F6]',
    amber: 'border-l-[#F59E0B]',
    red: 'border-l-[#EF4444]',
    green: 'border-l-[#10B981]',
    neutral: 'border-l-[#6B7280]'
  };
  
  return (
    <div 
      className={`bg-white border border-[#E5E7EB] rounded-xl p-3 transition-all duration-150 hover:border-[#D1D5DB] hover:shadow-md ${accentColor ? `border-l-4 ${accentColors[accentColor]}` : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="text-xs uppercase tracking-wide text-[#9CA3AF] mb-1 font-medium">{label}</div>
      <div className="text-3xl font-bold text-[#1A1A1D] mb-0.5">{value}</div>
      <div className="text-xs text-[#6B7280]">{sublabel}</div>
      {urgent && (
        <div className="flex gap-1 mt-1.5">
          <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></span>
          <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
        </div>
      )}
    </div>
  );
}