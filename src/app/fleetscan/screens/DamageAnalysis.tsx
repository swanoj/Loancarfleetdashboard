import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Plus, AlertTriangle } from 'lucide-react';
import { DamageCard } from '../components/DamageCard';
import { StepIndicator } from '../components/StepIndicator';
import { SubmitButton } from '../components/SubmitButton';
import { useInspection } from '../context/InspectionContext';
import { analyzeDamage } from '../utils/mockApi';
import { DamageItem } from '../context/InspectionContext';

interface DamageAnalysisProps {
  onBack: () => void;
  onContinue: () => void;
}

export function DamageAnalysis({ onBack, onContinue }: DamageAnalysisProps) {
  const { inspection, currentVehicle, setDamageItems, updateDamageItem } = useInspection();
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    if (!inspection || !currentVehicle) return;

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const photos = inspection.exteriorPhotos.map(p => p.imageData);
      const result = await analyzeDamage(photos, currentVehicle.id);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Combine new and existing damage
      const allDamage = [
        ...result.newDamage,
        ...result.existingDamage
      ];
      
      setDamageItems(allDamage);
      
      setTimeout(() => {
        setAnalyzing(false);
      }, 500);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalyzing(false);
    }
  };

  if (!inspection) return null;

  const newDamage = inspection.damageItems.filter(d => d.isNew);
  const existingDamage = inspection.damageItems.filter(d => !d.isNew);
  const unconfirmedNew = newDamage.filter(d => !d.confirmed);

  const handleConfirmNew = (id: string) => {
    updateDamageItem(id, { confirmed: true });
  };

  const handleMarkPreExisting = (id: string) => {
    updateDamageItem(id, { isNew: false, confirmed: false });
  };

  const canContinue = unconfirmedNew.length === 0;

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          
          <h2 className="text-2xl font-semibold text-[#1A1A1D] mb-2">
            Analyzing Photos...
          </h2>
          <p className="text-[#6B7280] mb-6">
            Detecting damage and comparing with previous inspection
          </p>
          
          <div className="bg-[#E5E7EB] rounded-full h-3 overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-[#F97066] to-[#FDA29B] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-[#6B7280] font-medium">{progress}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A1D] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-sm text-[#6B7280]">Step 2 of 3</span>
        </div>
        <StepIndicator currentStep={2} totalSteps={3} />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A1D] mb-2">
              Damage Analysis Results
            </h2>
          </div>

          {/* Summary Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#F97066] mb-1">
                  {newDamage.length}
                </div>
                <div className="text-sm text-[#6B7280]">New items detected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#9CA3AF] mb-1">
                  {existingDamage.length}
                </div>
                <div className="text-sm text-[#6B7280]">Existing items</div>
              </div>
            </div>
          </div>

          {/* New Damage Section */}
          {newDamage.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-[#F97066]" />
                <h3 className="text-lg font-semibold text-[#1A1A1D]">
                  NEW DAMAGE FOUND
                </h3>
              </div>

              {unconfirmedNew.length > 0 && (
                <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-4">
                  <div className="text-sm text-orange-900">
                    <strong className="font-semibold">Action Required:</strong> Please confirm each new damage item or mark as pre-existing.
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {newDamage.map((damage) => (
                  <DamageCard
                    key={damage.id}
                    {...damage}
                    onConfirmNew={() => handleConfirmNew(damage.id)}
                    onMarkPreExisting={() => handleMarkPreExisting(damage.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Existing Damage Section */}
          {existingDamage.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1D] mb-4">
                EXISTING DAMAGE (No change)
              </h3>
              
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                <ul className="space-y-3">
                  {existingDamage.map((damage) => (
                    <li key={damage.id} className="flex items-start gap-3 text-sm text-[#6B7280]">
                      <span className="text-[#9CA3AF] font-bold">•</span>
                      <span className="flex-1">
                        <span className="capitalize font-medium text-[#1A1A1D]">{damage.type}</span> - {damage.location}
                        {damage.size && ` (${damage.size})`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* No Damage */}
          {newDamage.length === 0 && existingDamage.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1D] mb-2">
                No Damage Detected
              </h3>
              <p className="text-[#6B7280]">
                Vehicle appears to be in good condition
              </p>
            </div>
          )}

          {/* Add Manual Damage */}
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1A1A1D] font-medium hover:bg-[#F8F9FA] hover:border-[#D1D5DB] transition-all shadow-sm">
            <Plus className="w-5 h-5 text-[#6B7280]" />
            Add Damage Manually
          </button>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <SubmitButton
            onClick={onContinue}
            disabled={!canContinue}
          >
            {canContinue ? 'Continue' : `Confirm ${unconfirmedNew.length} New Item${unconfirmedNew.length !== 1 ? 's' : ''}`}
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}