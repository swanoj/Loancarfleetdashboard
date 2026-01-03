# Fleet Command Database Setup Guide

## Complete Production-Ready Database Implementation

Fleet Command now includes a full Supabase backend with PostgreSQL database, real-time subscriptions, Row Level Security (RLS), and a comprehensive API layer. This guide will help you set up and use the database system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Database Schema](#database-schema)
3. [Environment Setup](#environment-setup)
4. [Running Migrations](#running-migrations)
5. [Using the Database Service](#using-the-database-service)
6. [Real-time Subscriptions](#real-time-subscriptions)
7. [Security & RLS](#security--rls)
8. [Extending the System](#extending-the-system)

---

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details (name, database password, region)
4. Wait for project to finish provisioning (~2 minutes)

### 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGc...`)

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/supabase/migrations/20250103_fleet_command_schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)

The migration will create:
- ✅ All 11 database tables
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamps
- ✅ Row Level Security policies
- ✅ Database views for common queries
- ✅ 27 seed vehicles

### 5. Start Using the Database

The app will now use real database instead of mock data. All changes persist across page refreshes and work in real-time across multiple users.

---

## Database Schema

### Core Tables

#### `users`
Extends Supabase auth.users with application-specific fields
```sql
- id (UUID, primary key)
- full_name (TEXT)
- role (TEXT: admin, manager, staff, washer)
- avatar_url (TEXT, optional)
- created_at, updated_at (TIMESTAMP)
```

#### `cars`
Vehicle inventory - the heart of the fleet system
```sql
- id (UUID, primary key)
- rego (TEXT, unique registration number)
- make, model (TEXT)
- year (INTEGER)
- color, color_hex (TEXT)
- bay (TEXT, optional)
- status (TEXT: available, out, hold, service, cleaning)
- rego_expiry (DATE)
- do_not_renew (BOOLEAN)
- vin, odometer, fuel_type, transmission (optional)
- created_at, updated_at (TIMESTAMP)
```

#### `loans`
Vehicle loan/checkout records
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- customer_name, customer_phone, customer_email (TEXT)
- checked_out_at, due_back_at, checked_in_at (TIMESTAMP)
- checked_out_by, checked_in_by (UUID, foreign key → users)
- odometer_out, fuel_level_out (INTEGER)
- odometer_in, fuel_level_in (INTEGER)
- status (TEXT: active, completed, overdue)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### `cleaning_jobs`
Cleaning queue and history
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- type (TEXT: full, quick, interior, exterior)
- priority (TEXT: urgent, normal, low)
- status (TEXT: pending, in-progress, completed, cancelled)
- assigned_to (UUID, foreign key → users)
- started_at, completed_at (TIMESTAMP)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### `hold_items`
Vehicles temporarily removed from circulation
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- reason (TEXT)
- since (DATE)
- released_at (TIMESTAMP)
- placed_by, released_by (UUID, foreign key → users)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### `insurance`
Insurance policy records
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- provider, policy_number, coverage_type (TEXT)
- expiry_date (DATE)
- premium (DECIMAL)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### `service_records`
Maintenance and repair history
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- service_date (DATE)
- type (TEXT: routine, repair, inspection, other)
- description (TEXT)
- odometer, cost (INTEGER/DECIMAL)
- provider (TEXT)
- next_due_date (DATE)
- created_by (UUID, foreign key → users)
- created_at, updated_at (TIMESTAMP)
```

#### `car_notes`
Notes and comments on vehicles
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- type (TEXT: general, damage, maintenance, customer)
- content (TEXT)
- created_by (UUID, foreign key → users)
- created_at, updated_at (TIMESTAMP)
```

#### `activity_logs`
Comprehensive audit trail
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars, optional)
- action (TEXT: checked-out, checked-in, cleaned, serviced, hold, released, status-change, created, updated, deleted)
- description (TEXT)
- user_id (UUID, foreign key → users)
- metadata (JSONB for additional context)
- created_at (TIMESTAMP)
```

#### `inspections`
Fleet Scan inspection records
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key → cars)
- type (TEXT: check-in, check-out)
- odometer, fuel_level (INTEGER)
- inspector_id (UUID, foreign key → users)
- created_at (TIMESTAMP)
```

#### `inspection_photos`
Photos from Fleet Scan inspections
```sql
- id (UUID, primary key)
- inspection_id (UUID, foreign key → inspections)
- photo_type (TEXT: dashboard, front, rear, left, right, damage)
- photo_url (TEXT)
- damage_detected (BOOLEAN)
- damage_description (TEXT)
- created_at (TIMESTAMP)
```

### Database Views

Pre-built views for common queries:

- **`active_loans_with_cars`** - Active loans with car details
- **`pending_cleaning_with_cars`** - Pending cleaning queue with car details
- **`hold_items_with_cars`** - Active hold items with car details
- **`upcoming_rego_renewals`** - Registrations expiring in next 90 days

---

## Environment Setup

### Required Environment Variables

```bash
# Supabase Connection
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Be very careful with this key!
```

### Security Best Practices

1. **Never commit `.env.local` to version control**
   - Add to `.gitignore`
   - Use `.env.example` as template

2. **Service Role Key Protection**
   - Only use server-side (never in browser)
   - Required for admin operations and bypassing RLS
   - Treat like a database password

3. **Anon Key is Safe for Frontend**
   - Designed for client-side use
   - Protected by Row Level Security policies
   - Safe to commit in production builds

---

## Using the Database Service

### Importing the Service

```typescript
import * as db from './services/database';
```

### Common Operations

#### Fetch All Cars

```typescript
const cars = await db.getAllCars();
console.log(`You have ${cars.length} vehicles`);
```

#### Get Car by Registration

```typescript
const car = await db.getCarByRego('ABC-123');
if (car) {
  console.log(`Found: ${car.make} ${car.model}`);
}
```

#### Create a New Loan

```typescript
const loan = await db.createLoan({
  car_id: 'some-uuid',
  customer_name: 'John Smith',
  customer_phone: '0400123456',
  checked_out_at: new Date().toISOString(),
  due_back_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
  status: 'active'
});
```

#### Check In a Vehicle

```typescript
await db.checkInLoan('loan-id', {
  checked_in_by: 'user-id',
  odometer_in: 15450,
  fuel_level_in: 75,
  notes: 'Returned in good condition'
});
```

#### Complete a Cleaning Job

```typescript
await db.completeCleaningJob('job-id', 'washer-user-id');
// Car status automatically updates to 'available'
```

#### Get Dashboard Stats

```typescript
const stats = await db.getDashboardStats();
console.log(`Available: ${stats.available}`);
console.log(`Out on loan: ${stats.out}`);
console.log(`Overdue: ${stats.overdueLoans}`);
```

---

## Real-time Subscriptions

Subscribe to database changes for live updates:

### Cars Table

```typescript
import { subscribeToCars } from './services/database';

const unsubscribe = subscribeToCars((cars) => {
  console.log('Cars updated!', cars);
  // Update your UI state here
});

// Clean up when component unmounts
return () => unsubscribe();
```

### Loans Table

```typescript
import { subscribeToLoans } from './services/database';

const unsubscribe = subscribeToLoans((loans) => {
  console.log('Active loans updated!', loans);
});
```

### Cleaning Jobs

```typescript
import { subscribeToCleaningJobs } from './services/database';

const unsubscribe = subscribeToCleaningJobs((jobs) => {
  console.log('Cleaning queue updated!', jobs);
});
```

### React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { getAllCars, subscribeToCars, Car } from './services/database';

function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    getAllCars().then(data => {
      setCars(data);
      setLoading(false);
    });

    // Subscribe to changes
    const unsubscribe = subscribeToCars(setCars);
    return unsubscribe;
  }, []);

  return { cars, loading };
}
```

---

## Security & RLS

### Row Level Security Policies

All tables have RLS enabled with policies that:

1. **Allow authenticated users to read all data**
   - Staff can view entire fleet
   - Read-only for general operations

2. **Allow authenticated users to insert/update most tables**
   - Staff can create loans, cleaning jobs, notes
   - Normal workflow operations

3. **Restrict deletion to admins/managers only**
   - Prevents accidental data loss
   - Only users with `admin` or `manager` role can delete cars

### User Roles

Defined in `users.role`:
- **`admin`** - Full access, can delete data
- **`manager`** - Full access, can delete data
- **`staff`** - Can read/write, cannot delete
- **`washer`** - Can view and complete cleaning jobs

### Extending RLS Policies

To add more restrictive policies:

```sql
-- Example: Only allow washers to update cleaning jobs
CREATE POLICY "Washers can update cleaning jobs"
  ON cleaning_jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'washer'
    )
  );
