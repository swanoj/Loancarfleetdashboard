import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isComplete = step < currentStep;
        const isCurrent = step === currentStep;
        
        return (
          <div key={step} className="flex items-center gap-2">
            {step > 1 && (
              <div 
                className={`h-0.5 w-8 transition-colors ${
                  isComplete ? 'bg-[#F97066]' : 'bg-[#2A2A2E]'
                }`} 
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isComplete
                    ? 'bg-[#F97066] text-white'
                    : isCurrent
                    ? 'bg-[#F9706620] text-[#F97066] ring-2 ring-[#F97066]'
                    : 'bg-[#2A2A2E] text-[#71717A]'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : step}
              </div>
              {stepLabels && stepLabels[step - 1] && (
                <span className={`text-xs ${
                  isCurrent ? 'text-[#FAFAFA]' : 'text-[#71717A]'
                }`}>
                  {stepLabels[step - 1]}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}