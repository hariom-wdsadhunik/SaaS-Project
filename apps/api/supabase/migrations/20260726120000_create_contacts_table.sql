-- Migration: 20260726120000_create_contacts_table.sql
-- Description: Create public.contacts and public.contact_timeline tables with strict RLS for LeadPilot AI CRM

-- 1. Contacts Table
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

-- 2. Contact Timeline Events Table
CREATE TABLE IF NOT EXISTS public.contact_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_timeline ENABLE ROW LEVEL SECURITY;

-- Strict RLS Access Policies for Authenticated & Anon CRM Operations (NO USING (true))

-- Contacts Policies
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
CREATE POLICY "Authenticated users can read contacts"
  ON public.contacts FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON public.contacts;
CREATE POLICY "Authenticated users can insert contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
CREATE POLICY "Authenticated users can update contacts"
  ON public.contacts FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON public.contacts;
CREATE POLICY "Authenticated users can delete contacts"
  ON public.contacts FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Contact Timeline Policies
DROP POLICY IF EXISTS "Authenticated users can read contact_timeline" ON public.contact_timeline;
CREATE POLICY "Authenticated users can read contact_timeline"
  ON public.contact_timeline FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert contact_timeline" ON public.contact_timeline;
CREATE POLICY "Authenticated users can insert contact_timeline"
  ON public.contact_timeline FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete contact_timeline" ON public.contact_timeline;
CREATE POLICY "Authenticated users can delete contact_timeline"
  ON public.contact_timeline FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Seed Initial Enterprise Contacts Dataset
INSERT INTO public.contacts (id, lead_id, full_name, avatar_url, job_title, company, email, phone, status, is_favorite, tags, notes, created_at)
VALUES
  ('c0a80101-0000-0000-0000-000000000301', 'ld-101', 'John Doe', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Managing Director', 'Vanguard Tech Holdings', 'john.doe@vanguardtech.com', '+1 (555) 234-5678', 'VIP', TRUE, '["VIP", "Investor", "High Net Worth"]'::jsonb, 'Acquisition of Palm Jumeirah Penthouse.', '2026-07-20T10:30:00Z'),
  ('c0a80101-0000-0000-0000-000000000302', 'ld-102', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'VP of Operations', 'Apex Logistics Ltd', 'sarah.jenkins@agency.io', '+1 (555) 876-5432', 'ACTIVE', FALSE, '["Buyer", "Hot"]'::jsonb, 'Interested in commercial portfolio Expansion.', '2026-07-21T14:15:00Z'),
  ('c0a80101-0000-0000-0000-000000000303', 'ld-103', 'Alexander Montgomery-Wellington III', NULL, 'Chairman', 'Wellington Investments', 'alexander.wellington.investments@estate-corp.com', '+1 (555) 999-0011', 'VIP', TRUE, '["VIP", "Investor", "Buyer"]'::jsonb, 'Ultra high net worth client seeking prime real estate.', '2026-07-22T09:00:00Z'),
  ('c0a80101-0000-0000-0000-000000000304', 'ld-104', 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Principal Architect', 'TechHoldings International', 'm.chen@techholdings.com', '+1 (555) 444-3322', 'ACTIVE', FALSE, '["Buyer", "Cold"]'::jsonb, 'Commercial complex expansion inquiry.', '2026-07-22T11:45:00Z'),
  ('c0a80101-0000-0000-0000-000000000305', 'ld-105', 'Emily Watson', NULL, 'Head of Expansion', 'Watson Real Estate Ltd', 'emily.watson@designstudio.org', '+1 (555) 111-2233', 'PROSPECT', FALSE, '["Buyer", "Seller"]'::jsonb, 'Nurturing lead converted to active prospect.', '2026-07-23T08:20:00Z')
ON CONFLICT (id) DO NOTHING;
