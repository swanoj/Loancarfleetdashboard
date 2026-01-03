# Fleet Command - GPS Tracking System Guide

## 🎯 Overview

The GPS Tracking System enables real-time location monitoring of loan vehicles through the Fleet Scan Customer Hub mobile app and a comprehensive Live Tracking dashboard in Fleet Command.

---

## 📱 Customer Hub (Mobile/Web App)

### Access
Navigate to: **Fleet Scan** → **Customer Hub** (accessed via Fleet Scan app)

### Features

#### 1. **Start Loan**
- Customer initiates GPS tracking
- Automatically creates loan record with:
  - Unique Loan ID
  - Vehicle details (rego, make, model)
  - Customer information
  - Start time & due back time
  - GPS coordinates

#### 2. **Real-Time Tracking**
- **High-Accuracy GPS**: Uses device's geolocation API with enableHighAccuracy
- **Continuous Updates**: Sends location every few seconds
- **Live Status Indicator**: Green pulsing dot shows active tracking
- **Current Location Display**:
  - Latitude & Longitude (6 decimal precision)
  - Accuracy (in meters)
  - Speed (in km/h)
  - Last update timestamp

#### 3. **Tracking Controls**
- **Pause Tracking**: Temporarily stop GPS updates
- **Resume Tracking**: Restart GPS monitoring
- **End Loan**: Complete the loan and stop tracking

#### 4. **Data Display**
- Vehicle card with rego number
- Customer information
- Loan duration counter
- Location update count
- All coordinates displayed in monospace font

#### 5. **Privacy & Transparency**
- Clear notification: "Location Services Required"
- Visible tracking status at all times
- Customer can see all data being collected

---

## 🖥️ Live Tracking Dashboard

### Access
Navigate to: **Fleet Command Dashboard** → **Live Tracking** (sidebar navigation)

### Features

#### 1. **Overview Stats**
- **Active Vehicles**: Total vehicles currently being tracked
- **Location Updates**: Cumulative GPS points received
- **Last Update**: Most recent timestamp across all vehicles

#### 2. **Real-Time Vehicle Cards**
Each tracked vehicle displays:
- Vehicle rego number (large, monospace)
- Customer name
- "Live" status indicator (pulsing green dot)
- Current GPS coordinates
- Accuracy measurement
- "Open in Google Maps" button
- Journey statistics:
  - Duration (hours/minutes since start)
  - Distance traveled (calculated)
  - Total location updates

#### 3. **Auto-Refresh**
- **Toggle**: ON/OFF button
- **Interval**: Updates every 10 seconds when enabled
- **Manual Refresh**: "Refresh Now" button for instant updates

#### 4. **Journey History Modal**
Click "View Journey History" on any vehicle to see:
- **Full Location Timeline**: All GPS points in reverse chronological order
- **Details for Each Point**:
  - Timestamp
  - Latitude & Longitude
  - Accuracy
  - "Map" link to open in Google Maps
- **Current Location Badge**: Highlights most recent point

#### 5. **Map Integration**
- Direct links to Google Maps for each coordinate
- Shows exact location for investigation/verification
- Useful for customer support or incident investigation

---

## 🔧 Technical Architecture

### Frontend (Customer Hub)

**Location**: `/src/app/fleetscan/screens/CustomerHub.tsx`

**Key Technologies**:
- React with hooks (useState, useEffect)
- Navigator Geolocation API
- LocalStorage for persistence
- Automatic position watching

**Data Flow**:
1. Customer clicks "Start Loan"
2. Mock loan created (in production, from check-out)
3. GPS tracking starts via `navigator.geolocation.watchPosition()`
4. Location updates sent to backend every few seconds
5. Stored in localStorage for app resilience

**Configuration**:
```typescript
{
  enableHighAccuracy: true,  // Use GPS, not cell tower
  timeout: 5000,             // 5 second timeout
  maximumAge: 0              // Always get fresh location
}
```

### Backend (Hono Server)

**Location**: `/supabase/functions/server/index.tsx`

**Endpoints**:

1. **POST `/tracking/update`**
   - Receives location data from Customer Hub
   - Stores in KV store with key `tracking:{loanId}`
   - Maintains active tracking index
   - Appends to location history array

2. **POST `/tracking/end`**
   - Marks tracking as inactive
   - Sets end timestamp
   - Removes from active index

3. **GET `/tracking/active`**
   - Returns all active tracked vehicles
   - Used by Live Tracking dashboard
   - Filters for active status only

4. **GET `/tracking/:loanId`**
   - Retrieves specific loan's tracking data
   - Returns full location history

**Data Structure**:
```typescript
{
  loanId: string,
  carRego: string,
  customerName: string,
  startTime: ISO timestamp,
  lastUpdate: ISO timestamp,
  locations: [
    {
      lat: number,
      lng: number,
      timestamp: ISO string,
      speed?: number,
      accuracy?: number
    },
    ...
  ],
  active: boolean,
  endTime?: ISO timestamp
}
```

