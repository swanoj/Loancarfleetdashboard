import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/leaflet.css';
import { Navigation, Car, Clock, MapPin, TrendingUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom active vehicle icon
const activeIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#F97066"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#F97066"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

interface TrackingData {
  loanId: string;
  carRego: string;
  customerName: string;
  startTime: string;
  lastUpdate: string;
  locations: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    accuracy?: number;
    speed?: number;
  }>;
  active: boolean;
}

interface VehicleDisplay {
  loanId: string;
  carRego: string;
  customerName: string;
  lat: number;
  lng: number;
  timestamp: string;
  accuracy: number;
  speed?: number;
  locationCount: number;
  duration: number;
}

export function LiveFleetMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [vehicles, setVehicles] = useState<VehicleDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchActiveVehicles = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-00031d07/tracking/active`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch tracking data:', response.statusText);
        setLoading(false);
        return;
      }

      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Transform tracking data to vehicle display format
        const vehicleData: VehicleDisplay[] = result.data
          .filter((item: TrackingData) => item.active && item.locations && item.locations.length > 0)
          .map((item: TrackingData) => {
            const lastLocation = item.locations[item.locations.length - 1];
            const startTime = new Date(item.startTime);
            const lastUpdate = new Date(item.lastUpdate);
            const duration = Math.floor((lastUpdate.getTime() - startTime.getTime()) / 1000);

            return {
              loanId: item.loanId,
              carRego: item.carRego,
              customerName: item.customerName,
              lat: lastLocation.lat,
              lng: lastLocation.lng,
              timestamp: lastLocation.timestamp,
              accuracy: lastLocation.accuracy || 0,
              speed: lastLocation.speed,
              locationCount: item.locations.length,
              duration: duration
            };
          });

        setVehicles(vehicleData);
      } else {
        setVehicles([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      setVehicles([]);
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m`;
    return '<1m';
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([-33.8688, 151.2093], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when vehicles change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (vehicles.length === 0) return;

    // Add new markers
    vehicles.forEach((vehicle) => {
      if (!vehicle.lat || !vehicle.lng || !mapRef.current) return;

      const marker = L.marker([vehicle.lat, vehicle.lng], { icon: activeIcon })
        .addTo(mapRef.current);

      const popupContent = `
        <div class="min-w-[240px]">
          <div class="mb-3 pb-3 border-b border-[#E5E7EB]">
            <div class="flex items-center justify-between mb-1">
              <span class="font-mono font-bold text-lg text-[#1A1A1D]">
                ${vehicle.carRego}
              </span>
              <span class="flex items-center gap-1 text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded-full">
                <span class="w-1.5 h-1.5 bg-[#10B981] rounded-full"></span>
                Live
              </span>
            </div>
            <div class="text-sm text-[#6B7280]">
              ${vehicle.customerName}
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <div class="flex-1 min-w-0">
                <div class="text-xs text-[#6B7280] mb-0.5">Location</div>
                <div class="font-mono text-xs text-[#1A1A1D] truncate">
                  ${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <div class="flex-1">
                <div class="text-xs text-[#6B7280] mb-0.5">Duration</div>
                <div class="font-mono text-xs text-[#1A1A1D]">
                  ${formatDuration(vehicle.duration)}
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <div class="flex-1">
                <div class="text-xs text-[#6B7280] mb-0.5">Updates</div>
                <div class="font-mono text-xs text-[#1A1A1D]">
                  ${vehicle.locationCount} locations
                </div>
              </div>
            </div>
            ${vehicle.accuracy ? `
              <div class="text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
                Accuracy: ±${Math.round(vehicle.accuracy)}m
              </div>
            ` : ''}
          </div>
          <div class="mt-3 pt-3 border-t border-[#E5E7EB]">
            <a
              href="https://www.google.com/maps?q=${vehicle.lat},${vehicle.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full text-center px-3 py-2 bg-[#F97066] text-white rounded-lg text-xs font-medium hover:bg-[#F97066]/90 transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'fleet-popup'
      });

      markersRef.current.push(marker);
    });

    // Center map on first vehicle
    if (vehicles.length > 0 && vehicles[0].lat && vehicles[0].lng) {
      mapRef.current.setView([vehicles[0].lat, vehicles[0].lng], 13);
    }
  }, [vehicles]);

  // Fetch data on mount
  useEffect(() => {
    fetchActiveVehicles();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchActiveVehicles();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-[#E5E7EB]/50 shadow-xl">
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Auto-refresh toggle */}
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded-xl backdrop-blur-xl shadow-lg font-medium text-sm transition-all flex items-center gap-2 ${
            autoRefresh
              ? 'bg-[#F97066]/90 text-white shadow-[#F9706640]'
              : 'bg-white/90 text-[#6B7280] hover:bg-[#F8F9FA]'
          }`}
        >
          <Navigation className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          {autoRefresh ? 'Live' : 'Paused'}
        </button>

        {/* Refresh button */}
        <button
          onClick={fetchActiveVehicles}
          className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-xl text-[#6B7280] hover:bg-[#F8F9FA] shadow-lg font-medium text-sm transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-xl rounded-xl shadow-lg p-4 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-5 h-5 text-[#F97066]" />
          <span className="font-bold text-[#1A1A1D]">Fleet Status</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Active Vehicles:</span>
            <span className="font-mono font-semibold text-[#1A1A1D]">
              {vehicles.length}
            </span>
          </div>
          {vehicles.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Total Updates:</span>
              <span className="font-mono font-semibold text-[#1A1A1D]">
                {vehicles.reduce((sum, v) => sum + v.locationCount, 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-[1001] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#F97066]/20 border-t-[#F97066] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#6B7280] font-medium">Loading live tracking...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && vehicles.length === 0 && (
        <div className="absolute inset-0 z-[1001] bg-gradient-to-br from-[#F8F9FA] to-white flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1D] mb-2">No Active Vehicles</h3>
            <p className="text-[#6B7280]">
              There are no vehicles currently being tracked. Active loan vehicles will appear here in real-time.
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
