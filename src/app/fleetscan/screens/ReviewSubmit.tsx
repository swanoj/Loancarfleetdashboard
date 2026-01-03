import React, { useState } from 'react';
import { ArrowLeft, Check, Gauge, Droplet, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { PhotoThumbnail } from '../components/PhotoThumbnail';
import { SubmitButton } from '../components/SubmitButton';
import { useInspection } from '../context/InspectionContext';

interface ReviewSubmitProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewSubmit({ onBack, onSubmit }: ReviewSubmitProps) {
  const { inspection, currentVehicle, setNotes } = useInspection();
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotesInput] = useState(inspection?.notes || '');

  if (!inspection || !currentVehicle) return null;

  const newDamageCount = inspection.damageItems.filter(d => d.isNew && d.confirmed).length;
  const existingDamageCount = inspection.damageItems.filter(d => !d.isNew).length;

  const handleNotesChange = (value: string) => {
    setNotesInput(value);
    setNotes(value);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A1D] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="px-3 py-1 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
            <span className="font-mono text-sm text-[#1A1A1D] font-medium">{currentVehicle.rego}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A1D] mb-2">
              Review Inspection
            </h2>
            <p className="text-[#6B7280]">
              {inspection.type === 'pre-loan' ? 'PRE-LOAN' : 'RETURN'} • {new Date().toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <div className="text-sm text-[#9CA3AF] uppercase tracking-wide mb-2 font-medium">Vehicle</div>
            <div className="text-lg font-semibold text-[#1A1A1D]">
              {currentVehicle.make} {currentVehicle.model}
            </div>
            <div className="text-sm text-[#6B7280] mt-1">
              Rego: {currentVehicle.rego}
            </div>
          </div>

          {/* Dashboard Data */}
          {inspection.dashboardData && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#E5E7EB]">
                <div className="text-sm text-[#9CA3AF] uppercase tracking-wide font-medium">Dashboard Readings</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#E5E7EB]">
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[#6B7280] mb-2">
                    <Gauge className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide font-medium">Odometer</span>
                  </div>
                  <div className="text-2xl font-bold text-[#1A1A1D]">
                    {inspection.dashboardData.odometer.toLocaleString()}
                  </div>
                  <div className="text-sm text-[#9CA3AF]">km</div>
                  {currentVehicle.lastOdometer && (
                    <div className="text-xs text-[#6B7280] mt-2 font-medium">
                      +{(inspection.dashboardData.odometer - currentVehicle.lastOdometer).toLocaleString()} km
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[#6B7280] mb-2">
                    <Droplet className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide font-medium">Fuel Level</span>
                  </div>
                  <div className="text-2xl font-bold text-[#1A1A1D]">
                    {inspection.dashboardData.fuelLevel}%
                  </div>
                  <div className="mt-2 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F97066] to-[#FDA29B]"
                      style={{ width: `${inspection.dashboardData.fuelLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Damage Report */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <div className="text-sm text-[#9CA3AF] uppercase tracking-wide mb-3 font-medium">Damage Report</div>
            
            {newDamageCount > 0 && (
              <div className="mb-3 pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#F97066]" />
                  <span className="text-sm font-semibold text-[#F97066]">
                    {newDamageCount} new item{newDamageCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {inspection.damageItems
                    .filter(d => d.isNew && d.confirmed)
                    .map((damage) => (
                      <li key={damage.id} className="flex items-start gap-2 text-sm text-[#1A1A1D]">
                        <span className="text-[#F97066]">•</span>
                        <span className="flex-1">
                          <span className="capitalize font-medium">{damage.type}</span> - {damage.location}
                          {damage.size && ` (${damage.size})`}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {existingDamageCount > 0 && (
              <div>
                <div className="text-sm font-semibold text-[#6B7280] mb-2">
                  {existingDamageCount} existing (unchanged)
                </div>
                <ul className="space-y-1.5">
                  {inspection.damageItems
                    .filter(d => !d.isNew)
                    .slice(0, 3)
                    .map((damage) => (
                      <li key={damage.id} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                        <span>•</span>
                        <span className="flex-1">
                          <span className="capitalize">{damage.type}</span> - {damage.location}
                        </span>
                      </li>
                    ))}
                </ul>
                {existingDamageCount > 3 && (
                  <div className="text-xs text-[#9CA3AF] mt-2">
                    +{existingDamageCount - 3} more
                  </div>
                )}
              </div>
            )}

            {newDamageCount === 0 && existingDamageCount === 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <Check className="w-4 h-4" />
                <span>No damage detected</span>
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-[#9CA3AF] uppercase tracking-wide font-medium">Photos</div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <ImageIcon className="w-4 h-4" />
                <span>{inspection.exteriorPhotos.length} attached</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {inspection.exteriorPhotos.map((photo) => (
                <PhotoThumbnail
                  key={photo.id}
                  imageData={photo.imageData}
                  angle={photo.angle}
                  size="sm"
                />
              ))}
              {inspection.dashboardData && (
                <PhotoThumbnail
                  imageData={inspection.dashboardData.photo}
                  angle="DASH"
                  size="sm"
                />
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <label className="text-sm text-[#9CA3AF] uppercase tracking-wide block mb-3 font-medium">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add any additional notes or observations..."
              className="w-full bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg px-4 py-3 text-[#1A1A1D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97066] focus:ring-4 focus:ring-[#F9706620] transition-all resize-none"
              rows={4}
            />
          </div>

          {/* Confirmation */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-[#D1D5DB] bg-white checked:bg-[#F97066] checked:border-[#F97066] transition-colors cursor-pointer"
            />
            <span className="flex-1 text-sm text-[#6B7280] group-hover:text-[#1A1A1D] transition-colors">
              I confirm this inspection is accurate and complete
            </span>
          </label>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <SubmitButton
            onClick={onSubmit}
            disabled={!confirmed}
            icon={<Check className="w-5 h-5" />}
          >
            Submit Inspection
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}