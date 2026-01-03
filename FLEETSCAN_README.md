# Fleet Scan - Mobile Vehicle Inspection App

## Overview

Fleet Scan is a premium mobile-first React web application for vehicle loan inspections. It integrates AI-powered damage detection and dashboard data extraction to streamline the inspection process for automotive workshop staff.

## Features

### 🚗 Complete Inspection Workflow
1. **Vehicle Lookup** - Enter or scan vehicle registration
2. **Inspection Type** - Choose Pre-Loan or Return inspection
3. **Exterior Photos** - Capture 4 angle photos (Front, Rear, Left, Right)
4. **AI Damage Analysis** - Automatic damage detection and comparison
5. **Dashboard Capture** - AI extraction of odometer and fuel level
6. **Review & Submit** - Comprehensive inspection summary
7. **Success Confirmation** - Reference number and email confirmation

### 📸 Photo Capture System
- Full-screen native camera interface
- Car guide overlays for proper framing
- Flash control and camera switching
- Auto-advance between angles
- Retake functionality
- Photo compression for upload

### 🤖 AI Features (Mock Implementation)
- **Damage Detection**: Compares current photos with previous inspection
  - Detects scratches, dents, cracks, scuffs, chips, broken parts
  - Classifies severity (minor, moderate, severe)
  - Highlights new vs existing damage
  - User confirmation required for new damage

- **Dashboard Data Extraction**: OCR from dashboard photo
  - Reads odometer (km)
  - Detects fuel gauge level (%)
  - Confidence scoring
  - Manual override capability
  - Anomaly detection (negative distance, unusual trips)

### 💾 State Management
- React Context for inspection state
- LocalStorage draft persistence
- Resume interrupted inspections
- Recent vehicles quick access

### 🎨 Design System
- **Dark Theme**: Matches Retool aesthetic
- **Colors**:
  - Background: #0C0C0D
  - Cards: #141416
  - Borders: #2A2A2E
  - Coral Accent: #F97066
  - Success: #10B981
  - Warning: #F59E0B
  - Danger: #EF4444
- **Typography**: Inter font family, JetBrains Mono for rego/data
- **Animations**: 150ms subtle transitions
- **Mobile-First**: 375px primary, responsive to tablet (768px)

## File Structure

```
/src/app/fleetscan/
├── FleetScanApp.tsx              # Main app container & routing
├── context/
│   └── InspectionContext.tsx     # State management
├── screens/
│   ├── VehicleLookup.tsx         # Screen 1: Rego entry
│   ├── InspectionType.tsx        # Screen 2: Pre-loan/Return
│   ├── ExteriorPhotos.tsx        # Screen 3: Photo capture
│   ├── DamageAnalysis.tsx        # Screen 4: AI damage detection
│   ├── DashboardCapture.tsx      # Screen 5: Dashboard photo & OCR
│   ├── ReviewSubmit.tsx          # Screen 6: Review & submit
│   └── Success.tsx               # Screen 7: Confirmation
├── components/
│   ├── VehicleCard.tsx           # Vehicle info display
│   ├── PhotoCapture.tsx          # Camera interface
│   ├── PhotoThumbnail.tsx        # Photo preview
│   ├── DamageCard.tsx            # Damage item card
│   ├── StepIndicator.tsx         # Progress indicator
│   └── SubmitButton.tsx          # Primary action button
└── utils/
    └── mockApi.ts                # Mock API endpoints
```

## Mock Data

The app includes mock vehicles:
- **ABC-123**: Toyota Camry 2022 (White) - Has existing damage
- **XYZ-789**: Mazda CX-5 2023 (Grey) - No damage
- **DEF-456**: Honda Accord 2021 (Black) - Has existing damage

## API Integration Points

### Mock Endpoints (to be replaced with real APIs)

**1. Vehicle Lookup**
```typescript
await lookupVehicle(rego: string)
// Returns: Vehicle object with make, model, color, last inspection, existing damage
```

**2. Damage Analysis**
```typescript
await analyzeDamage(photos: string[], vehicleId: string)
// Input: Array of base64 images + vehicle ID
// Returns: { newDamage[], existingDamage[], confidence }
```

**3. Dashboard Extraction**
```typescript
await extractDashboardData(photo: string)
// Input: Base64 image of dashboard
// Returns: { odometer, fuelLevel, confidence }
```

