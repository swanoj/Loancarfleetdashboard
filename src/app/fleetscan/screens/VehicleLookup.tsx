import React, { useState } from 'react';
import { Camera, ArrowRight, Loader2 } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { SubmitButton } from '../components/SubmitButton';
import { lookupVehicle, scanRegoPlate, getRecentVehicles } from '../utils/mockApi';
import { useInspection } from '../context/InspectionContext';

interface VehicleLookupProps {
  onContinue: () => void;
}

export function VehicleLookup({ onContinue }: VehicleLookupProps) {
  const [rego, setRego] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const { currentVehicle, setCurrentVehicle } = useInspection();
  const recentVehicles = getRecentVehicles();

  const formatRego = (value: string) => {
    // Remove non-alphanumeric, uppercase, add hyphen
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
  };

  const handleRegoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRego(e.target.value);
    setRego(formatted);
    setError('');
    setCurrentVehicle(null);
  };

  const handleLookup = async () => {
    if (!rego) return;
    
    setLoading(true);
    setError('');
    
    try {
      const vehicle = await lookupVehicle(rego);
      setCurrentVehicle(vehicle);
    } catch (err) {
      setError('Vehicle not found. Please check the registration number.');
      setCurrentVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  const handleRecentVehicleClick = async (vehicleRego: string) => {
    setRego(vehicleRego);
    setLoading(true);
    try {
      const vehicle = await lookupVehicle(vehicleRego);
      setCurrentVehicle(vehicle);
    } catch (err) {
      setError('Error loading vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#1A1A1D] mb-2">Fleet Scan</h1>
        <p className="text-[#6B7280]">Vehicle Inspection System</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1D] mb-2">
              Enter Vehicle Registration
            </label>
            <div className="relative">
              <input
                type="text"
                value={rego}
                onChange={handleRegoChange}
                onKeyPress={handleKeyPress}
                onBlur={handleLookup}
                placeholder="ABC-123"
                maxLength={7}
                className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl px-4 py-4 text-[#1A1A1D] text-lg font-mono text-center uppercase placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97066] focus:ring-4 focus:ring-[#F9706620] transition-all shadow-sm"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-[#F97066] animate-spin" />
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-[#EF4444] mt-2">{error}</p>
            )}
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1A1A1D] font-medium hover:bg-[#F8F9FA] hover:border-[#F97066] transition-all shadow-sm"
          >
            <Camera className="w-5 h-5 text-[#6B7280]" />
            Scan Rego Plate
          </button>

          {/* Vehicle Preview */}
          {currentVehicle && (
            <div className="space-y-4 animate-fadeIn">
              <VehicleCard
                rego={currentVehicle.rego}
                make={currentVehicle.make}
                model={currentVehicle.model}
                color={currentVehicle.color}
                year={currentVehicle.year}
                lastInspection={currentVehicle.lastInspection}
                status="Ready"
              />
              
              <SubmitButton
                onClick={onContinue}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Continue
              </SubmitButton>
            </div>
          )}

          {/* Recent Vehicles */}
          {!currentVehicle && recentVehicles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-[#6B7280] mb-3">Recent Vehicles</h3>
              <div className="space-y-2">
                {recentVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleRecentVehicleClick(vehicle.rego)}
                    className="w-full text-left"
                  >
                    <div className="bg-white border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#F97066] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-sm text-[#1A1A1D] mb-1 font-medium">{vehicle.rego}</div>
                          <div className="text-xs text-[#6B7280]">{vehicle.make} {vehicle.model}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Scanner Modal (placeholder) */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F9706620] rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-[#F97066]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1D] mb-2">Scan Registration Plate</h3>
              <p className="text-[#6B7280] mb-6 text-sm">Camera scanner would open here</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowScanner(false);
                    setRego('ABC-123');
                    setTimeout(() => handleLookup(), 100);
                  }}
                  className="w-full px-6 py-3 bg-[#F97066] text-white rounded-xl font-medium hover:bg-[#E85F55] transition-colors shadow-md"
                >
                  Simulate Scan (ABC-123)
                </button>
                <button
                  onClick={() => setShowScanner(false)}
                  className="w-full px-6 py-3 bg-[#F8F9FA] text-[#1A1A1D] border-2 border-[#E5E7EB] rounded-xl font-medium hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}