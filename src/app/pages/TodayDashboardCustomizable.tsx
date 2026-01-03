import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  Plus, Search, Bell, Calendar, Clock, TrendingUp, AlertCircle, CheckCircle2,
  Sparkles, Filter, ArrowRight, MapPin, User, Phone, Settings, Lock, Unlock,
  RotateCcw, Save, Eye, EyeOff, Maximize2, Minimize2
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { KPICard } from '../components/KPICard';
import { CarTile } from '../components/CarTile';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { CarIcon } from '../components/CarIcon';
import { CheckOutModal } from './CheckOutModal';
import { Toast } from '../components/Toast';
import { LiveFleetMap } from '../components/LiveFleetMap';

// Layout configuration stored in localStorage
const STORAGE_KEY = 'fleetCommandDashboardLayout';

const defaultLayout = [
  { i: 'kpis', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 2 },
  { i: 'map', x: 0, y: 3, w: 12, h: 8, minW: 6, minH: 6 },
  { i: 'available', x: 0, y: 11, w: 8, h: 8, minW: 4, minH: 5 },
  { i: 'returns', x: 0, y: 19, w: 8, h: 8, minW: 4, minH: 5 },
  { i: 'cleaning', x: 8, y: 11, w: 4, h: 8, minW: 3, minH: 5 },
  { i: 'holds', x: 8, y: 19, w: 4, h: 8, minW: 3, minH: 5 },
];

