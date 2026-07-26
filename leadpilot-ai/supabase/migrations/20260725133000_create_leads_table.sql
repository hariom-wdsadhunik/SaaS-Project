-- Migration: 20260725133000_create_leads_table.sql
-- Description: Create public.leads table for LeadPilot AI CRM Lead domain

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

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated access for LeadPilot AI CRM preview environment
CREATE POLICY "Allow public read access to leads"
  ON public.leads FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to leads"
  ON public.leads FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to leads"
  ON public.leads FOR DELETE
  USING (true);

-- Seed Initial High-Value Real Estate Leads
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
