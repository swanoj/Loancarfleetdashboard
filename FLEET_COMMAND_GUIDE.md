# Fleet Command - Loan Car Fleet Management Dashboard

A premium internal operations tool inspired by Retool's sophisticated dark aesthetic.

## 🎨 Design Philosophy

This dashboard embodies Retool's design principles:
- **Deep, rich dark theme** with warmth (#0C0C0D background)
- **Confident typography** using Inter font family
- **Coral accent color** (#F97066) for primary actions
- **Professional yet approachable** interface
- **Generous white space** and clean component cards
- **Subtle animations** that enhance without distracting

## 📁 Project Structure

```
/src/app/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── CarTile.tsx
│   ├── EmptyState.tsx
│   ├── Input.tsx
│   ├── KPICard.tsx
│   ├── Modal.tsx
│   ├── ProgressBar.tsx
│   ├── Select.tsx
│   ├── StatusBadge.tsx
│   └── ToggleGroup.tsx
├── data/
│   └── mockData.ts      # Mock data for the application
├── pages/               # Main application pages
│   ├── CheckInModal.tsx
│   ├── CheckOutModal.tsx
│   ├── FleetManagement.tsx
│   ├── TodayDashboard.tsx
│   └── WasherConsole.tsx
└── App.tsx              # Main app with navigation
```

## 🎯 Features

### 1. Today Dashboard
The main operational view with:
- **KPI Cards**: Real-time metrics for Ready, Out, Due Today, Overdue, and Cleaning
- **Available Cars Grid**: Visual tiles showing all available vehicles
- **Due Back Today Table**: List of vehicles expected to return
- **Cleaning Queue**: Priority-sorted cleaning jobs
- **On Hold Items**: Vehicles requiring attention

### 2. Check-Out Modal
Streamlined vehicle checkout process:
- Vehicle preview card with rego, make, model, color, and bay
- Customer search with "New Customer" option
- Driver selection (same or different from customer)
- Quick duration toggles (6 hrs, 1 day, 2 days, custom)
- Fuel policy selection
- Terms agreement checkbox

### 3. Check-In Modal
Intuitive vehicle return process:
- Four outcome options: Ready to Go, Cleaning, Hold, Service
- Visual outcome cards with icons
- Conditional notes field for Hold/Cleaning outcomes
- Color-coded status indicators

### 4. Washer Console
Tablet-optimized cleaning workflow:
- Current job display with progress tracking
- Large touch-friendly action buttons
- "Up Next" queue with priority indicators
- Real-time progress bar (simulated)
- Quick job controls: Pause, Flag Issue, Complete

### 5. Fleet Management
Comprehensive vehicle data table:
- Sortable columns (Rego, Make/Model, Status, Expiry)
- Multi-filter system (status, search)
- Rego expiry warnings (amber <30 days, red <7 days)
- Responsive hover states
- Real-time vehicle count

## 🎨 Component Library

### Button
```tsx
<Button variant="primary|secondary|ghost|danger" size="sm|md|lg">
  Text
</Button>
```

### KPICard
```tsx
<KPICard 
  label="READY" 
  value={23} 
  sublabel="Available"
  accentColor="coral|blue|amber|red|green|neutral"
  urgent={false}
/>
```

### CarTile
```tsx
<CarTile
  rego="ABC-123"
  make="Toyota"
  model="Camry"
  color="White"
  bay="Bay 7"
  isSelected={false}
  onClick={() => {}}
/>
```

### StatusBadge
```tsx
<StatusBadge variant="available|out|hold|service|ready|cleaning|overdue|ok|late">
  Status Text
</StatusBadge>
```

### Modal
```tsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="sm|md|lg"
  footer={<Button>Confirm</Button>}
>
  Content
</Modal>
```

## 🎨 Color Palette

### Backgrounds
- Primary: `#0C0C0D`
- Elevated (cards): `#141416`
- Hover: `#1A1A1D`

### Borders
- Subtle: `#2A2A2E`
- Hover: `#3A3A3F`

### Brand
- Primary (Coral): `#F97066`
- Coral Hover: `#FDA29B`
- Purple: `#7C3AED`

### Status Colors
- Success/Ready: `#10B981`
- Warning: `#F59E0B`
- Danger/Overdue: `#EF4444`
- Info/Out: `#3B82F6`
- Neutral/Hold: `#6B7280`

### Text
- Primary: `#FAFAFA`
- Secondary: `#A1A1AA`
- Tertiary: `#71717A`

## 🔤 Typography

- **Font Family**: Inter (body), JetBrains Mono (data/regos)
- **Page Title**: 32px / Bold
- **Section Header**: 18px / Semibold
- **Card Title**: 14px / Semibold
- **Body Text**: 14px / Regular
- **Small Label**: 12px / Medium / Uppercase

## 🎬 Animations

All animations follow Retool's subtle, professional approach:
- Modal open/close: 150ms fade + scale
- Hover states: 150ms ease
- Button press: Scale to 0.98 for 100ms
- Smooth transitions throughout

## 📊 Mock Data

The application includes comprehensive mock data:
- 27 vehicles with varying statuses
- 5 active loans with different due dates
- 3 cleaning jobs with priorities
- 2 hold items with reasons
- Realistic vehicle details (rego, make, model, year, color, bay)

## 🚀 Usage

Navigate between pages using the sidebar:
1. **Today Dashboard** - Daily operations center
2. **Washer Console** - Cleaning workflow management
3. **Fleet Management** - Complete vehicle data view

## 🎯 Key Interactions

- Click car tiles to select for checkout
- Use "Check Out" button to open checkout modal
- Click table headers to sort in Fleet Management
- Start cleaning jobs in Washer Console
- Monitor progress bars for active cleaning jobs
- Filter and search across all views

## 💎 Quality Standards

This dashboard meets enterprise-grade quality:
- ✅ Retool-inspired premium aesthetic
- ✅ Responsive and accessible
- ✅ Consistent spacing and alignment
- ✅ Professional micro-interactions
- ✅ Clean, maintainable component structure
- ✅ Type-safe with TypeScript
- ✅ Optimized for daily operational use

---

**Built with React + TypeScript + Tailwind CSS**
