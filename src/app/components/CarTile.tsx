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
      className={`relative bg-white border-2 rounded-lg p-2 w-full h-20 transition-all duration-200 cursor-pointer group ${
        isSelected 
          ? 'border-[#F97066] shadow-lg ring-4 ring-[#F9706620] scale-105' 
          : 'border-[#E5E7EB] hover:border-[#F97066] hover:shadow-md hover:-translate-y-0.5'
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-full flex items-center justify-center shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-[#10B981] rounded-full animate-pulse"></div>
      </div>
      
      <div className="flex items-center gap-1 mb-0.5">
        <CarIcon model={model} className={`w-4 h-4 transition-colors ${isSelected ? 'text-[#F97066]' : 'text-[#9CA3AF] group-hover:text-[#F97066]'}`} />
        <div className="font-mono font-bold text-xs text-[#1A1A1D]">{rego}</div>
      </div>
      <div className="text-[10px] text-[#6B7280] mb-1.5 truncate leading-tight">{make} {model}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span 
            className="w-1.5 h-1.5 rounded-full ring-1 ring-white" 
            style={{ backgroundColor: color.toLowerCase() }}
          />
          <span className="text-[10px] text-[#6B7280] capitalize truncate">{color}</span>
        </div>
        <div className="flex items-center gap-0.5 text-[10px] text-[#9CA3AF]">
          <MapPin className="w-2.5 h-2.5" />
          <span className="font-medium">{bay}</span>
        </div>
      </div>
    </div>
  );
}