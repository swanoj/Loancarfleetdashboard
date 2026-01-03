import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[#FAFAFA]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`appearance-none w-full bg-[#0C0C0D] border border-[#2A2A2E] rounded-lg px-4 py-3 pr-10 text-[#FAFAFA] focus:outline-none focus:border-[#F97066] transition-colors ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
      </div>
    </div>
  );
}
