import React, { useState, useEffect } from 'react';
import { Droplet, Pause, AlertTriangle, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { CarIcon } from '../components/CarIcon';
import { mockCars, mockCleaningJobs, getCarById } from '../data/mockData';

export function WasherConsole() {
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (currentJob) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 600); // 60 seconds to complete (1% per 0.6s)
      
      return () => clearInterval(interval);
    }
  }, [currentJob]);
  
  const pendingJobs = mockCleaningJobs.filter(j => j.status === 'pending');
  
  const startJob = (jobId: string) => {
    const job = mockCleaningJobs.find(j => j.id === jobId);
    if (job) {
      setCurrentJob(job);
      setProgress(0);
    }
  };
  
  const completeJob = () => {
    setCurrentJob(null);
    setProgress(0);
  };
  
  const currentCar = currentJob ? getCarById(currentJob.carId) : null;
  const startTime = new Date('2025-01-04T10:15:00');
  const estDone = new Date(startTime.getTime() + 30 * 60000);
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <Droplet className="w-6 h-6 text-[#3B82F6]" />
          <h1 className="text-xl font-semibold text-[#1A1A1D]">Washer Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#6B7280] text-sm">Dave</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-sm text-green-700 font-medium">Ready</span>
          </div>
        </div>
      </div>
      
      {/* Current Job */}
      {currentJob && currentCar ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xs uppercase tracking-wide text-[#9CA3AF] mb-4 font-medium">CURRENT JOB</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CarIcon model={currentCar.model} className="w-6 h-6 text-[#F97066]" />
                <div className="font-mono text-2xl font-bold text-[#1A1A1D]">{currentCar.rego}</div>
              </div>
              <div className="text-lg text-[#6B7280]">
                {currentCar.year} {currentCar.make} {currentCar.model} • {currentCar.color}
              </div>
            </div>
            
            <div>
              <ProgressBar value={progress} />
            </div>
            
            <div className="text-sm text-[#6B7280]">
              Started {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • 
              Est. done {estDone.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="md" className="flex-1">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button variant="secondary" size="md" className="flex-1">
                <AlertTriangle className="w-4 h-4" />
                Flag Issue
              </Button>
              <Button 
                size="md" 
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
                onClick={completeJob}
              >
                <Check className="w-4 h-4" />
                Complete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 mb-6 text-center shadow-sm">
          <Droplet className="w-12 h-12 text-[#3B82F6] mx-auto mb-3 opacity-50" />
          <h3 className="text-lg text-[#1A1A1D] mb-2 font-semibold">No active job</h3>
          <p className="text-[#6B7280] text-sm">Select a job from the queue below to get started</p>
        </div>
      )}
      
      {/* Up Next */}
      <div>
        <h2 className="text-xs uppercase tracking-wide text-[#9CA3AF] mb-3 font-medium">UP NEXT</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {pendingJobs.slice(0, 4).map(job => {
            const car = getCarById(job.carId);
            if (!car) return null;
            
            return (
              <div 
                key={job.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm"
              >
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CarIcon model={car.model} className="w-5 h-5 text-[#9CA3AF]" />
                    <div className="font-mono text-lg font-bold text-[#1A1A1D]">{car.rego}</div>
                  </div>
                  <div className="text-[#6B7280] mb-2 text-sm">
                    {car.model} • {car.color}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      job.priority === 'urgent' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'
                    }`} />
                    <span className={`text-xs font-semibold ${
                      job.priority === 'urgent' ? 'text-[#EF4444]' : 'text-[#3B82F6]'
                    }`}>
                      {job.priority === 'urgent' ? 'Urgent' : 'Normal'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="md" 
                  className="w-full"
                  onClick={() => startJob(job.id)}
                  disabled={!!currentJob}
                >
                  Start This Job
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}