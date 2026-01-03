export interface Car {
  id: string;
  rego: string;
  make: string;
  model: string;
  year: number;
  color: string;
  colorHex: string;
  bay: string;
  status: 'available' | 'out' | 'hold' | 'service' | 'cleaning';
  regoExpiry: string;
  doNotRenew?: boolean;
  vin?: string;
  odometer?: number;
  fuelType?: string;
  transmission?: string;
}

export interface Insurance {
  id: string;
  carId: string;
  provider: string;
  policyNumber: string;
  expiryDate: string;
  coverageType: string;
  premium: number;
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  carId: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection' | 'other';
  description: string;
  odometer?: number;
  cost?: number;
  provider?: string;
  nextDue?: string;
}

export interface CarNote {
  id: string;
  carId: string;
  createdAt: string;
  createdBy: string;
  content: string;
  type: 'general' | 'damage' | 'maintenance' | 'customer';
}

export interface ActivityLog {
  id: string;
  carId: string;
  timestamp: string;
  action: 'checked-out' | 'checked-in' | 'cleaned' | 'serviced' | 'hold' | 'released' | 'status-change';
  description: string;
  user: string;
  metadata?: Record<string, any>;
}

export const mockCars: Car[] = [
  { id: '1', rego: 'ABC-123', make: 'Toyota', model: 'Camry', year: 2022, color: 'White', colorHex: '#FFFFFF', bay: 'Bay 7', status: 'available', regoExpiry: '2025-03-15' },
  { id: '2', rego: 'DEF-456', make: 'Toyota', model: 'Hilux', year: 2023, color: 'Silver', colorHex: '#C0C0C0', bay: 'Bay 3', status: 'out', regoExpiry: '2025-04-22' },
  { id: '3', rego: 'GHI-789', make: 'Toyota', model: 'RAV4', year: 2021, color: 'Blue', colorHex: '#4169E1', bay: 'Bay 2', status: 'hold', regoExpiry: '2025-01-08' },
  { id: '4', rego: 'JKL-012', make: 'Toyota', model: 'Corolla', year: 2022, color: 'Red', colorHex: '#DC143C', bay: 'Bay 1', status: 'available', regoExpiry: '2025-06-30' },
  { id: '5', rego: 'MNO-345', make: 'Toyota', model: 'Kluger', year: 2023, color: 'Black', colorHex: '#000000', bay: 'Bay 5', status: 'available', regoExpiry: '2025-05-12' },
  { id: '6', rego: 'PQR-678', make: 'Toyota', model: 'Camry', year: 2022, color: 'Grey', colorHex: '#808080', bay: 'Bay 4', status: 'cleaning', regoExpiry: '2025-07-18' },
  { id: '7', rego: 'STU-901', make: 'Toyota', model: 'Hilux', year: 2023, color: 'White', colorHex: '#FFFFFF', bay: 'Bay 8', status: 'available', regoExpiry: '2025-08-25' },
  { id: '8', rego: 'VWX-234', make: 'Toyota', model: 'RAV4', year: 2021, color: 'Silver', colorHex: '#C0C0C0', bay: 'Bay 6', status: 'available', regoExpiry: '2025-02-14' },
  { id: '9', rego: 'YZA-567', make: 'Toyota', model: 'Corolla', year: 2022, color: 'Blue', colorHex: '#4169E1', bay: 'Bay 9', status: 'out', regoExpiry: '2025-09-03' },
  { id: '10', rego: 'BCD-890', make: 'Toyota', model: 'Kluger', year: 2023, color: 'Red', colorHex: '#DC143C', bay: 'Bay 10', status: 'available', regoExpiry: '2025-10-11' },
  { id: '11', rego: 'EFG-123', make: 'Toyota', model: 'Camry', year: 2022, color: 'Black', colorHex: '#000000', bay: 'Bay 11', status: 'available', regoExpiry: '2025-11-20' },
  { id: '12', rego: 'HIJ-456', make: 'Toyota', model: 'Hilux', year: 2023, color: 'Grey', colorHex: '#808080', bay: 'Bay 12', status: 'available', regoExpiry: '2025-12-05' },
  { id: '13', rego: 'KLM-789', make: 'Toyota', model: 'RAV4', year: 2021, color: 'White', colorHex: '#FFFFFF', bay: 'Bay 13', status: 'cleaning', regoExpiry: '2026-01-15' },
  { id: '14', rego: 'NOP-012', make: 'Toyota', model: 'Corolla', year: 2022, color: 'Silver', colorHex: '#C0C0C0', bay: 'Bay 14', status: 'available', regoExpiry: '2025-03-28' },
  { id: '15', rego: 'QRS-345', make: 'Toyota', model: 'Kluger', year: 2023, color: 'Blue', colorHex: '#4169E1', bay: 'Bay 15', status: 'out', regoExpiry: '2025-04-17' },
  { id: '16', rego: 'TUV-678', make: 'Toyota', model: 'Camry', year: 2022, color: 'Red', colorHex: '#DC143C', bay: 'Bay 16', status: 'available', regoExpiry: '2025-05-22' },
  { id: '17', rego: 'WXY-901', make: 'Toyota', model: 'Hilux', year: 2023, color: 'Black', colorHex: '#000000', bay: 'Bay 17', status: 'available', regoExpiry: '2025-06-09' },
  { id: '18', rego: 'ZAB-234', make: 'Toyota', model: 'RAV4', year: 2021, color: 'Grey', colorHex: '#808080', bay: 'Bay 18', status: 'available', regoExpiry: '2025-07-13' },
  { id: '19', rego: 'CDE-567', make: 'Toyota', model: 'Corolla', year: 2022, color: 'White', colorHex: '#FFFFFF', bay: 'Bay 19', status: 'out', regoExpiry: '2025-08-01' },
  { id: '20', rego: 'FGH-890', make: 'Toyota', model: 'Kluger', year: 2023, color: 'Silver', colorHex: '#C0C0C0', bay: 'Bay 20', status: 'available', regoExpiry: '2025-09-19' },
  { id: '21', rego: 'IJK-123', make: 'Toyota', model: 'Camry', year: 2022, color: 'Blue', colorHex: '#4169E1', bay: 'Bay 21', status: 'available', regoExpiry: '2025-10-27' },
  { id: '22', rego: 'LMN-456', make: 'Toyota', model: 'Hilux', year: 2023, color: 'Red', colorHex: '#DC143C', bay: 'Bay 22', status: 'available', regoExpiry: '2025-11-14' },
  { id: '23', rego: 'OPQ-789', make: 'Toyota', model: 'RAV4', year: 2021, color: 'Black', colorHex: '#000000', bay: 'Bay 23', status: 'available', regoExpiry: '2025-12-23' },
  { id: '24', rego: 'RST-012', make: 'Toyota', model: 'Corolla', year: 2022, color: 'Grey', colorHex: '#808080', bay: 'Bay 24', status: 'cleaning', regoExpiry: '2026-01-30' },
  { id: '25', rego: 'UVW-345', make: 'Toyota', model: 'Kluger', year: 2023, color: 'White', colorHex: '#FFFFFF', bay: 'Bay 25', status: 'out', regoExpiry: '2025-02-08' },
  { id: '26', rego: 'XYZ-678', make: 'Toyota', model: 'Kluger', year: 2023, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'hold', regoExpiry: '2025-04-16' },
  { id: '27', rego: 'LMN-345', make: 'Toyota', model: 'Corolla', year: 2022, color: 'Blue', colorHex: '#4169E1', bay: '', status: 'hold', regoExpiry: '2025-05-21' },
];

