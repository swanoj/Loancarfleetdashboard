import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Car, 
  Loan, 
  CleaningJob, 
  HoldItem,
  Insurance,
  ServiceRecord,
  CarNote,
  ActivityLog,
  mockCars, 
  mockLoans, 
  mockCleaningJobs, 
  mockHoldItems,
  mockInsurance,
  mockServiceRecords,
  mockCarNotes,
  mockActivityLogs
} from '../data/mockData';

// Fleet management context for state management across the application
interface FleetContextType {
  cars: Car[];
  loans: Loan[];
  cleaningJobs: CleaningJob[];
  holdItems: HoldItem[];
  insurance: Insurance[];
  serviceRecords: ServiceRecord[];
  carNotes: CarNote[];
  activityLogs: ActivityLog[];
  
  // Car operations
  updateCar: (id: string, updates: Partial<Car>) => void;
  addCar: (car: Car) => void;
  deleteCar: (id: string) => void;
  
  // Loan operations
  checkOutCar: (carId: string, customer: string, driver: string, dueBack: string) => void;
  checkInCar: (carId: string, hasIssues: boolean, notes?: string) => void;
  
  // Cleaning operations
  startCleaning: (jobId: string, washer: string) => void;
  completeCleaning: (jobId: string) => void;
  addCleaningJob: (job: CleaningJob) => void;
  
  // Hold operations
  resolveHold: (holdId: string) => void;
  addHold: (carId: string, reason: string, notes?: string) => void;
  
  // Note operations
  addNote: (carId: string, content: string, type: CarNote['type']) => void;
  
  // Activity log
  addActivityLog: (carId: string, action: ActivityLog['action'], description: string, metadata?: Record<string, any>) => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export function FleetProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [cleaningJobs, setCleaningJobs] = useState<CleaningJob[]>(mockCleaningJobs);
  const [holdItems, setHoldItems] = useState<HoldItem[]>(mockHoldItems);
  const [insurance, setInsurance] = useState<Insurance[]>(mockInsurance);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(mockServiceRecords);
  const [carNotes, setCarNotes] = useState<CarNote[]>(mockCarNotes);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  
  const updateCar = (id: string, updates: Partial<Car>) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
  };
  
  const addCar = (car: Car) => {
    setCars(prev => [...prev, car]);
  };
  
  const deleteCar = (id: string) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };
  
  const checkOutCar = (carId: string, customer: string, driver: string, dueBack: string) => {
    // Update car status
    updateCar(carId, { status: 'out' });
    
    // Create new loan
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      carId,
      customer,
      driver,
      checkedOut: new Date().toISOString(),
      dueBack,
    };
    
    setLoans(prev => [...prev, newLoan]);
  };
  
  const checkInCar = (carId: string, hasIssues: boolean, notes?: string) => {
    // Find and complete the loan
    setLoans(prev => prev.map(loan => 
      loan.carId === carId && !loan.returnedAt
        ? { ...loan, returnedAt: new Date().toISOString() }
        : loan
    ));
    
    // Update car status - either to cleaning or available
    if (hasIssues && notes) {
      // Add to hold if there are issues
      updateCar(carId, { status: 'hold' });
      addHold(carId, 'Damage reported on check-in', notes);
    } else {
      // Add to cleaning queue
      updateCar(carId, { status: 'cleaning' });
      const cleaningJob: CleaningJob = {
        id: `clean-${Date.now()}`,
        carId,
        type: 'full',
        priority: 'normal',
        status: 'pending',
      };
      addCleaningJob(cleaningJob);
    }
  };
  
  const startCleaning = (jobId: string, washer: string) => {
    setCleaningJobs(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, status: 'in-progress' as const, assignedTo: washer, startedAt: new Date().toISOString() }
        : job
    ));
  };
  
  const completeCleaning = (jobId: string) => {
    const job = cleaningJobs.find(j => j.id === jobId);
    if (job) {
      // Update job status
      setCleaningJobs(prev => prev.map(j =>
        j.id === jobId
          ? { ...j, status: 'complete' as const, completedAt: new Date().toISOString() }
          : j
      ));
      
      // Update car status to available
      updateCar(job.carId, { status: 'available' });
      
      // Remove completed job after a delay
      setTimeout(() => {
        setCleaningJobs(prev => prev.filter(j => j.id !== jobId));
      }, 1000);
    }
  };
  
  const addCleaningJob = (job: CleaningJob) => {
    setCleaningJobs(prev => [...prev, job]);
  };
  
  const resolveHold = (holdId: string) => {
    const hold = holdItems.find(h => h.id === holdId);
    if (hold) {
      // Update car status to available
      updateCar(hold.carId, { status: 'available' });
      
      // Remove hold item
      setHoldItems(prev => prev.filter(h => h.id !== holdId));
    }
  };
  
  const addHold = (carId: string, reason: string, notes?: string) => {
    const newHold: HoldItem = {
      id: `hold-${Date.now()}`,
      carId,
      reason,
      since: new Date().toISOString().split('T')[0],
      notes,
    };
    
    setHoldItems(prev => [...prev, newHold]);
  };
  
  const addNote = (carId: string, content: string, type: CarNote['type']) => {
    const newNote: CarNote = {
      id: `note-${Date.now()}`,
      carId,
      content,
      type,
      createdAt: new Date().toISOString(),
      createdBy: 'Oliver', // Default user
    };
    
    setCarNotes(prev => [...prev, newNote]);
  };
  
  const addActivityLog = (carId: string, action: ActivityLog['action'], description: string, metadata?: Record<string, any>) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      carId,
      action,
      description,
      user: 'Oliver', // Default user
      metadata,
      timestamp: new Date().toISOString(),
    };
    
    setActivityLogs(prev => [...prev, newLog]);
  };
  
  return (
    <FleetContext.Provider
      value={{
        cars,
        loans,
        cleaningJobs,
        holdItems,
        insurance,
        serviceRecords,
        carNotes,
        activityLogs,
        updateCar,
        addCar,
        deleteCar,
        checkOutCar,
        checkInCar,
        startCleaning,
        completeCleaning,
        addCleaningJob,
        resolveHold,
        addHold,
        addNote,
        addActivityLog,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}