**Storage**:
- Uses Supabase KV store (key-value database)
- Key format: `tracking:{loanId}`
- Active index: `tracking:active` (array of loan IDs)
- No size limits on location history

### Frontend (Dashboard)

**Location**: `/src/app/pages/LiveTracking.tsx`

**Key Features**:
- Polls `/tracking/active` endpoint
- Auto-refresh toggle (10-second interval)
- Distance calculation using Haversine formula
- Duration formatting (hours/minutes)
- Modal system for journey history

**Distance Calculation**:
```typescript
// Haversine formula for distance between two GPS points
// Returns kilometers traveled between coordinates
```

---

## 🚀 Usage Workflow

### Customer Flow:
1. **Open Fleet Scan** on mobile device
2. **Navigate to Customer Hub**
3. **Click "Start Loan"**
4. **Grant location permissions** when prompted by browser
5. **Keep app open** for continuous tracking
6. **Monitor journey** - see live coordinates
7. **End loan** when returning vehicle

### Fleet Manager Flow:
1. **Open Fleet Command Dashboard**
2. **Click "Live Tracking"** in sidebar
3. **View all active vehicles** in real-time
4. **Enable auto-refresh** for hands-free monitoring
5. **Click vehicle cards** for detailed journey history
6. **Open locations in Google Maps** for context

---

## 📊 Use Cases

### 1. **Fleet Oversight**
- Monitor all loan vehicles simultaneously
- Verify customers are within expected areas
- Real-time visibility of fleet utilization

### 2. **Customer Support**
- Quickly locate vehicles for roadside assistance
- Verify customer location claims
- Provide accurate ETAs for returns

### 3. **Incident Investigation**
- Full journey history available
- Timestamp-accurate location data
- Distance traveled calculations

### 4. **Operational Analytics**
- Journey duration tracking
- Distance monitoring
- Usage pattern analysis

### 5. **Asset Security**
- Detect unexpected movements
- Geofence monitoring (future enhancement)
- Rapid response to issues

---

## 🔐 Privacy & Compliance

### Customer Transparency:
✅ Clear notification before tracking starts
✅ Visible tracking status at all times
✅ Customer can pause/resume tracking
✅ All data visible to customer

### Data Collection:
- GPS coordinates (latitude/longitude)
- Accuracy measurements
- Speed (if available)
- Timestamps
- Associated with loan ID and vehicle

### Best Practices:
- Only track during active loans
- Delete tracking data after loan completion
- Inform customers of tracking policy
- Use data only for operational purposes

---

## 🛠️ Future Enhancements

### Potential Features:
- **Geofencing**: Alerts when vehicles leave designated areas
- **Route Replay**: Animated playback of journey
- **Map View**: Interactive map with all vehicles plotted
- **Historical Reports**: Export journey data to CSV
- **Speed Alerts**: Notifications for excessive speed
- **Push Notifications**: Alert customers and managers
- **Battery Monitoring**: Track device battery during loan
- **Offline Support**: Queue updates when offline

---

## 🐛 Troubleshooting

### Customer Hub Issues:

**"Location error: User denied geolocation"**
- Customer needs to grant location permissions
- Check browser settings
- Try different browser (Chrome recommended)

**"Location error: Timeout"**
- Poor GPS signal
- Move outdoors for better accuracy
- Check device location settings

**Tracking paused unexpectedly**
- App may have gone to background
- Ask customer to keep app open
- Consider implementing wake lock API

### Dashboard Issues:

**No active vehicles showing**
- No customers have started loans
- Check Customer Hub is accessible
- Verify backend endpoints are running

**Auto-refresh not working**
- Toggle off and back on
- Check browser console for errors
- Verify network connectivity

**Stale data**
- Customer may have lost GPS signal
- Check "Last Update" timestamp
- Contact customer to verify app status

---

## 📝 Integration Points

### Existing Systems:
- **Check-Out Flow**: Can be integrated to auto-start tracking
- **Check-In Flow**: Can auto-end tracking on return
- **Fleet Management**: Links to vehicle records
- **Analytics Dashboard**: Journey data for reporting

### API Integration:
All endpoints follow standard REST patterns and return JSON with format:
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 🎯 Key Benefits

✅ **Real-Time Visibility**: Know where every loan vehicle is
✅ **Customer Safety**: Provide better support and assistance
✅ **Asset Protection**: Monitor fleet movements
✅ **Operational Efficiency**: Data-driven decision making
✅ **Professional Service**: Modern tracking capabilities
✅ **Compliance Ready**: Transparent tracking with customer consent

---

**System Status**: ✅ Fully Operational
**Last Updated**: January 3, 2026
**Version**: 1.0

For technical support or feature requests, contact the development team.
