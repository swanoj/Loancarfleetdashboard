# Fleet Scan - Quick Start Guide

## 🚀 Launch the App

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Access Fleet Scan**:
   - Open your browser to the app
   - Click **"Fleet Scan"** in the left sidebar
   - The mobile app will launch in full-screen mode

## 📱 Test the Complete Flow

### Step 1: Vehicle Lookup
1. You'll see the Fleet Scan home screen with a camera icon
2. Enter a test registration: **ABC-123**
3. The app will load the vehicle details (Toyota Camry 2022, White)
4. Click **Continue**

**Alternative**: Click "Scan Rego Plate" → Click "Simulate Scan" for quick testing

### Step 2: Inspection Type
1. Choose between:
   - **Pre-Loan Inspection** (taking vehicle out)
   - **Return Inspection** (bringing vehicle back)
2. Click your choice

### Step 3: Exterior Photos
1. You'll see 4 angle buttons: FRNT, REAR, L, R
2. Click the main capture area to open the camera
3. **Grant camera permissions** when prompted
4. Capture a photo (point at anything - it's just for testing)
5. The app auto-advances to the next angle
6. Repeat for all 4 angles
7. Click **Continue (4/4 done)**

**Tips**:
- You can retake any photo by clicking its thumbnail
- The car guide overlay helps with framing
- Flash and camera switch controls are in the top-right

### Step 4: AI Damage Analysis
1. **Wait 3 seconds** while the AI analyzes photos
2. You'll see:
   - **2 New Damage Items** detected (mock data)
     - Scratch on left rear quarter
     - Dent on front bumper
   - **3 Existing Damage Items** (unchanged)
3. **Confirm each new damage**:
   - Click "Confirm New" or "Pre-Existing" for each item
4. Once all confirmed, click **Continue**

### Step 5: Dashboard Capture
1. Click the main capture area to open camera
2. Point at any dashboard (or any image with numbers)
3. Capture the photo
4. **Wait 2.5 seconds** while AI extracts data
5. You'll see:
   - **Odometer**: ~47,832 km (randomly generated)
   - **Fuel Level**: ~75% (randomly generated)
6. **Optional**: Click "Edit if incorrect" to manually adjust
7. Check the trip distance calculation
8. Click **Continue to Review**

**Note**: If odometer is lower than previous, you'll see a warning

### Step 6: Review & Submit
1. Review all inspection details:
   - Vehicle info
   - Dashboard readings (odometer + fuel)
   - Damage report summary
   - Photo gallery
2. **Add notes** (optional): "Customer mentioned slight pull to left"
3. **Check the confirmation box**: "I confirm this inspection is accurate"
4. Click **Submit Inspection**

### Step 7: Success
1. **Wait 1.5 seconds** while submitting
2. See the success screen with:
   - ✓ Checkmark with confetti animation
   - Reference number (e.g., INS-2025-0104-001)
   - Email confirmation
3. Options:
   - **Start New Inspection** - Reset and start over
   - **View Inspection History** - (placeholder)

## 🎯 Quick Test Vehicles

| Rego    | Vehicle             | Color | Existing Damage |
|---------|---------------------|-------|-----------------|
| ABC-123 | Toyota Camry 2022   | White | Yes (3 items)   |
| XYZ-789 | Mazda CX-5 2023     | Grey  | None            |
| DEF-456 | Honda Accord 2021   | Black | Yes (1 item)    |

## 📸 Camera Permissions

### First Time Setup
1. Browser will prompt: "Allow camera access?"
2. Click **Allow**
3. If you blocked it, go to browser settings:
   - **Chrome**: Click lock icon → Camera → Allow
   - **Safari**: Settings → Website Settings → Camera → Allow

### Desktop Testing
- Use built-in webcam
- Photos can be of anything - the AI is mocked
- Real implementation would require actual vehicle/dashboard photos

### Mobile Testing
- Open in mobile browser (Chrome/Safari)
- Use rear camera for best results
- App is optimized for mobile (375px)

## 🔄 Resume Draft

The app automatically saves your progress!

1. **Start an inspection** but don't finish it
2. **Close the browser** or **refresh**
3. **Return to Fleet Scan**
4. The app will have your draft saved in LocalStorage
5. To resume: You'd need to implement a "Resume Draft" button on the lookup screen

## 🐛 Troubleshooting

### Camera Not Working
- **Check permissions** in browser settings
- **Use HTTPS** (camera API requires secure context)
- **Try different browser** (Chrome recommended)
- **Check device camera** is working in other apps

### Photos Not Advancing
- Each angle can only have one photo
- Retaking a photo replaces the previous one
- Check you've captured all 4 required angles

### Can't Submit
- Ensure all new damage is confirmed
- Check the confirmation checkbox is ticked
- Dashboard data must be captured

### Mock Data Not Realistic
This is expected! The AI is simulated:
- Damage detection is random
- Dashboard readings are random
- Real implementation needs actual AI APIs

## 🎨 Design Features to Notice

### Animations
- **Fade-in** on screen transitions
- **Scale animation** on success checkmark
- **Confetti** on successful submission
- **Progress bars** during AI processing
- **Smooth transitions** (150ms)

### Mobile-First Design
- Optimized for phone screens (375px)
- Large touch targets
- Full-screen camera
- Bottom-fixed action buttons
- Swipe-friendly layouts

### Dark Theme
- Retool-inspired aesthetic
- Near-black backgrounds (#0C0C0D)
- Coral accent (#F97066)
- High contrast for readability
- Premium professional feel

### Typography
- **Inter** for UI text
- **JetBrains Mono** for rego plates and data
- Clear hierarchy
- Readable on small screens

## 🔧 Advanced Testing

### Test Anomaly Detection
1. Edit dashboard reading manually
2. Set odometer to **40,000** (lower than previous 47,654)
3. See the red warning: "Odometer Decreased"
4. Or set to **60,000** (jump of 12k+)
5. See orange warning: "Unusual Distance"

### Test Damage Confirmation Flow
1. On damage analysis screen, mark new damage as "Pre-Existing"
2. Notice it moves to "Existing Damage" section
3. You can't continue until all new items are resolved

### Test Photo Retakes
1. Capture all 4 angles
2. Click on any thumbnail
3. Retake that specific angle
4. Notice it replaces in the gallery

## 📊 What's Mocked vs Real

### Currently Mocked (Demo Mode)
- ✅ Vehicle lookup (3 test vehicles)
- ✅ Damage detection (random results)
- ✅ Dashboard OCR (random readings)
- ✅ Rego plate scanning (returns random rego)
- ✅ Submission (generates reference number)
- ✅ AI processing delays (simulated)

### Real in Production
- ✅ Photo capture (actual device camera)
- ✅ State management (React Context)
- ✅ Draft persistence (LocalStorage)
- ✅ Form validation
- ✅ UI/UX flow
- ✅ Responsive design

## 🚢 Ready for Production

To make this production-ready:
1. **Replace mock APIs** with real endpoints
2. **Integrate AI services** (OpenAI, Google, Azure)
3. **Add authentication** (user login)
4. **Setup image storage** (S3, CloudFlare R2)
5. **Add error tracking** (Sentry)
6. **Implement offline mode** (Service Worker)
7. **Add analytics** (Mixpanel, PostHog)

See `/AI_INTEGRATION_GUIDE.md` for AI setup details.

## 💡 Pro Tips

1. **Mobile testing**: Use Chrome DevTools device emulation
2. **Fast testing**: Use "Scan Rego Plate" simulator
3. **Skip photos**: Just capture 4 quick photos of anything
4. **Multiple tests**: Each submission generates new reference
5. **Recent vehicles**: App remembers last 3 vehicles scanned

## 🎓 Learning the Codebase

Start with these files:
1. `/src/app/fleetscan/FleetScanApp.tsx` - Main routing
2. `/src/app/fleetscan/context/InspectionContext.tsx` - State management
3. `/src/app/fleetscan/screens/VehicleLookup.tsx` - First screen
4. `/src/app/fleetscan/utils/mockApi.ts` - Mock data

## 🙋 Need Help?

Check these resources:
- `/FLEETSCAN_README.md` - Full documentation
- `/AI_INTEGRATION_GUIDE.md` - AI setup guide
- `/COMPONENTS.md` - Component library

---

**Enjoy testing Fleet Scan! 🚗📸**
