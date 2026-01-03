# Fleet Command - Component Library

A comprehensive component library following Retool's design aesthetic for the Fleet Command dashboard.

## 🎨 Design Tokens

### Colors

```css
/* Backgrounds */
--retool-bg-primary: #0C0C0D
--retool-bg-elevated: #141416
--retool-bg-hover: #1A1A1D

/* Borders */
--retool-border-subtle: #2A2A2E
--retool-border-hover: #3A3A3F

/* Brand */
--retool-coral: #F97066
--retool-coral-hover: #FDA29B
--retool-purple: #7C3AED

/* Status */
--retool-success: #10B981
--retool-warning: #F59E0B
--retool-danger: #EF4444
--retool-info: #3B82F6
--retool-neutral: #6B7280

/* Text */
--retool-text-primary: #FAFAFA
--retool-text-secondary: #A1A1AA
--retool-text-tertiary: #71717A
```

## 📦 Components

### Button

**Variants:** `primary` | `secondary` | `ghost` | `danger`  
**Sizes:** `sm` | `md` | `lg`

```tsx
import { Button } from './components/Button';

// Primary button (coral)
<Button variant="primary" size="md">
  Confirm
</Button>

// Secondary button (outlined)
<Button variant="secondary">
  Cancel
</Button>

// Ghost button (transparent)
<Button variant="ghost" size="sm">
  View All
</Button>

// Danger button (red)
<Button variant="danger">
  Delete
</Button>
```

**Features:**
- Active state scales to 0.98
- 150ms transition timing
- Disabled state with 50% opacity
- Supports icons as children

---

### KPICard

Displays key performance indicators with optional accent colors.

```tsx
import { KPICard } from './components/KPICard';

<KPICard 
  label="READY" 
  value={23} 
  sublabel="Available"
  accentColor="coral"
  urgent={false}
  onClick={() => console.log('clicked')}
/>
```

**Props:**
- `label`: string - Uppercase label (e.g., "READY")
- `value`: number | string - Main metric
- `sublabel`: string - Description below value
- `accentColor?`: 'coral' | 'blue' | 'amber' | 'red' | 'green' | 'neutral'
- `urgent?`: boolean - Shows pulsing indicator dots
- `onClick?`: () => void - Optional click handler

**Features:**
- 2px left border accent when color specified
- Hover state with border color change
- Optional shadow on hover when clickable
- Pulsing animation for urgent items

---

### CarTile

Visual tile for vehicle selection.

```tsx
import { CarTile } from './components/CarTile';

<CarTile
  rego="ABC-123"
  make="Toyota"
  model="Camry"
  color="White"
  bay="Bay 7"
  isSelected={false}
  onClick={() => handleSelect('car-id')}
/>
```

**Props:**
- `rego`: string - Registration number (monospace font)
- `make`: string - Vehicle make
- `model`: string - Vehicle model
- `color`: string - Color name
- `bay`: string - Bay location
- `isSelected?`: boolean - Shows checkmark and coral border
- `onClick?`: () => void - Selection handler

**Features:**
- 160px × 120px fixed size
- Color dot indicator
- Bay location with pin icon
- Coral border when selected
- Checkmark overlay when selected
- Hover state with border highlight

---

### StatusBadge

Colored badge for status indicators.

**Variants:** `available` | `out` | `hold` | `service` | `ready` | `cleaning` | `overdue` | `due-soon` | `ok` | `late`

```tsx
import { StatusBadge } from './components/StatusBadge';

<StatusBadge variant="available">Available</StatusBadge>
<StatusBadge variant="overdue">LATE</StatusBadge>
<StatusBadge variant="ok">● Urgent</StatusBadge>
```

**Color Mapping:**
- `available`, `ready`, `ok` → Green
- `out`, `cleaning` → Blue
- `overdue`, `late` → Red
- `due-soon` → Amber
- `hold`, `service` → Gray

**Features:**
- 6px border radius (rounded rectangle)
- Semi-transparent background
- Matching text color
- 12px font size

---

### Modal

Overlay modal with backdrop blur.

```tsx
import { Modal } from './components/Modal';
import { Button } from './components/Button';

<Modal
  isOpen={true}
  onClose={() => setOpen(false)}
  title="Check Out Vehicle"
  size="md"
  footer={
    <>
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

**Props:**
- `isOpen`: boolean - Controls visibility
- `onClose`: () => void - Close handler
- `title?`: string - Optional header title
- `children`: ReactNode - Modal content
- `footer?`: ReactNode - Optional footer content
- `size?`: 'sm' | 'md' | 'lg' - Width (max-w-md | max-w-xl | max-w-3xl)

**Features:**
- Backdrop: 80% opacity with 8px blur
- Scale animation: 0.95 → 1.0
- Fade in/out: 150ms
- Auto-locks body scroll when open
- Click outside to close

---

### Input

Styled text input with optional label.

```tsx
import { Input } from './components/Input';

