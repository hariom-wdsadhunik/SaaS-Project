-- ======================================================================
-- LeadPilot AI CRM — Master Database Bootstrap Script
-- File: supabase/bootstrap.sql
-- Description: Unified execution script for fresh Supabase database setup.
-- Version: v0.6.0
-- ======================================================================

-- SECTION 1: EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- SECTION 2: TABLES CREATION

-- 2.1 Profiles Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  organization_id TEXT DEFAULT 'org-leadpilot-default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 User Roles Mapping Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 2.4 Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'Website Webhook',
  status TEXT NOT NULL DEFAULT 'NEW',
  ai_propensity_score INTEGER NOT NULL DEFAULT 50,
  budget_min BIGINT NOT NULL DEFAULT 0,
  budget_max BIGINT NOT NULL DEFAULT 0,
  assigned_broker_name TEXT NOT NULL DEFAULT 'Unassigned',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
  property_id TEXT,
  owner_id TEXT,
  stage TEXT NOT NULL DEFAULT 'NEW',
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  value NUMERIC NOT NULL DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 50,
  assigned_agent_name TEXT NOT NULL DEFAULT 'Alex Morgan',
  agent_avatar_url TEXT,
  expected_close_date TEXT NOT NULL DEFAULT '2026-08-30',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 Contact Timeline Table
CREATE TABLE IF NOT EXISTS public.contact_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'TODO',
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  category TEXT NOT NULL DEFAULT 'FOLLOW_UP',
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to TEXT NOT NULL DEFAULT 'Alex Morgan',
  created_by TEXT NOT NULL DEFAULT 'System Admin',
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
  deal_id TEXT REFERENCES public.deals(id) ON DELETE SET NULL,
  reminder_at TIMESTAMPTZ,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 Task Comments Table
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 Task Activity Table
CREATE TABLE IF NOT EXISTS public.task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.11 Appointments Table
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

-- 2.12 Appointment Attendees Table
CREATE TABLE IF NOT EXISTS public.appointment_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ORGANIZER',
  status TEXT NOT NULL DEFAULT 'ACCEPTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.13 Appointment Reminders Table
CREATE TABLE IF NOT EXISTS public.appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.14 Appointment Activity Table
CREATE TABLE IF NOT EXISTS public.appointment_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTION 3: TRIGGERS & FUNCTIONS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'role', 'BROKER'))
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SECTION 4: ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_activity ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Roles Policies
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
CREATE POLICY "Authenticated users can read roles" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');

-- User Roles Policies
DROP POLICY IF EXISTS "Authenticated users can read user_roles" ON public.user_roles;
CREATE POLICY "Authenticated users can read user_roles" ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage user_roles if self or admin" ON public.user_roles;
CREATE POLICY "Users can manage user_roles if self or admin" ON public.user_roles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Leads Policies
DROP POLICY IF EXISTS "Allow public read access to leads" ON public.leads;
CREATE POLICY "Allow public read access to leads" ON public.leads FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow public insert access to leads" ON public.leads;
CREATE POLICY "Allow public insert access to leads" ON public.leads FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow public update access to leads" ON public.leads;
CREATE POLICY "Allow public update access to leads" ON public.leads FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow public delete access to leads" ON public.leads;
CREATE POLICY "Allow public delete access to leads" ON public.leads FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Deals Policies
DROP POLICY IF EXISTS "Authenticated users can read deals" ON public.deals;
CREATE POLICY "Authenticated users can read deals" ON public.deals FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert deals" ON public.deals;
CREATE POLICY "Authenticated users can insert deals" ON public.deals FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can update deals" ON public.deals;
CREATE POLICY "Authenticated users can update deals" ON public.deals FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete deals" ON public.deals;
CREATE POLICY "Authenticated users can delete deals" ON public.deals FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Contacts Policies
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
CREATE POLICY "Authenticated users can read contacts" ON public.contacts FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON public.contacts;
CREATE POLICY "Authenticated users can insert contacts" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
CREATE POLICY "Authenticated users can update contacts" ON public.contacts FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON public.contacts;
CREATE POLICY "Authenticated users can delete contacts" ON public.contacts FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Contact Timeline Policies
DROP POLICY IF EXISTS "Authenticated users can read contact_timeline" ON public.contact_timeline;
CREATE POLICY "Authenticated users can read contact_timeline" ON public.contact_timeline FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert contact_timeline" ON public.contact_timeline;
CREATE POLICY "Authenticated users can insert contact_timeline" ON public.contact_timeline FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete contact_timeline" ON public.contact_timeline;
CREATE POLICY "Authenticated users can delete contact_timeline" ON public.contact_timeline FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Tasks Policies
DROP POLICY IF EXISTS "Authenticated users can read tasks" ON public.tasks;
CREATE POLICY "Authenticated users can read tasks" ON public.tasks FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert tasks" ON public.tasks;
CREATE POLICY "Authenticated users can insert tasks" ON public.tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can update tasks" ON public.tasks;
CREATE POLICY "Authenticated users can update tasks" ON public.tasks FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON public.tasks;
CREATE POLICY "Authenticated users can delete tasks" ON public.tasks FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Task Comments Policies
DROP POLICY IF EXISTS "Authenticated users can read task_comments" ON public.task_comments;
CREATE POLICY "Authenticated users can read task_comments" ON public.task_comments FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert task_comments" ON public.task_comments;
CREATE POLICY "Authenticated users can insert task_comments" ON public.task_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete task_comments" ON public.task_comments;
CREATE POLICY "Authenticated users can delete task_comments" ON public.task_comments FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Task Activity Policies
DROP POLICY IF EXISTS "Authenticated users can read task_activity" ON public.task_activity;
CREATE POLICY "Authenticated users can read task_activity" ON public.task_activity FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert task_activity" ON public.task_activity;
CREATE POLICY "Authenticated users can insert task_activity" ON public.task_activity FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

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