export function TodayDashboard() {
  const { cars, loans, cleaningJobs, holdItems, resolveHold } = useFleet();
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'today'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState(defaultLayout);
  const [hiddenWidgets, setHiddenWidgets] = useState<Set<string>>(new Set());

  const today = new Date('2025-01-04');

  // Load saved layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLayout(parsed.layout || defaultLayout);
        setHiddenWidgets(new Set(parsed.hidden || []));
      } catch (e) {
        console.error('Failed to load layout:', e);
      }
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = () => {
    const data = {
      layout,
      hidden: Array.from(hiddenWidgets),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setToast({ message: 'Dashboard layout saved!', type: 'success' });
  };

  // Reset layout to default
  const resetLayout = () => {
    setLayout(defaultLayout);
    setHiddenWidgets(new Set());
    localStorage.removeItem(STORAGE_KEY);
    setToast({ message: 'Dashboard reset to default', type: 'success' });
  };

  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    setHiddenWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  // Get visible layout
  const visibleLayout = layout.filter(item => !hiddenWidgets.has(item.i));

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

  // Filter returns by search
  const filteredReturns = dueTodayAndOverdue.filter(loan => {
    if (searchQuery === '') return true;
    const car = cars.find(c => c.id === loan.carId);
    if (!car) return false;
    return (
      car.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter cleaning jobs by search
  const filteredCleaningJobs = cleaningJobs.filter(job => {
    if (searchQuery === '') return true;
    const car = cars.find(c => c.id === job.carId);
    if (!car) return false;
    return (
      car.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter hold items by search
  const filteredHoldItems = holdItems.filter(item => {
    if (searchQuery === '') return true;
    const car = cars.find(c => c.id === item.carId);
    if (!car) return false;
    return (
      car.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCheckOut = () => {
    if (selectedCarId) {
      setShowCheckOut(true);
    }
  };

  // Widget components
  const widgets = {
    kpis: (
      <div className="h-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 p-4 overflow-auto">
        <div className={isEditMode ? 'drag-handle cursor-move mb-4 p-2 bg-[#F97066]/10 rounded-lg flex items-center gap-2' : 'hidden'}>
          <Settings className="w-4 h-4 text-[#F97066]" />
          <span className="text-sm font-medium text-[#F97066]">Drag to reposition</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="group bg-white border-l-2 border-l-emerald-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <TrendingUp className="w-3 h-3 text-[#9CA3AF]" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#1A1A1D] mb-1">{availableCars.length}</div>
            <div className="text-xs font-medium text-[#6B7280] mb-1">Ready to Go</div>
            <div className="text-[10px] text-[#9CA3AF]">+3 from yesterday</div>
          </div>

          <div className="group bg-white border-l-2 border-l-blue-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-[10px] font-mono text-[#6B7280] bg-[#F8F9FA] px-1.5 py-0.5 rounded">{Math.round((outCars.length / cars.length) * 100)}%</div>
            </div>
            <div className="font-mono text-3xl font-bold text-[#1A1A1D] mb-1">{outCars.length}</div>
            <div className="text-xs font-medium text-[#6B7280] mb-1">Currently Out</div>
            <div className="text-[10px] text-[#9CA3AF]">On loan to customers</div>
          </div>

          <div className="group bg-white border-l-2 border-l-amber-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              {dueToday.length > 0 && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />}
            </div>
            <div className="font-mono text-3xl font-bold text-[#1A1A1D] mb-1">{dueToday.length}</div>
            <div className="text-xs font-medium text-[#6B7280] mb-1">Due Today</div>
            <div className="text-[10px] text-[#9CA3AF]">Expected returns</div>
          </div>

          <div className="group bg-white border-l-2 border-l-red-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              {overdue.length > 0 && (
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                </div>
              )}
            </div>
            <div className="font-mono text-3xl font-bold text-[#1A1A1D] mb-1">{overdue.length}</div>
            <div className="text-xs font-medium text-[#6B7280] mb-1">Overdue</div>
            <div className="text-[10px] text-[#9CA3AF]">Requires attention</div>
          </div>

          <div className="group bg-white border-l-2 border-l-cyan-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 bg-cyan-50 rounded-lg flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                <Sparkles className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-[10px] font-mono text-[#6B7280] bg-[#F8F9FA] px-1.5 py-0.5 rounded">{cleaningJobs.length}</div>
            </div>
            <div className="font-mono text-3xl font-bold text-[#1A1A1D] mb-1">{cleaningCars.length}</div>
            <div className="text-xs font-medium text-[#6B7280] mb-1">In Cleaning</div>
            <div className="text-[10px] text-[#9CA3AF]">{cleaningJobs.filter(j => j.priority === 'urgent').length} urgent</div>
          </div>
        </div>
      </div>
    ),
    map: (
      <div className="h-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 p-6 overflow-hidden flex flex-col">
        <div className={isEditMode ? 'drag-handle cursor-move mb-4 p-2 bg-[#F97066]/10 rounded-lg flex items-center gap-2' : 'hidden'}>
          <Settings className="w-4 h-4 text-[#F97066]" />
          <span className="text-sm font-medium text-[#F97066]">Drag to reposition • Drag corner to resize</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1D] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              Live Fleet Tracking
            </h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Real-time GPS location of all active loan vehicles
            </p>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <LiveFleetMap />
        </div>
      </div>
    ),
    available: (
      <div className="h-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden flex flex-col">
        <div className={isEditMode ? 'drag-handle cursor-move p-2 bg-[#F97066]/10 flex items-center gap-2' : 'hidden'}>
          <Settings className="w-4 h-4 text-[#F97066]" />
          <span className="text-sm font-medium text-[#F97066]">Drag to reposition</span>
        </div>
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
            <button className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {filteredAvailableCars.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredAvailableCars.slice(0, 12).map(car => (
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
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="font-semibold text-[#1A1A1D] mb-1">No vehicles found</h3>
                <p className="text-sm text-[#6B7280]">Try adjusting your search</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    returns: (
      <div className="h-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden flex flex-col">
        <div className={isEditMode ? 'drag-handle cursor-move p-2 bg-[#F97066]/10 flex items-center gap-2' : 'hidden'}>
          <Settings className="w-4 h-4 text-[#F97066]" />
          <span className="text-sm font-medium text-[#F97066]">Drag to reposition</span>
        </div>
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

        <div className="flex-1 overflow-auto p-6">
          {filteredReturns.length > 0 ? (
            <div className="space-y-2">
              {filteredReturns.slice(0, 5).map(loan => {
                const car = cars.find(c => c.id === loan.carId);
                if (!car) return null;
                const dueTime = new Date(loan.dueBack);
                const isLate = dueTime < today;

                return (
                  <div
                    key={loan.id}
                    className={`group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${isLate
                      ? 'bg-red-50 border-red-200 hover:border-red-300'
                      : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                      }`}
                  >
                    <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl ${isLate ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                      <div className={`text-xs uppercase tracking-wide font-semibold ${isLate ? 'text-red-700' : 'text-amber-700'
                        }`}>
                        {isLate ? 'Late' : 'Due'}
                      </div>
                      <div className={`font-mono text-lg font-bold ${isLate ? 'text-red-600' : 'text-amber-600'
                        }`}>
                        {dueTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CarIcon model={car.model} className="w-4 h-4 text-[#9CA3AF]" />
                        <span className="font-mono font-bold text-[#1A1A1D]">{car.rego}</span>
                        <span className="text-sm text-[#6B7280]">•</span>
                        <span className="text-sm text-[#6B7280] truncate">{car.make} {car.model}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#6B7280] truncate">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{loan.customer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-[#1A1A1D] mb-1">All clear!</h3>
                <p className="text-sm text-[#6B7280]">No vehicles due back today</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    cleaning: (
      <div className="h-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden flex flex-col">
        <div className={isEditMode ? 'drag-handle cursor-move p-2 bg-[#F97066]/10 flex items-center gap-2' : 'hidden'}>
          <Settings className="w-4 h-4 text-[#F97066]" />
          <span className="text-sm font-medium text-[#F97066]">Drag to reposition</span>
        </div>
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

        <div className="flex-1 overflow-auto p-6">
          {filteredCleaningJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredCleaningJobs
                .filter(job => cars.find(c => c.id === job.carId))
                .slice(0, 8)
                .map(job => {
                  const car = cars.find(c => c.id === job.carId)!;

                  return (
                    <div
                      key={job.id}
                      className={`bg-[#F8F9FA] border-l-4 rounded-lg p-3 ${job.priority === 'urgent' ? 'border-l-[#EF4444]' : 'border-l-[#3B82F6]'
                        }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#1A1A1D] mb-1 font-medium truncate">
                        <CarIcon model={car.model} className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                        <span className="truncate">{car.rego} • {car.make} {car.model}</span>
                      </div>
                      <div className="text-xs text-[#6B7280] mb-2 capitalize">
                        {job.type === 'full' ? 'Interior + Exterior' : job.type}
                      </div>
                      <div className="flex items-center justify-between">
                        <StatusBadge variant={job.priority === 'urgent' ? 'overdue' : 'ok'}>
                          {job.priority === 'urgent' ? '● Urgent' : '○ Normal'}
                        </StatusBadge>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-[#1A1A1D] mb-1 text-sm">All clean!</h3>
                <p className="text-xs text-[#6B7280]">No vehicles in queue</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    holds: (
      <div className="h-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB]/50 overflow-hidden flex flex-col">
        <div className={isEditMode ? 'drag-handle cursor-move p-2 bg-[#F97066]/10 flex items-center gap-2' : 'hidden'}>
          <Settings className="w-4 h-4 text-[#F97066]" />
          <span className="text-sm font-medium text-[#F97066]">Drag to reposition</span>
        </div>
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

        <div className="flex-1 overflow-auto p-6">
          {filteredHoldItems.length > 0 ? (
            <div className="space-y-3">
              {filteredHoldItems
                .filter(item => cars.find(c => c.id === item.carId))
                .slice(0, 8)
                .map(item => {
                  const car = cars.find(c => c.id === item.carId)!;
                  const daysSince = Math.floor((today.getTime() - new Date(item.since).getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={item.id} className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#1A1A1D] mb-1 font-medium truncate">
                        <CarIcon model={car.model} className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                        <span className="truncate">{car.rego} • {car.model}</span>
                      </div>
                      <div className="text-xs text-[#6B7280] mb-2 truncate">
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
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-[#1A1A1D] mb-1 text-sm">All good!</h3>
                <p className="text-xs text-[#6B7280]">No vehicles on hold</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="px-8 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold text-[#1A1A1D] mb-0.5">Today's Dashboard</h1>
              <p className="text-xs text-[#6B7280] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Saturday, 4 January 2025
                <span className="ml-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  11:30 AM
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Edit Mode Toggle */}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isEditMode
                  ? 'bg-[#F97066] text-white shadow-lg'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#F97066] hover:text-[#F97066]'
                  }`}
              >
                {isEditMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span className="text-xs font-medium">
                  {isEditMode ? 'Edit Mode' : 'Customize'}
                </span>
              </button>

              {isEditMode && (
                <>
                  <button
                    onClick={saveLayout}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-xs font-medium">Save</span>
                  </button>
                  <button
                    onClick={resetLayout}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F8F9FA] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-xs font-medium">Reset</span>
                  </button>
                </>
              )}

              <button className="relative p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                <Bell className="w-4 h-4 text-[#6B7280]" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
                <div className="w-6 h-6 bg-[#E5E7EB] rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-[#1A1A1D]">O</span>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#1A1A1D]">Oliver</div>
                  <div className="text-[10px] text-[#6B7280]">Manager</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search vehicles by rego, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm text-[#1A1A1D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg p-0.5">
              {(['all', 'urgent', 'today'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${activeFilter === filter
                    ? 'bg-[#F8F9FA] text-[#1A1A1D] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1A1A1D]'
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
              className="bg-[#3B82F6] hover:bg-[#2563EB] shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Check Out Vehicle
            </Button>
          </div>
        </div>

        {/* Widget Visibility Controls */}
        {isEditMode && (
          <div className="px-8 py-3 bg-[#F97066]/5 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1A1A1D]">Toggle Widgets:</span>
              {['kpis', 'map', 'available', 'returns', 'cleaning', 'holds'].map((widgetId) => (
                <button
                  key={widgetId}
                  onClick={() => toggleWidget(widgetId)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${hiddenWidgets.has(widgetId)
                    ? 'bg-white border border-[#E5E7EB] text-[#6B7280]'
                    : 'bg-[#F97066] text-white'
                    }`}
                >
                  {hiddenWidgets.has(widgetId) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {widgetId === 'kpis' && 'KPIs'}
                  {widgetId === 'map' && 'Live Map'}
                  {widgetId === 'available' && 'Available'}
                  {widgetId === 'returns' && 'Returns'}
                  {widgetId === 'cleaning' && 'Cleaning'}
                  {widgetId === 'holds' && 'Holds'}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        <GridLayout
          className="layout"
          layout={visibleLayout}
          cols={12}
          rowHeight={60}
          width={1200}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          draggableHandle={isEditMode ? '.drag-handle' : undefined}
          compactType="vertical"
        >
          {visibleLayout.map((item) => (
            <div key={item.i} className={isEditMode ? 'grid-item-editable' : ''}>
              {widgets[item.i as keyof typeof widgets]}
            </div>
          ))}
        </GridLayout>
      </main>

      {/* Modals & Toasts */}
      {showCheckOut && selectedCarId && (
        <CheckOutModal
          carId={selectedCarId}
          onClose={() => {
            setShowCheckOut(false);
            setSelectedCarId(null);
          }}
        />
      )}

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
