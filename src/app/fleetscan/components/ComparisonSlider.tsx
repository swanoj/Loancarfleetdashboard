import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  onClose: () => void;
  title?: string;
}

export function ComparisonSlider({ beforeImage, afterImage, onClose, title }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {title || 'Damage Comparison'}
            </h3>
            <p className="text-sm text-[#A1A1AA]">
              Slide to compare before and after
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Comparison Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-[#0C0C0D] rounded-xl overflow-hidden cursor-ew-resize select-none"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {/* After Image (Full) */}
          <div className="absolute inset-0">
            <img
              src={afterImage}
              alt="After"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 right-4 px-3 py-1 bg-[#F97066] text-white rounded-lg text-sm font-medium">
              Current
            </div>
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-[#71717A] text-white rounded-lg text-sm font-medium">
              Previous
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="flex gap-1">
                <div className="w-0.5 h-6 bg-[#0C0C0D] rounded-full" />
                <div className="w-0.5 h-6 bg-[#0C0C0D] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center justify-between mt-4 text-sm text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#71717A] rounded" />
            <span>Previous Inspection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#F97066] rounded" />
            <span>Current Inspection</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-[#141416] border border-[#2A2A2E] rounded-lg p-4 text-center">
          <p className="text-sm text-[#A1A1AA]">
            <strong className="text-[#FAFAFA]">Tip:</strong> Drag the slider or tap anywhere on the image to compare before and after
          </p>
        </div>
      </div>
    </div>
  );
}
