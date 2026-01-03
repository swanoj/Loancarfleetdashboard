import React from 'react';
import { X, Check } from 'lucide-react';

interface PhotoThumbnailProps {
  imageData: string;
  angle?: string;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PhotoThumbnail({ 
  imageData, 
  angle, 
  onRemove, 
  onClick, 
  selected,
  size = 'md' 
}: PhotoThumbnailProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} rounded-lg overflow-hidden border-2 transition-all ${
          selected 
            ? 'border-[#F97066] ring-2 ring-[#F9706650]' 
            : 'border-[#2A2A2E] hover:border-[#3A3A3F]'
        }`}
      >
        <img 
          src={imageData} 
          alt={angle || 'Photo'} 
          className="w-full h-full object-cover"
        />
        
        {selected && (
          <div className="absolute inset-0 bg-[#F97066]/20 flex items-center justify-center">
            <div className="w-6 h-6 bg-[#F97066] rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </button>
      
      {angle && (
        <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5">
          <span className="text-xs text-white uppercase">{angle}</span>
        </div>
      )}
      
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
}