```

---

## Extending the System

### Adding a New Table

1. **Define the schema** in a new migration file
2. **Add TypeScript interface** in `/src/app/services/database.ts`
3. **Create CRUD functions** in database service
4. **Add RLS policies** for security
5. **Create real-time subscription** (optional)

Example: Adding a `fuel_purchases` table

```sql
CREATE TABLE public.fuel_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id),
  date DATE NOT NULL,
  liters DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  odometer INTEGER,
  station TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.fuel_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can view fuel purchases"
  ON public.fuel_purchases FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can create fuel purchases"
  ON public.fuel_purchases FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

Then in TypeScript:

```typescript
// In database.ts
export interface FuelPurchase {
  id: string;
  car_id: string;
  date: string;
  liters: number;
  cost: number;
  odometer?: number;
  station?: string;
  created_at?: string;
}

export async function getFuelPurchasesByCarId(carId: string): Promise<FuelPurchase[]> {
  const { data, error } = await supabase
    .from('fuel_purchases')
    .select('*')
    .eq('car_id', carId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createFuelPurchase(purchase: Omit<FuelPurchase, 'id' | 'created_at'>): Promise<FuelPurchase> {
  const { data, error } = await supabase
    .from('fuel_purchases')
    .insert(purchase)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

### Analytics Queries

The Analytics dashboard uses pre-aggregated data from the database service. To add new metrics:

1. Create a new query function in `database.ts`
2. Use SQL aggregations for performance
3. Consider creating a materialized view for complex queries

Example:

```typescript
export async function getMonthlyUtilizationStats(months: number = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .rpc('calculate_monthly_utilization', {
      start_date: startDate.toISOString()
    });

  if (error) throw error;
  return data;
}
```

---

## Database Maintenance

### Backup Strategy

Supabase provides automatic daily backups:
- Go to **Database** → **Backups** in dashboard
- Download backup when needed
- Restore to specific point in time (Pro plan)

### Manual Backup

```bash
# Export specific table
pg_dump -h db.xxx.supabase.co -U postgres -t cars > cars_backup.sql