<Input
  label="Customer"
  placeholder="Search customers..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error="This field is required"
/>
```

**Props:**
- `label?`: string - Label above input
- `error?`: string - Error message below
- All standard input props supported

**Features:**
- Dark background (#0C0C0D)
- Subtle border (#2A2A2E)
- Coral focus border
- Error state with red text

---

### Select

Dropdown select with custom styling.

```tsx
import { Select } from './components/Select';

<Select
  label="Fuel Policy"
  value={policy}
  onChange={(e) => setPolicy(e.target.value)}
  options={[
    { value: 'same', label: 'Return at same level' },
    { value: 'full', label: 'Return with full tank' }
  ]}
/>
```

**Props:**
- `label?`: string - Label above select
- `options`: Array<{ value: string; label: string }>
- All standard select props supported

**Features:**
- Custom chevron icon
- Matches Input styling
- Dark background
- Coral focus border

---

### ToggleGroup

Button group for mutually exclusive options.

```tsx
import { ToggleGroup } from './components/ToggleGroup';

<ToggleGroup
  options={[
    { value: '6hrs', label: '6 hrs' },
    { value: '1day', label: '1 day' },
    { value: '2days', label: '2 days' }
  ]}
  value={duration}
  onChange={setDuration}
/>
```

**Props:**
- `options`: Array<{ value: string; label: string }>
- `value`: string - Currently selected value
- `onChange`: (value: string) => void

**Features:**
- Pill-style buttons
- Selected: coral fill (#F97066)
- Unselected: dark with border
- Smooth transition between states

---

### ProgressBar

Animated progress indicator.

```tsx
import { ProgressBar } from './components/ProgressBar';

<ProgressBar value={45} showLabel={true} />
```

**Props:**
- `value`: number - 0-100
- `showLabel?`: boolean - Shows percentage (default: true)

**Features:**
- Coral fill color
- Dark track background
- Smooth 300ms transitions
- Percentage label

---

### Toast

Notification toast for success/error messages.

```tsx
import { Toast } from './components/Toast';

<Toast
  message="Vehicle checked out successfully"
  type="success"
  onClose={() => setToast(null)}
  duration={3000}
/>
```

**Props:**
- `message`: string - Toast message
- `type`: 'success' | 'error'
- `onClose`: () => void
- `duration?`: number - Auto-dismiss time (ms, default: 3000)

**Features:**
- Success: Green background, auto-dismisses
- Error: Red background, manual dismiss
- Fixed top-right position
- Slide-in animation
- Checkmark/warning icon

---

### EmptyState

Friendly empty state placeholders.

```tsx
import { EmptyState } from './components/EmptyState';

<EmptyState
  type="no-due-backs"
  title="No cars due back today"
  description="All caught up! Check the fleet status for upcoming returns."
/>
```

**Props:**
- `type`: 'no-due-backs' | 'cleaning-empty'
- `title`: string
- `description`: string

**Features:**
- Large icon (16×16)
- Centered layout
- Muted colors
- Professional tone

---

## 🎯 Usage Guidelines

### Spacing
- Use 8px base grid for consistency
- Cards: 20px padding
- Gaps: 12px (sm), 16px (md), 24px (lg)

### Typography
- Use Inter for UI text
- Use JetBrains Mono for data (regos, numbers)
- Don't override font sizes unless necessary

### Colors
- Always use status colors semantically
- Green = success/ready
- Red = danger/overdue
- Amber = warning
- Blue = info/active
- Gray = neutral/hold

### Animations
- Keep transitions subtle (150ms)
- Use ease-out for entering
- Use ease-in for exiting
- Avoid flashy effects

### Accessibility
- Maintain color contrast (WCAG AA)
- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works

---

## 📱 Responsive Considerations

### Desktop (1440px)
- Today Dashboard
- Fleet Management

### Tablet (1024px)
- Washer Console (optimized)
- Larger touch targets (48px min)

### Mobile
- Not currently optimized
- Future enhancement opportunity

---

## 🔧 Customization

All components accept className prop for overrides:

```tsx
<Button className="w-full">
  Full Width Button
</Button>
```

Use Tailwind utilities to extend base styles without modifying components.

---

## ✅ Quality Checklist

- [ ] Consistent border radius (8px buttons, 12px cards)
- [ ] Proper color usage (semantic status colors)
- [ ] Smooth transitions (150ms standard)
- [ ] Accessible contrast ratios
- [ ] Keyboard navigation support
- [ ] Touch-friendly targets (washer console)
- [ ] Loading states where needed
- [ ] Error states with helpful messages
- [ ] Empty states with clear CTAs
- [ ] Professional micro-interactions

---

**Component Library Version 1.0**  
*Built for Fleet Command Dashboard*
