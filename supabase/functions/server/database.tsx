import * as kv from "./kv_store.tsx";

// Database service layer for Fleet Command
// All data stored in KV store with structured keys

// ==================== VEHICLES ====================

export interface Vehicle {
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
  createdAt: string;
  updatedAt: string;
}

export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
  const id = `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const newVehicle: Vehicle = {
    ...vehicle,
    id,
    createdAt: now,
    updatedAt: now,
  };
  
  await kv.set(`vehicle:${id}`, newVehicle);
  await addToVehicleIndex(id);
  
  return newVehicle;
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  return await kv.get(`vehicle:${id}`);
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const index = await kv.get('vehicle:index') || [];
  if (!Array.isArray(index)) return [];
  
  const vehicles = await kv.mget(index.map(id => `vehicle:${id}`));
  return vehicles.filter(v => v !== null) as Vehicle[];
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
  const existing = await getVehicle(id);
  if (!existing) return null;
  
  const updated: Vehicle = {
    ...existing,
    ...updates,
    id: existing.id, // Preserve ID
    createdAt: existing.createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`vehicle:${id}`, updated);
  return updated;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const existing = await getVehicle(id);
  if (!existing) return false;
  
  await kv.del(`vehicle:${id}`);
  await removeFromVehicleIndex(id);
  
  return true;
}

async function addToVehicleIndex(id: string) {
  const index = await kv.get('vehicle:index') || [];
  if (!Array.isArray(index)) {
    await kv.set('vehicle:index', [id]);
  } else if (!index.includes(id)) {
    await kv.set('vehicle:index', [...index, id]);
  }
}

async function removeFromVehicleIndex(id: string) {
  const index = await kv.get('vehicle:index') || [];
  if (Array.isArray(index)) {
    await kv.set('vehicle:index', index.filter(i => i !== id));
  }
}

// ==================== LOANS ====================

export interface Loan {
  id: string;
  carId: string;
  customer: string;
  driver: string;
  checkedOut: string;
  dueBack: string;
  returnedAt?: string;
  createdAt: string;
}

export async function createLoan(loan: Omit<Loan, 'id' | 'createdAt'>): Promise<Loan> {
  const id = `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newLoan: Loan = {
    ...loan,
    id,
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(`loan:${id}`, newLoan);
  await addToLoanIndex(id);
  
  return newLoan;
}

export async function getAllLoans(): Promise<Loan[]> {
  const index = await kv.get('loan:index') || [];
  if (!Array.isArray(index)) return [];
  
  const loans = await kv.mget(index.map(id => `loan:${id}`));
  return loans.filter(l => l !== null) as Loan[];
}

export async function updateLoan(id: string, updates: Partial<Loan>): Promise<Loan | null> {
  const existing = await kv.get(`loan:${id}`);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates };
  await kv.set(`loan:${id}`, updated);
  return updated;
}

async function addToLoanIndex(id: string) {
  const index = await kv.get('loan:index') || [];
  if (!Array.isArray(index)) {
    await kv.set('loan:index', [id]);
  } else if (!index.includes(id)) {
    await kv.set('loan:index', [...index, id]);
  }
}

// ==================== CLEANING JOBS ====================

export interface CleaningJob {
  id: string;
  carId: string;
  type: 'full' | 'quick' | 'interior' | 'exterior';
  priority: 'urgent' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'complete';
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export async function createCleaningJob(job: Omit<CleaningJob, 'id' | 'createdAt'>): Promise<CleaningJob> {
  const id = `cleaning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newJob: CleaningJob = {
    ...job,
    id,
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(`cleaning:${id}`, newJob);
  await addToCleaningIndex(id);
  
  return newJob;
}

export async function getAllCleaningJobs(): Promise<CleaningJob[]> {
  const index = await kv.get('cleaning:index') || [];
  if (!Array.isArray(index)) return [];
  
  const jobs = await kv.mget(index.map(id => `cleaning:${id}`));
  return jobs.filter(j => j !== null) as CleaningJob[];
}

export async function updateCleaningJob(id: string, updates: Partial<CleaningJob>): Promise<CleaningJob | null> {
  const existing = await kv.get(`cleaning:${id}`);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates };
  await kv.set(`cleaning:${id}`, updated);
  return updated;
}

export async function deleteCleaningJob(id: string): Promise<boolean> {
  await kv.del(`cleaning:${id}`);
  await removeFromCleaningIndex(id);
  return true;
}

async function addToCleaningIndex(id: string) {
  const index = await kv.get('cleaning:index') || [];
  if (!Array.isArray(index)) {
    await kv.set('cleaning:index', [id]);
  } else if (!index.includes(id)) {
    await kv.set('cleaning:index', [...index, id]);
  }
}

async function removeFromCleaningIndex(id: string) {
  const index = await kv.get('cleaning:index') || [];
  if (Array.isArray(index)) {
    await kv.set('cleaning:index', index.filter(i => i !== id));
  }
}

// ==================== HOLD ITEMS ====================

export interface HoldItem {
  id: string;
  carId: string;
  reason: string;
  since: string;
  notes?: string;
  createdAt: string;
}

export async function createHoldItem(hold: Omit<HoldItem, 'id' | 'createdAt'>): Promise<HoldItem> {
  const id = `hold-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newHold: HoldItem = {
    ...hold,
    id,
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(`hold:${id}`, newHold);
  await addToHoldIndex(id);
  
  return newHold;
}

export async function getAllHoldItems(): Promise<HoldItem[]> {
  const index = await kv.get('hold:index') || [];
  if (!Array.isArray(index)) return [];
  
  const holds = await kv.mget(index.map(id => `hold:${id}`));
  return holds.filter(h => h !== null) as HoldItem[];
}

export async function deleteHoldItem(id: string): Promise<boolean> {
  await kv.del(`hold:${id}`);
  await removeFromHoldIndex(id);
  return true;
}

async function addToHoldIndex(id: string) {
  const index = await kv.get('hold:index') || [];
  if (!Array.isArray(index)) {
    await kv.set('hold:index', [id]);
  } else if (!index.includes(id)) {
    await kv.set('hold:index', [...index, id]);
  }
}

async function removeFromHoldIndex(id: string) {
  const index = await kv.get('hold:index') || [];
  if (Array.isArray(index)) {
    await kv.set('hold:index', index.filter(i => i !== id));
  }
}
