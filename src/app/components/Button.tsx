import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#F97066] text-white hover:bg-[#FDA29B] active:scale-[0.98]',
    secondary: 'bg-transparent border border-[#3A3A3F] text-[#FAFAFA] hover:bg-[#1A1A1D]',
    ghost: 'bg-transparent text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1A1A1D]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] active:scale-[0.98]'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3',
    lg: 'px-6 py-4 text-lg'
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
