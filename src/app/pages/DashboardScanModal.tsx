import React, { useState } from 'react';
import { X, Camera, Gauge, Droplet } from 'lucide-react';
import { DashboardScanner } from '../components/DashboardScanner';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface ScanResult {
  odometer: number | null;
  fuelLevel: number | null;
  confidence: 'high' | 'medium' | 'low';
  rawImage: string;
}

interface DashboardScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { odometer: number; fuelLevel: number; image?: string }) => void;
  carRego?: string;
  currentOdometer?: number;
  currentFuelLevel?: number;
}

export function DashboardScanModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  carRego,
  currentOdometer,
  currentFuelLevel 
}: DashboardScanModalProps) {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualOdometer, setManualOdometer] = useState(currentOdometer?.toString() || '');
  const [manualFuelLevel, setManualFuelLevel] = useState(currentFuelLevel?.toString() || '');
  
  if (!isOpen) return null;
  
  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    if (result.odometer !== null) {
      setManualOdometer(result.odometer.toString());
    }
    if (result.fuelLevel !== null) {
      setManualFuelLevel(result.fuelLevel.toString());
    }
  };
  
  const handleConfirm = () => {
    const odometer = parseInt(manualOdometer);
    const fuelLevel = parseInt(manualFuelLevel);
    
    if (isNaN(odometer) || isNaN(fuelLevel)) {
      alert('Please enter valid numbers for odometer and fuel level');
      return;
    }
    
    if (fuelLevel < 0 || fuelLevel > 100) {
      alert('Fuel level must be between 0 and 100');
      return;
    }
    
    onConfirm({
      odometer,
      fuelLevel,
      image: scanResult?.rawImage
    });
    
    // Reset state
    setScanResult(null);
    setManualOdometer('');
    setManualFuelLevel('');
    setMode('scan');
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#F8F9FA] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#DEE2E6] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#212529]">Dashboard Scan</h2>
              {carRego && (
                <p className="text-sm text-[#6C757D] mt-1">Vehicle: {carRego}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F1F3F5] transition-colors"
            >
              <X className="w-6 h-6 text-[#495057]" />
            </button>
          </div>
          
          {/* Mode Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setMode('scan')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'scan'
                  ? 'bg-[#F97066] text-white'
                  : 'bg-[#F1F3F5] text-[#6C757D] hover:bg-[#E9ECEF]'
              }`}
            >
              <Camera className="w-4 h-4" />
              AI Scan
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'manual'
                  ? 'bg-[#F97066] text-white'
                  : 'bg-[#F1F3F5] text-[#6C757D] hover:bg-[#E9ECEF]'
              }`}
            >
              Manual Entry
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'scan' ? (
            <DashboardScanner
              title="Capture Dashboard Photo"
              description="Take or upload a clear photo of the dashboard showing the odometer and fuel gauge"
              onScanComplete={handleScanComplete}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-white border border-[#DEE2E6] rounded-xl p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#495057] mb-2">
                    <Gauge className="w-4 h-4" />
                    Odometer Reading (km)
                  </label>
                  <Input
                    type="number"
                    value={manualOdometer}
                    onChange={(e) => setManualOdometer(e.target.value)}
                    placeholder="Enter odometer reading"
                    min="0"
                  />
                  {currentOdometer && (
                    <div className="text-xs text-[#6C757D] mt-1">
                      Previous: {currentOdometer.toLocaleString()} km
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#495057] mb-2">
                    <Droplet className="w-4 h-4" />
                    Fuel Level (%)
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={manualFuelLevel}
                      onChange={(e) => setManualFuelLevel(e.target.value)}
                      placeholder="Enter fuel level percentage"
                      min="0"
                      max="100"
                    />
                    {manualFuelLevel && !isNaN(parseInt(manualFuelLevel)) && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-[#DEE2E6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#F97066] to-[#FDA29B] transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, parseInt(manualFuelLevel)))}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#495057] min-w-[3ch]">
                          {parseInt(manualFuelLevel)}%
                        </span>
                      </div>
                    )}
                  </div>
                  {currentFuelLevel && (
                    <div className="text-xs text-[#6C757D] mt-1">
                      Previous: {currentFuelLevel}%
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>Tip:</strong> For faster data entry, use the AI Scan mode above to automatically capture dashboard readings.
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-white border-t border-[#DEE2E6] px-6 py-4 flex items-center justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!manualOdometer || !manualFuelLevel}
          >
            Confirm & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
