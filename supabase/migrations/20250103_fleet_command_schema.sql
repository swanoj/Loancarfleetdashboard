-- Fleet Command Database Schema
-- Created: 2025-01-03
-- This schema supports the complete Fleet Command system with extensibility for future features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff', 'washer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cars table - Core fleet inventory
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rego TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#FFFFFF',
  bay TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'out', 'hold', 'service', 'cleaning')),
  rego_expiry DATE NOT NULL,
  do_not_renew BOOLEAN DEFAULT FALSE,
  vin TEXT,
  odometer INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loans table - Track vehicle check-outs
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  checked_out_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  due_back_at TIMESTAMP WITH TIME ZONE NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_by UUID REFERENCES public.users(id),
  checked_in_by UUID REFERENCES public.users(id),
  odometer_out INTEGER,
  fuel_level_out INTEGER,
  odometer_in INTEGER,
  fuel_level_in INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleaning jobs table
CREATE TABLE IF NOT EXISTS public.cleaning_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('full', 'quick', 'interior', 'exterior')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent', 'normal', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES public.users(id),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hold items table - Vehicles temporarily removed from circulation
CREATE TABLE IF NOT EXISTS public.hold_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  since DATE NOT NULL DEFAULT CURRENT_DATE,
  released_at TIMESTAMP WITH TIME ZONE,
  placed_by UUID REFERENCES public.users(id),
  released_by UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance records
CREATE TABLE IF NOT EXISTS public.insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  coverage_type TEXT NOT NULL,
  premium DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service records
CREATE TABLE IF NOT EXISTS public.service_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('routine', 'repair', 'inspection', 'other')),
  description TEXT NOT NULL,
  odometer INTEGER,
  cost DECIMAL(10, 2),
  provider TEXT,
  next_due_date DATE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car notes
CREATE TABLE IF NOT EXISTS public.car_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('general', 'damage', 'maintenance', 'customer')),
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs - Comprehensive audit trail
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('checked-out', 'checked-in', 'cleaned', 'serviced', 'hold', 'released', 'status-change', 'created', 'updated', 'deleted')),
  description TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fleet Scan inspection records
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('check-in', 'check-out')),
  odometer INTEGER,
  fuel_level INTEGER,
  inspector_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspection photos
CREATE TABLE IF NOT EXISTS public.inspection_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('dashboard', 'front', 'rear', 'left', 'right', 'damage')),
  photo_url TEXT NOT NULL,
  damage_detected BOOLEAN DEFAULT FALSE,
  damage_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_cars_status ON public.cars(status);
CREATE INDEX idx_cars_rego_expiry ON public.cars(rego_expiry);
CREATE INDEX idx_loans_car_id ON public.loans(car_id);
CREATE INDEX idx_loans_status ON public.loans(status);
CREATE INDEX idx_loans_due_back ON public.loans(due_back_at);
CREATE INDEX idx_cleaning_jobs_status ON public.cleaning_jobs(status);
CREATE INDEX idx_cleaning_jobs_car_id ON public.cleaning_jobs(car_id);
CREATE INDEX idx_hold_items_car_id ON public.hold_items(car_id);
CREATE INDEX idx_service_records_car_id ON public.service_records(car_id);
CREATE INDEX idx_car_notes_car_id ON public.car_notes(car_id);
CREATE INDEX idx_activity_logs_car_id ON public.activity_logs(car_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_inspections_car_id ON public.inspections(car_id);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cleaning_jobs_updated_at BEFORE UPDATE ON public.cleaning_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hold_items_updated_at BEFORE UPDATE ON public.hold_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_updated_at BEFORE UPDATE ON public.insurance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_records_updated_at BEFORE UPDATE ON public.service_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_car_notes_updated_at BEFORE UPDATE ON public.car_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create activity log
CREATE OR REPLACE FUNCTION public.log_car_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    INSERT INTO public.activity_logs (car_id, action, description, metadata)
    VALUES (
      NEW.id,
      'status-change',
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_car_status_change_trigger
  AFTER UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.log_car_status_change();

-- Function to update car status when loan is created
CREATE OR REPLACE FUNCTION public.update_car_status_on_loan()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'active') THEN
    UPDATE public.cars SET status = 'out' WHERE id = NEW.car_id;
  ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status = 'active') THEN
    UPDATE public.cars SET status = 'cleaning' WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_car_status_on_loan_trigger
  AFTER INSERT OR UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.update_car_status_on_loan();

