import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A1D]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`appearance-none w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 pr-10 text-[#1A1A1D] focus:outline-none focus:border-[#F97066] focus:ring-2 focus:ring-[#F9706620] transition-colors ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
      </div>
    </div>
  );
}