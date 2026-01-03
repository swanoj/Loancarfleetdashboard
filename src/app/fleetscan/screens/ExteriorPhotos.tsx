import React, { useState } from 'react';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { PhotoCapture } from '../components/PhotoCapture';
import { PhotoThumbnail } from '../components/PhotoThumbnail';
import { StepIndicator } from '../components/StepIndicator';
import { SubmitButton } from '../components/SubmitButton';
import { useInspection } from '../context/InspectionContext';
import { ExteriorPhoto } from '../context/InspectionContext';

interface ExteriorPhotosProps {
  onBack: () => void;
  onContinue: () => void;
}

type AngleType = 'front' | 'rear' | 'left' | 'right';

export function ExteriorPhotos({ onBack, onContinue }: ExteriorPhotosProps) {
  const { inspection, addExteriorPhoto, removeExteriorPhoto } = useInspection();
  const [showCamera, setShowCamera] = useState(false);
  const [currentAngle, setCurrentAngle] = useState<AngleType>('front');

  if (!inspection) return null;

  const angles: { value: AngleType; label: string; shortLabel: string }[] = [
    { value: 'front', label: 'Front View', shortLabel: 'FRNT' },
    { value: 'rear', label: 'Rear View', shortLabel: 'REAR' },
    { value: 'left', label: 'Left Side', shortLabel: 'L' },
    { value: 'right', label: 'Right Side', shortLabel: 'R' }
  ];

  const getPhotoForAngle = (angle: AngleType) => {
    return inspection.exteriorPhotos.find(p => p.angle === angle);
  };

  const handleCaptureClick = (angle: AngleType) => {
    setCurrentAngle(angle);
    setShowCamera(true);
  };

  const handlePhotoCapture = (imageData: string) => {
    const photo: ExteriorPhoto = {
      id: `photo-${Date.now()}`,
      angle: currentAngle,
      imageData,
      timestamp: new Date()
    };
    
    addExteriorPhoto(photo);
    setShowCamera(false);
    
    // Auto-advance to next angle
    const currentIndex = angles.findIndex(a => a.value === currentAngle);
    if (currentIndex < angles.length - 1) {
      const nextAngle = angles[currentIndex + 1].value;
      const nextPhoto = getPhotoForAngle(nextAngle);
      if (!nextPhoto) {
        setTimeout(() => {
          setCurrentAngle(nextAngle);
          setShowCamera(true);
        }, 500);
      }
    }
  };

  const capturedCount = inspection.exteriorPhotos.filter(p => 
    ['front', 'rear', 'left', 'right'].includes(p.angle)
  ).length;
  const requiredCount = 4;
  const canContinue = capturedCount >= requiredCount;

  const currentAngleData = angles.find(a => a.value === currentAngle);

  return (
    <div className="min-h-screen bg-[#0C0C0D] flex flex-col">
      {/* Header */}
      <header className="bg-[#141416] border-b border-[#2A2A2E] px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-sm text-[#A1A1AA]">Step 1 of 3</span>
        </div>
        <StepIndicator currentStep={1} totalSteps={3} />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-2">
              Capture Exterior Photos
            </h2>
            <p className="text-[#A1A1AA]">
              Take 4 photos from each angle
            </p>
          </div>

          {/* Main Capture Area */}
          <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-[#FAFAFA] uppercase tracking-wide">
                {currentAngleData?.label}
              </h3>
            </div>

            <button
              onClick={() => handleCaptureClick(currentAngle)}
              className="w-full aspect-video bg-[#0C0C0D] border-2 border-dashed border-[#2A2A2E] rounded-xl flex flex-col items-center justify-center hover:border-[#F97066] hover:bg-[#1A1A1D] transition-all group"
            >
              {getPhotoForAngle(currentAngle) ? (
                <div className="relative w-full h-full">
                  <img
                    src={getPhotoForAngle(currentAngle)!.imageData}
                    alt={currentAngle}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-12 h-12 text-white mb-2" />
                      <div className="text-white font-medium">Retake</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="w-16 h-16 text-[#71717A] mb-4 group-hover:text-[#F97066] transition-colors" />
                  <div className="text-lg font-medium text-[#A1A1AA] group-hover:text-[#FAFAFA] transition-colors">
                    Tap to capture
                  </div>
                  <div className="text-sm text-[#71717A] mt-1">
                    {currentAngleData?.label}
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Angle Selector Grid */}
          <div className="grid grid-cols-4 gap-3">
            {angles.map((angle) => {
              const photo = getPhotoForAngle(angle.value);
              const isSelected = currentAngle === angle.value;
              
              return (
                <button
                  key={angle.value}
                  onClick={() => setCurrentAngle(angle.value)}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    photo
                      ? 'border-[#10B981] bg-[#10B98120]'
                      : isSelected
                      ? 'border-[#F97066] bg-[#F9706620]'
                      : 'border-[#2A2A2E] bg-[#141416] hover:border-[#3A3A3F]'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-1">
                    {photo ? (
                      <>
                        <Check className="w-5 h-5 text-[#10B981]" />
                        <span className="text-xs text-[#10B981] font-medium">
                          {angle.shortLabel}
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera className={`w-5 h-5 ${isSelected ? 'text-[#F97066]' : 'text-[#71717A]'}`} />
                        <span className={`text-xs font-medium ${isSelected ? 'text-[#F97066]' : 'text-[#71717A]'}`}>
                          {angle.shortLabel}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Photo Thumbnails */}
          {inspection.exteriorPhotos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#A1A1AA] mb-3">
                Captured Photos ({capturedCount}/{requiredCount})
              </h3>
              <div className="flex flex-wrap gap-3">
                {inspection.exteriorPhotos.map((photo) => (
                  <PhotoThumbnail
                    key={photo.id}
                    imageData={photo.imageData}
                    angle={photo.angle}
                    onRemove={() => removeExteriorPhoto(photo.id)}
                    onClick={() => {
                      setCurrentAngle(photo.angle as AngleType);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
            <div className="text-sm text-[#94A3B8] leading-relaxed">
              <strong className="text-[#E2E8F0]">Tips:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Include the full vehicle in frame</li>
                <li>Ensure good lighting</li>
                <li>Take photos from a slight angle for better visibility</li>
                <li>Capture any existing damage clearly</li>
              </ul>
            </div>
          </div>

          {/* Continue Button */}
          <SubmitButton
            onClick={onContinue}
            disabled={!canContinue}
          >
            Continue ({capturedCount}/{requiredCount} done)
          </SubmitButton>
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
          guideText={`Capture ${currentAngleData?.label}`}
          showCarGuide={true}
        />
      )}
    </div>
  );
}
