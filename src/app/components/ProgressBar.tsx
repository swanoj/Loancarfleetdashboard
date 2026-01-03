import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = true }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="relative w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-[#F97066] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-[#6B7280] mt-1 font-medium">{value}%</div>
      )}
    </div>
  );
}