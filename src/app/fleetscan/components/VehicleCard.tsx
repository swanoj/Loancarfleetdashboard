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
    <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-lg font-semibold text-[#FAFAFA] mb-1">{rego}</div>
          <div className="text-[#FAFAFA]">{make} {model}</div>
          <div className="text-sm text-[#A1A1AA] mt-1">
            {year && `${year} • `}{color}
          </div>
        </div>
        {status && (
          <div className="px-3 py-1 bg-[#10B98115] text-[#10B981] rounded-lg text-sm font-medium">
            {status}
          </div>
        )}
      </div>
      
      {lastInspection && (
        <div className="flex items-center gap-2 text-sm text-[#71717A] mt-3 pt-3 border-t border-[#2A2A2E]">
          <Calendar className="w-4 h-4" />
          <span>Last inspected: {formatDate(lastInspection)}</span>
        </div>
      )}
    </div>
  );
}