export const mockLoans: Loan[] = [
  { id: '1', carId: '2', customer: 'John Smith', checkedOut: '2025-01-04T09:00:00', dueBack: '2025-01-04T14:30:00' },
  { id: '2', carId: '9', customer: 'Jane Doe', checkedOut: '2025-01-04T10:00:00', dueBack: '2025-01-04T16:00:00' },
  { id: '3', carId: '15', customer: 'Bob Wilson', checkedOut: '2025-01-04T07:00:00', dueBack: '2025-01-04T11:00:00' },
  { id: '4', carId: '19', customer: 'Alice Johnson', checkedOut: '2025-01-03T14:00:00', dueBack: '2025-01-04T10:00:00' },
  { id: '5', carId: '25', customer: 'David Brown', checkedOut: '2025-01-03T09:00:00', dueBack: '2025-01-03T17:00:00' },
];

export const mockCleaningJobs: CleaningJob[] = [
  { id: '1', carId: '6', type: 'full', priority: 'urgent', status: 'pending' },
  { id: '2', carId: '13', type: 'quick', priority: 'normal', status: 'pending' },
  { id: '3', carId: '24', type: 'interior', priority: 'normal', status: 'pending' },
];

export const mockHoldItems: HoldItem[] = [
  { id: '1', carId: '26', reason: 'Damage inspection', since: '2025-01-02', notes: 'Minor scratch on rear bumper' },
  { id: '2', carId: '27', reason: 'Service due', since: '2025-01-01', notes: '100k service overdue' },
];

export const mockInsurance: Insurance[] = [
  { id: 'ins-1', carId: '1', provider: 'NRMA Insurance', policyNumber: 'POL-ABC-123-2025', expiryDate: '2025-12-31', coverageType: 'Comprehensive', premium: 1850, notes: 'Annual premium paid' },
  { id: 'ins-2', carId: '2', provider: 'RACV Insurance', policyNumber: 'POL-DEF-456-2025', expiryDate: '2025-11-15', coverageType: 'Comprehensive', premium: 2100, notes: 'Commercial use endorsement' },
  { id: 'ins-3', carId: '3', provider: 'NRMA Insurance', policyNumber: 'POL-GHI-789-2025', expiryDate: '2025-10-22', coverageType: 'Comprehensive', premium: 1920, notes: '' },
];

