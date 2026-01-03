import React, { useState } from 'react';
import { ArrowLeft, Camera, Gauge, Droplet, Loader2, AlertTriangle } from 'lucide-react';
import { PhotoCapture } from '../components/PhotoCapture';
import { StepIndicator } from '../components/StepIndicator';
import { SubmitButton } from '../components/SubmitButton';
import { useInspection } from '../context/InspectionContext';
import { extractDashboardData } from '../utils/mockApi';

interface DashboardCaptureProps {
  onBack: () => void;
  onContinue: () => void;
}

export function DashboardCapture({ onBack, onContinue }: DashboardCaptureProps) {
  const { inspection, currentVehicle, setDashboardData } = useInspection();
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [manualOdometer, setManualOdometer] = useState('');
  const [manualFuel, setManualFuel] = useState('');

  if (!inspection || !currentVehicle) return null;

  const handlePhotoCapture = async (imageData: string) => {
    setShowCamera(false);
    setAnalyzing(true);

    try {
      const result = await extractDashboardData(imageData);
      
      setDashboardData({
        odometer: result.odometer,
        fuelLevel: result.fuelLevel,
        photo: imageData,
        confidence: result.confidence
      });
      
      setManualOdometer(result.odometer.toString());
      setManualFuel(result.fuelLevel.toString());
    } catch (error) {
      console.error('Dashboard extraction failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualUpdate = () => {
    if (!inspection.dashboardData) return;
    
    const odometer = parseInt(manualOdometer);
    const fuelLevel = parseInt(manualFuel);
    
    if (isNaN(odometer) || isNaN(fuelLevel)) {
      alert('Please enter valid numbers');
      return;
    }
    
    setDashboardData({
      ...inspection.dashboardData,
      odometer,
      fuelLevel
    });
    
    setEditMode(false);
  };

  const tripDistance = currentVehicle.lastOdometer 
    ? (inspection.dashboardData?.odometer || 0) - currentVehicle.lastOdometer
    : 0;

  const showAnomalyWarning = tripDistance < 0 || tripDistance > 500;

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          
          <h2 className="text-2xl font-semibold text-[#1A1A1D] mb-2">
            Extracting Dashboard Data...
          </h2>
          <p className="text-[#6B7280]">
            Reading odometer and fuel level
          </p>
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
          <span className="text-sm text-[#6B7280]">Step 3 of 3</span>
        </div>
        <StepIndicator currentStep={3} totalSteps={3} />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A1D] mb-2">
              Capture Dashboard
            </h2>
            <p className="text-[#6B7280]">
              Ensure odometer and fuel gauge are visible
            </p>
          </div>

          {/* Dashboard Photo */}
          {!inspection.dashboardData ? (
            <button
              onClick={() => setShowCamera(true)}
              className="w-full aspect-video bg-white border-2 border-dashed border-[#D1D5DB] rounded-xl flex flex-col items-center justify-center hover:border-[#F97066] hover:bg-[#F8F9FA] transition-all group shadow-sm"
            >
              <Camera className="w-16 h-16 text-[#9CA3AF] mb-4 group-hover:text-[#F97066] transition-colors" />
              <div className="text-lg font-medium text-[#6B7280] group-hover:text-[#1A1A1D] transition-colors">
                Capture Dashboard Photo
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              {/* Photo Preview */}
              <div className="relative rounded-xl overflow-hidden border-2 border-[#E5E7EB] shadow-sm">
                <img
                  src={inspection.dashboardData.photo}
                  alt="Dashboard"
                  className="w-full aspect-video object-cover"
                />
                <button
                  onClick={() => setShowCamera(true)}
                  className="absolute top-3 right-3 px-3 py-2 bg-black/70 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
                >
                  Retake
                </button>
              </div>

              {/* Extracted Data */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1A1A1D]">
                    Dashboard Data Extracted
                  </h3>
                  <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                    AI Detected
                  </div>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#6B7280] font-medium mb-2">
                        Odometer (km)
                      </label>
                      <input
                        type="number"
                        value={manualOdometer}
                        onChange={(e) => setManualOdometer(e.target.value)}
                        className="w-full bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg px-4 py-3 text-[#1A1A1D] focus:outline-none focus:border-[#F97066] focus:ring-4 focus:ring-[#F9706620]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#6B7280] font-medium mb-2">
                        Fuel Level (%)
                      </label>
                      <input
                        type="number"
                        value={manualFuel}
                        onChange={(e) => setManualFuel(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg px-4 py-3 text-[#1A1A1D] focus:outline-none focus:border-[#F97066] focus:ring-4 focus:ring-[#F9706620]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleManualUpdate}
                        className="flex-1 px-4 py-2 bg-[#F97066] text-white rounded-lg font-medium hover:bg-[#E85F55] transition-colors shadow-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex-1 px-4 py-2 bg-[#F8F9FA] text-[#1A1A1D] border-2 border-[#E5E7EB] rounded-lg font-medium hover:bg-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB]">
                        <div className="flex items-center gap-2 text-[#6B7280] mb-2">
                          <Gauge className="w-4 h-4" />
                          <span className="text-sm uppercase tracking-wide font-medium">Odometer</span>
                        </div>
                        <div className="text-3xl font-bold text-[#1A1A1D]">
                          {inspection.dashboardData.odometer.toLocaleString()}
                        </div>
                        <div className="text-sm text-[#9CA3AF] mt-1">km</div>
                      </div>

                      <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB]">
                        <div className="flex items-center gap-2 text-[#6B7280] mb-2">
                          <Droplet className="w-4 h-4" />
                          <span className="text-sm uppercase tracking-wide font-medium">Fuel Level</span>
                        </div>
                        <div className="text-3xl font-bold text-[#1A1A1D]">
                          {inspection.dashboardData.fuelLevel}%
                        </div>
                        <div className="mt-2 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#F97066] to-[#FDA29B] transition-all"
                            style={{ width: `${inspection.dashboardData.fuelLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditMode(true)}
                      className="text-sm text-[#F97066] font-medium hover:text-[#E85F55] transition-colors"
                    >
                      Edit if incorrect →
                    </button>
                  </>
                )}
              </div>

              {/* Previous Reading & Trip Info */}
              {currentVehicle.lastOdometer && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[#9CA3AF] mb-1">Previous Reading</div>
                      <div className="text-[#1A1A1D] font-semibold">
                        {currentVehicle.lastOdometer.toLocaleString()} km
                      </div>
                    </div>
                    <div>
                      <div className="text-[#9CA3AF] mb-1">Trip Distance</div>
                      <div className="text-[#1A1A1D] font-semibold">
                        {tripDistance >= 0 ? '+' : ''}{tripDistance.toLocaleString()} km
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Anomaly Warning */}
              {showAnomalyWarning && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-amber-900 mb-1">
                      {tripDistance < 0 ? 'Odometer Decreased' : 'Unusual Distance'}
                    </div>
                    <div className="text-sm text-amber-800">
                      {tripDistance < 0 
                        ? 'The odometer reading is lower than the previous inspection. Please verify.'
                        : 'The trip distance seems unusually high. Please verify the reading is correct.'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-sm text-blue-900 leading-relaxed">
              <strong className="font-semibold">Tips:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Turn ignition to ON (don't start engine)</li>
                <li>Ensure dashboard is fully lit up</li>
                <li>Capture the full instrument cluster</li>
                <li>Avoid reflections and glare</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <SubmitButton
            onClick={onContinue}
            disabled={!inspection.dashboardData}
          >
            Continue to Review
          </SubmitButton>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
          guideText="Capture dashboard with odometer and fuel visible"
        />
      )}
    </div>
  );
}