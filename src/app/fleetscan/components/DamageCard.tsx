import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DamageCardProps {
  type: 'scratch' | 'dent' | 'crack' | 'scuff' | 'chip' | 'broken';
  location: string;
  severity: 'minor' | 'moderate' | 'severe';
  size?: string;
  photo?: string;
  isNew?: boolean;
  confirmed?: boolean;
  onConfirmNew?: () => void;
  onMarkPreExisting?: () => void;
  onClick?: () => void;
}

const damageTypeEmoji: Record<string, string> = {
  scratch: '🔴',
  dent: '🔴',
  crack: '⚠️',
  scuff: '🟠',
  chip: '🟡',
  broken: '🔴'
};

const severityColors = {
  minor: '#F59E0B',
  moderate: '#F97066',
  severe: '#EF4444'
};

export function DamageCard({
  type,
  location,
  severity,
  size,
  photo,
  isNew,
  confirmed,
  onConfirmNew,
  onMarkPreExisting,
  onClick
}: DamageCardProps) {
  return (
    <div 
      className={`bg-white border-2 rounded-xl p-4 shadow-sm ${
        isNew 
          ? 'border-[#F97066]' 
          : 'border-[#E5E7EB]'
      } ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[#D1D5DB]' : ''} transition-all`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        {/* Photo Thumbnail */}
        {photo && (
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8F9FA] border border-[#E5E7EB]">
            <img src={photo} alt={type} className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Damage Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{damageTypeEmoji[type]}</span>
              <div>
                <div className="text-[#1A1A1D] font-semibold capitalize">
                  {type} - {location}
                </div>
                {size && (
                  <div className="text-sm text-[#6B7280]">{size}</div>
                )}
              </div>
            </div>
            
            {isNew && !confirmed && (
              <div className="px-2 py-1 bg-[#F9706620] text-[#F97066] rounded text-xs font-bold">
                NEW
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="px-2 py-1 rounded text-xs font-semibold"
              style={{ 
                backgroundColor: `${severityColors[severity]}20`,
                color: severityColors[severity]
              }}
            >
              Severity: {severity.toUpperCase()}
            </div>
          </div>
          
          {/* Confirmation Options for New Damage */}
          {isNew && !confirmed && onConfirmNew && onMarkPreExisting && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmNew();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F97066] text-white rounded-lg text-sm font-medium hover:bg-[#E85F55] transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm New
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkPreExisting();
                }}
                className="flex-1 px-3 py-2 bg-[#F8F9FA] border-2 border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Pre-Existing
              </button>
            </div>
          )}
          
          {confirmed && (
            <div className="flex items-center gap-2 text-sm text-green-600 mt-2 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Confirmed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}