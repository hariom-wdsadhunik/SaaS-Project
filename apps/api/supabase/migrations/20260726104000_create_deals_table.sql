-- Migration: 20260726104000_create_deals_table.sql
-- Description: Create public.deals table for LeadPilot AI CRM Deal domain

CREATE TABLE IF NOT EXISTS public.deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  lead_id TEXT,
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Strict RLS Access Policies for Authenticated Users Only (NO USING (true))
CREATE POLICY "Authenticated users can read deals"
  ON public.deals FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert deals"
  ON public.deals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update deals"
  ON public.deals FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete deals"
  ON public.deals FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Seed Initial High-Value Real Estate Deal Pipeline Records
INSERT INTO public.deals (id, title, company_name, contact_name, stage, priority, value, probability, assigned_agent_name, agent_avatar_url, expected_close_date, created_at)
VALUES
  ('dl-201', 'Penthouse Acquisition — Palm Jumeirah', 'Emaar Properties PJSC', 'Alexander Wellington', 'NEW', 'URGENT', 3500000, 30, 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-08-30', '2026-07-20T10:00:00Z'),
  ('dl-202', 'Commercial Complex Expansion', 'TechHoldings International', 'Michael Chen', 'QUALIFIED', 'HIGH', 1800000, 50, 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-09-15', '2026-07-21T11:30:00Z'),
  ('dl-203', 'Luxury Villa Portfolio Sale', 'Jenkins Design Studio', 'Sarah Jenkins', 'PROPOSAL_SENT', 'HIGH', 2400000, 70, 'Sarah Jenkins', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-08-20', '2026-07-22T09:15:00Z'),
  ('dl-204', 'Waterfront Condominium Buyout', 'Watson Real Estate Ltd', 'Emily Watson', 'NEGOTIATION', 'URGENT', 4200000, 85, 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-08-10', '2026-07-23T14:45:00Z'),
  ('dl-205', 'Downtown Office Tower Lease', 'Global Asset Management', 'Jessica Taylor', 'WON', 'NORMAL', 1250000, 100, 'Alex Morgan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-07-28', '2026-07-18T16:20:00Z'),
  ('dl-206', 'Suburban Land Development Plot', 'Miller Construction Co', 'David Miller', 'LOST', 'LOW', 650000, 0, 'Michael Chen', NULL, '2026-07-24', '2026-07-15T08:00:00Z')
ON CONFLICT (id) DO NOTHING;
