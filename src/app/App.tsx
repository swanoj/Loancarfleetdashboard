import React, { useState } from 'react';
import { TodayDashboard } from './pages/TodayDashboard';
import { WasherConsole } from './pages/WasherConsole';
import { FleetManagement } from './pages/FleetManagement';
import FleetScanApp from './fleetscan/FleetScanApp';
import { LayoutDashboard, Droplet, Database, Camera } from 'lucide-react';
import { FleetProvider } from './context/FleetContext';

type Page = 'dashboard' | 'washer' | 'fleet' | 'fleetscan';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  // If FleetScan is active, render it full-screen without sidebar
  if (currentPage === 'fleetscan') {
    return <FleetScanApp />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <TodayDashboard />;
      case 'washer':
        return <WasherConsole />;
      case 'fleet':
        return <FleetManagement />;
      default:
        return <TodayDashboard />;
    }
  };
  
  return (
    <FleetProvider>
      <div className="flex min-h-screen bg-[#0C0C0D]">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#141416] border-r border-[#2A2A2E] flex flex-col">
          <div className="p-6 border-b border-[#2A2A2E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">FC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Fleet Command</h1>
                <p className="text-xs text-[#71717A]">Workshop Manager</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-[#F97066] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Today Dashboard</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('washer')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === 'washer'
                    ? 'bg-[#F97066] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-white'
                }`}
              >
                <Droplet className="w-5 h-5" />
                <span className="font-medium">Washer Console</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('fleet')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === 'fleet'
                    ? 'bg-[#F97066] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-white'
                }`}
              >
                <Database className="w-5 h-5" />
                <span className="font-medium">Fleet Management</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('fleetscan')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === 'fleetscan'
                    ? 'bg-[#F97066] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-white'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">Fleet Scan</span>
              </button>
            </div>
          </nav>
          
          <div className="p-4 border-t border-[#2A2A2E]">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 bg-[#F97066] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">O</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-white font-medium">Oliver</div>
                <div className="text-xs text-[#71717A]">Manager</div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </FleetProvider>
  );
}