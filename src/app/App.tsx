import React, { useState } from 'react';
import { TodayDashboard } from './pages/TodayDashboard';
import { WasherConsole } from './pages/WasherConsole';
import { FleetManagement } from './pages/FleetManagement';
import { Analytics } from './pages/Analytics';
import FleetScanApp from './fleetscan/FleetScanApp';
import { LayoutDashboard, Droplet, Database, Camera, BarChart3 } from 'lucide-react';
import { FleetProvider } from './context/FleetContext';

type Page = 'dashboard' | 'washer' | 'fleet' | 'analytics' | 'fleetscan';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  // If FleetScan is active, render it full-screen without sidebar
  if (currentPage === 'fleetscan') {
    return <FleetScanApp onBackToHome={() => setCurrentPage('dashboard')} />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <TodayDashboard />;
      case 'washer':
        return <WasherConsole />;
      case 'fleet':
        return <FleetManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <TodayDashboard />;
    }
  };
  
  return (
    <FleetProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
        {/* Enhanced Sidebar Navigation */}
        <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-[#E5E7EB]/50 flex flex-col shadow-xl">
          <div className="p-6 border-b border-[#E5E7EB]/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F9706640]">
                <span className="text-white font-bold text-lg">FC</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1A1A1D]">Fleet Command</h1>
                <p className="text-xs text-[#6B7280]">Workshop Manager</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                  currentPage === 'dashboard'
                    ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A1D]'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Today Dashboard</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('washer')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                  currentPage === 'washer'
                    ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A1D]'
                }`}
              >
                <Droplet className="w-5 h-5" />
                <span>Washer Console</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('fleet')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                  currentPage === 'fleet'
                    ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A1D]'
                }`}
              >
                <Database className="w-5 h-5" />
                <span>Fleet Management</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                  currentPage === 'analytics'
                    ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A1D]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('fleetscan')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                  currentPage === 'fleetscan'
                    ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A1D]'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span>Fleet Scan</span>
              </button>
            </div>
          </nav>
          
          <div className="p-4 border-t border-[#E5E7EB]/50">
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#F8F9FA] to-white rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F97066] to-[#FDA29B] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-semibold">O</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#1A1A1D] font-semibold">Oliver</div>
                <div className="text-xs text-[#6B7280]">Manager</div>
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