import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Car {
  id: string;
  rego: string;
  make: string;
  model: string;
  year: number;
  color: string;
  color_hex: string;
  bay: string | null;
  status: 'available' | 'out' | 'hold' | 'service' | 'cleaning';
  rego_expiry: string;
  do_not_renew: boolean;
  vin?: string;
  odometer?: number;
  fuel_type?: string;
  transmission?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Loan {
  id: string;
  car_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  checked_out_at: string;
  due_back_at: string;
  checked_in_at?: string;
  checked_out_by?: string;
  checked_in_by?: string;
  odometer_out?: number;
  fuel_level_out?: number;
  odometer_in?: number;
  fuel_level_in?: number;
  status: 'active' | 'completed' | 'overdue';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CleaningJob {
  id: string;
  car_id: string;
  type: 'full' | 'quick' | 'interior' | 'exterior';
  priority: 'urgent' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HoldItem {
  id: string;
  car_id: string;
  reason: string;
  since: string;
  released_at?: string;
  placed_by?: string;
  released_by?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Insurance {
  id: string;
  car_id: string;
  provider: string;
  policy_number: string;
  expiry_date: string;
  coverage_type: string;
  premium?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRecord {
  id: string;
  car_id: string;
  service_date: string;
  type: 'routine' | 'repair' | 'inspection' | 'other';
  description: string;
  odometer?: number;
  cost?: number;
  provider?: string;
  next_due_date?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarNote {
  id: string;
  car_id: string;
  type: 'general' | 'damage' | 'maintenance' | 'customer';
  content: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  car_id?: string;
  action: 'checked-out' | 'checked-in' | 'cleaned' | 'serviced' | 'hold' | 'released' | 'status-change' | 'created' | 'updated' | 'deleted';
  description: string;
  user_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface User {
  id: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff' | 'washer';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// CAR OPERATIONS
// ==========================================

export async function getAllCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('rego', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getCarByRego(rego: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('rego', rego)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .insert(car)
    .select()
    .single();
  
  if (error) throw error;
  
  // Log creation
  await createActivityLog({
    car_id: data.id,
    action: 'created',
    description: `Vehicle ${car.rego} added to fleet`,
    metadata: { rego: car.rego, make: car.make, model: car.model }
  });
  
  return data;
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCar(id: string): Promise<void> {
  const car = await getCarById(id);
  
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  if (car) {
    await createActivityLog({
      action: 'deleted',
      description: `Vehicle ${car.rego} removed from fleet`,
      metadata: { rego: car.rego, make: car.make, model: car.model }
    });
  }
}

export async function getCarsByStatus(status: Car['status']): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', status)
    .order('rego', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// ==========================================
// LOAN OPERATIONS
// ==========================================

export async function getAllLoans(): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .order('checked_out_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getActiveLoans(): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('status', 'active')
    .order('due_back_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getLoansByCarId(carId: string): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('car_id', carId)
    .order('checked_out_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createLoan(loan: Omit<Loan, 'id' | 'created_at' | 'updated_at'>): Promise<Loan> {
  const { data, error } = await supabase
    .from('loans')
    .insert(loan)
    .select()
    .single();
  
  if (error) throw error;
  
  // Log checkout
  const car = await getCarById(loan.car_id);
  await createActivityLog({
    car_id: loan.car_id,
    action: 'checked-out',
    description: `Checked out to ${loan.customer_name}`,
    user_id: loan.checked_out_by,
    metadata: { 
      customer: loan.customer_name,
      dueBack: loan.due_back_at,
      odometerOut: loan.odometer_out,
      fuelLevelOut: loan.fuel_level_out
    }
  });
  
  return data;
}

export async function updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
  const { data, error } = await supabase
    .from('loans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // If checking in, log it
  if (updates.checked_in_at && updates.status === 'completed') {
    await createActivityLog({
      car_id: data.car_id,
      action: 'checked-in',
      description: 'Returned from loan',
      user_id: updates.checked_in_by,
      metadata: {
        odometerIn: updates.odometer_in,
        fuelLevelIn: updates.fuel_level_in
      }
    });
  }
  
  return data;
}

export async function checkInLoan(
  loanId: string, 
  checkInData: {
    checked_in_by?: string;
    odometer_in?: number;
    fuel_level_in?: number;
    notes?: string;
  }
): Promise<Loan> {
  return updateLoan(loanId, {
    ...checkInData,
    checked_in_at: new Date().toISOString(),
    status: 'completed'
  });
}

// ==========================================
// CLEANING JOB OPERATIONS
// ==========================================

export async function getAllCleaningJobs(): Promise<CleaningJob[]> {
  const { data, error } = await supabase
    .from('cleaning_jobs')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getPendingCleaningJobs(): Promise<CleaningJob[]> {
  const { data, error } = await supabase
    .from('cleaning_jobs')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createCleaningJob(job: Omit<CleaningJob, 'id' | 'created_at' | 'updated_at'>): Promise<CleaningJob> {
  const { data, error } = await supabase
    .from('cleaning_jobs')
    .insert(job)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCleaningJob(id: string, updates: Partial<CleaningJob>): Promise<CleaningJob> {
  const { data, error } = await supabase
    .from('cleaning_jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // If completed, log it
  if (updates.status === 'completed' && updates.completed_at) {
    await createActivityLog({
      car_id: data.car_id,
      action: 'cleaned',
      description: `${data.type} clean completed`,
      user_id: data.assigned_to,
      metadata: { type: data.type, priority: data.priority }
    });
  }
  
  return data;
}

export async function completeCleaningJob(jobId: string, assignedTo?: string): Promise<CleaningJob> {
  return updateCleaningJob(jobId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
    assigned_to: assignedTo
  });
}

// ==========================================
// HOLD ITEM OPERATIONS
// ==========================================

export async function getActiveHoldItems(): Promise<HoldItem[]> {
  const { data, error } = await supabase
    .from('hold_items')
    .select('*')
    .is('released_at', null)
    .order('since', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createHoldItem(hold: Omit<HoldItem, 'id' | 'created_at' | 'updated_at'>): Promise<HoldItem> {
  const { data, error } = await supabase
    .from('hold_items')
    .insert(hold)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update car status
  await updateCar(hold.car_id, { status: 'hold' });
  
  // Log hold
  await createActivityLog({
    car_id: hold.car_id,
    action: 'hold',
    description: `Placed on hold: ${hold.reason}`,
    user_id: hold.placed_by,
    metadata: { reason: hold.reason }
  });
  
  return data;
}

export async function releaseHoldItem(id: string, releasedBy?: string): Promise<HoldItem> {
  const { data, error } = await supabase
    .from('hold_items')
    .update({
      released_at: new Date().toISOString(),
      released_by: releasedBy
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update car status back to available
  await updateCar(data.car_id, { status: 'available' });
  
  // Log release
  await createActivityLog({
    car_id: data.car_id,
    action: 'released',
    description: 'Released from hold',
    user_id: releasedBy
  });
  
  return data;
}

// ==========================================
// INSURANCE OPERATIONS
// ==========================================

export async function getInsuranceByCarId(carId: string): Promise<Insurance[]> {
  const { data, error } = await supabase
    .from('insurance')
    .select('*')
    .eq('car_id', carId)
    .order('expiry_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createInsurance(insurance: Omit<Insurance, 'id' | 'created_at' | 'updated_at'>): Promise<Insurance> {
  const { data, error } = await supabase
    .from('insurance')
    .insert(insurance)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateInsurance(id: string, updates: Partial<Insurance>): Promise<Insurance> {
  const { data, error } = await supabase
    .from('insurance')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==========================================
// SERVICE RECORD OPERATIONS
// ==========================================

export async function getServiceRecordsByCarId(carId: string): Promise<ServiceRecord[]> {
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .eq('car_id', carId)
    .order('service_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getAllServiceRecords(): Promise<ServiceRecord[]> {
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .order('service_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createServiceRecord(record: Omit<ServiceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRecord> {
  const { data, error } = await supabase
    .from('service_records')
    .insert(record)
    .select()
    .single();
  
  if (error) throw error;
  
  // Log service
  await createActivityLog({
    car_id: record.car_id,
    action: 'serviced',
    description: record.description,
    user_id: record.created_by,
    metadata: { 
      type: record.type,
      cost: record.cost,
      odometer: record.odometer,
      provider: record.provider
    }
  });
  
  return data;
}

// ==========================================
// CAR NOTE OPERATIONS
// ==========================================

export async function getNotesByCarId(carId: string): Promise<CarNote[]> {
  const { data, error } = await supabase
    .from('car_notes')
    .select('*')
    .eq('car_id', carId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createCarNote(note: Omit<CarNote, 'id' | 'created_at' | 'updated_at'>): Promise<CarNote> {
  const { data, error } = await supabase
    .from('car_notes')
    .insert(note)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==========================================
// ACTIVITY LOG OPERATIONS
// ==========================================

export async function getActivityLogsByCarId(carId: string, limit: number = 50): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('car_id', carId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function getAllActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function createActivityLog(log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert(log)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==========================================
// DASHBOARD QUERIES
// ==========================================

export async function getDashboardStats() {
  const [
    allCars,
    activeLoans,
    pendingCleaningJobs,
    activeHolds
  ] = await Promise.all([
    getAllCars(),
    getActiveLoans(),
    getPendingCleaningJobs(),
    getActiveHoldItems()
  ]);

  const statusCounts = allCars.reduce((acc, car) => {
    acc[car.status] = (acc[car.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate overdue and due soon loans
  const now = new Date();
  const overdue = activeLoans.filter(loan => new Date(loan.due_back_at) < now);
  const dueSoon = activeLoans.filter(loan => {
    const dueDate = new Date(loan.due_back_at);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDue > 0 && hoursUntilDue <= 2;
  });

  return {
    totalVehicles: allCars.length,
    available: statusCounts.available || 0,
    out: statusCounts.out || 0,
    cleaning: statusCounts.cleaning || 0,
    hold: statusCounts.hold || 0,
    service: statusCounts.service || 0,
    activeLoans: activeLoans.length,
    overdueLoans: overdue.length,
    dueSoonLoans: dueSoon.length,
    cleaningQueue: pendingCleaningJobs.length,
    holdItems: activeHolds.length
  };
}

// ==========================================
// REAL-TIME SUBSCRIPTIONS
// ==========================================

export function subscribeToCars(callback: (cars: Car[]) => void) {
  const subscription = supabase
    .channel('cars-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, async () => {
      const cars = await getAllCars();
      callback(cars);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToLoans(callback: (loans: Loan[]) => void) {
  const subscription = supabase
    .channel('loans-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'loans' }, async () => {
      const loans = await getActiveLoans();
      callback(loans);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToCleaningJobs(callback: (jobs: CleaningJob[]) => void) {
  const subscription = supabase
    .channel('cleaning-jobs-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cleaning_jobs' }, async () => {
      const jobs = await getPendingCleaningJobs();
      callback(jobs);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ==========================================
// ANALYTICS QUERIES
// ==========================================

export async function getAnalyticsData(dateRange: '7d' | '30d' | '90d' | 'all' = '30d') {
  const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const [
    allCars,
    recentLoans,
    serviceRecords,
    activityLogs
  ] = await Promise.all([
    getAllCars(),
    supabase
      .from('loans')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .then(({ data }) => data || []),
    getAllServiceRecords(),
    supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .then(({ data }) => data || [])
  ]);

  return {
    cars: allCars,
    loans: recentLoans,
    serviceRecords,
    activityLogs
  };
}