-- Function to update car status when cleaning job is completed
CREATE OR REPLACE FUNCTION public.update_car_status_on_cleaning()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed') THEN
    UPDATE public.cars SET status = 'available' WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_car_status_on_cleaning_trigger
  AFTER UPDATE ON public.cleaning_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_car_status_on_cleaning();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hold_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (all staff can read all data)
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view all cars" ON public.cars FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can insert cars" ON public.cars FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Staff can update cars" ON public.cars FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete cars" ON public.cars FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Staff can view all loans" ON public.loans FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create loans" ON public.loans FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Staff can update loans" ON public.loans FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can view cleaning jobs" ON public.cleaning_jobs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create cleaning jobs" ON public.cleaning_jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Staff can update cleaning jobs" ON public.cleaning_jobs FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can view hold items" ON public.hold_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create hold items" ON public.hold_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Staff can update hold items" ON public.hold_items FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can view insurance" ON public.insurance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can manage insurance" ON public.insurance FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can view service records" ON public.service_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create service records" ON public.service_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can view car notes" ON public.car_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create car notes" ON public.car_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can view activity logs" ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can view inspections" ON public.inspections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create inspections" ON public.inspections FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can view inspection photos" ON public.inspection_photos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can create inspection photos" ON public.inspection_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- VIEWS FOR COMMON QUERIES
-- ==========================================

-- View: Active loans with car details
CREATE OR REPLACE VIEW public.active_loans_with_cars AS
SELECT 
  l.*,
  c.rego,
  c.make,
  c.model,
  c.year,
  c.color,
  c.color_hex,
  c.bay
FROM public.loans l
JOIN public.cars c ON l.car_id = c.id
WHERE l.status = 'active'
ORDER BY l.due_back_at ASC;

-- View: Pending cleaning jobs with car details
CREATE OR REPLACE VIEW public.pending_cleaning_with_cars AS
SELECT 
  cj.*,
  c.rego,
  c.make,
  c.model,
  c.color,
  c.bay
FROM public.cleaning_jobs cj
JOIN public.cars c ON cj.car_id = c.id
WHERE cj.status = 'pending'
ORDER BY 
  CASE cj.priority
    WHEN 'urgent' THEN 1
    WHEN 'normal' THEN 2
    WHEN 'low' THEN 3
  END,
  cj.created_at ASC;

-- View: Cars on hold with details
CREATE OR REPLACE VIEW public.hold_items_with_cars AS
SELECT 
  h.*,
  c.rego,
  c.make,
  c.model,
  c.color,
  c.bay
FROM public.hold_items h
JOIN public.cars c ON h.car_id = c.id
WHERE h.released_at IS NULL
ORDER BY h.since ASC;

-- View: Upcoming registration renewals (next 90 days)
CREATE OR REPLACE VIEW public.upcoming_rego_renewals AS
SELECT 
  id,
  rego,
  make,
  model,
  rego_expiry,
  do_not_renew,
  (rego_expiry - CURRENT_DATE) as days_until_expiry
FROM public.cars
WHERE rego_expiry <= CURRENT_DATE + INTERVAL '90 days'
  AND rego_expiry >= CURRENT_DATE
