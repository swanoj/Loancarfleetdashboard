import React from 'react';
import { ArrowLeft, LogOut, LogIn } from 'lucide-react';
import { useInspection } from '../context/InspectionContext';

interface InspectionTypeProps {
  onBack: () => void;
  onContinue: () => void;
}

export function InspectionType({ onBack, onContinue }: InspectionTypeProps) {
  const { currentVehicle, inspection, initializeInspection } = useInspection();

  if (!currentVehicle) return null;

  const handleTypeSelect = (type: 'pre-loan' | 'return') => {
    initializeInspection(currentVehicle.id, type);
    onContinue();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0C0C0D] flex flex-col">
      {/* Header */}
      <header className="bg-[#141416] border-b border-[#2A2A2E] px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="px-3 py-1 bg-[#2A2A2E] rounded-lg">
            <span className="font-mono text-sm text-[#FAFAFA]">{currentVehicle.rego}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Vehicle Info */}
          <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-4">
            <div className="text-lg font-semibold text-[#FAFAFA] mb-1">
              {currentVehicle.make} {currentVehicle.model}
            </div>
            <div className="text-sm text-[#A1A1AA]">
              {currentVehicle.year} • {currentVehicle.color}
            </div>
            {currentVehicle.lastInspection && (
              <div className="mt-3 pt-3 border-t border-[#2A2A2E] text-sm text-[#71717A]">
                Last inspected: {formatDate(currentVehicle.lastInspection)}
              </div>
            )}
          </div>

          <div className="h-px bg-[#2A2A2E]" />

          {/* Inspection Type Selection */}
          <div>
            <h2 className="text-xl font-semibold text-[#FAFAFA] mb-4">
              What type of inspection?
            </h2>

            <div className="space-y-4">
              {/* Pre-Loan */}
              <button
                onClick={() => handleTypeSelect('pre-loan')}
                className="w-full bg-[#141416] border-2 border-[#2A2A2E] rounded-xl p-6 hover:border-[#F97066] hover:bg-[#1A1A1D] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F9706620] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#F9706630] transition-colors">
                    <LogOut className="w-6 h-6 text-[#F97066]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-lg font-semibold text-[#FAFAFA] mb-1">
                      Pre-Loan Inspection
                    </div>
                    <div className="text-sm text-[#A1A1AA]">
                      Taking the vehicle out for a loan
                    </div>
                    <div className="mt-3 text-xs text-[#71717A]">
                      Document condition before customer takes possession
                    </div>
                  </div>
                </div>
              </button>

              {/* Return */}
              <button
                onClick={() => handleTypeSelect('return')}
                className="w-full bg-[#141416] border-2 border-[#2A2A2E] rounded-xl p-6 hover:border-[#F97066] hover:bg-[#1A1A1D] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#10B98120] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#10B98130] transition-colors">
                    <LogIn className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-lg font-semibold text-[#FAFAFA] mb-1">
                      Return Inspection
                    </div>
                    <div className="text-sm text-[#A1A1AA]">
                      Bringing the vehicle back from loan
                    </div>
                    <div className="mt-3 text-xs text-[#71717A]">
                      Check for new damage and record final odometer reading
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
            <div className="text-sm text-[#94A3B8] leading-relaxed">
              <strong className="text-[#E2E8F0]">Tip:</strong> Each inspection captures exterior photos, checks for damage, and records dashboard readings (odometer and fuel level).
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
