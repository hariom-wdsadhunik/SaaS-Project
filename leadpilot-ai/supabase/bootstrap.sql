-- ======================================================================
-- LeadPilot AI CRM — Master Database Bootstrap Script
-- File: supabase/bootstrap.sql
-- Description: Unified execution script for fresh Supabase database setup.
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

-- Profiles Policies
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Roles Policies
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
CREATE POLICY "Authenticated users can read roles" ON public.roles FOR SELECT USING (true);

-- User Roles Policies
DROP POLICY IF EXISTS "Authenticated users can read user_roles" ON public.user_roles;
CREATE POLICY "Authenticated users can read user_roles" ON public.user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage user_roles if self or admin" ON public.user_roles;
CREATE POLICY "Users can manage user_roles if self or admin" ON public.user_roles FOR INSERT WITH CHECK (true);

-- Leads Policies
DROP POLICY IF EXISTS "Allow public read access to leads" ON public.leads;
CREATE POLICY "Allow public read access to leads" ON public.leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to leads" ON public.leads;
CREATE POLICY "Allow public insert access to leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to leads" ON public.leads;
CREATE POLICY "Allow public update access to leads" ON public.leads FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access to leads" ON public.leads;
CREATE POLICY "Allow public delete access to leads" ON public.leads FOR DELETE USING (true);

-- Deals Policies
DROP POLICY IF EXISTS "Authenticated users can read deals" ON public.deals;
CREATE POLICY "Authenticated users can read deals" ON public.deals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert deals" ON public.deals;
CREATE POLICY "Authenticated users can insert deals" ON public.deals FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update deals" ON public.deals;
CREATE POLICY "Authenticated users can update deals" ON public.deals FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete deals" ON public.deals;
CREATE POLICY "Authenticated users can delete deals" ON public.deals FOR DELETE USING (true);

-- SECTION 5: SEED DATA (SYSTEM ROLES & INITIAL DEMO DATA)

-- 5.1 System Roles Seed
INSERT INTO public.roles (id, name, description) VALUES
  ('ADMIN', 'Administrator', 'Full tenant configuration, user management, and operational controls.'),
  ('MANAGER', 'Sales Manager', 'Team management, analytics access, and approval permissions.'),
  ('BROKER', 'Senior Broker', 'Standard CRM record management for leads, deals, properties, tasks.'),
  ('AGENT', 'Sales Agent', 'Standard sales agent operations and contact management.'),
  ('VIEWER', 'Read-Only Viewer', 'Read-only access across CRM modules.')
ON CONFLICT (id) DO NOTHING;

-- 5.2 Initial Real Estate Leads Seed
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

-- 5.3 Initial Deals Seed
INSERT INTO public.deals (id, title, company_name, contact_name, lead_id, stage, priority, value, probability, assigned_agent_name, agent_avatar_url, expected_close_date, created_at)
VALUES
  ('dl-201', 'Penthouse Acquisition — Palm Jumeirah', 'Emaar Properties PJSC', 'Alexander Wellington', 'ld-101', 'NEW', 'URGENT', 3500000, 30, 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-08-30', '2026-07-20T10:00:00Z'),
  ('dl-202', 'Commercial Complex Expansion', 'TechHoldings International', 'Michael Chen', 'ld-104', 'QUALIFIED', 'HIGH', 1800000, 50, 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-09-15', '2026-07-21T11:30:00Z'),
  ('dl-203', 'Luxury Villa Portfolio Sale', 'Jenkins Design Studio', 'Sarah Jenkins', 'ld-102', 'PROPOSAL_SENT', 'HIGH', 2400000, 70, 'Sarah Jenkins', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-08-20', '2026-07-22T09:15:00Z'),
  ('dl-204', 'Waterfront Condominium Buyout', 'Watson Real Estate Ltd', 'Emily Watson', 'ld-105', 'NEGOTIATION', 'URGENT', 4200000, 85, 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-08-10', '2026-07-23T14:45:00Z'),
  ('dl-205', 'Downtown Office Tower Lease', 'Global Asset Management', 'Jessica Taylor', 'ld-107', 'WON', 'NORMAL', 1250000, 100, 'Alex Morgan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-07-28', '2026-07-18T16:20:00Z'),
  ('dl-206', 'Suburban Land Development Plot', 'Miller Construction Co', 'David Miller', 'ld-106', 'LOST', 'LOW', 650000, 0, 'Michael Chen', NULL, '2026-07-24', '2026-07-15T08:00:00Z')
ON CONFLICT (id) DO NOTHING;
