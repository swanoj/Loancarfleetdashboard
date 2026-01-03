import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A1D]">
          {label}
        </label>
      )}
      <input
        className={`bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A1D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97066] focus:ring-2 focus:ring-[#F9706620] transition-colors ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[#EF4444] font-medium">{error}</span>
      )}
    </div>
  );
}