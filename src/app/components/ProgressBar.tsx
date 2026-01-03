import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = true }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="relative w-full h-2 bg-[#2A2A2E] rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-[#F97066] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-[#A1A1AA] mt-1">{value}%</div>
      )}
    </div>
  );
}
