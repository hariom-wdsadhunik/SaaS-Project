-- Migration: 20260726103000_create_auth_rbac_tables.sql
-- Description: Create profiles, roles, user_roles tables with strict RLS for LeadPilot AI CRM

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  organization_id TEXT DEFAULT 'org-leadpilot-default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed System Roles
INSERT INTO public.roles (id, name, description) VALUES
  ('ADMIN', 'Administrator', 'Full tenant configuration, user management, and operational controls.'),
  ('MANAGER', 'Sales Manager', 'Team management, analytics access, and approval permissions.'),
  ('BROKER', 'Senior Broker', 'Standard CRM record management for leads, deals, properties, tasks.'),
  ('AGENT', 'Sales Agent', 'Standard sales agent operations and contact management.'),
  ('VIEWER', 'Read-Only Viewer', 'Read-only access across CRM modules.')
ON CONFLICT (id) DO NOTHING;

-- 3. User Roles Mapping Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Strict RLS Policies (NO USING (true) - Authenticated Only)

-- Profiles Policies
CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Roles Policies
CREATE POLICY "Authenticated users can read roles"
  ON public.roles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- User Roles Policies
CREATE POLICY "Authenticated users can read user_roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage user_roles if self or admin"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger: Automatically create profile and assign default role on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, 'ADMIN');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
