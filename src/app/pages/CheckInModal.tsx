import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { DashboardScanModal } from './DashboardScanModal';
import { Check, Droplet, Pause, Wrench, Camera } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
  carRego?: string;
}

type OutcomeType = 'ready' | 'cleaning' | 'hold' | 'service';

export function CheckInModal({ isOpen, onClose, carId, carRego }: CheckInModalProps) {
  const [outcome, setOutcome] = useState<OutcomeType | null>(null);
  const [notes, setNotes] = useState('');
  const [showDashboardScan, setShowDashboardScan] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    odometer: number;
    fuelLevel: number;
    image?: string;
  } | null>(null);
  
  const outcomes = [
    { 
      value: 'ready' as OutcomeType, 
      label: 'Ready to Go', 
      icon: Check,
      description: 'Car is clean and ready',
      color: '#10B981'
    },
    { 
      value: 'cleaning' as OutcomeType, 
      label: 'Cleaning', 
      icon: Droplet,
      description: 'Needs cleaning',
      color: '#3B82F6'
    },
    { 
      value: 'hold' as OutcomeType, 
      label: 'Hold', 
      icon: Pause,
      description: 'Damage or issue',
      color: '#6B7280'
    },
    { 
      value: 'service' as OutcomeType, 
      label: 'Service', 
      icon: Wrench,
      description: 'Service required',
      color: '#F59E0B'
    }
  ];
  
  const handleConfirm = () => {
    console.log('Checking in with outcome:', outcome);
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check In Vehicle"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!outcome}>
            Confirm Check In
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Vehicle Info would go here in real implementation */}
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">What's the condition?</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {outcomes.map(item => {
              const Icon = item.icon;
              const isSelected = outcome === item.value;
              
              return (
                <button
                  key={item.value}
                  onClick={() => setOutcome(item.value)}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#F97066] bg-[#F9706610]'
                      : 'border-[#2A2A2E] bg-[#0C0C0D] hover:bg-[#1A1A1D]'
                  }`}
                >
                  <Icon 
                    className="w-8 h-8 mb-3" 
                    style={{ color: isSelected ? '#F97066' : item.color }}
                  />
                  <div className="font-semibold text-white mb-1">{item.label}</div>
                  <div className="text-xs text-[#A1A1AA]">{item.description}</div>
                </button>
              );
            })}
          </div>
        </div>
        
        {outcome && (outcome === 'hold' || outcome === 'cleaning') && (
          <div>
            <label className="text-sm font-medium text-[#FAFAFA] block mb-2">
              {outcome === 'hold' ? 'Issue Details' : 'Cleaning Notes'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={outcome === 'hold' ? 'Describe the issue...' : 'Any special cleaning requirements...'}
              className="w-full bg-[#0C0C0D] border border-[#2A2A2E] rounded-lg px-4 py-3 text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#F97066] transition-colors resize-none"
              rows={4}
            />
          </div>
        )}
        
        {/* Dashboard Scan Button */}
        <div className="border-t border-[#2A2A2E] pt-6">
          <Button
            variant="secondary"
            onClick={() => setShowDashboardScan(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {dashboardData ? 'Update Dashboard Scan' : 'Scan Dashboard'}
          </Button>
          
          {dashboardData && (
            <div className="mt-3 bg-[#0C0C0D] border border-[#2A2A2E] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-[#71717A] mb-1">Odometer</div>
                  <div className="text-white font-medium">{dashboardData.odometer.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-[#71717A] mb-1">Fuel Level</div>
                  <div className="text-white font-medium">{dashboardData.fuelLevel}%</div>
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
        carRego={carRego}
      />
    </Modal>
  );
}