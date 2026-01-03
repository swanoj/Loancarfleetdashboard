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

export interface Loan {
  id: string;
  carId: string;
  customer: string;
  checkedOut: string;
  dueBack: string;
}

export interface CleaningJob {
  id: string;
  carId: string;
  type: 'full' | 'quick' | 'interior' | 'exterior';
  priority: 'urgent' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface HoldItem {
  id: string;
  carId: string;
  reason: string;
  since: string;
  notes?: string;
}

export const mockCars: Car[] = [
  { id: '1', rego: 'YOT95K', make: 'VW', model: 'Passat', year: 2020, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-01-17', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '2', rego: 'AW2RHE', make: 'VW', model: 'Polo', year: 2021, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-09-28', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '3', rego: 'VMR11R', make: 'BMW', model: '118i', year: 2019, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-02-28', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '4', rego: 'YKX362', make: 'MB', model: 'E250', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-12-12', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '5', rego: 'YO2B5A', make: 'BMW', model: '320D', year: 2020, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-09-11', fuelType: 'Diesel', transmission: 'Automatic' },
  { id: '6', rego: 'YXN4HZ', make: 'MB', model: 'E200', year: 2020, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-02-19', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '7', rego: 'YPS64E', make: 'VW', model: 'Passat', year: 2020, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2026-04-06', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '8', rego: 'YLJ77F', make: 'MB', model: 'C200', year: 2020, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-04-11', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '9', rego: 'YJM2D', make: 'BMW', model: '1120', year: 2019, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-04-12', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '10', rego: 'YXN81A', make: 'VW', model: 'Jetta', year: 2020, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2025-12-16', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '11', rego: 'AVA70P', make: 'MB', model: 'C220', year: 2021, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-05-24', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '12', rego: 'A65', make: 'BMW', model: '528', year: 2021, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2025-05-31', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '13', rego: 'YPJ8WV', make: 'BMW', model: '320D', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2025-12-22', fuelType: 'Diesel', transmission: 'Automatic' },
  { id: '14', rego: 'YYN05H', make: 'VW', model: 'Passat', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2025-04-24', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '15', rego: 'YNL01L', make: 'VW', model: 'Jetta', year: 2020, color: 'Gold', colorHex: '#FFD700', bay: '', status: 'available', regoExpiry: '2026-02-20', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '16', rego: 'YKL80X', make: 'MB', model: 'C200', year: 2019, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2024-12-12', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '17', rego: 'VJT03L', make: 'BMW', model: '320', year: 2019, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-04-13', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '18', rego: 'YKZ16Q', make: 'MB', model: 'C220', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2025-10-06', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '19', rego: 'VQU4SD', make: 'MB', model: 'B200', year: 2019, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2026-09-08', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '20', rego: 'PP6N6', make: 'MB', model: 'C200', year: 2022, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2025-12-17', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '21', rego: 'YXD85G', make: 'MB', model: 'B200', year: 2020, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2025-12-18', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '22', rego: 'YPY47P', make: 'BMW', model: '328i', year: 2020, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-03-24', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '23', rego: 'H8J11T', make: 'MB', model: 'B200', year: 2015, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-01-14', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '24', rego: 'YXW26F', make: 'MB', model: 'E2000', year: 2020, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-04-19', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '25', rego: 'C955M', make: 'MB', model: 'E200', year: 2013, color: 'Bronze', colorHex: '#CD7F32', bay: '', status: 'available', regoExpiry: '2026-04-25', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '26', rego: 'AVA44F', make: 'MB', model: 'E200', year: 2021, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-04-25', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '27', rego: 'Y9LA03', make: 'MB', model: 'C220nc', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-10-08', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '28', rego: 'AOO004', make: 'MB', model: 'B200', year: 2021, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2026-05-26', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '29', rego: 'C346M', make: 'MB', model: 'M2', year: 2013, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-01-14', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '30', rego: 'YXW79A', make: 'BMW', model: 'X4', year: 2020, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2026-11-09', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '31', rego: 'Y6Z60C', make: 'BMW', model: 'X1 320ne', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-04-07', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '32', rego: 'YG2D37', make: 'BMW', model: 'X5', year: 2020, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-02-27', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '33', rego: 'AAO222', make: 'MB', model: 'E200', year: 2021, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2026-05-19', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '34', rego: '1283B', make: 'MB', model: 'C250cdi', year: 2012, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-05-07', fuelType: 'Diesel', transmission: 'Automatic' },
  { id: '35', rego: 'VW001', make: 'VW', model: 'Polo', year: 2019, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2026-02-20', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '36', rego: 'MB001', make: 'MB', model: 'B200', year: 2021, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-06-07', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '37', rego: 'MB002', make: 'MB', model: 'M140i', year: 2021, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-06-16', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '38', rego: 'BMW001', make: 'BMW', model: 'X5', year: 2020, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2026-02-01', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '39', rego: 'Y9N985', make: 'Saturn', model: 'Winnebago', year: 2021, color: 'Red', colorHex: '#DC143C', bay: '', status: 'available', regoExpiry: '2026-02-05', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '40', rego: 'AVAA31R', make: 'MB', model: 'C180', year: 2021, color: 'Bronze', colorHex: '#CD7F32', bay: '', status: 'available', regoExpiry: '2026-03-29', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '41', rego: 'YJM68T', make: 'VW', model: 'Jetta', year: 2020, color: 'Silver', colorHex: '#C0C0C0', bay: '', status: 'available', regoExpiry: '2026-02-27', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '42', rego: '77709', make: 'Porsche', model: '911', year: 2020, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-12-04', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '43', rego: '47777', make: 'MB', model: 'GLE250', year: 2014, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-04-25', fuelType: 'Diesel', transmission: 'Automatic' },
  { id: '44', rego: 'CDZLJH77', make: 'VW', model: 'Amarok', year: 2022, color: 'Black', colorHex: '#000000', bay: '', status: 'available', regoExpiry: '2025-11-22', fuelType: 'Diesel', transmission: 'Automatic' },
  { id: '45', rego: 'A103', make: 'MB', model: 'E350', year: 2021, color: 'Grey', colorHex: '#808080', bay: '', status: 'available', regoExpiry: '2026-01-19', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '46', rego: '8111T', make: 'Toyota', model: 'Prada', year: 2020, color: 'Bronze', colorHex: '#CD7F32', bay: '', status: 'available', regoExpiry: '2026-08-07', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '47', rego: 'STARIA01', make: 'Hyundai', model: 'Staria', year: 2024, color: 'White', colorHex: '#FFFFFF', bay: '', status: 'available', regoExpiry: '2027-12-17', fuelType: 'Petrol', transmission: 'Automatic' },
  { id: '48', rego: 'YN9R04', make: 'MB', model: '230E', year: 2020, color: 'Gold', colorHex: '#FFD700', bay: '', status: 'available', regoExpiry: '2025-12-09', fuelType: 'Petol', transmission: 'Automatic' },
];

export const mockLoans: Loan[] = [];

export const mockCleaningJobs: CleaningJob[] = [];

export const mockHoldItems: HoldItem[] = [];

export const mockInsurance: Insurance[] = [];

export const mockServiceRecords: ServiceRecord[] = [];

export const mockCarNotes: CarNote[] = [];

export const mockActivityLogs: ActivityLog[] = [];

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