import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[#FAFAFA]">
          {label}
        </label>
      )}
      <input
        className={`bg-[#0C0C0D] border border-[#2A2A2E] rounded-lg px-4 py-3 text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#F97066] transition-colors ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[#EF4444]">{error}</span>
      )}
    </div>
  );
}