-- SECTION 5: PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_broker ON public.leads(assigned_broker_name);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON public.deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_priority ON public.deals(priority);
CREATE INDEX IF NOT EXISTS idx_deals_assigned_agent ON public.deals(assigned_agent_name);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_lead_id ON public.contacts(lead_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_timeline_contact_id ON public.contact_timeline(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_timeline_event_type ON public.contact_timeline(event_type);
CREATE INDEX IF NOT EXISTS idx_contact_timeline_created_at ON public.contact_timeline(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON public.tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON public.task_comments(created_at ASC);

CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON public.task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_created_at ON public.task_activity(created_at DESC);

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

-- SECTION 6: SEED DATA (SYSTEM ROLES & INITIAL DEMO DATA)

-- 6.1 System Roles Seed
INSERT INTO public.roles (id, name, description) VALUES
  ('ADMIN', 'Administrator', 'Full tenant configuration, user management, and operational controls.'),
  ('MANAGER', 'Sales Manager', 'Team management, analytics access, and approval permissions.'),
  ('BROKER', 'Senior Broker', 'Standard CRM record management for leads, deals, properties, tasks.'),
  ('AGENT', 'Sales Agent', 'Standard sales agent operations and contact management.'),
  ('VIEWER', 'Read-Only Viewer', 'Read-only access across CRM modules.')
ON CONFLICT (id) DO NOTHING;

-- 6.2 Initial Real Estate Leads Seed
INSERT INTO public.leads (id, full_name, avatar_url, email, phone, source, status, ai_propensity_score, budget_min, budget_max, assigned_broker_name, created_at)
VALUES
  ('ld-101', 'John Doe', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'john.doe@example.com', '+1 (555) 234-5678', 'WhatsApp Business API', 'QUALIFIED', 88, 1000000, 1500000, 'Alex Morgan', '2026-07-20T10:30:00Z'),
  ('ld-102', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'sarah.jenkins@agency.io', '+1 (555) 876-5432', 'Meta / IG Lead Ads', 'NEW', 64, 750000, 900000, 'Sarah Jenkins', '2026-07-21T14:15:00Z'),
  ('ld-103', 'Alexander Montgomery-Wellington III', NULL, 'alexander.wellington.investments@estate-corp.com', '+1 (555) 999-0011', 'Client Referrals', 'QUALIFIED', 94, 2500000, 4000000, 'Alex Morgan', '2026-07-22T09:00:00Z'),
  ('ld-104', 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'm.chen@techholdings.com', '+1 (555) 444-3322', 'Website Webhook', 'CONTACTED', 72, 1200000, 1800000, 'Michael Chen', '2026-07-22T11:45:00Z'),
  ('ld-105', 'Emily Watson', NULL, 'emily.watson@designstudio.org', '+1 (555) 111-2233', 'Meta / IG Lead Ads', 'NURTURING', 52, 500000, 700000, 'Unassigned', '2026-07-23T08:20:00Z'),
  ('ld-106', 'David Miller', NULL, 'dmiller@construction.net', '+1 (555) 666-7788', 'WhatsApp Business API', 'LOST', 28, 400000, 600000, 'Michael Chen', '2026-07-18T16:00:00Z'),
  ('ld-107', 'Jessica Taylor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'jtaylor@luxuryhomes.com', '+1 (555) 333-8899', 'Client Referrals', 'QUALIFIED', 82, 1800000, 2200000, 'Alex Morgan', '2026-07-23T15:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- 6.3 Initial Deals Seed
INSERT INTO public.deals (id, title, company_name, contact_name, lead_id, stage, priority, value, probability, assigned_agent_name, agent_avatar_url, expected_close_date, created_at)
VALUES
  ('dl-201', 'Penthouse Acquisition — Palm Jumeirah', 'Emaar Properties PJSC', 'Alexander Wellington', 'ld-101', 'NEW', 'URGENT', 3500000, 30, 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-08-30', '2026-07-20T10:00:00Z'),
  ('dl-202', 'Commercial Complex Expansion', 'TechHoldings International', 'Michael Chen', 'ld-104', 'QUALIFIED', 'HIGH', 1800000, 50, 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-09-15', '2026-07-21T11:30:00Z'),
  ('dl-203', 'Luxury Villa Portfolio Sale', 'Jenkins Design Studio', 'Sarah Jenkins', 'ld-102', 'PROPOSAL_SENT', 'HIGH', 2400000, 70, 'Sarah Jenkins', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-08-20', '2026-07-22T09:15:00Z'),
  ('dl-204', 'Waterfront Condominium Buyout', 'Watson Real Estate Ltd', 'Emily Watson', 'ld-105', 'NEGOTIATION', 'URGENT', 4200000, 85, 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-08-10', '2026-07-23T14:45:00Z'),
  ('dl-205', 'Downtown Office Tower Lease', 'Global Asset Management', 'Jessica Taylor', 'ld-107', 'WON', 'NORMAL', 1250000, 100, 'Alex Morgan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-07-28', '2026-07-18T16:20:00Z'),
  ('dl-206', 'Suburban Land Development Plot', 'Miller Construction Co', 'David Miller', 'ld-106', 'LOST', 'LOW', 650000, 0, 'Michael Chen', NULL, '2026-07-24', '2026-07-15T08:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 6.4 Initial Contacts Seed
INSERT INTO public.contacts (id, lead_id, full_name, avatar_url, job_title, company, email, phone, status, is_favorite, tags, notes, created_at)
VALUES
  ('c0a80101-0000-0000-0000-000000000301', 'ld-101', 'John Doe', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Managing Director', 'Vanguard Tech Holdings', 'john.doe@vanguardtech.com', '+1 (555) 234-5678', 'VIP', TRUE, '["VIP", "Investor", "High Net Worth"]'::jsonb, 'Acquisition of Palm Jumeirah Penthouse.', '2026-07-20T10:30:00Z'),
  ('c0a80101-0000-0000-0000-000000000302', 'ld-102', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'VP of Operations', 'Apex Logistics Ltd', 'sarah.jenkins@agency.io', '+1 (555) 876-5432', 'ACTIVE', FALSE, '["Buyer", "Hot"]'::jsonb, 'Interested in commercial portfolio Expansion.', '2026-07-21T14:15:00Z'),
  ('c0a80101-0000-0000-0000-000000000303', 'ld-103', 'Alexander Montgomery-Wellington III', NULL, 'Chairman', 'Wellington Investments', 'alexander.wellington.investments@estate-corp.com', '+1 (555) 999-0011', 'VIP', TRUE, '["VIP", "Investor", "Buyer"]'::jsonb, 'Ultra high net worth client seeking prime real estate.', '2026-07-22T09:00:00Z'),
  ('c0a80101-0000-0000-0000-000000000304', 'ld-104', 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Principal Architect', 'TechHoldings International', 'm.chen@techholdings.com', '+1 (555) 444-3322', 'ACTIVE', FALSE, '["Buyer", "Cold"]'::jsonb, 'Commercial complex expansion inquiry.', '2026-07-22T11:45:00Z'),
  ('c0a80101-0000-0000-0000-000000000305', 'ld-105', 'Emily Watson', NULL, 'Head of Expansion', 'Watson Real Estate Ltd', 'emily.watson@designstudio.org', '+1 (555) 111-2233', 'PROSPECT', FALSE, '["Buyer", "Seller"]'::jsonb, 'Nurturing lead converted to active prospect.', '2026-07-23T08:20:00Z')
ON CONFLICT (id) DO NOTHING;

-- 6.5 Initial Tasks Seed
INSERT INTO public.tasks (id, title, description, status, priority, category, due_date, assigned_to, contact_id, lead_id, deal_id, tags, created_at)
VALUES
  ('t0a80101-0000-0000-0000-000000000401', 'Follow up with Alexander Montgomery regarding Penthouse Proposal', 'Review updated pricing terms for Palm Jumeirah penthouse acquisition and schedule executive review call.', 'TODO', 'URGENT', 'CALL', '2026-07-27T10:00:00Z', 'Alex Morgan', 'c0a80101-0000-0000-0000-000000000303', 'ld-101', 'dl-201', '["Penthouse", "VIP", "High Priority"]'::jsonb, '2026-07-24T09:00:00Z'),
  ('t0a80101-0000-0000-0000-000000000402', 'Prepare SPA Agreement for Commercial Complex Expansion', 'Draft Sale and Purchase Agreement for TechHoldings International expansion deal.', 'IN_PROGRESS', 'HIGH', 'CONTRACT_REVIEW', '2026-07-28T15:00:00Z', 'Michael Chen', 'c0a80101-0000-0000-0000-000000000304', 'ld-104', 'dl-202', '["Legal", "Contract"]'::jsonb, '2026-07-24T11:30:00Z'),
  ('t0a80101-0000-0000-0000-000000000403', 'Site Visit Showing with Sarah Jenkins at Downtown Portfolio', 'Conduct private physical inspection of luxury apartments with buyer rep.', 'TODO', 'MEDIUM', 'SITE_VISIT', '2026-07-29T11:00:00Z', 'Sarah Jenkins', 'c0a80101-0000-0000-0000-000000000302', 'ld-102', 'dl-203', '["Site Visit", "Showing"]'::jsonb, '2026-07-25T08:15:00Z'),
  ('t0a80101-0000-0000-0000-000000000404', 'Send Updated Floor Plans to Emily Watson', 'Email revised architectural blueprints and floor plan renders.', 'COMPLETED', 'LOW', 'EMAIL', '2026-07-25T14:00:00Z', 'Alex Morgan', 'c0a80101-0000-0000-0000-000000000305', 'ld-105', 'dl-204', '["Floorplans", "Done"]'::jsonb, '2026-07-23T16:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 6.6 Initial Appointments Seed
INSERT INTO public.appointments (id, title, description, location, meeting_type, status, start_time, end_time, timezone, contact_id, lead_id, deal_id, assigned_to, meeting_link, created_at)
VALUES
  ('a0a80101-0000-0000-0000-000000000501', 'Penthouse Acquisition Executive Presentation', 'Present revised financial terms for Palm Jumeirah penthouse buyout.', 'Google Meet / Online', 'VIDEO', 'CONFIRMED', '2026-07-27T10:00:00Z', '2026-07-27T11:00:00Z', 'UTC', 'c0a80101-0000-0000-0000-000000000303', 'ld-101', 'dl-201', 'Alex Morgan', 'https://meet.google.com/leadpilot-palm-penthouse', '2026-07-24T09:00:00Z'),
  ('a0a80101-0000-0000-0000-000000000502', 'Commercial Complex On-Site Inspection', 'Walkthrough TechHoldings International site plot with structural engineers.', 'Downtown Business Bay Plot 4', 'SITE_VISIT', 'SCHEDULED', '2026-07-28T14:30:00Z', '2026-07-28T16:00:00Z', 'UTC', 'c0a80101-0000-0000-0000-000000000304', 'ld-104', 'dl-202', 'Michael Chen', NULL, '2026-07-25T11:30:00Z'),
  ('a0a80101-0000-0000-0000-000000000503', 'Luxury Villa Portfolio Strategy Review', 'Review investor portfolio requirements with Sarah Jenkins.', 'Brokerage HQ Boardroom A', 'IN_PERSON', 'COMPLETED', '2026-07-25T11:00:00Z', '2026-07-25T12:00:00Z', 'UTC', 'c0a80101-0000-0000-0000-000000000302', 'ld-102', 'dl-203', 'Sarah Jenkins', NULL, '2026-07-22T08:15:00Z')
ON CONFLICT (id) DO NOTHING;
