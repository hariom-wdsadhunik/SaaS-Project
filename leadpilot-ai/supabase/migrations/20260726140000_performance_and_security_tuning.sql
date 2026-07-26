-- ======================================================================
-- LeadPilot AI CRM — Migration: Performance & Security Tuning
-- Migration: 20260726140000_performance_and_security_tuning.sql
-- Description: Adds high-performance B-tree indexes for foreign keys,
-- query filters, and orders across all CRM core entities.
-- ======================================================================

-- 1. LEADS INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_broker ON public.leads(assigned_broker_name);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- 2. DEALS INDEXES
CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON public.deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_priority ON public.deals(priority);
CREATE INDEX IF NOT EXISTS idx_deals_assigned_agent ON public.deals(assigned_agent_name);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);

-- 3. CONTACTS INDEXES
CREATE INDEX IF NOT EXISTS idx_contacts_lead_id ON public.contacts(lead_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- 4. CONTACT TIMELINE INDEXES
CREATE INDEX IF NOT EXISTS idx_contact_timeline_contact_id ON public.contact_timeline(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_timeline_event_type ON public.contact_timeline(event_type);
CREATE INDEX IF NOT EXISTS idx_contact_timeline_created_at ON public.contact_timeline(created_at DESC);

-- 5. TASKS INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON public.tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

-- 6. TASK COMMENTS INDEXES
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON public.task_comments(created_at ASC);

-- 7. TASK ACTIVITY INDEXES
CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON public.task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_created_at ON public.task_activity(created_at DESC);