**4. Rego Plate OCR**
```typescript
await scanRegoPlate(photo: string)
// Input: Base64 image of number plate
// Returns: { rego, confidence }
```

**5. Submit Inspection**
```typescript
await submitInspection()
// Input: Full inspection payload
// Returns: { success, reference }
```

## Real AI Integration

To integrate real AI:

### Option 1: OpenAI GPT-4 Vision (Recommended)
- Best for damage detection and dashboard OCR
- High accuracy
- Good at understanding context
- Cost: ~$0.01-0.03 per image

### Option 2: Google Cloud Vision
- Fast processing
- Good OCR accuracy
- Structured data extraction
- Cost: ~$1.50 per 1000 images

### Option 3: Azure Computer Vision
- Enterprise-grade
- Excellent OCR
- Good for compliance
- Cost: ~$1.00 per 1000 images

See `/AI_INTEGRATION_GUIDE.md` for detailed integration steps.

## Usage

### Access FleetScan
1. Open the main app
2. Click "Fleet Scan" in the sidebar
3. Full-screen mobile app launches

### Perform Inspection
1. Enter vehicle rego (e.g., ABC-123)
2. Select Pre-Loan or Return
3. Capture 4 exterior photos
4. Review AI damage detection, confirm new items
5. Capture dashboard photo
6. Review AI extracted odometer/fuel
7. Add optional notes
8. Confirm and submit
9. Receive reference number

### Resume Draft
- App auto-saves progress to localStorage
- Interrupted inspections can be resumed
- Draft cleared on successful submission

## Key Components

### InspectionContext
- Manages entire inspection state
- Handles photo storage
- Damage item management
- Dashboard data
- Draft persistence

### PhotoCapture
- Native camera API integration
- Full-screen capture interface
- Flash and camera switching
- Overlay guides
- Haptic feedback

### StepIndicator
- Visual progress through workflow
- Shows current step (1 of 3)
- Completed step markers

## Validation & Error Handling

### Photo Validation
- Minimum 4 exterior photos required
- Size limit: 10MB per image
- Compression before upload

### Dashboard Validation
- Odometer must not decrease
- Flags unusual trip distances (>500km)
- Manual override available

### Damage Confirmation
- All new damage must be confirmed or marked pre-existing
- Cannot continue until resolved

### Submission
- All required fields validated
- Confirmation checkbox required
- Loading states during submission
- Error handling with retry

## Performance

- Images compressed to max 2MB
- LocalStorage for draft persistence
- Lazy loading of screens
- Optimized re-renders with React Context
- Smooth 60fps animations

## Browser Support

- Modern browsers with camera API support
- Chrome/Safari on iOS
- Chrome on Android
- Not supported: IE11, older mobile browsers

## Future Enhancements

1. **Real AI Integration**: Connect to vision APIs
2. **Offline Mode**: Queue submissions when offline
3. **Photo Editing**: Crop, rotate, adjust photos
4. **Voice Notes**: Add audio notes to inspection
5. **GPS Tagging**: Location metadata for photos
6. **PDF Reports**: Generate printable inspection reports
7. **Multi-Language**: Support for other languages
8. **Barcode Scanner**: Quick VIN scanning
9. **Signature Capture**: Customer sign-off
10. **History View**: Browse past inspections

## Testing

### Mock Flow
1. Launch FleetScan
2. Type "ABC-123" or use "Scan Rego Plate" simulator
3. Select "Pre-Loan Inspection"
4. Capture 4 photos (uses device camera)
5. Review AI-detected damage (2 new items)
6. Confirm or mark as pre-existing
7. Capture dashboard photo
8. Review extracted odometer/fuel
9. Add notes
10. Submit
11. View success screen with reference

### Camera Permissions
- App will request camera access on first photo capture
- Ensure browser has camera permissions granted
- Use HTTPS for camera API to work

## Production Checklist

- [ ] Replace mock APIs with real endpoints
- [ ] Add authentication/authorization
- [ ] Implement proper image storage (S3, CloudFlare, etc.)
- [ ] Add error tracking (Sentry)
- [ ] Set up analytics
- [ ] Configure CDN for assets
- [ ] Add rate limiting
- [ ] Implement offline queue
- [ ] Add loading skeletons
- [ ] Optimize bundle size
- [ ] Add E2E tests
- [ ] Set up CI/CD pipeline

## License

Proprietary - Fleet Command Workshop Manager
