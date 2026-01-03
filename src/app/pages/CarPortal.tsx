import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { CarIcon } from '../components/CarIcon';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Wrench, 
  Shield, 
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Plus,
  Edit,
  Fuel,
  Gauge,
  Hash,
  Zap,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface CarPortalProps {
  carId: string;
  onClose: () => void;
}

export function CarPortal({ carId, onClose }: CarPortalProps) {
  const { cars, loans, insurance, serviceRecords, carNotes, activityLogs, addNote } = useFleet();
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'service' | 'insurance' | 'notes' | 'activity'>('overview');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<'general' | 'damage' | 'maintenance' | 'customer'>('general');
  
  const car = cars.find(c => c.id === carId);
  const carInsurance = insurance.find(ins => ins.carId === carId);
  const carServiceRecords = serviceRecords.filter(srv => srv.carId === carId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const carLoans = loans.filter(loan => loan.carId === carId).sort((a, b) => 
    new Date(b.checkedOut).getTime() - new Date(a.checkedOut).getTime()
  );
  const carNotesList = carNotes.filter(note => note.carId === carId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const carActivityLogs = activityLogs.filter(log => log.carId === carId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (!car) return null;
  
  const today = new Date();
  const regoExpiryDate = new Date(car.regoExpiry);
  const daysToRegoExpiry = Math.ceil((regoExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isRegoExpiringSoon = daysToRegoExpiry <= 30 && daysToRegoExpiry > 0;
  const isRegoExpired = daysToRegoExpiry < 0;
  
  const insuranceExpiryDate = carInsurance ? new Date(carInsurance.expiryDate) : null;
  const daysToInsuranceExpiry = insuranceExpiryDate ? Math.ceil((insuranceExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isInsuranceExpiringSoon = daysToInsuranceExpiry !== null && daysToInsuranceExpiry <= 30 && daysToInsuranceExpiry > 0;
  
  const totalLoans = carLoans.length;
  const completedLoans = carLoans.filter(loan => loan.returnedAt).length;
  const activeLoans = carLoans.filter(loan => !loan.returnedAt).length;
  
  const totalServiceCost = carServiceRecords.reduce((sum, srv) => sum + (srv.cost || 0), 0);
  
  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addNote(carId, newNoteContent, newNoteType);
      setNewNoteContent('');
      setNewNoteType('general');
    }
  };
  
  const getStatusColor = (status: typeof car.status) => {
    switch (status) {
      case 'available':
        return 'bg-[#10B981] text-white';
      case 'out':
        return 'bg-[#3B82F6] text-white';
      case 'cleaning':
        return 'bg-[#6B7280] text-white';
      case 'hold':
        return 'bg-[#F59E0B] text-white';
      case 'service':
        return 'bg-[#EF4444] text-white';
      default:
        return 'bg-[#6B7280] text-white';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#F8F9FA] rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#DEE2E6] px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F97066] to-[#FDA29B] flex items-center justify-center">
                <CarIcon model={car.model} className="w-9 h-9 text-white" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-semibold text-[#212529]">{car.rego}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.status)}`}>
                    {car.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-lg text-[#495057] mb-2">
                  {car.year} {car.make} {car.model}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6C757D]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border-2 border-[#ADB5BD]" style={{ backgroundColor: car.colorHex }} />
                    <span className="capitalize">{car.color}</span>
                  </div>
                  {car.bay && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{car.bay}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F1F3F5] transition-colors"
            >
              <X className="w-6 h-6 text-[#495057]" />
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-[#FFF5F5] border border-[#F97066]/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#6C757D]">Total Loans</span>
                <FileText className="w-4 h-4 text-[#F97066]" />
              </div>
              <div className="text-2xl font-semibold text-[#212529]">{totalLoans}</div>
              <div className="text-xs text-[#6C757D] mt-1">{activeLoans} active</div>
            </div>
            
            <div className={`rounded-lg p-4 ${isRegoExpired ? 'bg-red-50 border border-red-200' : isRegoExpiringSoon ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#6C757D]">Rego Expiry</span>
                <Calendar className={`w-4 h-4 ${isRegoExpired ? 'text-red-600' : isRegoExpiringSoon ? 'text-amber-600' : 'text-green-600'}`} />
              </div>
              <div className="text-lg font-semibold text-[#212529]">
                {new Date(car.regoExpiry).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div className={`text-xs mt-1 ${isRegoExpired ? 'text-red-600' : isRegoExpiringSoon ? 'text-amber-600' : 'text-green-600'}`}>
                {isRegoExpired ? 'EXPIRED' : `${daysToRegoExpiry} days`}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#6C757D]">Insurance</span>
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-[#212529]">
                {carInsurance ? carInsurance.provider.split(' ')[0] : 'No Policy'}
              </div>
              <div className={`text-xs mt-1 ${isInsuranceExpiringSoon ? 'text-amber-600' : 'text-blue-600'}`}>
                {carInsurance ? (isInsuranceExpiringSoon ? `${daysToInsuranceExpiry} days` : 'Active') : 'Not set'}
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#6C757D]">Service Cost</span>
                <Wrench className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-lg font-semibold text-[#212529]">
                ${totalServiceCost.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 mt-1">{carServiceRecords.length} records</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border-b border-[#DEE2E6] px-8">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'loans', label: 'Loan History' },
              { id: 'service', label: 'Service Records' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'notes', label: 'Notes' },
              { id: 'activity', label: 'Activity Log' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#F97066]'
                    : 'text-[#6C757D] hover:text-[#495057]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97066]" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Current State Cards */}
              <div className="grid grid-cols-3 gap-4">
                {/* Odometer */}
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-blue-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div className="text-sm text-[#6C757D] mb-1">Odometer</div>
                  <div className="text-2xl font-semibold font-mono text-[#212529]">
                    {car.odometer ? car.odometer.toLocaleString() : '—'} km
                  </div>
                  <div className="text-xs text-[#6C757D] mt-2">Last updated today</div>
                </div>
                
                {/* Fuel Type */}
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Fuel className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-sm text-[#6C757D] mb-1">Fuel Type</div>
                  <div className="text-2xl font-semibold text-[#212529]">
                    {car.fuelType || 'Petrol'}
                  </div>
                  <div className="text-xs text-[#6C757D] mt-2">
                    {car.transmission || 'Automatic'}
                  </div>
                </div>
                
                {/* VIN */}
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-sm text-[#6C757D] mb-1">VIN Number</div>
                  <div className="text-lg font-semibold font-mono text-[#212529] truncate">
                    {car.vin || 'Not recorded'}
                  </div>
                  {car.vin && (
                    <div className="text-xs text-[#6C757D] mt-2">Vehicle ID</div>
                  )}
                </div>
              </div>
              
              {/* Current State Alert */}
              {car.status === 'out' && activeLoans > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#212529] mb-1">Currently On Loan</h4>
                      <div className="text-sm text-[#495057]">
                        Customer: <span className="font-medium">{carLoans[0]?.customer}</span>
                        {carLoans[0]?.driver && carLoans[0].driver !== carLoans[0].customer && (
                          <> • Driver: <span className="font-medium">{carLoans[0].driver}</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-[#6C757D]">Checked out:</span>
                          <span className="ml-1 font-medium text-[#212529]">
                            {new Date(carLoans[0]?.checkedOut).toLocaleDateString('en-AU', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6C757D]">Due back:</span>
                          <span className="ml-1 font-medium text-[#212529]">
                            {new Date(carLoans[0]?.dueBack).toLocaleDateString('en-AU', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {car.status === 'hold' && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#212529] mb-1">Vehicle On Hold</h4>
                      <div className="text-sm text-[#495057]">
                        This vehicle is currently unavailable and requires attention before it can be loaned out.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {car.status === 'service' && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#212529] mb-1">In Service</h4>
                      <div className="text-sm text-[#495057]">
                        This vehicle is currently being serviced and is not available for loan.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {car.status === 'cleaning' && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#212529] mb-1">Being Cleaned</h4>
                      <div className="text-sm text-[#495057]">
                        This vehicle is currently in the cleaning queue and will be available soon.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {car.status === 'available' && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#212529] mb-1">Available for Loan</h4>
                      <div className="text-sm text-[#495057]">
                        This vehicle is ready and available to be loaned out to customers.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Vehicle Details */}
              <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                <h3 className="font-semibold text-[#212529] mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#6C757D]" />
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Registration</div>
                    <div className="font-mono font-semibold text-[#212529]">{car.rego}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Make & Model</div>
                    <div className="font-semibold text-[#212529]">{car.year} {car.make} {car.model}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Color</div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded border border-[#DEE2E6]" style={{ backgroundColor: car.colorHex }} />
                      <span className="font-semibold text-[#212529] capitalize">{car.color}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Bay Location</div>
                    <div className="font-semibold text-[#212529]">{car.bay || 'Not assigned'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Fuel Type</div>
                    <div className="font-semibold text-[#212529]">{car.fuelType || 'Petrol'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Transmission</div>
                    <div className="font-semibold text-[#212529]">{car.transmission || 'Automatic'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6C757D] mb-1">Registration Expiry</div>
                    <div className="font-semibold text-[#212529]">
                      {new Date(car.regoExpiry).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {isRegoExpiringSoon && (
                        <span className="ml-2 text-xs text-amber-600 font-normal">({daysToRegoExpiry} days)</span>
                      )}
                      {isRegoExpired && (
                        <span className="ml-2 text-xs text-red-600 font-normal">(EXPIRED)</span>
                      )}
                    </div>
                  </div>
                  {car.vin && (
                    <div className="col-span-2">
                      <div className="text-sm text-[#6C757D] mb-1">VIN Number</div>
                      <div className="font-mono font-semibold text-[#212529]">{car.vin}</div>
                    </div>
                  )}
                  {car.odometer && (
                    <div>
                      <div className="text-sm text-[#6C757D] mb-1">Current Odometer</div>
                      <div className="font-mono font-semibold text-[#212529]">{car.odometer.toLocaleString()} km</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#212529] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#6C757D]" />
                    Recent Activity
                  </h3>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {carActivityLogs.slice(0, 5).length === 0 ? (
                    <div className="text-center py-8 text-[#6C757D]">
                      No activity recorded yet
                    </div>
                  ) : (
                    carActivityLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-[#F1F3F5] last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          log.action === 'checked-out' ? 'bg-blue-100' :
                          log.action === 'checked-in' ? 'bg-green-100' :
                          log.action === 'cleaned' ? 'bg-purple-100' :
                          log.action === 'serviced' ? 'bg-orange-100' :
                          'bg-gray-100'
                        }`}>
                          {log.action === 'checked-out' && <User className="w-4 h-4 text-blue-600" />}
                          {log.action === 'checked-in' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {log.action === 'cleaned' && <CheckCircle className="w-4 h-4 text-purple-600" />}
                          {log.action === 'serviced' && <Wrench className="w-4 h-4 text-orange-600" />}
                          {log.action === 'hold' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#212529]">{log.description}</div>
                          <div className="text-xs text-[#6C757D] mt-0.5">
                            {new Date(log.timestamp).toLocaleString('en-AU', { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })} • {log.user}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'loans' && (
            <div className="space-y-4">
              {carLoans.length === 0 ? (
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-12 text-center">
                  <FileText className="w-12 h-12 text-[#ADB5BD] mx-auto mb-3" />
                  <div className="text-[#6C757D]">No loan history</div>
                </div>
              ) : (
                carLoans.map(loan => (
                  <div key={loan.id} className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-[#212529] mb-1">{loan.customer}</div>
                        {loan.driver && loan.driver !== loan.customer && (
                          <div className="text-sm text-[#6C757D]">Driver: {loan.driver}</div>
                        )}
                      </div>
                      {loan.returnedAt ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Returned
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-[#6C757D] mb-1">Checked Out</div>
                        <div className="text-[#212529] font-medium">
                          {new Date(loan.checkedOut).toLocaleString('en-AU', { 
                            day: 'numeric', 
                            month: 'short', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[#6C757D] mb-1">Due Back</div>
                        <div className="text-[#212529] font-medium">
                          {new Date(loan.dueBack).toLocaleString('en-AU', { 
                            day: 'numeric', 
                            month: 'short', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      {loan.returnedAt && (
                        <div>
                          <div className="text-[#6C757D] mb-1">Returned</div>
                          <div className="text-[#212529] font-medium">
                            {new Date(loan.returnedAt).toLocaleString('en-AU', { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'service' && (
            <div className="space-y-4">
              {carServiceRecords.length === 0 ? (
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-12 text-center">
                  <Wrench className="w-12 h-12 text-[#ADB5BD] mx-auto mb-3" />
                  <div className="text-[#6C757D]">No service records</div>
                </div>
              ) : (
                carServiceRecords.map(record => (
                  <div key={record.id} className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-[#212529] mb-1">{record.description}</div>
                        {record.provider && (
                          <div className="text-sm text-[#6C757D]">{record.provider}</div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.type === 'routine' ? 'bg-blue-100 text-blue-700' :
                        record.type === 'repair' ? 'bg-orange-100 text-orange-700' :
                        record.type === 'inspection' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-[#6C757D] mb-1">Date</div>
                        <div className="text-[#212529] font-medium">
                          {new Date(record.date).toLocaleDateString('en-AU', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                      {record.odometer && (
                        <div>
                          <div className="text-[#6C757D] mb-1">Odometer</div>
                          <div className="text-[#212529] font-medium">{record.odometer.toLocaleString()} km</div>
                        </div>
                      )}
                      {record.cost && (
                        <div>
                          <div className="text-[#6C757D] mb-1">Cost</div>
                          <div className="text-[#212529] font-medium">${record.cost}</div>
                        </div>
                      )}
                      {record.nextDue && (
                        <div>
                          <div className="text-[#6C757D] mb-1">Next Due</div>
                          <div className="text-[#212529] font-medium">
                            {new Date(record.nextDue).toLocaleDateString('en-AU', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'insurance' && (
            <div>
              {carInsurance ? (
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-[#212529] text-lg mb-1">{carInsurance.provider}</h3>
                      <div className="text-sm text-[#6C757D]">Policy #{carInsurance.policyNumber}</div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-[#6C757D] mb-2">Coverage Type</div>
                      <div className="font-semibold text-[#212529]">{carInsurance.coverageType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#6C757D] mb-2">Annual Premium</div>
                      <div className="font-semibold text-[#212529]">${carInsurance.premium.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#6C757D] mb-2">Expiry Date</div>
                      <div className="font-semibold text-[#212529]">
                        {new Date(carInsurance.expiryDate).toLocaleDateString('en-AU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                      {isInsuranceExpiringSoon && (
                        <div className="text-sm text-amber-600 mt-1">Expires in {daysToInsuranceExpiry} days</div>
                      )}
                    </div>
                  </div>
                  
                  {carInsurance.notes && (
                    <div className="mt-6 pt-6 border-t border-[#DEE2E6]">
                      <div className="text-sm text-[#6C757D] mb-2">Notes</div>
                      <div className="text-[#212529]">{carInsurance.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-12 text-center">
                  <Shield className="w-12 h-12 text-[#ADB5BD] mx-auto mb-3" />
                  <div className="text-[#6C757D] mb-4">No insurance policy on record</div>
                  <Button>
                    <Plus className="w-4 h-4" />
                    Add Insurance
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                <h3 className="font-semibold text-[#212529] mb-4">Add New Note</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {(['general', 'damage', 'maintenance', 'customer'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewNoteType(type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          newNoteType === type
                            ? 'bg-[#F97066] text-white'
                            : 'bg-[#F1F3F5] text-[#6C757D] hover:bg-[#E9ECEF]'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Enter note..."
                    className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg bg-white text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-[#F97066] focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddNote} disabled={!newNoteContent.trim()}>
                      <Plus className="w-4 h-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Notes List */}
              {carNotesList.length === 0 ? (
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-12 text-center">
                  <FileText className="w-12 h-12 text-[#ADB5BD] mx-auto mb-3" />
                  <div className="text-[#6C757D]">No notes yet</div>
                </div>
              ) : (
                carNotesList.map(note => (
                  <div key={note.id} className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        note.type === 'damage' ? 'bg-red-100 text-red-700' :
                        note.type === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                        note.type === 'customer' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                      </span>
                      <div className="text-sm text-[#6C757D]">
                        {new Date(note.createdAt).toLocaleDateString('en-AU', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="text-[#212529] mb-2">{note.content}</div>
                    <div className="text-sm text-[#6C757D]">By {note.createdBy}</div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {carActivityLogs.length === 0 ? (
                <div className="bg-white border border-[#DEE2E6] rounded-xl p-12 text-center">
                  <Clock className="w-12 h-12 text-[#ADB5BD] mx-auto mb-3" />
                  <div className="text-[#6C757D]">No activity</div>
                </div>
              ) : (
                carActivityLogs.map(log => (
                  <div key={log.id} className="bg-white border border-[#DEE2E6] rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        log.action === 'checked-out' ? 'bg-blue-100' :
                        log.action === 'checked-in' ? 'bg-green-100' :
                        log.action === 'cleaned' ? 'bg-purple-100' :
                        log.action === 'serviced' ? 'bg-orange-100' :
                        log.action === 'hold' ? 'bg-amber-100' :
                        'bg-gray-100'
                      }`}>
                        {log.action === 'checked-out' && <User className="w-5 h-5 text-blue-600" />}
                        {log.action === 'checked-in' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {log.action === 'cleaned' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                        {log.action === 'serviced' && <Wrench className="w-5 h-5 text-orange-600" />}
                        {log.action === 'hold' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                        {log.action === 'released' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-medium text-[#212529]">{log.description}</div>
                          <div className="text-sm text-[#6C757D]">
                            {new Date(log.timestamp).toLocaleString('en-AU', { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        <div className="text-sm text-[#6C757D]">By {log.user}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}