# Export entire database
pg_dump -h db.xxx.supabase.co -U postgres fleetcommand > full_backup.sql
```

### Performance Monitoring

1. **Check slow queries** - Database → Query Performance
2. **Monitor table sizes** - Database → Database Size
3. **View active connections** - Database → Pooling

### Indexing Tips

Already included indexes:
- Primary keys (automatic)
- Foreign keys (automatic)
- Status fields (for filtering)
- Date fields (for sorting)

Add more indexes if needed:

```sql
-- Example: If you frequently search by customer phone
CREATE INDEX idx_loans_customer_phone ON public.loans(customer_phone);
```

---

## Troubleshooting

### Connection Issues

**Problem:** `fetch failed` or connection errors

**Solutions:**
1. Check environment variables are correct
2. Verify Supabase project is not paused (free tier)
3. Check browser console for CORS errors
4. Ensure you're using HTTPS, not HTTP

### RLS Policy Errors

**Problem:** `new row violates row-level security policy`

**Solutions:**
1. Check you're authenticated (not anonymous user)
2. Verify user role has required permissions
3. Review policy conditions in SQL Editor
4. Temporarily disable RLS for testing (not recommended for production)

### Migration Errors

**Problem:** Migration SQL fails to run

**Solutions:**
1. Check for syntax errors in SQL
2. Run migrations in correct order
3. Drop conflicting tables first (if re-running)
4. Check Supabase logs for detailed error messages

### Real-time Not Working

**Problem:** Subscriptions not receiving updates

**Solutions:**
1. Check Replication is enabled for tables (Database → Replication)
2. Verify RLS policies allow SELECT on table
3. Check browser console for subscription errors
4. Ensure you're cleaning up subscriptions properly

---

## Next Steps

1. ✅ **Run the migration** (if you haven't already)
2. ✅ **Test basic operations** - Create a car, check it out, check it in
3. ✅ **Set up authentication** (optional) - Enable Supabase Auth for multi-user
4. ✅ **Configure real-time** - Enable for tables you want live updates
5. ✅ **Add analytics** - Use the Analytics page to view fleet insights
6. ✅ **Customize RLS** - Adjust security policies for your use case
7. ✅ **Deploy** - Push to production with environment variables

---

## Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Reference**: https://www.postgresql.org/docs/
- **Row Level Security Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Realtime Guide**: https://supabase.com/docs/guides/realtime

---

**Database Version:** 1.0.0  
**Last Updated:** January 2025  
**Schema File:** `/supabase/migrations/20250103_fleet_command_schema.sql`
