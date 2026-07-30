-- Migration: 20260726130000_create_tasks_table.sql
-- Description: Create public.tasks, public.task_comments, and public.task_activity tables for LeadPilot AI CRM

-- 1. Tasks Table
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

-- 2. Task Comments Table
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Task Activity Timeline Table
CREATE TABLE IF NOT EXISTS public.task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;

-- Strict RLS Access Policies (NO USING (true))

-- Tasks Policies
DROP POLICY IF EXISTS "Authenticated users can read tasks" ON public.tasks;
CREATE POLICY "Authenticated users can read tasks"
  ON public.tasks FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert tasks" ON public.tasks;
CREATE POLICY "Authenticated users can insert tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can update tasks" ON public.tasks;
CREATE POLICY "Authenticated users can update tasks"
  ON public.tasks FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON public.tasks;
CREATE POLICY "Authenticated users can delete tasks"
  ON public.tasks FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Task Comments Policies
DROP POLICY IF EXISTS "Authenticated users can read task_comments" ON public.task_comments;
CREATE POLICY "Authenticated users can read task_comments"
  ON public.task_comments FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert task_comments" ON public.task_comments;
CREATE POLICY "Authenticated users can insert task_comments"
  ON public.task_comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can delete task_comments" ON public.task_comments;
CREATE POLICY "Authenticated users can delete task_comments"
  ON public.task_comments FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Task Activity Policies
DROP POLICY IF EXISTS "Authenticated users can read task_activity" ON public.task_activity;
CREATE POLICY "Authenticated users can read task_activity"
  ON public.task_activity FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Authenticated users can insert task_activity" ON public.task_activity;
CREATE POLICY "Authenticated users can insert task_activity"
  ON public.task_activity FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Seed Initial Enterprise Tasks Dataset
INSERT INTO public.tasks (id, title, description, status, priority, category, due_date, assigned_to, contact_id, lead_id, deal_id, tags, created_at)
VALUES
  ('t0a80101-0000-0000-0000-000000000401', 'Follow up with Alexander Montgomery regarding Penthouse Proposal', 'Review updated pricing terms for Palm Jumeirah penthouse acquisition and schedule executive review call.', 'TODO', 'URGENT', 'CALL', '2026-07-27T10:00:00Z', 'Alex Morgan', 'c0a80101-0000-0000-0000-000000000303', 'ld-101', 'dl-201', '["Penthouse", "VIP", "High Priority"]'::jsonb, '2026-07-24T09:00:00Z'),
  ('t0a80101-0000-0000-0000-000000000402', 'Prepare SPA Agreement for Commercial Complex Expansion', 'Draft Sale and Purchase Agreement for TechHoldings International expansion deal.', 'IN_PROGRESS', 'HIGH', 'CONTRACT_REVIEW', '2026-07-28T15:00:00Z', 'Michael Chen', 'c0a80101-0000-0000-0000-000000000304', 'ld-104', 'dl-202', '["Legal", "Contract"]'::jsonb, '2026-07-24T11:30:00Z'),
  ('t0a80101-0000-0000-0000-000000000403', 'Site Visit Showing with Sarah Jenkins at Downtown Portfolio', 'Conduct private physical inspection of luxury apartments with buyer rep.', 'TODO', 'MEDIUM', 'SITE_VISIT', '2026-07-29T11:00:00Z', 'Sarah Jenkins', 'c0a80101-0000-0000-0000-000000000302', 'ld-102', 'dl-203', '["Site Visit", "Showing"]'::jsonb, '2026-07-25T08:15:00Z'),
  ('t0a80101-0000-0000-0000-000000000404', 'Send Updated Floor Plans to Emily Watson', 'Email revised architectural blueprints and floor plan renders.', 'COMPLETED', 'LOW', 'EMAIL', '2026-07-25T14:00:00Z', 'Alex Morgan', 'c0a80101-0000-0000-0000-000000000305', 'ld-105', 'dl-204', '["Floorplans", "Done"]'::jsonb, '2026-07-23T16:00:00Z')
ON CONFLICT (id) DO NOTHING;
