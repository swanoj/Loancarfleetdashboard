import React, { useState } from 'react';
import { Search, ChevronDown, AlertTriangle, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { StatusBadge } from '../components/StatusBadge';
import { CarIcon } from '../components/CarIcon';
import { CarPortal } from './CarPortal';
import { VehicleFormModal } from '../components/VehicleFormModal';
import { CSVImportModal } from '../components/CSVImportModal';
import { Car } from '../data/mockData';

export function FleetManagement() {
  const { cars, addCar, updateCar, deleteCar, loading } = useFleet();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'rego' | 'make' | 'status' | 'expiry'>('rego');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  
  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const isExpiryWarning = (expiryDate: string) => {
    const today = new Date('2025-01-04');
    const expiry = new Date(expiryDate);
    const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil < 30;
  };
  
  const isExpiryCritical = (expiryDate: string) => {
    const today = new Date('2025-01-04');
    const expiry = new Date(expiryDate);
    const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil < 7;
  };
  
  const filteredCars = cars
    .filter(car => {
      if (statusFilter !== 'all' && car.status !== statusFilter) return false;
      if (searchQuery && !car.rego.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !car.make.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !car.model.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortField) {
        case 'rego':
          aVal = a.rego;
          bVal = b.rego;
          break;
        case 'make':
          aVal = `${a.make} ${a.model}`;
          bVal = `${b.make} ${b.model}`;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'expiry':
          aVal = new Date(a.regoExpiry).getTime();
          bVal = new Date(b.regoExpiry).getTime();
          break;
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="px-6 py-3">
          <h1 className="text-xl font-semibold text-[#1A1A1D] mb-3">Fleet Management</h1>
          
          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 pr-10 text-[#1A1A1D] text-sm focus:outline-none focus:border-[#F97066] focus:ring-2 focus:ring-[#F9706620]"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="out">Out</option>
                <option value="hold">Hold</option>
                <option value="service">Service</option>
                <option value="cleaning">Cleaning</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search by rego, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-[#1A1A1D] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97066] focus:ring-2 focus:ring-[#F9706620]"
              />
            </div>
            
            <div className="text-sm text-[#6B7280] font-medium">
              {filteredCars.length} vehicles
            </div>
          </div>
        </div>
      </header>
      
      {/* Table */}
      <main className="px-6 py-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th 
                    className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#9CA3AF] font-medium cursor-pointer hover:text-[#6B7280]"
                    onClick={() => handleSort('rego')}
                  >
                    Rego {sortField === 'rego' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#9CA3AF] font-medium cursor-pointer hover:text-[#6B7280]"
                    onClick={() => handleSort('make')}
                  >
                    Make/Model {sortField === 'make' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#9CA3AF] font-medium cursor-pointer hover:text-[#6B7280]"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#9CA3AF] font-medium">
                    Bay
                  </th>
                  <th 
                    className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#9CA3AF] font-medium cursor-pointer hover:text-[#6B7280]"
                    onClick={() => handleSort('expiry')}
                  >
                    Rego Expiry {sortField === 'expiry' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#9CA3AF] font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car, index) => {
                  const expiryDate = new Date(car.regoExpiry);
                  const isWarning = isExpiryWarning(car.regoExpiry);
                  const isCritical = isExpiryCritical(car.regoExpiry);
                  
                  return (
                    <tr 
                      key={car.id}
                      className="border-t border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                    >
                      <td 
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedCarId(car.id)}
                      >
                        <div className="flex items-center gap-2">
                          <CarIcon model={car.model} className="w-4 h-4 text-[#9CA3AF]" />
                          <span className="font-mono text-[#1A1A1D] font-medium">{car.rego}</span>
                        </div>
                      </td>
                      <td 
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedCarId(car.id)}
                      >
                        <div className="text-[#1A1A1D] font-medium">{car.make} {car.model}</div>
                        <div className="text-sm text-[#6B7280] flex items-center gap-2 mt-0.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.colorHex }} />
                          {car.year} • {car.color}
                        </div>
                      </td>
                      <td 
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedCarId(car.id)}
                      >
                        <StatusBadge variant={car.status}>
                          {car.status === 'available' ? 'Available' : 
                           car.status === 'out' ? 'Out' :
                           car.status === 'hold' ? 'Hold' :
                           car.status === 'service' ? 'Service' :
                           'Cleaning'}
                        </StatusBadge>
                      </td>
                      <td 
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedCarId(car.id)}
                      >
                        <span className="text-[#6B7280]">{car.bay || '—'}</span>
                      </td>
                      <td 
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedCarId(car.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            isCritical ? 'text-[#EF4444] font-semibold' :
                            isWarning ? 'text-[#F59E0B] font-semibold' :
                            'text-[#6B7280]'
                          }`}>
                            {expiryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                          {isCritical && <AlertTriangle className="w-4 h-4 text-[#EF4444]" />}
                          {isWarning && !isCritical && <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCar(car);
                              setModalMode('edit');
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                            title="Edit vehicle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete ${car.rego}?`)) {
                                deleteCar(car.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7280] hover:text-[#EF4444] transition-colors"
                            title="Delete vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Car Portal */}
      {selectedCarId && (
        <CarPortal
          carId={selectedCarId}
          onClose={() => setSelectedCarId(null)}
        />
      )}
      
      {/* Add/Edit Vehicle Modal */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCar(undefined);
        }}
        vehicle={editingCar}
        mode={modalMode}
        onSave={(car) => {
          if (modalMode === 'create') {
            addCar(car);
          } else if (modalMode === 'edit' && editingCar) {
            updateCar(editingCar.id, car);
          }
          setIsModalOpen(false);
          setEditingCar(undefined);
        }}
      />
      
      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImport={(cars) => {
          cars.forEach(car => addCar(car));
          setIsCSVModalOpen(false);
        }}
      />
      
      {/* Add Vehicle Button */}
      <button
        className="fixed bottom-4 right-4 bg-[#F97066] text-white rounded-full p-3 shadow-lg hover:bg-[#F85F53] transition-colors"
        onClick={() => {
          setModalMode('create');
          setEditingCar(undefined);
          setIsModalOpen(true);
        }}
      >
        <Plus className="w-5 h-5" />
      </button>
      
      {/* Import CSV Button */}
      <button
        className="fixed bottom-4 left-4 bg-white border border-[#E5E7EB] text-[#1A1A1D] rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
        onClick={() => setIsCSVModalOpen(true)}
        title="Import vehicles from CSV"
      >
        <Upload className="w-5 h-5 text-[#F97066]" />
        <span>Import CSV</span>
      </button>
    </div>
  );
}