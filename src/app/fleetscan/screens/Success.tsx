import React, { useEffect, useState } from 'react';
import { Check, FileText, Plus } from 'lucide-react';
import { SubmitButton } from '../components/SubmitButton';

interface SuccessProps {
  reference: string;
  onNewInspection: () => void;
  onViewHistory?: () => void;
  inspectionType: 'pre-loan' | 'return';
  vehicleRego: string;
}

export function Success({ reference, onNewInspection, onViewHistory, inspectionType, vehicleRego }: SuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0D] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#F97066] rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: Math.random()
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-md w-full text-center space-y-6 animate-fadeIn">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-full mx-auto opacity-20 animate-ping" />
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-3xl font-bold text-[#FAFAFA] mb-3">
            Inspection Submitted
          </h1>
          <p className="text-[#A1A1AA]">
            {vehicleRego} • {inspectionType === 'pre-loan' ? 'Pre-Loan' : 'Return'}
          </p>
          <p className="text-sm text-[#71717A] mt-2">
            {new Date().toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="h-px bg-[#2A2A2E]" />

        {/* Details */}
        <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6 space-y-4">
          <div>
            <div className="text-sm text-[#71717A] mb-1">Summary sent to:</div>
            <div className="text-[#FAFAFA] font-medium">fleet@workshop.com.au</div>
          </div>
          
          <div>
            <div className="text-sm text-[#71717A] mb-1">Reference Number:</div>
            <div className="font-mono text-lg text-[#F97066] font-semibold">{reference}</div>
          </div>
        </div>

        <div className="h-px bg-[#2A2A2E]" />

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <SubmitButton
            onClick={onNewInspection}
            icon={<Plus className="w-5 h-5" />}
          >
            Start New Inspection
          </SubmitButton>

          {onViewHistory && (
            <button
              onClick={onViewHistory}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#141416] border border-[#2A2A2E] rounded-xl text-[#FAFAFA] font-medium hover:bg-[#1A1A1D] hover:border-[#3A3A3F] transition-all"
            >
              <FileText className="w-5 h-5" />
              View Inspection History
            </button>
          )}
        </div>

        {/* Success Badge */}
        <div className="bg-[#10B98110] border border-[#10B981] rounded-lg p-4 mt-8">
          <div className="text-sm text-[#10B981] leading-relaxed">
            ✓ Your inspection has been recorded and synced to the fleet management system.
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.5);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
