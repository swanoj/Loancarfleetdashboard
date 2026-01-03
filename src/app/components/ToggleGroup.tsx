import React from 'react';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  return (
    <div className="flex gap-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            value === option.value
              ? 'bg-[#F97066] text-white shadow-sm'
              : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F8F9FA]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}