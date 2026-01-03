import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white hover:shadow-lg hover:shadow-[#F9706640] hover:scale-105 focus:ring-[#F9706640] active:scale-95',
    secondary: 'bg-white text-[#1A1A1D] border-2 border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F8F9FA] focus:ring-[#E5E7EB]',
    ghost: 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A1D] focus:ring-[#E5E7EB]',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 focus:ring-red-500/40 active:scale-95'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}