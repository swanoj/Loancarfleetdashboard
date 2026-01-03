import React, { useState } from 'react';
import { ChevronDown, Plus, Clock, User } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { CarTile } from '../components/CarTile';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { CarIcon } from '../components/CarIcon';
import { useFleet } from '../context/FleetContext';
import { CheckOutModal } from './CheckOutModal';
import { CheckInModal } from './CheckInModal';

export function TodayDashboard() {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { cars, loans, cleaningJobs, holdItems, startCleaning, resolveHold } = useFleet();
  
  const availableCars = cars.filter(car => car.status === 'available');
  const outCars = cars.filter(car => car.status === 'out');
  const cleaningCars = cars.filter(car => car.status === 'cleaning');
  const holdCars = cars.filter(car => car.status === 'hold');
  
  // Calculate due today and overdue
  const today = new Date('2025-01-04');
  const dueToday = loans.filter(loan => {
    const dueDate = new Date(loan.dueBack);
    return dueDate.toDateString() === today.toDateString() && !loan.returnedAt;
  });
  
  const overdue = loans.filter(loan => {
    const dueDate = new Date(loan.dueBack);
    return dueDate < today && !loan.returnedAt;
  });
  
  // Combine and deduplicate by loan ID
  const dueTodayAndOverdue = [...dueToday, ...overdue].filter((loan, index, self) => 
    index === self.findIndex(l => l.id === loan.id)
  );
  
  const handleCheckOut = () => {
    if (selectedCarId) {
      setCheckOutModalOpen(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0C0C0D]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0C0C0D] border-b border-[#2A2A2E]">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <h1 className="text-xl font-semibold text-white">Fleet Command</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#A1A1AA]">Sat, 4 Jan 2025</span>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1A1A1D] transition-colors">
              <div className="w-8 h-8 bg-[#F97066] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">O</span>
              </div>
              <span className="text-sm text-white">Oliver</span>
              <ChevronDown className="w-4 h-4 text-[#71717A]" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-8 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <KPICard 
            label="READY" 
            value={availableCars.length} 
            sublabel="Available"
          />
          <KPICard 
            label="OUT" 
            value={outCars.length} 
            sublabel="On loan"
            accentColor="blue"
          />
          <KPICard 
            label="DUE TODAY" 
            value={dueToday.length} 
            sublabel="Expected"
            accentColor="amber"
          />
          <KPICard 
            label="OVERDUE" 
            value={overdue.length} 
            sublabel="Past due"
            accentColor="red"
            urgent={overdue.length > 0}
          />
          <KPICard 
            label="CLEANING" 
            value={cleaningCars.length} 
            sublabel="In queue"
            accentColor="neutral"
          />
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Available Cars */}
            <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Available Cars</h2>
                  <p className="text-sm text-[#A1A1AA]">{availableCars.length} cars ready to go</p>
                </div>
                <Button onClick={handleCheckOut} disabled={!selectedCarId}>
                  <Plus className="w-4 h-4" />
                  Check Out
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {availableCars.map(car => (
                  <CarTile
                    key={car.id}
                    rego={car.rego}
                    make={car.make}
                    model={car.model}
                    color={car.color}
                    bay={car.bay}
                    isSelected={selectedCarId === car.id}
                    onClick={() => setSelectedCarId(car.id === selectedCarId ? null : car.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* Due Back Today */}
            <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Due Back Today</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-[#1A1A1D]">
                  <div className="col-span-2 text-xs uppercase tracking-wide text-[#71717A]">Time</div>
                  <div className="col-span-2 text-xs uppercase tracking-wide text-[#71717A]">Rego</div>
                  <div className="col-span-3 text-xs uppercase tracking-wide text-[#71717A]">Vehicle</div>
                  <div className="col-span-3 text-xs uppercase tracking-wide text-[#71717A]">Customer</div>
                  <div className="col-span-2 text-xs uppercase tracking-wide text-[#71717A]">Status</div>
                </div>
                
                {/* Table Rows */}
                {dueTodayAndOverdue.map(loan => {
                  const car = cars.find(c => c.id === loan.carId);
                  if (!car) return null;
                  const dueTime = new Date(loan.dueBack);
                  const isLate = dueTime < today;
                  
                  return (
                    <div 
                      key={loan.id}
                      className={`grid grid-cols-12 gap-4 py-3 rounded-lg hover:bg-[#1A1A1D] transition-colors ${isLate ? 'bg-[#EF444410]' : ''}`}
                    >
                      <div className={`col-span-2 font-mono ${isLate ? 'text-[#EF4444]' : 'text-white'}`}>
                        {dueTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <CarIcon model={car.model} className="w-4 h-4 text-[#71717A]" />
                        <span className="font-mono text-white">{car.rego}</span>
                      </div>
                      <div className="col-span-3 text-[#A1A1AA]">{car.make} {car.model}</div>
                      <div className="col-span-3 text-[#FAFAFA]">{loan.customer}</div>
                      <div className="col-span-2">
                        <StatusBadge variant={isLate ? 'late' : 'ok'}>
                          {isLate ? 'LATE' : 'OK'}
                        </StatusBadge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Cleaning Queue */}
            <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Cleaning Queue</h2>
                <div className="w-6 h-6 bg-[#2A2A2E] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{cleaningJobs.length}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {cleaningJobs.map(job => {
                  const car = cars.find(c => c.id === job.carId);
                  if (!car) return null;
                  
                  return (
                    <div 
                      key={job.id}
                      className={`bg-[#0C0C0D] border-l-2 rounded-lg p-4 ${
                        job.priority === 'urgent' ? 'border-l-[#EF4444]' : 'border-l-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-mono text-sm text-white mb-1">
                        <CarIcon model={car.model} className="w-4 h-4 text-[#71717A]" />
                        <span>{car.rego} • {car.make} {car.model}</span>
                      </div>
                      <div className="text-sm text-[#A1A1AA] mb-2 capitalize">
                        {job.type === 'full' ? 'Interior + Exterior' : job.type}
                      </div>
                      <div className="flex items-center justify-between">
                        <StatusBadge variant={job.priority === 'urgent' ? 'overdue' : 'ok'}>
                          {job.priority === 'urgent' ? '● Urgent' : '○ Normal'}
                        </StatusBadge>
                        <Button variant="ghost" size="sm">Start Clean</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* On Hold */}
            <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">On Hold</h2>
                <div className="w-6 h-6 bg-[#2A2A2E] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{holdItems.length}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {holdItems.map(item => {
                  const car = cars.find(c => c.id === item.carId);
                  if (!car) return null;
                  const daysSince = Math.floor((today.getTime() - new Date(item.since).getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={item.id} className="bg-[#0C0C0D] rounded-lg p-4">
                      <div className="flex items-center gap-2 font-mono text-sm text-white mb-1">
                        <CarIcon model={car.model} className="w-4 h-4 text-[#71717A]" />
                        <span>{car.rego} • {car.model}</span>
                      </div>
                      <div className="text-sm text-[#A1A1AA] mb-3">
                        {item.reason} • {daysSince} days
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-end"
                        onClick={() => {
                          resolveHold(item.id);
                          setToast({ message: `${car.rego} removed from hold`, type: 'success' });
                        }}
                      >
                        Resolve →
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <CheckOutModal 
        isOpen={checkOutModalOpen}
        onClose={() => {
          setCheckOutModalOpen(false);
          setSelectedCarId(null);
        }}
        carId={selectedCarId}
        onSuccess={() => {
          const car = cars.find(c => c.id === selectedCarId);
          if (car) {
            setToast({ message: `${car.rego} checked out successfully`, type: 'success' });
          }
          setSelectedCarId(null);
        }}
      />
      
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
      />
      
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}