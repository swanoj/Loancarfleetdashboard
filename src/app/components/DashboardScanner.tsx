import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Upload, Camera, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ScanResult {
  odometer: number | null;
  fuelLevel: number | null;
  confidence: 'high' | 'medium' | 'low';
  rawImage: string;
}

interface DashboardScannerProps {
  onScanComplete?: (result: ScanResult) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
}

export function DashboardScanner({ 
  onScanComplete, 
  onClose,
  title = "Scan Dashboard",
  description = "Upload a photo of the dashboard to automatically capture odometer and fuel level"
}: DashboardScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImage(dataUrl);
        setError(null);
        setScanResult(null);
        
        // Auto-scan after image is loaded
        scanDashboard(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const scanDashboard = async (imageData: string) => {
    setIsScanning(true);
    setError(null);
    
    try {
      // In production, this would call an AI vision API like OpenAI GPT-4 Vision, Google Cloud Vision, or Azure Computer Vision
      // Example API call structure (commented out):
      /*
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUR_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this car dashboard image and extract: 1) Odometer reading (in kilometers) 2) Fuel level (as percentage 0-100). Return only a JSON object with keys: odometer (number), fuelLevel (number), confidence (high/medium/low).'
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }],
          max_tokens: 300
        })
      });
      
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      */
      
      // Mock AI response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate AI analysis with realistic mock data
      const mockResult: ScanResult = {
        odometer: Math.floor(Math.random() * 50000) + 10000, // Random odometer between 10k-60k
        fuelLevel: Math.floor(Math.random() * 80) + 20, // Random fuel level 20-100%
        confidence: Math.random() > 0.3 ? 'high' : 'medium',
        rawImage: imageData
      };
      
      setScanResult(mockResult);
      
      // Call parent callback if provided
      if (onScanComplete) {
        onScanComplete(mockResult);
      }
    } catch (err) {
      setError('Failed to scan dashboard. Please try again or enter values manually.');
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleReset = () => {
    setImage(null);
    setScanResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRetake = () => {
    handleReset();
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-[#212529] mb-1">{title}</h3>
          <p className="text-sm text-[#6C757D]">{description}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#F1F3F5] transition-colors"
          >
            <X className="w-5 h-5 text-[#6C757D]" />
          </button>
        )}
      </div>
      
      {/* Upload Area */}
      {!image && (
        <div className="border-2 border-dashed border-[#DEE2E6] rounded-xl p-8 text-center bg-[#F8F9FA] hover:bg-white hover:border-[#F97066] transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="dashboard-upload"
          />
          <label
            htmlFor="dashboard-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="font-medium text-[#212529] mb-2">
              Click to upload or take a photo
            </div>
            <div className="text-sm text-[#6C757D] mb-4">
              PNG, JPG up to 10MB
            </div>
            <Button variant="secondary" size="sm" onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}>
              <Upload className="w-4 h-4" />
              Choose Image
            </Button>
          </label>
        </div>
      )}
      
      {/* Image Preview & Scanning */}
      {image && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-[#DEE2E6] bg-black">
            <img
              src={image}
              alt="Dashboard"
              className="w-full h-auto max-h-80 object-contain"
            />
            
            {isScanning && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 text-center">
                  <Loader2 className="w-8 h-8 text-[#F97066] animate-spin mx-auto mb-3" />
                  <div className="font-medium text-[#212529]">Analyzing dashboard...</div>
                  <div className="text-sm text-[#6C757D] mt-1">Extracting odometer & fuel data</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Scan Results */}
          {scanResult && (
            <div className="bg-white border border-[#DEE2E6] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-[#212529]">Scan Complete</span>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                  scanResult.confidence === 'high' ? 'bg-green-100 text-green-700' :
                  scanResult.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {scanResult.confidence.toUpperCase()} CONFIDENCE
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-lg p-4">
                  <div className="text-sm text-[#6C757D] mb-1">Odometer Reading</div>
                  <div className="text-2xl font-semibold text-[#212529]">
                    {scanResult.odometer?.toLocaleString() || 'N/A'} <span className="text-base text-[#6C757D]">km</span>
                  </div>
                </div>
                
                <div className="bg-[#F8F9FA] rounded-lg p-4">
                  <div className="text-sm text-[#6C757D] mb-1">Fuel Level</div>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-semibold text-[#212529]">
                      {scanResult.fuelLevel !== null ? scanResult.fuelLevel : 'N/A'}
                      {scanResult.fuelLevel !== null && <span className="text-base text-[#6C757D]">%</span>}
                    </div>
                    {scanResult.fuelLevel !== null && (
                      <div className="flex-1 h-2 bg-[#DEE2E6] rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-[#F97066] to-[#FDA29B] transition-all"
                          style={{ width: `${scanResult.fuelLevel}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <strong>Tip:</strong> Review the extracted values for accuracy. You can manually adjust them if needed.
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-red-900 mb-1">Scan Failed</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleRetake} className="flex-1">
              <Camera className="w-4 h-4" />
              Retake Photo
            </Button>
            {scanResult && (
              <Button onClick={() => onScanComplete?.(scanResult)} className="flex-1">
                <CheckCircle className="w-4 h-4" />
                Use These Values
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* AI Integration Note */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-bold text-sm">AI</span>
          </div>
          <div className="flex-1 text-sm">
            <div className="font-medium text-purple-900 mb-1">AI-Powered Analysis</div>
            <div className="text-purple-700">
              Currently using demo mode. Connect to OpenAI GPT-4 Vision, Google Cloud Vision, or Azure Computer Vision API for real dashboard scanning.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
