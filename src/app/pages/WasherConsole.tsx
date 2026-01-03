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
    <div className="min-h-screen bg-[#0C0C0D] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#2A2A2E]">
        <div className="flex items-center gap-3">
          <Droplet className="w-8 h-8 text-[#3B82F6]" />
          <h1 className="text-2xl font-semibold text-white">Washer Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#A1A1AA]">Dave</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10B98120] rounded-lg">
            <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
            <span className="text-sm text-[#10B981] font-medium">Ready</span>
          </div>
        </div>
      </div>
      
      {/* Current Job */}
      {currentJob && currentCar ? (
        <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-8 mb-8">
          <h2 className="text-sm uppercase tracking-wide text-[#71717A] mb-6">CURRENT JOB</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CarIcon model={currentCar.model} className="w-8 h-8 text-[#F97066]" />
                <div className="font-mono text-3xl font-bold text-white">{currentCar.rego}</div>
              </div>
              <div className="text-xl text-[#A1A1AA]">
                {currentCar.year} {currentCar.make} {currentCar.model} • {currentCar.color}
              </div>
            </div>
            
            <div>
              <ProgressBar value={progress} />
            </div>
            
            <div className="text-sm text-[#A1A1AA]">
              Started {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • 
              Est. done {estDone.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" size="lg" className="flex-1">
                <Pause className="w-5 h-5" />
                Pause
              </Button>
              <Button variant="secondary" size="lg" className="flex-1">
                <AlertTriangle className="w-5 h-5" />
                Flag Issue
              </Button>
              <Button 
                size="lg" 
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
                onClick={completeJob}
              >
                <Check className="w-5 h-5" />
                Complete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-8 mb-8 text-center">
          <Droplet className="w-16 h-16 text-[#3B82F6] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl text-white mb-2">No active job</h3>
          <p className="text-[#A1A1AA]">Select a job from the queue below to get started</p>
        </div>
      )}
      
      {/* Up Next */}
      <div>
        <h2 className="text-sm uppercase tracking-wide text-[#71717A] mb-4">UP NEXT</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {pendingJobs.slice(0, 4).map(job => {
            const car = getCarById(job.carId);
            if (!car) return null;
            
            return (
              <div 
                key={job.id}
                className="bg-[#141416] border border-[#2A2A2E] rounded-xl p-6"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CarIcon model={car.model} className="w-6 h-6 text-[#71717A]" />
                    <div className="font-mono text-xl font-bold text-white">{car.rego}</div>
                  </div>
                  <div className="text-[#A1A1AA] mb-3">
                    {car.model} • {car.color}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      job.priority === 'urgent' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'
                    }`} />
                    <span className={`text-sm font-medium ${
                      job.priority === 'urgent' ? 'text-[#EF4444]' : 'text-[#3B82F6]'
                    }`}>
                      {job.priority === 'urgent' ? 'Urgent' : 'Normal'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
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