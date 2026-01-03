import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, Car, User, RefreshCw, AlertCircle, Activity, Maximize2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  accuracy?: number;
}

interface TrackingData {
  loanId: string;
  carRego: string;
  customerName: string;
  startTime: string;
  lastUpdate: string;
  locations: LocationData[];
  active: boolean;
  endTime?: string;
}

export function LiveTracking() {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch active tracking data
  const fetchTrackingData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-00031d07/tracking/active`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }

      const result = await response.json();
      setTrackingData(result.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching tracking data:', err);
      setError('Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTrackingData();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    const duration = end - start;

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calculateDistance = (locations: LocationData[]) => {
    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const lat1 = locations[i - 1].lat;
      const lon1 = locations[i - 1].lng;
      const lat2 = locations[i].lat;
      const lon2 = locations[i].lng;

      // Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }

    return totalDistance;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Live Vehicle Tracking</h1>
              <p className="text-sm text-neutral-600 mt-1">
                Real-time GPS monitoring of active loan vehicles
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  autoRefresh
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-semibold">
                  {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                </span>
              </button>

              <button
                onClick={fetchTrackingData}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-semibold">Refresh Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-neutral-900">
                  {trackingData.length}
                </p>
                <p className="text-sm text-neutral-600">Active Vehicles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-neutral-900">
                  {trackingData.reduce((sum, t) => sum + t.locations.length, 0)}
                </p>
                <p className="text-sm text-neutral-600">Location Updates</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-neutral-900">
                  {trackingData.length > 0 ? formatTime(trackingData[0].lastUpdate) : '--:--'}
                </p>
                <p className="text-sm text-neutral-600">Last Update</p>
              </div>
            </div>
          </div>
        </div>

        {/* No Active Tracking */}
        {trackingData.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">No Active Tracking</h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              There are no vehicles currently being tracked. Customers need to start a loan in the
              Fleet Scan Customer Hub to enable GPS tracking.
            </p>
          </div>
        )}

        {/* Tracking List */}
        {trackingData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trackingData.map((tracking) => {
              const lastLocation = tracking.locations[tracking.locations.length - 1];
              const distance = calculateDistance(tracking.locations);
              const duration = formatDuration(tracking.startTime);

              return (
                <div
                  key={tracking.loanId}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        <span className="text-2xl font-bold font-mono">{tracking.carRego}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold">Live</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/90">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">{tracking.customerName}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Current Location */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <h4 className="font-semibold text-neutral-900">Current Location</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500 mb-1">Latitude</p>
                          <p className="font-mono text-sm font-semibold text-neutral-900">
                            {lastLocation.lat.toFixed(6)}°
                          </p>
                        </div>

                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500 mb-1">Longitude</p>
                          <p className="font-mono text-sm font-semibold text-neutral-900">
                            {lastLocation.lng.toFixed(6)}°
                          </p>
                        </div>
                      </div>

                      {lastLocation.accuracy && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
                          <MapPin className="w-3 h-3" />
                          <span>Accuracy: ±{Math.round(lastLocation.accuracy)}m</span>
                        </div>
                      )}

                      {/* Open in Maps */}
                      <a
                        href={`https://www.google.com/maps?q=${lastLocation.lat},${lastLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full bg-neutral-900 text-white py-2 px-4 rounded-lg hover:bg-neutral-800 transition-colors text-sm font-semibold"
                      >
                        <Maximize2 className="w-4 h-4" />
                        Open in Google Maps
                      </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Duration</p>
                        <p className="font-semibold text-neutral-900">{duration}</p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Distance</p>
                        <p className="font-semibold text-neutral-900">{distance.toFixed(1)} km</p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Updates</p>
                        <p className="font-semibold text-neutral-900 font-mono">
                          {tracking.locations.length}
                        </p>
                      </div>
                    </div>

                    {/* Last Update Time */}
                    <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center gap-2 text-xs text-neutral-600">
                      <Clock className="w-3 h-3" />
                      <span>Last update: {formatTime(tracking.lastUpdate)}</span>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedLoan(tracking)}
                      className="mt-4 w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-semibold"
                    >
                      View Journey History ({tracking.locations.length} points)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Journey History Modal */}
        {selectedLoan && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLoan(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">Journey History</h3>
                <p className="text-sm opacity-90 font-mono">{selectedLoan.loanId}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Car className="w-4 h-4" />
                  <span className="font-bold font-mono">{selectedLoan.carRego}</span>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4" />
                  <span>{selectedLoan.customerName}</span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-96">
                <div className="space-y-3">
                  {selectedLoan.locations
                    .slice()
                    .reverse()
                    .map((location, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-semibold text-neutral-900">
                              {formatTime(location.timestamp)}
                            </p>
                            {index === 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                Current
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-neutral-500">Lat: </span>
                              <span className="font-mono font-semibold text-neutral-900">
                                {location.lat.toFixed(6)}°
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Lng: </span>
                              <span className="font-mono font-semibold text-neutral-900">
                                {location.lng.toFixed(6)}°
                              </span>
                            </div>
                          </div>

                          {location.accuracy && (
                            <p className="text-xs text-neutral-500 mt-1">
                              Accuracy: ±{Math.round(location.accuracy)}m
                            </p>
                          )}
                        </div>

                        <a
                          href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                        >
                          <Maximize2 className="w-3 h-3" />
                          Map
                        </a>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-6 bg-neutral-50 border-t border-neutral-200">
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="w-full bg-neutral-900 text-white py-3 px-6 rounded-lg hover:bg-neutral-800 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}