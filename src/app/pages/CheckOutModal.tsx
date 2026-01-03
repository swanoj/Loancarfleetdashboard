import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { ToggleGroup } from '../components/ToggleGroup';
import { CarIcon } from '../components/CarIcon';
import { useFleet } from '../context/FleetContext';
import { DashboardScanModal } from './DashboardScanModal';
import { Plus, MapPin, Camera } from 'lucide-react';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string | null;
  onSuccess?: () => void;
}

export function CheckOutModal({ isOpen, onClose, carId, onSuccess }: CheckOutModalProps) {
  const [customer, setCustomer] = useState('');
  const [driverType, setDriverType] = useState<'same' | 'different'>('same');
  const [driverName, setDriverName] = useState('');
  const [duration, setDuration] = useState('6hrs');
  const [fuelPolicy, setFuelPolicy] = useState('same-level');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showDashboardScan, setShowDashboardScan] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    odometer: number;
    fuelLevel: number;
    image?: string;
  } | null>(null);
  
  const { cars, checkOutCar } = useFleet();
  const car = carId ? cars.find(c => c.id === carId) : null;
  
  if (!car) return null;
  
  const durationOptions = [
    { value: '6hrs', label: '6 hrs' },
    { value: '1day', label: '1 day' },
    { value: '2days', label: '2 days' },
    { value: 'custom', label: 'Custom' }
  ];
  
  const calculateReturnTime = () => {
    const now = new Date('2025-01-04T11:30:00');
    let returnTime = new Date(now);
    
    switch (duration) {
      case '6hrs':
        returnTime.setHours(returnTime.getHours() + 6);
        break;
      case '1day':
        returnTime.setDate(returnTime.getDate() + 1);
        break;
      case '2days':
        returnTime.setDate(returnTime.getDate() + 2);
        break;
    }
    
    return returnTime;
  };
  
  const getReturnTimeDisplay = () => {
    const returnTime = calculateReturnTime();
    return returnTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    }) + ' at ' + returnTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };
  
  const handleConfirm = () => {
    const driver = driverType === 'same' ? customer : driverName;
    const dueBack = calculateReturnTime().toISOString();
    
    checkOutCar(car.id, customer, driver, dueBack);
    
    // Reset form
    setCustomer('');
    setDriverType('same');
    setDriverName('');
    setDuration('6hrs');
    setFuelPolicy('same-level');
    setTermsAgreed(false);
    
    onClose();
    if (onSuccess) onSuccess();
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Check Out Vehicle"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!customer || !termsAgreed}>
            Confirm Check Out
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Vehicle Preview */}
        <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CarIcon model={car.model} className="w-7 h-7 text-[#F97066]" />
            <div className="font-mono text-2xl font-bold text-[#1A1A1D]">{car.rego}</div>
          </div>
          <div className="text-[#6B7280] mb-1">
            {car.year} {car.make} {car.model}
          </div>
          <div className="flex items-center justify-center gap-3 text-sm text-[#9CA3AF]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.colorHex }} />
              <span className="capitalize">{car.color}</span>
            </div>
            {car.bay && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{car.bay}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Customer Search */}
        <div>
          <Input
            label="Customer"
            placeholder="Search customers..."
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <button className="mt-2 text-sm text-[#F97066] hover:text-[#E85F55] flex items-center gap-1 font-medium">
            <Plus className="w-4 h-4" />
            New Customer
          </button>
        </div>
        
        {/* Driver Selection */}
        <div>
          <label className="text-sm font-medium text-[#1A1A1D] block mb-3">Driver</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="driver"
                value="same"
                checked={driverType === 'same'}
                onChange={() => setDriverType('same')}
                className="w-4 h-4 accent-[#F97066]"
              />
              <span className="text-sm text-[#1A1A1D]">Same as customer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="driver"
                value="different"
                checked={driverType === 'different'}
                onChange={() => setDriverType('different')}
                className="w-4 h-4 accent-[#F97066]"
              />
              <span className="text-sm text-[#1A1A1D]">Different driver</span>
            </label>
          </div>
          {driverType === 'different' && (
            <Input
              label="Driver Name"
              placeholder="Enter driver's name..."
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          )}
        </div>
        
        {/* Due Back */}
        <div>
          <label className="text-sm font-medium text-[#1A1A1D] block mb-3">Due Back</label>
          <ToggleGroup
            options={durationOptions}
            value={duration}
            onChange={setDuration}
          />
          <p className="mt-2 text-sm text-[#6B7280]">
            Returns: {getReturnTimeDisplay()}
          </p>
        </div>
        
        {/* Fuel Policy */}
        <Select
          label="Fuel Policy"
          value={fuelPolicy}
          onChange={(e) => setFuelPolicy(e.target.value)}
          options={[
            { value: 'same-level', label: 'Return at same level' },
            { value: 'full-tank', label: 'Return with full tank' },
            { value: 'workshop-fills', label: 'Workshop fills' }
          ]}
        />
        
        {/* Terms Agreement */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#F97066]"
          />
          <span className="text-sm text-[#1A1A1D]">Customer agrees to loan terms</span>
        </label>
        
        {/* Dashboard Scan */}
        <div className="border-t border-[#E5E7EB] pt-6">
          <Button
            variant="secondary"
            onClick={() => setShowDashboardScan(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {dashboardData ? 'Update Dashboard Scan' : 'Scan Dashboard (Optional)'}
          </Button>
          {dashboardData && (
            <div className="mt-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-[#9CA3AF] mb-1 font-medium">Odometer</div>
                  <div className="text-[#1A1A1D] font-semibold">{dashboardData.odometer.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-[#9CA3AF] mb-1 font-medium">Fuel Level</div>
                  <div className="text-[#1A1A1D] font-semibold">{dashboardData.fuelLevel}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Dashboard Scan Modal */}
      <DashboardScanModal
        isOpen={showDashboardScan}
        onClose={() => setShowDashboardScan(false)}
        onConfirm={(data) => {
          setDashboardData(data);
          setShowDashboardScan(false);
        }}
        carRego={car.rego}
        currentOdometer={car.odometer}
        currentFuelLevel={undefined}
      />
    </Modal>
  );
}