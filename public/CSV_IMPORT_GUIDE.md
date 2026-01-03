# Fleet Command - CSV Import Guide

## Your Real Fleet Data

Your actual loan car fleet has been loaded into the system! The following **48 vehicles** are now in Fleet Command:

### Vehicle Breakdown:
- **Mercedes-Benz (MB)**: 21 vehicles
- **BMW**: 11 vehicles  
- **VW (Volkswagen)**: 11 vehicles
- **Porsche**: 1 vehicle
- **Toyota**: 1 vehicle
- **Hyundai**: 1 vehicle
- **Saturn**: 1 vehicle

### Registration Examples:
- YOT95K, AW2RHE, VMR11R, YKX362, YO2B5A, YXN4HZ, YPS64E
- And 41 more real vehicles from your current fleet!

## CSV Import Template

A ready-to-use CSV file is available at `/public/fleet_import.csv` with all your current vehicles.

## How to Import More Vehicles

### Method 1: Using the Import Button
1. Click **"Import CSV"** button (bottom-left of Fleet Management page)
2. Download the template or upload your CSV
3. Review the preview
4. Click "Import"

### Method 2: CSV Format

```csv
rego,make,model,year,color,regoExpiry,bay,vin,odometer,fuelType,transmission,status
ABC123,Toyota,Camry,2023,White,2026-12-31,Bay 1,JT2BF18K0X0123456,45000,Petrol,Automatic,available
```

### Required Columns:
- **rego**: Registration number (e.g., "YOT95K", "ABC123")
- **make**: Manufacturer (e.g., "VW", "BMW", "MB")
- **model**: Model name (e.g., "Passat", "320D", "C200")
- **year**: Manufacturing year (1900-2026)
- **color**: Color name (White, Black, Silver, Grey, Red, Blue, Green, Yellow, Bronze, Gold)
- **regoExpiry**: Date in YYYY-MM-DD format (e.g., "2026-12-31")

### Optional Columns:
- **bay**: Parking bay location (e.g., "Bay 1")
- **vin**: Vehicle Identification Number
- **odometer**: Current kilometers
- **fuelType**: "Petrol" or "Diesel" (defaults to "Petrol")
- **transmission**: "Automatic" or "Manual" (defaults to "Automatic")
- **status**: available, out, hold, service, cleaning (defaults to "available")

## Color Mapping

The system automatically converts these color names to hex codes:
- White → #FFFFFF
- Black → #000000
- Silver → #C0C0C0
- Grey/Gray → #808080
- Red → #DC143C
- Blue → #4169E1
- Green → #228B22
- Yellow → #FFD700
- Bronze → #CD7F32
- Gold → #FFD700

## Tips for Best Results

1. **Use YYYY-MM-DD** date format for all dates
2. **Registration numbers** are automatically converted to UPPERCASE
3. **Missing optional fields** will use sensible defaults
4. **Validation errors** are shown before import - fix them in your CSV and re-upload
5. **Preview** shows the first 5 vehicles before importing
6. **Bulk operations** - Import dozens of vehicles at once

## Your Fleet Stats

Based on your uploaded data:
- **Total Vehicles**: 48
- **Fuel Types**: Mostly Petrol with some Diesel vehicles
- **Transmission**: All Automatic
- **Years**: Ranging from 2012-2024
- **Rego Expiry**: Most expire in 2025-2026

All vehicles are currently set to "available" status and can be updated individually through the Fleet Management interface or Car Portal.