ORDER BY rego_expiry ASC;

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert sample cars (matching mock data)
INSERT INTO public.cars (rego, make, model, year, color, color_hex, bay, status, rego_expiry) VALUES
  ('ABC-123', 'Toyota', 'Camry', 2022, 'White', '#FFFFFF', 'Bay 7', 'available', '2025-03-15'),
  ('DEF-456', 'Toyota', 'Hilux', 2023, 'Silver', '#C0C0C0', 'Bay 3', 'available', '2025-04-22'),
  ('GHI-789', 'Toyota', 'RAV4', 2021, 'Blue', '#4169E1', 'Bay 2', 'available', '2025-01-08'),
  ('JKL-012', 'Toyota', 'Corolla', 2022, 'Red', '#DC143C', 'Bay 1', 'available', '2025-06-30'),
  ('MNO-345', 'Toyota', 'Kluger', 2023, 'Black', '#000000', 'Bay 5', 'available', '2025-05-12'),
  ('PQR-678', 'Toyota', 'Camry', 2022, 'Grey', '#808080', 'Bay 4', 'available', '2025-07-18'),
  ('STU-901', 'Toyota', 'Hilux', 2023, 'White', '#FFFFFF', 'Bay 8', 'available', '2025-08-25'),
  ('VWX-234', 'Toyota', 'RAV4', 2021, 'Silver', '#C0C0C0', 'Bay 6', 'available', '2025-02-14'),
  ('YZA-567', 'Toyota', 'Corolla', 2022, 'Blue', '#4169E1', 'Bay 9', 'available', '2025-09-03'),
  ('BCD-890', 'Toyota', 'Kluger', 2023, 'Red', '#DC143C', 'Bay 10', 'available', '2025-10-11'),
  ('EFG-123', 'Toyota', 'Camry', 2022, 'Black', '#000000', 'Bay 11', 'available', '2025-11-20'),
  ('HIJ-456', 'Toyota', 'Hilux', 2023, 'Grey', '#808080', 'Bay 12', 'available', '2025-12-05'),
  ('KLM-789', 'Toyota', 'RAV4', 2021, 'White', '#FFFFFF', 'Bay 13', 'available', '2026-01-15'),
  ('NOP-012', 'Toyota', 'Corolla', 2022, 'Silver', '#C0C0C0', 'Bay 14', 'available', '2025-03-28'),
  ('QRS-345', 'Toyota', 'Kluger', 2023, 'Blue', '#4169E1', 'Bay 15', 'available', '2025-04-17'),
  ('TUV-678', 'Toyota', 'Camry', 2022, 'Red', '#DC143C', 'Bay 16', 'available', '2025-05-22'),
  ('WXY-901', 'Toyota', 'Hilux', 2023, 'Black', '#000000', 'Bay 17', 'available', '2025-06-09'),
  ('ZAB-234', 'Toyota', 'RAV4', 2021, 'Grey', '#808080', 'Bay 18', 'available', '2025-07-13'),
  ('CDE-567', 'Toyota', 'Corolla', 2022, 'White', '#FFFFFF', 'Bay 19', 'available', '2025-08-01'),
  ('FGH-890', 'Toyota', 'Kluger', 2023, 'Silver', '#C0C0C0', 'Bay 20', 'available', '2025-09-19'),
  ('IJK-123', 'Toyota', 'Camry', 2022, 'Blue', '#4169E1', 'Bay 21', 'available', '2025-10-27'),
  ('LMN-456', 'Toyota', 'Hilux', 2023, 'Red', '#DC143C', 'Bay 22', 'available', '2025-11-14'),
  ('OPQ-789', 'Toyota', 'RAV4', 2021, 'Black', '#000000', 'Bay 23', 'available', '2025-12-23'),
  ('RST-012', 'Toyota', 'Corolla', 2022, 'Grey', '#808080', 'Bay 24', 'available', '2026-01-30'),
  ('UVW-345', 'Toyota', 'Kluger', 2023, 'White', '#FFFFFF', 'Bay 25', 'available', '2025-02-08'),
  ('XYZ-678', 'Toyota', 'Kluger', 2023, 'Silver', '#C0C0C0', '', 'available', '2025-04-16'),
  ('LMN-345', 'Toyota', 'Corolla', 2022, 'Blue', '#4169E1', '', 'available', '2025-05-21')
ON CONFLICT (rego) DO NOTHING;
