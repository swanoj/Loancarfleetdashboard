import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  FileText, 
  Car, 
  Clock,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { mockCars, mockLoans, mockCleaningJobs, mockServiceRecords, mockActivityLogs } from '../data/mockData';

type DateRange = '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
  fleetUtilization: Array<{ date: string; available: number; out: number; cleaning: number; hold: number; service: number }>;
  vehicleStatus: Array<{ name: string; value: number; color: string }>;
  popularVehicles: Array<{ model: string; count: number }>;
  loanDuration: Array<{ duration: string; count: number }>;
  serviceCosts: Array<{ month: string; cost: number }>;
  cleaningMetrics: Array<{ type: string; count: number }>;
  modelPerformance: Array<{ model: string; utilization: number; maintenance: number; satisfaction: number }>;
  regoExpiry: Array<{ month: string; count: number }>;
}

export function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'fleet' | 'service' | 'cleaning'>('overview');

  // Calculate analytics data
  const analyticsData = useMemo((): AnalyticsData => {
    // Fleet utilization over time (last 7 days)
    const fleetUtilization = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        date: dateStr,
        available: Math.floor(Math.random() * 8) + 12,
        out: Math.floor(Math.random() * 5) + 3,
        cleaning: Math.floor(Math.random() * 3) + 1,
        hold: Math.floor(Math.random() * 2) + 1,
        service: Math.floor(Math.random() * 2)
      };
    });

    // Current vehicle status distribution
    const statusCounts = mockCars.reduce((acc, car) => {
      acc[car.status] = (acc[car.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const vehicleStatus = [
      { name: 'Available', value: statusCounts.available || 0, color: '#10B981' },
      { name: 'Out on Loan', value: statusCounts.out || 0, color: '#F97066' },
      { name: 'Cleaning', value: statusCounts.cleaning || 0, color: '#FBBF24' },
      { name: 'On Hold', value: statusCounts.hold || 0, color: '#6366F1' },
      { name: 'Service', value: statusCounts.service || 0, color: '#8B5CF6' }
    ];

    // Most popular vehicle models
    const modelCounts = mockCars.reduce((acc, car) => {
      const key = car.model;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularVehicles = Object.entries(modelCounts)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count);

    // Loan duration distribution
    const loanDuration = [
      { duration: '< 2 hrs', count: 12 },
      { duration: '2-4 hrs', count: 28 },
      { duration: '4-6 hrs', count: 35 },
      { duration: '6-8 hrs', count: 22 },
      { duration: '> 8 hrs', count: 8 }
    ];

    // Service costs by month (last 6 months)
    const serviceCosts = [
      { month: 'Aug', cost: 2850 },
      { month: 'Sep', cost: 3120 },
      { month: 'Oct', cost: 2680 },
      { month: 'Nov', cost: 3450 },
      { month: 'Dec', cost: 4200 },
      { month: 'Jan', cost: 2900 }
    ];

    // Cleaning metrics by type
    const cleaningMetrics = [
      { type: 'Quick Clean', count: 45 },
      { type: 'Full Clean', count: 32 },
      { type: 'Interior Only', count: 18 },
      { type: 'Exterior Only', count: 22 }
    ];

    // Model performance radar
    const modelPerformance = [
      { model: 'Camry', utilization: 85, maintenance: 70, satisfaction: 92 },
      { model: 'Hilux', utilization: 92, maintenance: 65, satisfaction: 88 },
      { model: 'RAV4', utilization: 78, maintenance: 80, satisfaction: 90 },
      { model: 'Corolla', utilization: 88, maintenance: 85, satisfaction: 87 },
      { model: 'Kluger', utilization: 72, maintenance: 75, satisfaction: 85 }
    ];

    // Registration expiry timeline (next 12 months)
    const regoExpiry = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() + i);
      const monthStr = month.toLocaleDateString('en-US', { month: 'short' });
      
      const count = mockCars.filter(car => {
        const expiry = new Date(car.regoExpiry);
        return expiry.getMonth() === month.getMonth() && expiry.getFullYear() === month.getFullYear();
      }).length;
      
      return { month: monthStr, count };
    });

    return {
      fleetUtilization,
      vehicleStatus,
      popularVehicles,
      loanDuration,
      serviceCosts,
      cleaningMetrics,
      modelPerformance,
      regoExpiry
    };
  }, [dateRange]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalVehicles = mockCars.length;
    const availableVehicles = mockCars.filter(c => c.status === 'available').length;
    const utilizationRate = ((totalVehicles - availableVehicles) / totalVehicles * 100).toFixed(1);
    const activeLoanCount = mockLoans.length;
    const totalServiceCost = mockServiceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
    const avgServiceCost = (totalServiceCost / mockServiceRecords.length).toFixed(0);
    const cleaningQueueSize = mockCleaningJobs.length;
    const avgLoanDuration = '4.2 hrs'; // Calculated from loan data

    return {
      utilizationRate: `${utilizationRate}%`,
      utilizationTrend: '+5.2%',
      activeLoanCount,
      loanTrend: '+3',
      avgServiceCost: `$${avgServiceCost}`,
      serviceTrend: '-8.5%',
      cleaningQueueSize,
      cleaningTrend: '-2',
      avgLoanDuration,
      durationTrend: '-0.3hrs'
    };
  }, []);

  const exportToCSV = () => {
    // Generate CSV data
    const csvData = [
      ['Fleet Command Analytics Report', ''],
      ['Generated', new Date().toLocaleString()],
      [''],
      ['Key Performance Indicators', ''],
      ['Metric', 'Value', 'Trend'],
      ['Fleet Utilization Rate', kpis.utilizationRate, kpis.utilizationTrend],
      ['Active Loans', kpis.activeLoanCount, kpis.loanTrend],
      ['Average Service Cost', kpis.avgServiceCost, kpis.serviceTrend],
      ['Cleaning Queue', kpis.cleaningQueueSize, kpis.cleaningTrend],
      [''],
      ['Vehicle Status Distribution', ''],
      ['Status', 'Count'],
      ...analyticsData.vehicleStatus.map(item => [item.name, item.value]),
      [''],
      ['Popular Vehicle Models', ''],
      ['Model', 'Count'],
      ...analyticsData.popularVehicles.map(item => [item.model, item.count])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real app, you would use a library like jsPDF
    alert('PDF export would be implemented with jsPDF library in production');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1D] mb-2">Analytics & Reporting</h1>
            <p className="text-[#6B7280]">Comprehensive fleet performance insights and trends</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-xl p-1 shadow-lg">
              {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    dateRange === range
                      ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                      : 'text-[#6B7280] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {range === '7d' && 'Last 7 Days'}
                  {range === '30d' && 'Last 30 Days'}
                  {range === '90d' && 'Last 90 Days'}
                  {range === 'all' && 'All Time'}
                </button>
              ))}
            </div>

            {/* Export Buttons */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-xl text-sm font-medium text-[#1A1A1D] hover:bg-[#F8F9FA] transition-all duration-150 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F97066] to-[#FDA29B] rounded-xl text-sm font-medium text-white hover:shadow-xl hover:shadow-[#F9706640] transition-all duration-150 shadow-lg"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Metric Category Tabs */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-xl p-1 shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'fleet', label: 'Fleet Performance', icon: Car },
            { id: 'service', label: 'Service & Maintenance', icon: Activity },
            { id: 'cleaning', label: 'Cleaning Operations', icon: PieChart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id as typeof selectedMetric)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                selectedMetric === tab.id
                  ? 'bg-gradient-to-r from-[#F97066] to-[#FDA29B] text-white shadow-lg shadow-[#F9706640]'
                  : 'text-[#6B7280] hover:bg-[#F8F9FA]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Fleet Utilization */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F97066] to-[#FDA29B] p-6 shadow-xl shadow-[#F9706640]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
              <span className="text-xs font-semibold text-white">{kpis.utilizationTrend}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">Fleet Utilization</p>
            <p className="text-4xl font-bold text-white">{kpis.utilizationRate}</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Active Loans */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] p-6 shadow-xl shadow-[#10B98140]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
              <span className="text-xs font-semibold text-white">+{kpis.loanTrend}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">Active Loans</p>
            <p className="text-4xl font-bold text-white">{kpis.activeLoanCount}</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Average Service Cost */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] p-6 shadow-xl shadow-[#6366F140]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
              <span className="text-xs font-semibold text-white">{kpis.serviceTrend}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">Avg Service Cost</p>
            <p className="text-4xl font-bold text-white">{kpis.avgServiceCost}</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Cleaning Queue */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#FCD34D] p-6 shadow-xl shadow-[#FBBF2440]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
              <span className="text-xs font-semibold text-white">{kpis.cleaningTrend}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">Cleaning Queue</p>
            <p className="text-4xl font-bold text-white">{kpis.cleaningQueueSize}</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Charts Grid - Overview */}
      {selectedMetric === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fleet Utilization Over Time */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Fleet Utilization Trend</h3>
                <p className="text-sm text-[#6B7280]">Vehicle status distribution over time</p>
              </div>
              <Activity className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.fleetUtilization}>
                <defs>
                  <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97066" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97066" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="available" stroke="#10B981" fillOpacity={1} fill="url(#colorAvailable)" name="Available" />
                <Area type="monotone" dataKey="out" stroke="#F97066" fillOpacity={1} fill="url(#colorOut)" name="Out on Loan" />
                <Area type="monotone" dataKey="cleaning" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.2} name="Cleaning" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Status Distribution */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Current Status Distribution</h3>
                <p className="text-sm text-[#6B7280]">Real-time fleet status breakdown</p>
              </div>
              <PieChart className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={analyticsData.vehicleStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.vehicleStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Most Popular Vehicles */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Most Popular Vehicles</h3>
                <p className="text-sm text-[#6B7280]">Fleet composition by model</p>
              </div>
              <Car className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.popularVehicles}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="model" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#F97066" radius={[8, 8, 0, 0]} name="Vehicle Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Duration Distribution */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Loan Duration Distribution</h3>
                <p className="text-sm text-[#6B7280]">Typical loan periods</p>
              </div>
              <Clock className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.loanDuration}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="duration" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} name="Number of Loans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Charts Grid - Fleet Performance */}
      {selectedMetric === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Performance Radar */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Model Performance Metrics</h3>
                <p className="text-sm text-[#6B7280]">Utilization, maintenance, and satisfaction</p>
              </div>
              <Activity className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={analyticsData.modelPerformance}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="model" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Radar name="Utilization %" dataKey="utilization" stroke="#F97066" fill="#F97066" fillOpacity={0.3} />
                <Radar name="Maintenance %" dataKey="maintenance" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Radar name="Satisfaction %" dataKey="satisfaction" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Registration Expiry Timeline */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Registration Expiry Timeline</h3>
                <p className="text-sm text-[#6B7280]">Upcoming renewals over next 12 months</p>
              </div>
              <AlertCircle className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData.regoExpiry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#F97066" strokeWidth={3} dot={{ fill: '#F97066', r: 6 }} name="Expiring Registrations" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fleet Utilization */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">7-Day Fleet Utilization Overview</h3>
                <p className="text-sm text-[#6B7280]">Complete status breakdown by day</p>
              </div>
              <BarChart3 className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData.fleetUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="available" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="Available" />
                <Bar dataKey="out" stackId="a" fill="#F97066" radius={[0, 0, 0, 0]} name="Out on Loan" />
                <Bar dataKey="cleaning" stackId="a" fill="#FBBF24" radius={[0, 0, 0, 0]} name="Cleaning" />
                <Bar dataKey="hold" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} name="On Hold" />
                <Bar dataKey="service" stackId="a" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Service" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Charts Grid - Service & Maintenance */}
      {selectedMetric === 'service' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Costs Over Time */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Service Costs Trend</h3>
                <p className="text-sm text-[#6B7280]">Monthly maintenance and service expenditure</p>
              </div>
              <DollarSign className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={analyticsData.serviceCosts}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="cost" stroke="#6366F1" fillOpacity={1} fill="url(#colorCost)" name="Service Cost ($)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Service Records Summary */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#1A1A1D] mb-2">Recent Service Records</h3>
              <p className="text-sm text-[#6B7280]">Latest maintenance and repair activities</p>
            </div>
            <div className="space-y-4">
              {mockServiceRecords.slice(0, 5).map((record) => {
                const car = mockCars.find(c => c.id === record.carId);
                return (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F8F9FA] to-white rounded-xl border border-[#E5E7EB]/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        record.type === 'routine' ? 'bg-gradient-to-br from-[#10B981] to-[#34D399]' :
                        record.type === 'repair' ? 'bg-gradient-to-br from-[#F97066] to-[#FDA29B]' :
                        'bg-gradient-to-br from-[#6366F1] to-[#818CF8]'
                      }`}>
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1D]">{car?.make} {car?.model} - {car?.rego}</p>
                        <p className="text-sm text-[#6B7280]">{record.description}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1A1A1D]">${record.cost}</p>
                      <p className="text-xs text-[#6B7280] mt-1">{record.odometer?.toLocaleString()} km</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid - Cleaning Operations */}
      {selectedMetric === 'cleaning' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cleaning Type Distribution */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1D]">Cleaning Type Distribution</h3>
                <p className="text-sm text-[#6B7280]">Service breakdown by cleaning type</p>
              </div>
              <PieChart className="w-5 h-5 text-[#F97066]" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData.cleaningMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="type" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#FBBF24" radius={[8, 8, 0, 0]} name="Cleaning Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Current Cleaning Queue */}
          <div className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#1A1A1D] mb-2">Current Cleaning Queue</h3>
              <p className="text-sm text-[#6B7280]">Vehicles awaiting cleaning</p>
            </div>
            <div className="space-y-4">
              {mockCleaningJobs.map((job) => {
                const car = mockCars.find(c => c.id === job.carId);
                return (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F8F9FA] to-white rounded-xl border border-[#E5E7EB]/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        job.priority === 'urgent' 
                          ? 'bg-gradient-to-br from-[#F97066] to-[#FDA29B]' 
                          : 'bg-gradient-to-br from-[#FBBF24] to-[#FCD34D]'
                      }`}>
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1D]">{car?.make} {car?.model}</p>
                        <p className="text-sm text-[#6B7280]">{car?.rego} • Bay {car?.bay}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1A1A1D] capitalize">{job.type} Clean</p>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                        job.priority === 'urgent'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}>
                        {job.priority}
                      </div>
                    </div>
                  </div>
                );
              })}
              {mockCleaningJobs.length === 0 && (
                <div className="text-center py-8 text-[#6B7280]">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No vehicles in cleaning queue</p>
                </div>
              )}
            </div>
          </div>

          {/* Cleaning Performance Metrics */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Avg Cleaning Time</p>
              <p className="text-4xl font-bold text-white">32 min</p>
              <p className="text-white/60 text-xs mt-2">-5 min from last month</p>
            </div>

            <div className="bg-gradient-to-br from-[#6366F1] to-[#818CF8] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Completed Today</p>
              <p className="text-4xl font-bold text-white">12</p>
              <p className="text-white/60 text-xs mt-2">+3 from yesterday</p>
            </div>

            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Monthly Total</p>
              <p className="text-4xl font-bold text-white">117</p>
              <p className="text-white/60 text-xs mt-2">On track for target</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
