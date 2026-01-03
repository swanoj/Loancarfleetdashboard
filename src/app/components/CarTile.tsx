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
      className={`relative bg-[#141416] border rounded-xl p-4 w-40 h-32 transition-all duration-150 cursor-pointer ${
        isSelected 
          ? 'border-[#F97066] shadow-lg shadow-[#F9706620]' 
          : 'border-[#2A2A2E] hover:border-[#F97066]'
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-[#F97066] rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        <CarIcon model={model} className="w-5 h-5 text-[#F97066]" />
        <div className="font-mono font-bold text-white">{rego}</div>
      </div>
      <div className="text-sm text-[#A1A1AA] mb-2">{make} {model}</div>
      <div className="flex items-center gap-2 mb-1">
        <span 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: color.toLowerCase() }}
        />
        <span className="text-xs text-[#A1A1AA] capitalize">{color}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#71717A]">
        <MapPin className="w-3 h-3" />
        <span>{bay}</span>
      </div>
    </div>
  );
}