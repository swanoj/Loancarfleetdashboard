import { DamageItem } from '../context/InspectionContext';

// Mock vehicle database
const mockVehicles = [
  {
    id: '1',
    rego: 'ABC-123',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'White',
    lastInspection: '2025-01-02T10:30:00',
    lastOdometer: 47654,
    existingDamage: [
      {
        id: 'dmg-1',
        type: 'chip' as const,
        location: 'Bonnet',
        severity: 'minor' as const,
        size: 'Multiple small chips',
        isNew: false
      },
      {
        id: 'dmg-2',
        type: 'scuff' as const,
        location: 'Rear bumper',
        severity: 'minor' as const,
        size: '~10cm',
        isNew: false
      },
      {
        id: 'dmg-3',
        type: 'scratch' as const,
        location: 'Driver door',
        severity: 'minor' as const,
        size: '~8cm length',
        isNew: false
      }
    ]
  },
  {
    id: '2',
    rego: 'XYZ-789',
    make: 'Mazda',
    model: 'CX-5',
    year: 2023,
    color: 'Grey',
    lastInspection: '2025-01-03T14:20:00',
    lastOdometer: 23450,
    existingDamage: []
  },
  {
    id: '3',
    rego: 'DEF-456',
    make: 'Honda',
    model: 'Accord',
    year: 2021,
    color: 'Black',
    lastInspection: '2024-12-30T09:15:00',
    lastOdometer: 61234,
    existingDamage: [
      {
        id: 'dmg-4',
        type: 'dent' as const,
        location: 'Passenger door',
        severity: 'moderate' as const,
        size: '~3cm diameter',
        isNew: false
      }
    ]
  }
];

export async function lookupVehicle(rego: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedRego = rego.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const vehicle = mockVehicles.find(v => 
    v.rego.replace(/[^A-Z0-9]/gi, '').toUpperCase() === normalizedRego
  );
  
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  
  return vehicle;
}

export async function analyzeDamage(photos: string[], vehicleId: string) {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock damage detection - simulate finding new damage
  const mockNewDamage: DamageItem[] = [
    {
      id: `new-${Date.now()}-1`,
      type: 'scratch',
      location: 'Left rear quarter',
      severity: 'minor',
      size: '~15cm length',
      photo: photos[2] || photos[0], // Use left side photo if available
      isNew: true,
      confirmed: false
    },
    {
      id: `new-${Date.now()}-2`,
      type: 'dent',
      location: 'Front bumper',
      severity: 'minor',
      size: '~5cm diameter',
      photo: photos[0], // Use front photo
      isNew: true,
      confirmed: false
    }
  ];
  
  // Get existing damage for this vehicle
  const vehicle = mockVehicles.find(v => v.id === vehicleId);
  const existingDamage = vehicle?.existingDamage || [];
  
  return {
    newDamage: mockNewDamage,
    existingDamage,
    confidence: 0.85
  };
}

export async function extractDashboardData(photo: string) {
  // Simulate AI OCR processing
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Mock extracted data
  const mockOdometer = Math.floor(Math.random() * 50000) + 30000;
  const mockFuelLevel = Math.floor(Math.random() * 60) + 40; // 40-100%
  
  return {
    odometer: mockOdometer,
    fuelLevel: mockFuelLevel,
    confidence: 0.92
  };
}

export async function scanRegoPlate(photo: string) {
  // Simulate OCR on rego plate
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock OCR result - randomly return one of the mock regos
  const regos = mockVehicles.map(v => v.rego);
  const randomRego = regos[Math.floor(Math.random() * regos.length)];
  
  return {
    rego: randomRego,
    confidence: 0.88
  };
}

// Store for recent vehicles (in real app, this would be in localStorage or backend)
let recentVehicles: string[] = [];

export function addRecentVehicle(vehicleId: string) {
  recentVehicles = [vehicleId, ...recentVehicles.filter(id => id !== vehicleId)].slice(0, 3);
}

export function getRecentVehicles() {
  return mockVehicles.filter(v => recentVehicles.includes(v.id));
}
