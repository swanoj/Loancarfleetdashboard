import React from 'react';
import { Calendar } from 'lucide-react';

interface VehicleCardProps {
  rego: string;
  make: string;
  model: string;
  color: string;
  year?: number;
  lastInspection?: string;
  status?: string;
}

export function VehicleCard({ rego, make, model, color, year, lastInspection, status }: VehicleCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-lg font-bold text-[#1A1A1D] mb-1">{rego}</div>
          <div className="text-[#1A1A1D] font-semibold">{make} {model}</div>
          <div className="text-sm text-[#6B7280] mt-1">
            {year && `${year} • `}{color}
          </div>
        </div>
        {status && (
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
            {status}
          </div>
        )}
      </div>
      
      {lastInspection && (
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-3 pt-3 border-t border-[#E5E7EB]">
          <Calendar className="w-4 h-4" />
          <span>Last inspected: <span className="font-medium">{formatDate(lastInspection)}</span></span>
        </div>
      )}
    </div>
  );
}