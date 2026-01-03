import React, { useState } from 'react';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { StatusBadge } from '../components/StatusBadge';
import { CarIcon } from '../components/CarIcon';
import { CarPortal } from './CarPortal';

export function FleetManagement() {
  const { cars } = useFleet();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'rego' | 'make' | 'status' | 'expiry'>('rego');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  
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
    <div className="min-h-screen bg-[#0C0C0D]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0C0C0D] border-b border-[#2A2A2E]">
        <div className="px-8 py-4">
          <h1 className="text-2xl font-semibold text-white mb-4">Fleet Management</h1>
          
          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-[#141416] border border-[#2A2A2E] rounded-lg px-4 py-2 pr-10 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#F97066]"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="out">Out</option>
                <option value="hold">Hold</option>
                <option value="service">Service</option>
                <option value="cleaning">Cleaning</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                placeholder="Search by rego, make, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141416] border border-[#2A2A2E] rounded-lg pl-10 pr-4 py-2 text-[#FAFAFA] text-sm placeholder:text-[#71717A] focus:outline-none focus:border-[#F97066]"
              />
            </div>
            
            <div className="text-sm text-[#A1A1AA]">
              {filteredCars.length} vehicles
            </div>
          </div>
        </div>
      </header>
      
      {/* Table */}
      <main className="px-8 py-6">
        <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0C0C0D]">
                <tr>
                  <th 
                    className="text-left px-6 py-4 text-xs uppercase tracking-wide text-[#71717A] cursor-pointer hover:text-[#A1A1AA]"
                    onClick={() => handleSort('rego')}
                  >
                    Rego {sortField === 'rego' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left px-6 py-4 text-xs uppercase tracking-wide text-[#71717A] cursor-pointer hover:text-[#A1A1AA]"
                    onClick={() => handleSort('make')}
                  >
                    Make/Model {sortField === 'make' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left px-6 py-4 text-xs uppercase tracking-wide text-[#71717A] cursor-pointer hover:text-[#A1A1AA]"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-[#71717A]">
                    Bay
                  </th>
                  <th 
                    className="text-left px-6 py-4 text-xs uppercase tracking-wide text-[#71717A] cursor-pointer hover:text-[#A1A1AA]"
                    onClick={() => handleSort('expiry')}
                  >
                    Rego Expiry {sortField === 'expiry' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                      className="border-t border-[#1A1A1D] hover:bg-[#1A1A1D] transition-colors cursor-pointer"
                      onClick={() => setSelectedCarId(car.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CarIcon model={car.model} className="w-5 h-5 text-[#71717A]" />
                          <span className="font-mono text-white">{car.rego}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#FAFAFA]">{car.make} {car.model}</div>
                        <div className="text-sm text-[#A1A1AA] flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.colorHex }} />
                          {car.year} • {car.color}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge variant={car.status}>
                          {car.status === 'available' ? 'Available' : 
                           car.status === 'out' ? 'Out' :
                           car.status === 'hold' ? 'Hold' :
                           car.status === 'service' ? 'Service' :
                           'Cleaning'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#A1A1AA]">{car.bay || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`${
                            isCritical ? 'text-[#EF4444]' :
                            isWarning ? 'text-[#F59E0B]' :
                            'text-[#A1A1AA]'
                          }`}>
                            {expiryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                          {isCritical && <AlertTriangle className="w-4 h-4 text-[#EF4444]" />}
                          {isWarning && !isCritical && <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}
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
    </div>
  );
}