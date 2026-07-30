-- ======================================================================
-- LEADPILOT AI CRM — MIGRATION: 20260726160000_create_communication_tables.sql
-- Module: Omnichannel Communication Platform Domain
-- Version: v0.7.0
-- Security: Strict RLS Enabled (NO USING (true) policies)
-- ======================================================================

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL CHECK (channel IN ('WHATSAPP', 'EMAIL', 'SMS', 'IN_APP')),
    subject TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED', 'CLOSED', 'PENDING')),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
    deal_id TEXT REFERENCES public.deals(id) ON DELETE SET NULL,
    assigned_agent_id TEXT NOT NULL DEFAULT 'agent-001',
    unread_count INT NOT NULL DEFAULT 0,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Conversation Participants Table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    participant_name TEXT NOT NULL,
    participant_address TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'AGENT', 'SYSTEM')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    channel TEXT NOT NULL CHECK (channel IN ('WHATSAPP', 'EMAIL', 'SMS', 'IN_APP')),
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SENT' CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED')),
    provider TEXT NOT NULL DEFAULT 'SYSTEM',
    provider_message_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Attachments Table
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Message Templates Table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('PROSPECTING', 'FOLLOW_UP', 'CLOSING', 'APPOINTMENT_REMINDER', 'GENERAL')),
    channel TEXT NOT NULL CHECK (channel IN ('WHATSAPP', 'EMAIL', 'SMS', 'IN_APP')),
    subject_template TEXT,
    body_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Delivery Receipts Table
CREATE TABLE IF NOT EXISTS public.delivery_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('DELIVERED', 'READ', 'FAILED')),
    provider_status_code TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_contact_id ON public.conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON public.attachments(message_id);

-- Enable Strict Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_receipts ENABLE ROW LEVEL SECURITY;

-- Strict RLS Policies (NO USING (true) allowed)
CREATE POLICY conversations_authenticated_select ON public.conversations
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY conversations_authenticated_insert ON public.conversations
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY conversations_authenticated_update ON public.conversations
    FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY messages_authenticated_select ON public.messages
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY messages_authenticated_insert ON public.messages
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY attachments_authenticated_select ON public.attachments
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY attachments_authenticated_insert ON public.attachments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY message_templates_authenticated_select ON public.message_templates
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY delivery_receipts_authenticated_select ON public.delivery_receipts
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- Seed Initial Communication Data
INSERT INTO public.conversations (id, channel, subject, status, assigned_agent_id, unread_count)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'WHATSAPP', 'Marina Bay Penthouse Inquiry', 'ACTIVE', 'agent-001', 1),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'EMAIL', 'Beachfront Villa Conveyancing Contract', 'ACTIVE', 'agent-002', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender, receiver, direction, channel, content, status, provider, provider_message_id)
VALUES
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Marcus Vance', 'Alex Morgan', 'INBOUND', 'WHATSAPP', 'Hello Alex, I would like to confirm tomorrow''s private walkthrough for the Marina Bay Sky Villa.', 'DELIVERED', 'META_WHATSAPP', 'wamid.HBgLMjA0Nzg5MDExMg=='),
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Sarah Jenkins', 'Eleanor Sterling', 'OUTBOUND', 'EMAIL', 'Dear Eleanor, attached is the revised conveyancing draft agreement for your review.', 'SENT', 'SENDGRID', 'msg_sg_89230498230498')
ON CONFLICT (id) DO NOTHING;
