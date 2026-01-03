import React, { useState, useEffect } from 'react';
import { Navigation, Clock, Car, User, Phone, AlertCircle, Upload, Camera, CheckCircle, FileText } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  accuracy?: number;
}

interface LoanAcceptance {
  accepted: boolean;
  licenceFrontUrl?: string;
  licenceBackUrl?: string;
  selfieUrl?: string;
  signatureUrl?: string;
  timestamp?: string;
}

interface ActiveLoan {
  loanId: string;
  carRego: string;
  carMake: string;
  carModel: string;
  customerName: string;
  customerPhone: string;
  startTime: string;
  dueBack: string;
  workshopName: string;
  workshopPhone: string;
  workshopAddress: string;
}

export function CustomerHubStandalone() {
  const [step, setStep] = useState<'landing' | 'accept' | 'tracking'>('landing');
  const [activeLoan, setActiveLoan] = useState<ActiveLoan | null>(null);
  const [acceptance, setAcceptance] = useState<LoanAcceptance>({ accepted: false });
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');
  const [watchId, setWatchId] = useState<number | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);

  // Check for existing loan on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loanId = urlParams.get('loan');
    
    if (loanId) {
      // Load loan details (in production, fetch from server)
      loadLoanDetails(loanId);
    }

    // Check for existing active loan
    const storedLoan = localStorage.getItem('fleet_active_loan');
    const storedAcceptance = localStorage.getItem('fleet_loan_acceptance');
    
    if (storedLoan) {
      setActiveLoan(JSON.parse(storedLoan));
      if (storedAcceptance) {
        setAcceptance(JSON.parse(storedAcceptance));
        setStep('tracking');
        startTracking(JSON.parse(storedLoan));
      }
    }
  }, []);

  const loadLoanDetails = (loanId: string) => {
    // Mock loan data - in production, fetch from server
    const mockLoan: ActiveLoan = {
      loanId,
      carRego: 'YOT95K',
      carMake: 'VW',
      carModel: 'Passat',
      customerName: 'Valued Customer',
      customerPhone: '0400 000 000',
      startTime: new Date().toISOString(),
      dueBack: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      workshopName: 'Premium Auto Service',
      workshopPhone: '(02) 9555 1234',
      workshopAddress: '123 Workshop St, Sydney NSW 2000',
    };

    setActiveLoan(mockLoan);
    localStorage.setItem('fleet_active_loan', JSON.stringify(mockLoan));
  };

  const handleFileUpload = (type: 'licenceFront' | 'licenceBack' | 'selfie', file: File) => {
    // In production, upload to server/storage
    const reader = new FileReader();
    reader.onload = (e) => {
      setAcceptance(prev => ({
        ...prev,
        [`${type}Url`]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAcceptLoan = () => {
    const acceptanceData: LoanAcceptance = {
      ...acceptance,
      accepted: true,
      timestamp: new Date().toISOString(),
    };
    
    setAcceptance(acceptanceData);
    localStorage.setItem('fleet_loan_acceptance', JSON.stringify(acceptanceData));
    
    setStep('tracking');
    if (activeLoan) {
      startTracking(activeLoan);
    }
  };

  const startTracking = (loan: ActiveLoan) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError('');
    setIsTracking(true);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          speed: position.coords.speed || undefined,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(locationData);
        setLocationHistory((prev) => [...prev, locationData]);
        sendLocationUpdate(loan.loanId, locationData);
      },
      (err) => {
        setError(`Location error: ${err.message}`);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const sendLocationUpdate = async (loanId: string, location: LocationData) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-00031d07/tracking/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            loanId,
            location,
            carRego: activeLoan?.carRego,
            customerName: activeLoan?.customerName,
          }),
        }
      );
    } catch (err) {
      console.error('Error sending location:', err);
    }
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const endLoan = async () => {
    stopTracking();

    if (activeLoan && currentLocation) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-00031d07/tracking/end`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            loanId: activeLoan.loanId,
          }),
        }
      );
    }

    setActiveLoan(null);
    setCurrentLocation(null);
    setLocationHistory([]);
    setAcceptance({ accepted: false });
    localStorage.removeItem('fleet_active_loan');
    localStorage.removeItem('fleet_loan_acceptance');
    setStep('landing');
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Landing Page
  if (step === 'landing' && !activeLoan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Fleet Command</h1>
              <p className="text-blue-100">Loan Car Service</p>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <AlertCircle className="w-4 h-4" />
                  Loan Vehicle Ready
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Your Loan Car is Ready!
                </h2>
                <p className="text-neutral-600">
                  Please review the loan terms and upload your documents to get started.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!activeLoan) {
                    // Generate demo loan ID from URL or create new
                    const urlParams = new URLSearchParams(window.location.search);
                    const loanId = urlParams.get('loan') || `LOAN-${Date.now()}`;
                    loadLoanDetails(loanId);
                  }
                  setStep('accept');
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-4"
              >
                View Loan Details
              </button>

              <p className="text-xs text-neutral-500">
                By continuing, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Acceptance & Document Upload
  if (step === 'accept' && activeLoan && !acceptance.accepted) {
    const allDocsUploaded = acceptance.licenceFrontUrl && acceptance.licenceBackUrl && acceptance.selfieUrl;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 pb-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Loan Agreement</h1>
          <p className="text-sm text-neutral-600">Please review and accept to continue</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {/* Vehicle Details */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Car className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Your Loan Vehicle</p>
                  <p className="text-2xl font-bold font-mono">{activeLoan.carRego}</p>
                </div>
              </div>
              <p className="text-lg font-semibold">
                {activeLoan.carMake} {activeLoan.carModel}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Loan Start</p>
                  <p className="font-semibold text-neutral-900">{formatDate(activeLoan.startTime)}</p>
                  <p className="text-sm text-neutral-700">{formatTime(activeLoan.startTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Due Back</p>
                  <p className="font-semibold text-neutral-900">{formatDate(activeLoan.dueBack)}</p>
                  <p className="text-sm text-neutral-700">{formatTime(activeLoan.dueBack)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 mb-2">Workshop Contact</p>
                <p className="font-semibold text-neutral-900">{activeLoan.workshopName}</p>
                <p className="text-sm text-neutral-700">{activeLoan.workshopPhone}</p>
                <p className="text-sm text-neutral-600">{activeLoan.workshopAddress}</p>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Required Documents
            </h3>

            <div className="space-y-3">
              {/* Licence Front */}
              <div className="border-2 border-dashed border-neutral-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    {acceptance.licenceFrontUrl ? (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900">Driver's Licence (Front)</p>
                      <p className="text-xs text-neutral-600">
                        {acceptance.licenceFrontUrl ? 'Uploaded ✓' : 'Tap to upload'}
                      </p>
                    </div>
                  </div>
                  <Camera className="w-5 h-5 text-neutral-400" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('licenceFront', file);
                    }}
                  />
                </label>
              </div>

              {/* Licence Back */}
              <div className="border-2 border-dashed border-neutral-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    {acceptance.licenceBackUrl ? (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900">Driver's Licence (Back)</p>
                      <p className="text-xs text-neutral-600">
                        {acceptance.licenceBackUrl ? 'Uploaded ✓' : 'Tap to upload'}
                      </p>
                    </div>
                  </div>
                  <Camera className="w-5 h-5 text-neutral-400" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('licenceBack', file);
                    }}
                  />
                </label>
              </div>

              {/* Selfie */}
              <div className="border-2 border-dashed border-neutral-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    {acceptance.selfieUrl ? (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900">Verification Photo</p>
                      <p className="text-xs text-neutral-600">
                        {acceptance.selfieUrl ? 'Uploaded ✓' : 'Selfie with licence'}
                      </p>
                    </div>
                  </div>
                  <Camera className="w-5 h-5 text-neutral-400" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('selfie', file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Terms & Accept */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-neutral-900 mb-3">Terms & Conditions</h3>
            <div className="bg-neutral-50 rounded-xl p-4 max-h-40 overflow-y-auto text-sm text-neutral-700 mb-4">
              <ul className="space-y-2">
                <li>• GPS tracking will be active during your loan period</li>
                <li>• Return vehicle with same fuel level</li>
                <li>• Report any damage immediately</li>
                <li>• Maximum speed limit: 110 km/h</li>
                <li>• You are responsible for any fines or tolls</li>
                <li>• Return vehicle by due date/time</li>
              </ul>
            </div>

            <button
              onClick={handleAcceptLoan}
              disabled={!allDocsUploaded}
              className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg transition-all ${
                allDocsUploaded
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {allDocsUploaded ? 'Accept & Start Tracking' : 'Upload All Documents to Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tracking Screen
  if (step === 'tracking' && activeLoan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Active Loan</h1>
                <p className="text-sm text-neutral-600 font-mono">{activeLoan.loanId}</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isTracking ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'}`} />
                <span className="text-xs font-semibold">
                  {isTracking ? 'Tracking Active' : 'Tracking Paused'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Location Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Vehicle Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Your Loan Vehicle</p>
                  <p className="text-2xl font-bold font-mono">{activeLoan.carRego}</p>
                </div>
              </div>
              <p className="text-lg font-semibold">
                {activeLoan.carMake} {activeLoan.carModel}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-3 text-neutral-700">
                  <Clock className="w-5 h-5 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Started</p>
                    <p className="font-semibold">{formatTime(activeLoan.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-700">
                  <Clock className="w-5 h-5 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Due Back</p>
                    <p className="font-semibold">{formatTime(activeLoan.dueBack)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 mb-2">Workshop Contact</p>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <a href={`tel:${activeLoan.workshopPhone}`} className="font-semibold text-blue-600">
                    {activeLoan.workshopPhone}
                  </a>
                </div>
                <p className="text-sm text-neutral-600">{activeLoan.workshopAddress}</p>
              </div>
            </div>
          </div>

          {/* Current Location Card */}
          {currentLocation && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">GPS Active</h3>
                  <p className="text-sm text-neutral-600">Last updated: {formatTime(currentLocation.timestamp)}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">{locationHistory.length}</span> location updates sent • 
                  Accuracy: ±{currentLocation.accuracy ? Math.round(currentLocation.accuracy) : '--'}m
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {!isTracking ? (
              <button
                onClick={() => startTracking(activeLoan)}
                className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
              >
                Resume Tracking
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="w-full bg-yellow-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-yellow-600 transition-colors"
              >
                Pause Tracking
              </button>
            )}

            <button
              onClick={endLoan}
              className="w-full bg-neutral-200 text-neutral-700 py-4 px-6 rounded-xl font-semibold hover:bg-neutral-300 transition-colors"
            >
              Return Vehicle & End Loan
            </button>
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-500">
              Keep this page open to ensure continuous tracking. Your location is monitored for fleet management and your safety.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
