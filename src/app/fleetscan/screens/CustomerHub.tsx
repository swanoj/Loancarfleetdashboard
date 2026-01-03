import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Car, User, Phone, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface ActiveLoan {
  loanId: string;
  carRego: string;
  carMake: string;
  carModel: string;
  customerName: string;
  customerPhone: string;
  startTime: string;
  dueBack: string;
}

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  accuracy?: number;
}

interface CustomerHubProps {
  onNewInspection?: () => void;
}

export function CustomerHub({ onNewInspection }: CustomerHubProps) {
  const [activeLoan, setActiveLoan] = useState<ActiveLoan | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');
  const [watchId, setWatchId] = useState<number | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);

  // Check for active loan on mount
  useEffect(() => {
    const storedLoan = localStorage.getItem('fleet_active_loan');
    if (storedLoan) {
      setActiveLoan(JSON.parse(storedLoan));
      startTracking(JSON.parse(storedLoan));
    }
  }, []);

  const startLoan = async () => {
    // For demo purposes, create a mock loan
    // In production, this would come from a check-out flow
    const mockLoan: ActiveLoan = {
      loanId: `LOAN-${Date.now()}`,
      carRego: 'YOT95K',
      carMake: 'VW',
      carModel: 'Passat',
      customerName: 'Demo Customer',
      customerPhone: '0400 000 000',
      startTime: new Date().toISOString(),
      dueBack: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    };

    setActiveLoan(mockLoan);
    localStorage.setItem('fleet_active_loan', JSON.stringify(mockLoan));
    startTracking(mockLoan);
  };

  const startTracking = (loan: ActiveLoan) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError('');
    setIsTracking(true);

    // Watch position with high accuracy
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

        // Send location to backend
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
      const response = await fetch(
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

      if (!response.ok) {
        console.error('Failed to send location update');
      }
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

    // Send final location update
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
    localStorage.removeItem('fleet_active_loan');
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!activeLoan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Customer Hub</h1>
            <p className="text-neutral-600 mb-8">
              Start your loan to enable GPS tracking and journey monitoring
            </p>

            <button
              onClick={startLoan}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Loan
            </button>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Location Services Required</p>
                  <p className="text-blue-700">
                    This app will track your location during the loan period for fleet management purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3 text-neutral-700">
              <User className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Customer</p>
                <p className="font-semibold">{activeLoan.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-700">
              <Phone className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Contact</p>
                <p className="font-semibold font-mono">{activeLoan.customerPhone}</p>
              </div>
            </div>

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
                <h3 className="font-bold text-neutral-900">Current Location</h3>
                <p className="text-sm text-neutral-600">Last updated: {formatTime(currentLocation.timestamp)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <p className="text-xs text-neutral-500 mb-1">Latitude</p>
                <p className="font-mono font-semibold text-neutral-900">
                  {currentLocation.lat.toFixed(6)}°
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4">
                <p className="text-xs text-neutral-500 mb-1">Longitude</p>
                <p className="font-mono font-semibold text-neutral-900">
                  {currentLocation.lng.toFixed(6)}°
                </p>
              </div>

              {currentLocation.accuracy && (
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-xs text-neutral-500 mb-1">Accuracy</p>
                  <p className="font-semibold text-neutral-900">
                    ±{Math.round(currentLocation.accuracy)}m
                  </p>
                </div>
              )}

              {currentLocation.speed !== undefined && currentLocation.speed !== null && (
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-xs text-neutral-500 mb-1">Speed</p>
                  <p className="font-semibold text-neutral-900">
                    {Math.round((currentLocation.speed || 0) * 3.6)} km/h
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">{locationHistory.length}</span> location updates sent to Fleet Command
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
            End Loan
          </button>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-500">
            Keep this app open to ensure continuous tracking. Your location is being monitored for fleet management purposes.
          </p>
        </div>
      </div>
    </div>
  );
}