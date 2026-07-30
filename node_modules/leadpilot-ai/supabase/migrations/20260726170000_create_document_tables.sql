-- ======================================================================
-- LEADPILOT AI CRM — MIGRATION: 20260726170000_create_document_tables.sql
-- Module: Intelligent Document Management Platform Domain
-- Version: v0.8.0
-- Security: Strict RLS Enabled (NO USING (true) policies)
-- ======================================================================

-- 1. Folders Table
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    owner_id TEXT NOT NULL DEFAULT 'agent-001',
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
    deal_id TEXT REFERENCES public.deals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    owner_id TEXT NOT NULL DEFAULT 'agent-001',
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
    deal_id TEXT REFERENCES public.deals(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    checksum TEXT NOT NULL,
    current_version INT NOT NULL DEFAULT 1,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    ocr_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (ocr_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    ocr_text TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Document Versions Table
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    storage_path TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum TEXT NOT NULL,
    uploaded_by TEXT NOT NULL DEFAULT 'agent-001',
    change_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(document_id, version_number)
);

-- 4. Document Tags Table
CREATE TABLE IF NOT EXISTS public.document_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(document_id, tag_name)
);

-- 5. Document Permissions Table
CREATE TABLE IF NOT EXISTS public.document_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id TEXT,
    role_id TEXT,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('READ', 'WRITE', 'ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Document Previews Table
CREATE TABLE IF NOT EXISTS public.document_previews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    preview_url TEXT NOT NULL,
    thumbnail_url TEXT,
    preview_type TEXT NOT NULL DEFAULT 'IMAGE' CHECK (preview_type IN ('IMAGE', 'PDF', 'TEXT')),
    status TEXT NOT NULL DEFAULT 'READY' CHECK (status IN ('PENDING', 'READY', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS idx_folders_owner ON public.folders(owner_id);
CREATE INDEX IF NOT EXISTS idx_folders_contact ON public.folders(contact_id);
CREATE INDEX IF NOT EXISTS idx_folders_deal ON public.folders(deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_folder ON public.documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_contact ON public.documents(contact_id);
CREATE INDEX IF NOT EXISTS idx_documents_lead ON public.documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_documents_deal ON public.documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_created ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_doc_versions_doc_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_tags_doc_id ON public.document_tags(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_permissions_doc_id ON public.document_permissions(document_id);

-- Enable Strict Row Level Security (RLS)
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_previews ENABLE ROW LEVEL SECURITY;

-- Strict RLS Policies (NO USING (true) allowed)
CREATE POLICY folders_authenticated_select ON public.folders
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY folders_authenticated_insert ON public.folders
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY folders_authenticated_update ON public.folders
    FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY documents_authenticated_select ON public.documents
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY documents_authenticated_insert ON public.documents
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY documents_authenticated_update ON public.documents
    FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY doc_versions_authenticated_select ON public.document_versions
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY doc_versions_authenticated_insert ON public.document_versions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY doc_tags_authenticated_select ON public.document_tags
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY doc_permissions_authenticated_select ON public.document_permissions
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY doc_previews_authenticated_select ON public.document_previews
    FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- Seed Initial Document Management Data
INSERT INTO public.folders (id, name, owner_id)
VALUES 
  ('f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'Property Deeds & SPA Agreements', 'agent-001'),
  ('f2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'Client Identification & Verification', 'agent-002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.documents (id, name, folder_id, owner_id, mime_type, storage_path, checksum, current_version, size_bytes, ocr_status, ocr_text, summary)
VALUES
  ('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Palm_Jumeirah_Penthouse_SPA_Draft.pdf', 'f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'agent-001', 'application/pdf', 'docs/2026/07/spa_draft_v1.pdf', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 1, 2450800, 'COMPLETED', 'Sale and Purchase Agreement between Vanguard Tech Holdings and Emaar Properties PJSC for Palm Jumeirah Penthouse 402.', 'Formal draft SPA for $3,500,000 penthouse buyout with 10% escrow deposit schedule.'),
  ('d2b3c4d5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Commercial_Complex_Blueprint.pdf', 'f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'agent-002', 'application/pdf', 'docs/2026/07/blueprint_v2.pdf', 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb', 2, 8940000, 'COMPLETED', 'Architectural blueprint specifications for TechHoldings International Business Bay Plot 4 commercial complex.', 'Complete architectural schematics including electrical layout, parking levels, and structural load calculations.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.document_versions (id, document_id, version_number, storage_path, size_bytes, checksum, uploaded_by, change_summary)
VALUES
  ('v1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'd1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 1, 'docs/2026/07/spa_draft_v1.pdf', 2450800, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'agent-001', 'Initial contract draft upload'),
  ('v2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'd2b3c4d5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 1, 'docs/2026/07/blueprint_v1.pdf', 8200000, 'a1b2c3d4e5f67a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', 'agent-002', 'Initial architectural schematics'),
  ('v3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', 'd2b3c4d5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 2, 'docs/2026/07/blueprint_v2.pdf', 8940000, 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb', 'agent-002', 'Updated electrical & HVAC layout revisions')
ON CONFLICT (id) DO NOTHING;
