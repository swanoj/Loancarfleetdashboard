import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl'
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ 
        backgroundColor: 'rgba(12, 12, 13, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className={`bg-[#141416] rounded-2xl w-full ${sizes[size]} shadow-2xl animate-in fade-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[#2A2A2E]">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button 
              onClick={onClose}
              className="text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
        
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2A2A2E]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
