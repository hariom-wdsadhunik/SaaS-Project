-- ======================================================================
-- LeadPilot AI CRM — Migration: Appointments & Calendar Module
-- Migration: 20260726150000_create_appointments_table.sql
-- Description: Creates appointments, attendees, reminders, and activity
-- tables with strict RLS policies and performance B-Tree indexes.
-- ======================================================================

-- SECTION 1: APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL DEFAULT 'Online Video Link',
  meeting_type TEXT NOT NULL DEFAULT 'VIDEO',
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
  deal_id TEXT REFERENCES public.deals(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_by TEXT NOT NULL DEFAULT 'System Admin',
  assigned_to TEXT NOT NULL DEFAULT 'Alex Morgan',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTION 2: APPOINTMENT ATTENDEES TABLE
CREATE TABLE IF NOT EXISTS public.appointment_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ORGANIZER',
  status TEXT NOT NULL DEFAULT 'ACCEPTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTION 3: APPOINTMENT REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTION 4: APPOINTMENT ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.appointment_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTION 5: ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_activity ENABLE ROW LEVEL SECURITY;

-- Appointments Policies
DROP POLICY IF EXISTS "Authenticated users can read appointments" ON public.appointments;
CREATE POLICY "Authenticated users can read appointments" ON public.appointments FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert appointments" ON public.appointments;
CREATE POLICY "Authenticated users can insert appointments" ON public.appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can update appointments" ON public.appointments;
CREATE POLICY "Authenticated users can update appointments" ON public.appointments FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON public.appointments;
CREATE POLICY "Authenticated users can delete appointments" ON public.appointments FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Appointment Attendees Policies
DROP POLICY IF EXISTS "Authenticated users can read appointment_attendees" ON public.appointment_attendees;
CREATE POLICY "Authenticated users can read appointment_attendees" ON public.appointment_attendees FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert appointment_attendees" ON public.appointment_attendees;
CREATE POLICY "Authenticated users can insert appointment_attendees" ON public.appointment_attendees FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete appointment_attendees" ON public.appointment_attendees;
CREATE POLICY "Authenticated users can delete appointment_attendees" ON public.appointment_attendees FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Appointment Reminders Policies
DROP POLICY IF EXISTS "Authenticated users can read appointment_reminders" ON public.appointment_reminders;
CREATE POLICY "Authenticated users can read appointment_reminders" ON public.appointment_reminders FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert appointment_reminders" ON public.appointment_reminders;
CREATE POLICY "Authenticated users can insert appointment_reminders" ON public.appointment_reminders FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Appointment Activity Policies
DROP POLICY IF EXISTS "Authenticated users can read appointment_activity" ON public.appointment_activity;
CREATE POLICY "Authenticated users can read appointment_activity" ON public.appointment_activity FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert appointment_activity" ON public.appointment_activity;
CREATE POLICY "Authenticated users can insert appointment_activity" ON public.appointment_activity FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- SECTION 6: PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_appointments_contact_id ON public.appointments(contact_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id ON public.appointments(lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_deal_id ON public.appointments(deal_id);
CREATE INDEX IF NOT EXISTS idx_appointments_task_id ON public.appointments(task_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_meeting_type ON public.appointments(meeting_type);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time ASC);
CREATE INDEX IF NOT EXISTS idx_appointments_assigned_to ON public.appointments(assigned_to);

CREATE INDEX IF NOT EXISTS idx_appointment_attendees_app_id ON public.appointment_attendees(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_app_id ON public.appointment_reminders(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_activity_app_id ON public.appointment_activity(appointment_id);

-- SECTION 7: SEED DATA
INSERT INTO public.appointments (id, title, description, location, meeting_type, status, start_time, end_time, timezone, contact_id, lead_id, deal_id, assigned_to, meeting_link, created_at)
VALUES
  ('a0a80101-0000-0000-0000-000000000501', 'Penthouse Acquisition Executive Presentation', 'Present revised financial terms for Palm Jumeirah penthouse buyout.', 'Google Meet / Online', 'VIDEO', 'CONFIRMED', '2026-07-27T10:00:00Z', '2026-07-27T11:00:00Z', 'UTC', 'c0a80101-0000-0000-0000-000000000303', 'ld-101', 'dl-201', 'Alex Morgan', 'https://meet.google.com/leadpilot-palm-penthouse', '2026-07-24T09:00:00Z'),
  ('a0a80101-0000-0000-0000-000000000502', 'Commercial Complex On-Site Inspection', 'Walkthrough TechHoldings International site plot with structural engineers.', 'Downtown Business Bay Plot 4', 'SITE_VISIT', 'SCHEDULED', '2026-07-28T14:30:00Z', '2026-07-28T16:00:00Z', 'UTC', 'c0a80101-0000-0000-0000-000000000304', 'ld-104', 'dl-202', 'Michael Chen', NULL, '2026-07-25T11:30:00Z'),
  ('a0a80101-0000-0000-0000-000000000503', 'Luxury Villa Portfolio Strategy Review', 'Review investor portfolio requirements with Sarah Jenkins.', 'Brokerage HQ Boardroom A', 'IN_PERSON', 'COMPLETED', '2026-07-25T11:00:00Z', '2026-07-25T12:00:00Z', 'UTC', 'c0a80101-0000-0000-0000-000000000302', 'ld-102', 'dl-203', 'Sarah Jenkins', NULL, '2026-07-22T08:15:00Z')
ON CONFLICT (id) DO NOTHING;
