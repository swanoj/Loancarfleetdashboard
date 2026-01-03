import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import * as api from '../services/api';

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
  loading: boolean;
  
  // Car operations
  updateCar: (id: string, updates: Partial<Car>) => Promise<void>;
  addCar: (car: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  refreshCars: () => Promise<void>;
  
  // Loan operations
  checkOutCar: (carId: string, customer: string, driver: string, dueBack: string) => Promise<void>;
  checkInCar: (carId: string, hasIssues: boolean, notes?: string) => Promise<void>;
  
  // Cleaning operations
  startCleaning: (jobId: string, washer: string) => Promise<void>;
  completeCleaning: (jobId: string) => Promise<void>;
  addCleaningJob: (job: CleaningJob) => void;
  
  // Hold operations
  resolveHold: (holdId: string) => Promise<void>;
  addHold: (carId: string, reason: string, notes?: string) => Promise<void>;
  
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
  const [loading, setLoading] = useState(false);
  
  // Load data from database on mount
  useEffect(() => {
    refreshCars();
  }, []);
  
  const refreshCars = async () => {
    setLoading(true);
    try {
      const vehicles = await api.fetchVehicles();
      if (vehicles.length > 0) {
        setCars(vehicles);
      }
      
      const dbLoans = await api.fetchLoans();
      if (dbLoans.length > 0) {
        setLoans(dbLoans);
      }
      
      const dbCleaningJobs = await api.fetchCleaningJobs();
      if (dbCleaningJobs.length > 0) {
        setCleaningJobs(dbCleaningJobs);
      }
      
      const dbHolds = await api.fetchHoldItems();
      if (dbHolds.length > 0) {
        setHoldItems(dbHolds);
      }
    } catch (error) {
      console.error('Error refreshing data from database:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateCar = async (id: string, updates: Partial<Car>) => {
    // Optimistic update
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
    
    // Sync with database
    await api.updateVehicle(id, updates);
  };
  
  const addCar = async (car: Partial<Car>) => {
    const newCar = await api.createVehicle(car);
    if (newCar) {
      setCars(prev => [...prev, newCar]);
    }
  };
  
  const deleteCar = async (id: string) => {
    // Optimistic update
    setCars(prev => prev.filter(car => car.id !== id));
    
    // Sync with database
    await api.deleteVehicle(id);
  };
  
  const checkOutCar = async (carId: string, customer: string, driver: string, dueBack: string) => {
    // Update car status
    await updateCar(carId, { status: 'out' });
    
    // Create new loan
    const newLoan = await api.createLoan({
      carId,
      customer,
      driver,
      checkedOut: new Date().toISOString(),
      dueBack,
    });
    
    if (newLoan) {
      setLoans(prev => [...prev, newLoan]);
    }
  };
  
  const checkInCar = async (carId: string, hasIssues: boolean, notes?: string) => {
    // Find and complete the loan
    const activeLoan = loans.find(loan => loan.carId === carId && !loan.returnedAt);
    if (activeLoan) {
      await api.updateLoan(activeLoan.id, { returnedAt: new Date().toISOString() });
      setLoans(prev => prev.map(loan => 
        loan.id === activeLoan.id
          ? { ...loan, returnedAt: new Date().toISOString() }
          : loan
      ));
    }
    
    // Update car status - either to cleaning or available
    if (hasIssues && notes) {
      // Add to hold if there are issues
      await updateCar(carId, { status: 'hold' });
      await addHold(carId, 'Damage reported on check-in', notes);
    } else {
      // Add to cleaning queue
      await updateCar(carId, { status: 'cleaning' });
      const newJob = await api.createCleaningJob({
        carId,
        type: 'full',
        priority: 'normal',
        status: 'pending',
      });
      if (newJob) {
        setCleaningJobs(prev => [...prev, newJob]);
      }
    }
  };
  
  const startCleaning = async (jobId: string, washer: string) => {
    const updates = {
      status: 'in-progress' as const,
      assignedTo: washer,
      startedAt: new Date().toISOString()
    };
    
    setCleaningJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, ...updates } : job
    ));
    
    await api.updateCleaningJob(jobId, updates);
  };
  
  const completeCleaning = async (jobId: string) => {
    const job = cleaningJobs.find(j => j.id === jobId);
    if (job) {
      // Update job status
      const updates = {
        status: 'complete' as const,
        completedAt: new Date().toISOString()
      };
      
      setCleaningJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, ...updates } : j
      ));
      
      await api.updateCleaningJob(jobId, updates);
      
      // Update car status to available
      await updateCar(job.carId, { status: 'available' });
      
      // Remove completed job after a delay
      setTimeout(async () => {
        setCleaningJobs(prev => prev.filter(j => j.id !== jobId));
        await api.deleteCleaningJob(jobId);
      }, 1000);
    }
  };
  
  const addCleaningJob = (job: CleaningJob) => {
    setCleaningJobs(prev => [...prev, job]);
  };
  
  const resolveHold = async (holdId: string) => {
    const hold = holdItems.find(h => h.id === holdId);
    if (hold) {
      // Update car status to available
      await updateCar(hold.carId, { status: 'available' });
      
      // Remove hold item
      setHoldItems(prev => prev.filter(h => h.id !== holdId));
      await api.deleteHoldItem(holdId);
    }
  };
  
  const addHold = async (carId: string, reason: string, notes?: string) => {
    const newHold = await api.createHoldItem({
      carId,
      reason,
      since: new Date().toISOString().split('T')[0],
      notes,
    });
    
    if (newHold) {
      setHoldItems(prev => [...prev, newHold]);
    }
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
        loading,
        updateCar,
        addCar,
        deleteCar,
        refreshCars,
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