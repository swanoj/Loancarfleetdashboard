import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function SubmitButton({ 
  children, 
  onClick, 
  disabled, 
  loading,
  variant = 'primary',
  fullWidth = true,
  icon
}: SubmitButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-[#F97066] text-white hover:bg-[#FDA29B] active:scale-95",
    secondary: "bg-[#2A2A2E] text-[#FAFAFA] hover:bg-[#3A3A3F] active:scale-95"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
