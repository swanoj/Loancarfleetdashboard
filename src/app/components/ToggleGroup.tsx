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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === option.value
              ? 'bg-[#F97066] text-white'
              : 'bg-[#0C0C0D] text-[#A1A1AA] border border-[#2A2A2E] hover:border-[#3A3A3F]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
