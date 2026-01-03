import React, { useState } from 'react';
import { InspectionProvider, useInspection } from './context/InspectionContext';
import { VehicleLookup } from './screens/VehicleLookup';
import { InspectionType } from './screens/InspectionType';
import { ExteriorPhotos } from './screens/ExteriorPhotos';
import { DamageAnalysis } from './screens/DamageAnalysis';
import { DashboardCapture } from './screens/DashboardCapture';
import { ReviewSubmit } from './screens/ReviewSubmit';
import { Success } from './screens/Success';
import { addRecentVehicle } from './utils/mockApi';
import { ArrowLeft } from 'lucide-react';

type Screen = 
  | 'lookup' 
  | 'type' 
  | 'exterior' 
  | 'damage' 
  | 'dashboard' 
  | 'review' 
  | 'success'
  | 'submitting';

interface FleetScanContentProps {
  onBackToHome?: () => void;
}

function FleetScanContent({ onBackToHome }: FleetScanContentProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('lookup');
  const [submissionReference, setSubmissionReference] = useState('');
  const { inspection, currentVehicle, submitInspection, clearInspection } = useInspection();

  const handleSubmit = async () => {
    setCurrentScreen('submitting');
    
    try {
      const result = await submitInspection();
      setSubmissionReference(result.reference);
      
      // Add to recent vehicles
      if (currentVehicle) {
        addRecentVehicle(currentVehicle.id);
      }
      
      setCurrentScreen('success');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
      setCurrentScreen('review');
    }
  };

  const handleNewInspection = () => {
    clearInspection();
    setCurrentScreen('lookup');
    setSubmissionReference('');
  };

  // Submitting Screen
  if (currentScreen === 'submitting') {
    return (
      <div className="min-h-screen bg-[#0C0C0D] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-2">
            Submitting Inspection...
          </h2>
          <p className="text-[#A1A1AA]">
            Uploading photos and syncing data
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back to Home Button - Fixed Position */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-150 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      )}
      
      {currentScreen === 'lookup' && (
        <VehicleLookup onContinue={() => setCurrentScreen('type')} />
      )}
      
      {currentScreen === 'type' && (
        <InspectionType
          onBack={() => setCurrentScreen('lookup')}
          onContinue={() => setCurrentScreen('exterior')}
        />
      )}
      
      {currentScreen === 'exterior' && (
        <ExteriorPhotos
          onBack={() => setCurrentScreen('type')}
          onContinue={() => setCurrentScreen('damage')}
        />
      )}
      
      {currentScreen === 'damage' && (
        <DamageAnalysis
          onBack={() => setCurrentScreen('exterior')}
          onContinue={() => setCurrentScreen('dashboard')}
        />
      )}
      
      {currentScreen === 'dashboard' && (
        <DashboardCapture
          onBack={() => setCurrentScreen('damage')}
          onContinue={() => setCurrentScreen('review')}
        />
      )}
      
      {currentScreen === 'review' && (
        <ReviewSubmit
          onBack={() => setCurrentScreen('dashboard')}
          onSubmit={handleSubmit}
        />
      )}
      
      {currentScreen === 'success' && currentVehicle && inspection && (
        <Success
          reference={submissionReference}
          onNewInspection={handleNewInspection}
          inspectionType={inspection.type}
          vehicleRego={currentVehicle.rego}
        />
      )}
    </>
  );
}

export default function FleetScanApp({ onBackToHome }: FleetScanContentProps = {}) {
  return (
    <InspectionProvider>
      <div className="font-sans antialiased">
        <FleetScanContent onBackToHome={onBackToHome} />
      </div>
    </InspectionProvider>
  );
}