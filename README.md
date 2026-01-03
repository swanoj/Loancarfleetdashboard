# Fleet Command - Loan Car Fleet Management Dashboard

A premium internal operations tool for automotive workshop loan car fleet management, inspired by Retool's sophisticated design aesthetic.

![Fleet Command Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

### Today Dashboard
- **Real-time KPI metrics** tracking ready, out, due today, overdue, and cleaning vehicles
- **Visual car selection** with interactive tiles showing rego, model, color, and bay location
- **Due back tracking** with time-based status indicators
- **Cleaning queue management** with priority flagging
- **Hold items monitoring** for vehicles requiring attention

### Washer Console
- **Tablet-optimized interface** with large touch targets (48px minimum)
- **Live progress tracking** for current cleaning jobs
- **Priority queue** showing urgent and normal jobs
- **Quick actions**: Start, Pause, Flag Issue, Complete
- **Real-time status updates**

### Fleet Management
- **Comprehensive vehicle table** with sortable columns
- **Advanced filtering** by status and search
- **Rego expiry warnings** (amber <30 days, red <7 days)
- **Multi-column sorting** for efficient data navigation
- **Real-time vehicle count** and status overview

## 🎨 Design System

### Color Palette
Based on Retool's sophisticated dark theme:

- **Backgrounds**: `#0C0C0D` (primary), `#141416` (elevated), `#1A1A1D` (hover)
- **Coral Primary**: `#F97066` with `#FDA29B` hover state
- **Status Colors**: Green (`#10B981`), Amber (`#F59E0B`), Red (`#EF4444`), Blue (`#3B82F6`)
- **Text**: `#FAFAFA` (primary), `#A1A1AA` (secondary), `#71717A` (tertiary)

### Typography
- **Font**: Inter (UI), JetBrains Mono (data)
- **Hierarchy**: Clear sizing from 12px labels to 48px KPI numbers
- **Weight**: Medium (500) for headings, Regular (400) for body

### Components
- **Buttons**: Primary (coral), Secondary (outlined), Ghost (transparent), Danger (red)
- **Cards**: 12px border-radius, subtle 1px borders, elevated backgrounds
- **Badges**: 6px border-radius, semi-transparent fills with matching text
- **Modals**: Backdrop blur, smooth animations, clear visual hierarchy

## 🚀 Quick Start

The application launches with the Today Dashboard and includes:
- **27 mock vehicles** with realistic data
- **5 active loans** with varying due dates
- **3 cleaning jobs** in the queue
- **2 vehicles on hold** with reasons

### Navigation
Use the sidebar to switch between:
1. **Today Dashboard** - Daily operations center
2. **Washer Console** - Cleaning workflow
3. **Fleet Management** - Full data table view

## 📱 Responsive Design

- **Desktop**: 1440px optimal (Dashboard & Fleet Management)
- **Tablet**: 1024px optimal (Washer Console)
- **Touch-friendly**: Minimum 48px touch targets in Washer Console

## 🎯 Key Interactions

1. **Select vehicles** by clicking car tiles
2. **Check out** vehicles with the modal workflow
3. **Sort tables** by clicking column headers
4. **Filter fleet** using status dropdown and search
5. **Start cleaning jobs** from the Washer Console
6. **Monitor progress** with real-time progress bars

## 🏗️ Technical Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Lucide React** - Icon library
- **Vite** - Build tool

## 📦 Component Library

All components are reusable and follow Retool's design principles:

- `Button` - 4 variants, 3 sizes
- `KPICard` - Metrics display with accent colors
- `CarTile` - Vehicle selection tiles
- `StatusBadge` - 10 status variants
- `Modal` - Overlays with blur backdrop
- `Input` - Form inputs with labels
- `Select` - Dropdowns with custom styling
- `ToggleGroup` - Button toggle groups
- `ProgressBar` - Animated progress tracking
- `EmptyState` - Friendly empty states

## 🎬 Animations

Subtle, professional animations throughout:
- **150ms** modal transitions with fade + scale
- **150ms** hover state transitions
- **100ms** button press feedback
- **No flashy effects** - maintains professional aesthetic

## 📊 Data Structure

```typescript
interface Car {
  id: string;
  rego: string;
  make: string;
  model: string;
  year: number;
  color: string;
  colorHex: string;
  bay: string;
  status: 'available' | 'out' | 'hold' | 'service' | 'cleaning';
  regoExpiry: string;
}
```

## 🎓 Best Practices

- ✅ Consistent 8px spacing grid
- ✅ Semantic color usage (status colors match meaning)
- ✅ Accessible contrast ratios (WCAG AA compliant)
- ✅ Clear visual hierarchy
- ✅ Professional micro-interactions
- ✅ Type-safe TypeScript throughout
- ✅ Component composition patterns

## 📄 Documentation

See [FLEET_COMMAND_GUIDE.md](./FLEET_COMMAND_GUIDE.md) for detailed component documentation and usage examples.

## 🎯 Quality Bar

This dashboard achieves enterprise-grade quality:
- Premium Retool-inspired aesthetic
- Production-ready component library
- Clean, maintainable code structure
- Professional enough for daily use
- Attention to every spacing and alignment detail

---

**Built with care for automotive workshop operations teams.**
