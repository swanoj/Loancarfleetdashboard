import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { CarIcon } from './CarIcon';

interface CarTileProps {
  rego: string;
  make: string;
  model: string;
  color: string;
  bay: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CarTile({ rego, make, model, color, bay, isSelected, onClick }: CarTileProps) {
  return (
    <div 
      className={`relative bg-white rounded-lg p-2.5 w-full h-20 transition-all duration-150 cursor-pointer group ${
        isSelected 
          ? 'border-2 border-[#3B82F6] shadow-md ring-2 ring-[#3B82F620]' 
          : 'border border-[#E5E7EB] hover:border-[#9CA3AF] hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-[#10B981] rounded-full"></div>
      </div>
      
      {/* Rego as primary anchor - Larger, mono font */}
      <div className="font-mono font-bold text-sm text-[#1A1A1D] mb-1 flex items-center gap-1.5">
        <CarIcon model={model} className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`} />
        {rego}
      </div>
      
      {/* Make/Model - Secondary */}
      <div className="text-[10px] text-[#6B7280] mb-1.5 truncate">{make} {model}</div>
      
      {/* Color and Bay - Subtle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span 
            className="w-1.5 h-1.5 rounded-full border border-[#E5E7EB]" 
            style={{ backgroundColor: color.toLowerCase() }}
          />
          <span className="text-[9px] text-[#9CA3AF] capitalize">{color}</span>
        </div>
        {bay && (
          <div className="px-1.5 py-0.5 bg-[#F8F9FA] rounded text-[9px] font-mono text-[#6B7280] border border-[#E5E7EB]">
            {bay}
          </div>
        )}
      </div>
    </div>
  );
}