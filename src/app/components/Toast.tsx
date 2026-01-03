import React, { useEffect } from 'react';
import { CheckCheck, X, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);
  
  const icons = {
    success: CheckCheck,
    error: AlertTriangle
  };
  
  const styles = {
    success: 'bg-[#10B981] border-[#10B981]',
    error: 'bg-[#EF4444] border-[#EF4444]'
  };
  
  const Icon = icons[type];
  
  return (
    <div className="fixed top-6 right-6 z-50 animate-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]}`}>
        <Icon className="w-5 h-5 text-white" />
        <span className="text-white font-medium">{message}</span>
        {type === 'error' && (
          <button onClick={onClose} className="ml-2 text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
