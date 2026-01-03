import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Vehicle {
  id: string;
  rego: string;
  make: string;
  model: string;
  year: number;
  color: string;
  lastInspection?: string;
  lastOdometer?: number;
  existingDamage: DamageItem[];
}

export interface DamageItem {
  id: string;
  type: 'scratch' | 'dent' | 'crack' | 'scuff' | 'chip' | 'broken';
  location: string;
  severity: 'minor' | 'moderate' | 'severe';
  size?: string;
  photo?: string;
  isNew?: boolean;
  confirmed?: boolean;
  notes?: string;
}

export interface ExteriorPhoto {
  id: string;
  angle: 'front' | 'rear' | 'left' | 'right' | 'detail';
  imageData: string;
  timestamp: Date;
}

export interface DashboardData {
  odometer: number;
  fuelLevel: number;
  photo: string;
  confidence: number;
}

export interface Inspection {
  vehicleId: string;
  type: 'pre-loan' | 'return';
  exteriorPhotos: ExteriorPhoto[];
  damageItems: DamageItem[];
  dashboardData: DashboardData | null;
  notes: string;
  timestamp: Date;
  confirmed: boolean;
}

interface InspectionContextType {
  currentVehicle: Vehicle | null;
  setCurrentVehicle: (vehicle: Vehicle | null) => void;
  inspection: Inspection | null;
  initializeInspection: (vehicleId: string, type: 'pre-loan' | 'return') => void;
  addExteriorPhoto: (photo: ExteriorPhoto) => void;
  removeExteriorPhoto: (photoId: string) => void;
  setDamageItems: (items: DamageItem[]) => void;
  updateDamageItem: (id: string, updates: Partial<DamageItem>) => void;
  setDashboardData: (data: DashboardData) => void;
  setNotes: (notes: string) => void;
  confirmInspection: () => void;
  submitInspection: () => Promise<{ success: boolean; reference: string }>;
  clearInspection: () => void;
  saveDraft: () => void;
  loadDraft: () => boolean;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

const DRAFT_KEY = 'fleetscan_draft_inspection';

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [inspection, setInspection] = useState<Inspection | null>(null);

  // Auto-save draft
  useEffect(() => {
    if (inspection && !inspection.confirmed) {
      saveDraft();
    }
  }, [inspection]);

  const initializeInspection = (vehicleId: string, type: 'pre-loan' | 'return') => {
    const newInspection: Inspection = {
      vehicleId,
      type,
      exteriorPhotos: [],
      damageItems: [],
      dashboardData: null,
      notes: '',
      timestamp: new Date(),
      confirmed: false
    };
    setInspection(newInspection);
  };

  const addExteriorPhoto = (photo: ExteriorPhoto) => {
    if (!inspection) return;
    
    // Remove existing photo with same angle
    const filtered = inspection.exteriorPhotos.filter(p => p.angle !== photo.angle);
    
    setInspection({
      ...inspection,
      exteriorPhotos: [...filtered, photo]
    });
  };

  const removeExteriorPhoto = (photoId: string) => {
    if (!inspection) return;
    
    setInspection({
      ...inspection,
      exteriorPhotos: inspection.exteriorPhotos.filter(p => p.id !== photoId)
    });
  };

  const setDamageItems = (items: DamageItem[]) => {
    if (!inspection) return;
    
    setInspection({
      ...inspection,
      damageItems: items
    });
  };

  const updateDamageItem = (id: string, updates: Partial<DamageItem>) => {
    if (!inspection) return;
    
    setInspection({
      ...inspection,
      damageItems: inspection.damageItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  const setDashboardData = (data: DashboardData) => {
    if (!inspection) return;
    
    setInspection({
      ...inspection,
      dashboardData: data
    });
  };

  const setNotes = (notes: string) => {
    if (!inspection) return;
    
    setInspection({
      ...inspection,
      notes
    });
  };

  const confirmInspection = () => {
    if (!inspection) return;
    
    setInspection({
      ...inspection,
      confirmed: true
    });
  };

  const submitInspection = async (): Promise<{ success: boolean; reference: string }> => {
    if (!inspection) {
      throw new Error('No inspection to submit');
    }

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reference = `INS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Clear draft after successful submission
    localStorage.removeItem(DRAFT_KEY);
    
    return {
      success: true,
      reference
    };
  };

  const clearInspection = () => {
    setInspection(null);
    setCurrentVehicle(null);
    localStorage.removeItem(DRAFT_KEY);
  };

  const saveDraft = () => {
    if (!inspection || !currentVehicle) return;
    
    const draft = {
      vehicle: currentVehicle,
      inspection,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const loadDraft = (): boolean => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (!draft) return false;
      
      const parsed = JSON.parse(draft);
      setCurrentVehicle(parsed.vehicle);
      setInspection(parsed.inspection);
      return true;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return false;
    }
  };

  return (
    <InspectionContext.Provider
      value={{
        currentVehicle,
        setCurrentVehicle,
        inspection,
        initializeInspection,
        addExteriorPhoto,
        removeExteriorPhoto,
        setDamageItems,
        updateDamageItem,
        setDashboardData,
        setNotes,
        confirmInspection,
        submitInspection,
        clearInspection,
        saveDraft,
        loadDraft
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspection must be used within InspectionProvider');
  }
  return context;
}
