import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Bell, 
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Filter,
  ArrowRight,
  MapPin,
  User,
  Phone
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { KPICard } from '../components/KPICard';
import { CarTile } from '../components/CarTile';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { CarIcon } from '../components/CarIcon';
import { CheckOutModal } from './CheckOutModal';
import { Toast } from '../components/Toast';

export function TodayDashboard() {
  const { cars, loans, cleaningJobs, holdItems, resolveHold } = useFleet();
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'today'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const today = new Date('2025-01-04');
  
  // Categorize vehicles
  const availableCars = cars.filter(car => car.status === 'available');
  const outCars = cars.filter(car => car.status === 'out');
  const cleaningCars = cars.filter(car => car.status === 'cleaning');
  
  // Filter loans
  const activeLoans = loans.filter(loan => !loan.returnedAt);
  const dueToday = activeLoans.filter(loan => {
    const dueDate = new Date(loan.dueBack);
    return dueDate.toDateString() === today.toDateString();
  });
  const overdue = activeLoans.filter(loan => {
    const dueDate = new Date(loan.dueBack);
    // Overdue means before today (not including today's date)
    return dueDate < today && dueDate.toDateString() !== today.toDateString();
  });
  
  const dueTodayAndOverdue = [...overdue, ...dueToday];
  
  // Filter available cars by search
  const filteredAvailableCars = availableCars.filter(car => 
    searchQuery === '' || 
    car.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCheckOut = () => {
    if (selectedCarId) {
      setShowCheckOut(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB]/50 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1D] mb-1">Today's Dashboard</h1>
              <p className="text-sm text-[#6B7280] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Saturday, 4 January 2025
                <span className="ml-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  11:30 AM
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97066] rounded-full animate-pulse"></span>
              </button>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-xl shadow-lg shadow-[#F9706640] text-white">
                <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">O</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">Oliver</div>
                  <div className="text-xs opacity-90">Manager</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search by rego, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A1D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97066] focus:ring-4 focus:ring-[#F9706620] transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl p-1">
              {(['all', 'urgent', 'today'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-[#F97066] text-white shadow-sm'
                      : 'text-[#6B7280] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {filter === 'all' && 'All'}
                  {filter === 'urgent' && 'Urgent'}
                  {filter === 'today' && 'Today'}
                </button>
              ))}
            </div>
            
            <Button 
              onClick={handleCheckOut} 
              disabled={!selectedCarId}
              className="shadow-lg shadow-[#F9706640]"
            >
              <Plus className="w-4 h-4" />
              Check Out Vehicle
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-8 py-6 space-y-6">
        {/* Hero KPI Cards with Gradients */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 opacity-70" />
            </div>
            <div className="text-4xl font-bold mb-1">{availableCars.length}</div>
            <div className="text-sm opacity-90 font-medium">Ready to Go</div>
            <div className="mt-2 text-xs opacity-75">+3 from yesterday</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">{Math.round((outCars.length / cars.length) * 100)}%</div>
            </div>
            <div className="text-4xl font-bold mb-1">{outCars.length}</div>
            <div className="text-sm opacity-90 font-medium">Currently Out</div>
            <div className="mt-2 text-xs opacity-75">On loan to customers</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              {dueToday.length > 0 && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
            </div>
            <div className="text-4xl font-bold mb-1">{dueToday.length}</div>
            <div className="text-sm opacity-90 font-medium">Due Today</div>
            <div className="mt-2 text-xs opacity-75">Expected returns</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
              {overdue.length > 0 && (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
              )}
            </div>
            <div className="text-4xl font-bold mb-1">{overdue.length}</div>
            <div className="text-sm opacity-90 font-medium">Overdue</div>
            <div className="mt-2 text-xs opacity-75">Requires attention</div>
          </div>
          
          <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl p-5 text-white shadow-xl shadow-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/30 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">{cleaningJobs.length}</div>
            </div>
            <div className="text-4xl font-bold mb-1">{cleaningCars.length}</div>
            <div className="text-sm opacity-90 font-medium">In Cleaning</div>
            <div className="mt-2 text-xs opacity-75">{cleaningJobs.filter(j => j.priority === 'urgent').length} urgent</div>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Available Vehicles - Larger Section */}
          <div className="col-span-8 space-y-6">
            {/* Available Cars */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#F8F9FA] to-white px-5 py-3 border-b border-[#E5E7EB]/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#1A1A1D] flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      Available Fleet
                    </h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {filteredAvailableCars.length} {filteredAvailableCars.length === 1 ? 'vehicle' : 'vehicles'} ready for checkout
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                      <Filter className="w-4 h-4 text-[#6B7280]" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {filteredAvailableCars.length > 0 ? (
                  <div className="grid grid-cols-6 gap-2">
                    {filteredAvailableCars.map(car => (
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
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-[#9CA3AF]" />
                    </div>
                    <h3 className="font-semibold text-[#1A1A1D] mb-1">No vehicles found</h3>
                    <p className="text-sm text-[#6B7280]">Try adjusting your search query</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Returns Today & Overdue */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#F8F9FA] to-white px-6 py-4 border-b border-[#E5E7EB]/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1D] flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      Expected Returns
                    </h2>
                    <p className="text-sm text-[#6B7280] mt-0.5">
                      {dueTodayAndOverdue.length} {dueTodayAndOverdue.length === 1 ? 'vehicle' : 'vehicles'} due back
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </div>
              
              <div className="p-6">
                {dueTodayAndOverdue.length > 0 ? (
                  <div className="space-y-2">
                    {dueTodayAndOverdue.map(loan => {
                      const car = cars.find(c => c.id === loan.carId);
                      if (!car) return null;
                      const dueTime = new Date(loan.dueBack);
                      const isLate = dueTime < today;
                      
                      return (
                        <div 
                          key={loan.id}
                          className={`group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                            isLate 
                              ? 'bg-red-50 border-red-200 hover:border-red-300' 
                              : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                          }`}
                        >
                          {/* Time Indicator */}
                          <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl ${
                            isLate ? 'bg-red-100' : 'bg-amber-100'
                          }`}>
                            <div className={`text-xs uppercase tracking-wide font-semibold ${
                              isLate ? 'text-red-700' : 'text-amber-700'
                            }`}>
                              {isLate ? 'Late' : 'Due'}
                            </div>
                            <div className={`font-mono text-lg font-bold ${
                              isLate ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {dueTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </div>
                          </div>
                          
                          {/* Car Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CarIcon model={car.model} className="w-4 h-4 text-[#9CA3AF]" />
                              <span className="font-mono font-bold text-[#1A1A1D]">{car.rego}</span>
                              <span className="text-sm text-[#6B7280]">•</span>
                              <span className="text-sm text-[#6B7280]">{car.make} {car.model}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                              <div className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{loan.customer}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>0400 XXX XXX</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Call Customer
                            </Button>
                            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Check In
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-[#1A1A1D] mb-1">All clear!</h3>
                    <p className="text-sm text-[#6B7280]">No vehicles due back today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Cleaning Queue */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#F8F9FA] to-white px-6 py-4 border-b border-[#E5E7EB]/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#1A1A1D] flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    Cleaning Queue
                  </h2>
                  <div className="w-5 h-5 bg-[#E5E7EB] rounded-full flex items-center justify-center">
                    <span className="text-xs text-[#1A1A1D] font-semibold">{cleaningJobs.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {cleaningJobs.length > 0 ? (
                  <div className="space-y-3">
                    {cleaningJobs
                      .filter(job => cars.find(c => c.id === job.carId))
                      .map(job => {
                        const car = cars.find(c => c.id === job.carId)!;
                        
                        return (
                          <div 
                            key={job.id}
                            className={`bg-[#F8F9FA] border-l-4 rounded-lg p-3 ${
                              job.priority === 'urgent' ? 'border-l-[#EF4444]' : 'border-l-[#3B82F6]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-mono text-xs text-[#1A1A1D] mb-1 font-medium">
                              <CarIcon model={car.model} className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span>{car.rego} • {car.make} {car.model}</span>
                            </div>
                            <div className="text-xs text-[#6B7280] mb-2 capitalize">
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
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-[#1A1A1D] mb-1 text-sm">All clean!</h3>
                    <p className="text-xs text-[#6B7280]">No vehicles in queue</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* On Hold */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#F8F9FA] to-white px-6 py-4 border-b border-[#E5E7EB]/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#1A1A1D] flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    On Hold
                  </h2>
                  <div className="w-5 h-5 bg-[#E5E7EB] rounded-full flex items-center justify-center">
                    <span className="text-xs text-[#1A1A1D] font-semibold">{holdItems.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {holdItems.length > 0 ? (
                  <div className="space-y-3">
                    {holdItems
                      .filter(item => cars.find(c => c.id === item.carId))
                      .map(item => {
                        const car = cars.find(c => c.id === item.carId)!;
                        const daysSince = Math.floor((today.getTime() - new Date(item.since).getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div key={item.id} className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-3">
                            <div className="flex items-center gap-1.5 font-mono text-xs text-[#1A1A1D] mb-1 font-medium">
                              <CarIcon model={car.model} className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span>{car.rego} • {car.model}</span>
                            </div>
                            <div className="text-xs text-[#6B7280] mb-2">
                              {item.reason} • {daysSince} days
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-end text-xs"
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
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-[#1A1A1D] mb-1 text-sm">All resolved!</h3>
                    <p className="text-xs text-[#6B7280]">No vehicles on hold</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <CheckOutModal 
        isOpen={showCheckOut}
        onClose={() => {
          setShowCheckOut(false);
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