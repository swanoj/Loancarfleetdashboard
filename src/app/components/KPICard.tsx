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
      className={`bg-[#141416] border border-[#2A2A2E] rounded-xl p-5 transition-all duration-150 hover:border-[#3A3A3F] ${accentColor ? `border-l-2 ${accentColors[accentColor]}` : ''} ${onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-[#F9706610]' : ''}`}
      onClick={onClick}
    >
      <div className="text-xs uppercase tracking-wide text-[#71717A] mb-2">{label}</div>
      <div className="text-5xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-[#A1A1AA]">{sublabel}</div>
      {urgent && (
        <div className="flex gap-1 mt-2">
          <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
        </div>
      )}
    </div>
  );
}