export const mockServiceRecords: ServiceRecord[] = [
  { id: 'srv-1', carId: '1', date: '2024-12-15', type: 'routine', description: '10,000km service - oil change, filter replacement', odometer: 10234, cost: 385, provider: 'Toyota Service Centre', nextDue: '2025-06-15' },
  { id: 'srv-2', carId: '1', date: '2024-09-20', type: 'repair', description: 'Front brake pad replacement', odometer: 8450, cost: 520, provider: 'Toyota Service Centre' },
  { id: 'srv-3', carId: '1', date: '2024-06-10', type: 'routine', description: '5,000km service', odometer: 5120, cost: 295, provider: 'Toyota Service Centre', nextDue: '2024-12-10' },
  { id: 'srv-4', carId: '2', date: '2024-12-28', type: 'routine', description: '15,000km service - full inspection', odometer: 15670, cost: 445, provider: 'Toyota Service Centre', nextDue: '2025-06-28' },
  { id: 'srv-5', carId: '2', date: '2024-11-05', type: 'repair', description: 'Rear taillight replacement', odometer: 14200, cost: 180, provider: 'Toyota Service Centre' },
];

export const mockCarNotes: CarNote[] = [
  { id: 'note-1', carId: '1', createdAt: '2025-01-03T14:30:00', createdBy: 'Oliver', content: 'Customer reported slight vibration at highway speeds. Checked tire balance - all good.', type: 'general' },
  { id: 'note-2', carId: '1', createdAt: '2024-12-20T10:15:00', createdBy: 'Sarah', content: 'Minor scuff on front bumper noted during cleaning. Not reportable damage.', type: 'damage' },
  { id: 'note-3', carId: '2', createdAt: '2025-01-02T09:00:00', createdBy: 'Mike', content: 'Customer John Smith is a regular - prefers this vehicle. Always returns on time.', type: 'customer' },
  { id: 'note-4', carId: '2', createdAt: '2024-12-15T16:45:00', createdBy: 'Oliver', content: 'Next service due in 6 months. Check transmission fluid levels.', type: 'maintenance' },
  { id: 'note-5', carId: '3', createdAt: '2025-01-02T11:20:00', createdBy: 'Sarah', content: 'Holding for damage assessment - small scratch on rear bumper from parking incident.', type: 'damage' },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: 'log-1', carId: '1', timestamp: '2025-01-03T09:00:00', action: 'checked-out', description: 'Checked out to Sarah Wilson', user: 'Oliver', metadata: { customer: 'Sarah Wilson', dueBack: '2025-01-03T17:00:00' } },
  { id: 'log-2', carId: '1', timestamp: '2025-01-03T16:45:00', action: 'checked-in', description: 'Returned from loan', user: 'Mike', metadata: { customer: 'Sarah Wilson' } },
  { id: 'log-3', carId: '1', timestamp: '2025-01-03T17:00:00', action: 'cleaned', description: 'Full interior and exterior clean completed', user: 'Washer Team', metadata: { type: 'full' } },
  { id: 'log-4', carId: '2', timestamp: '2025-01-04T09:00:00', action: 'checked-out', description: 'Checked out to John Smith', user: 'Oliver', metadata: { customer: 'John Smith', dueBack: '2025-01-04T14:30:00' } },
  { id: 'log-5', carId: '2', timestamp: '2024-12-28T14:20:00', action: 'serviced', description: '15,000km routine service completed', user: 'Service Centre', metadata: { type: 'routine', cost: 445 } },
  { id: 'log-6', carId: '3', timestamp: '2025-01-02T11:20:00', action: 'hold', description: 'Placed on hold for damage inspection', user: 'Sarah', metadata: { reason: 'Damage inspection' } },
  { id: 'log-7', carId: '1', timestamp: '2024-12-15T08:30:00', action: 'serviced', description: '10,000km service completed', user: 'Service Centre', metadata: { type: 'routine', cost: 385 } },
];

export function getCarById(id: string): Car | undefined {
  return mockCars.find(car => car.id === id);
}

export function getLoanByCar(carId: string): Loan | undefined {
  return mockLoans.find(loan => loan.carId === carId);
}

export function getCleaningJobByCar(carId: string): CleaningJob | undefined {
  return mockCleaningJobs.find(job => job.carId === carId);
}

export function getHoldItemByCar(carId: string): HoldItem | undefined {
  return mockHoldItems.find(item => item.carId === carId);
}