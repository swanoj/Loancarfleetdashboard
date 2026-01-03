# Fleet Command Analytics & Reporting Dashboard

## Overview

The Analytics & Reporting Dashboard provides comprehensive insights into your fleet operations with interactive charts, real-time KPIs, and exportable reports. Designed to help managers make data-driven decisions about fleet utilization, maintenance scheduling, and operational efficiency.

## Features

### 📊 Key Performance Indicators (KPIs)

Four hero KPI cards with gradient backgrounds and trend indicators:

1. **Fleet Utilization Rate** - Percentage of fleet currently in use
   - Gradient: Red/Coral (#F97066 to #FDA29B)
   - Shows trend comparison vs previous period

2. **Active Loans** - Number of vehicles currently out on loan
   - Gradient: Green (#10B981 to #34D399)
   - Displays change from previous period

3. **Average Service Cost** - Mean cost per service appointment
   - Gradient: Indigo (#6366F1 to #818CF8)
   - Shows cost trend (positive = savings)

4. **Cleaning Queue Size** - Number of vehicles awaiting cleaning
   - Gradient: Yellow (#FBBF24 to #FCD34D)
   - Indicates queue change

### 📈 Analytics Views

The dashboard includes 4 specialized views accessible via tabs:

#### 1. Overview
- **Fleet Utilization Trend** - Area chart showing vehicle status distribution over 7 days
- **Current Status Distribution** - Pie chart of real-time fleet status breakdown
- **Most Popular Vehicles** - Bar chart of fleet composition by model
- **Loan Duration Distribution** - Bar chart showing typical loan periods

#### 2. Fleet Performance
- **Model Performance Metrics** - Radar chart comparing utilization, maintenance, and satisfaction across models
- **Registration Expiry Timeline** - Line chart forecasting renewals over next 12 months
- **7-Day Fleet Utilization Overview** - Stacked bar chart with complete status breakdown by day

#### 3. Service & Maintenance
- **Service Costs Trend** - Area chart tracking monthly maintenance expenditure
- **Recent Service Records** - List view of latest maintenance activities with costs and details

#### 4. Cleaning Operations
- **Cleaning Type Distribution** - Bar chart breaking down cleaning jobs by type
- **Current Cleaning Queue** - Real-time list of vehicles awaiting cleaning with priority indicators
- **Cleaning Performance Metrics** - Three metric cards showing:
  - Average cleaning time
  - Jobs completed today
  - Monthly total completions

### 📅 Date Range Filtering

Four preset date ranges:
- **Last 7 Days** - Recent weekly trends
- **Last 30 Days** - Monthly overview (default)
- **Last 90 Days** - Quarterly analysis
- **All Time** - Complete historical data

### 📥 Export Functions

Two export options with glassmorphism styling:

1. **Export CSV** - Generates downloadable CSV file containing:
   - Report metadata (title, generation date)
   - All KPI values with trends
   - Vehicle status distribution data
   - Popular vehicle model rankings
   - Filename format: `fleet-analytics-YYYY-MM-DD.csv`

2. **Export PDF** - Placeholder for PDF generation
   - Would use jsPDF library in production
   - Currently shows implementation notice

## Design System

### Visual Style
- **Glassmorphism effects** - Frosted glass cards with backdrop blur
- **Gradient backgrounds** - Vibrant gradient overlays on KPI cards
- **Shadow effects** - Colored shadows matching gradient themes
- **150ms transitions** - Smooth state changes matching Fleet Command design

### Color Palette
- Primary: #F97066 to #FDA29B (coral/red gradient)
- Success: #10B981 to #34D399 (green gradient)
- Info: #6366F1 to #818CF8 (indigo gradient)
- Warning: #FBBF24 to #FCD34D (yellow gradient)
- Accent: #8B5CF6 to #A78BFA (purple gradient)

### Typography
- Font family: Inter (system default)
- Headers: Bold weights with tight leading
- Body: Regular weights with comfortable line height

## Chart Configuration

### Recharts Integration

All charts use Recharts library with customized styling:

- **CartesianGrid** - Light gray (#E5E7EB) dashed lines
- **Axes** - Gray text (#6B7280), 12px font size
- **Tooltips** - White background with border radius, subtle shadow
- **Colors** - Match Fleet Command brand palette
- **Animations** - Enabled by default for smooth data transitions

### Chart Types Used

1. **AreaChart** - Fleet utilization trends, service costs
2. **BarChart** - Popular vehicles, loan duration, cleaning types
3. **PieChart** - Status distribution
4. **LineChart** - Registration expiry timeline
5. **RadarChart** - Multi-dimensional model performance
6. **Stacked BarChart** - Daily fleet utilization breakdown

## Data Sources

### Mock Data
Currently uses mock data from `/src/app/data/mockData.ts`:
- `mockCars` - Vehicle inventory
- `mockLoans` - Active loan records
- `mockCleaningJobs` - Cleaning queue
- `mockServiceRecords` - Maintenance history
- `mockActivityLogs` - Fleet activity timeline

### Real Implementation
To connect to real data:
1. Replace mock data imports with API calls
2. Update `analyticsData` useMemo hook to fetch from backend
3. Implement WebSocket for real-time KPI updates
4. Add date range filtering to API queries
5. Integrate actual export library (jsPDF) for PDF generation

## Usage

### Navigation
1. Click **Analytics** in the sidebar navigation (BarChart3 icon)
2. Select desired date range from top-right filter
3. Choose metric category from tabs (Overview, Fleet, Service, Cleaning)
4. Export data using CSV or PDF buttons

### Interpreting Charts

**Fleet Utilization** - Higher utilization = better fleet efficiency, but ensure adequate availability for demand

**Status Distribution** - Monitor for:
- Too many vehicles on hold (process bottleneck)
- Low cleaning queue (good throughput)
- Balanced available vs. out ratio

**Popular Vehicles** - Identifies:
- Models to acquire more of
- Underutilized models to phase out
- Maintenance planning priorities

**Service Costs** - Track for:
- Seasonal cost variations
- Budget planning
- Vehicle replacement timing

**Registration Expiry** - Proactive planning:
- Upcoming renewal deadlines
- Budget allocation for renewals
- Compliance management

## Performance Optimization

### Current Implementation
- All calculations in client-side `useMemo` hook
- Recalculates when `dateRange` changes
- Lightweight chart data structures

### Production Recommendations
1. **Server-side aggregation** - Move complex calculations to backend
2. **Caching** - Cache frequently accessed analytics for 5-15 minutes
3. **Pagination** - Implement virtual scrolling for large data lists
4. **Lazy loading** - Load chart data on-demand when tab selected
5. **Web Workers** - Offload heavy calculations to background threads

## Accessibility

- **Keyboard navigation** - All interactive elements focusable
- **Color contrast** - WCAG AA compliant text colors
- **Screen readers** - Chart data tables as fallback (future enhancement)
- **Responsive design** - Grid layout adapts to screen size

## Future Enhancements

### Planned Features
- [ ] Custom date range picker
- [ ] Scheduled report generation (daily/weekly/monthly)
- [ ] Email report delivery
- [ ] Comparative analytics (month-over-month, year-over-year)
- [ ] Predictive analytics (forecast future trends)
- [ ] Custom metric builder
- [ ] Dashboard customization (drag-and-drop widgets)
- [ ] Team performance metrics
- [ ] Customer satisfaction scoring
- [ ] Fuel consumption tracking
- [ ] Revenue analytics (if pricing data available)
- [ ] Advanced filtering (by model, bay, date, status)
- [ ] Drill-down capability (click chart to see details)
- [ ] Data visualization presets (save custom views)
- [ ] Mobile-optimized charts
- [ ] Real-time notifications on anomalies

### Integration Opportunities
- Connect to accounting software for cost tracking
- Integrate with CRM for customer insights
- Link to maintenance scheduling system
- Sync with registration renewal services
- Feed data to business intelligence platforms

## Technical Details

### File Structure
```
/src/app/pages/Analytics.tsx       # Main analytics component
/src/app/data/mockData.ts          # Data source (mock)
/ANALYTICS_GUIDE.md                # This documentation
```

### Dependencies
- `recharts` (v2.15.2) - Already installed
- `lucide-react` - Icons
- React hooks (useState, useMemo)

### Component Props
None - Analytics is a standalone page component

### State Management
- Local state for `dateRange` and `selectedMetric`
- No global state required (self-contained)
- All data derived from mock data imports

## Troubleshooting

### Charts not rendering
- Ensure `recharts` package is installed
- Check console for import errors
- Verify mock data structure matches expected format

### Export not working
- CSV export uses browser download API - check permissions
- PDF export is placeholder - implement with jsPDF

### Performance issues
- Reduce chart data points (sample larger datasets)
- Disable chart animations in settings
- Implement data pagination

## Support

For questions or issues:
1. Check this documentation
2. Review component code comments
3. Test with mock data first
4. Verify Recharts documentation for chart-specific issues

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Component:** Fleet Command Analytics & Reporting
