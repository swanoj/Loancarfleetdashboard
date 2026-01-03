import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Zap, ZapOff } from 'lucide-react';

interface PhotoCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  guideText?: string;
  showCarGuide?: boolean;
}

export function PhotoCapture({ onCapture, onClose, guideText, showCarGuide = false }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Unable to access camera. Please check your camera and try again.');
        }
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flash effect
    if (flashEnabled) {
      const flashDiv = document.createElement('div');
      flashDiv.style.position = 'fixed';
      flashDiv.style.inset = '0';
      flashDiv.style.backgroundColor = 'white';
      flashDiv.style.zIndex = '9999';
      document.body.appendChild(flashDiv);
      setTimeout(() => flashDiv.remove(), 100);
    }

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    // Haptic feedback if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    onCapture(imageData);
  };

  const switchCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video Preview */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Error Message Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
            <div className="bg-[#141416] border border-red-500 rounded-xl p-6 max-w-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Camera Access Required</h3>
                <p className="text-[#A1A1AA] text-sm mb-6">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-[#2A2A2E] text-[#FAFAFA] rounded-lg font-medium hover:bg-[#3A3A3F] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={startCamera}
                    className="flex-1 px-4 py-3 bg-[#F97066] text-white rounded-lg font-medium hover:bg-[#E85F55] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Car Guide Overlay */}
        {showCarGuide && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-[#F97066] border-dashed rounded-lg opacity-50"
                 style={{ width: '80%', height: '40%' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#F97066] text-sm bg-black/50 px-3 py-1 rounded-lg">
                  Position vehicle within frame
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Guide Text */}
        {guideText && !error && (
          <div className="absolute top-6 left-0 right-0 flex justify-center">
            <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white text-sm">{guideText}</p>
            </div>
          </div>
        )}
        
        {/* Top Controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {!error && (
            <div className="flex gap-3">
              <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                {flashEnabled ? (
                  <Zap className="w-5 h-5 text-[#F97066]" fill="currentColor" />
                ) : (
                  <ZapOff className="w-5 h-5 text-white" />
                )}
              </button>
              
              <button
                onClick={switchCamera}
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Controls */}
      {!error && (
        <div className="bg-black py-8 px-6">
          <button
            onClick={capturePhoto}
            className="w-20 h-20 mx-auto block rounded-full border-4 border-white relative"
          >
            <div className="absolute inset-2 bg-white rounded-full" />
          </button>
        </div>
      )}
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}