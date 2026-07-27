# LeadPilot AI CRM — Database Setup Guide

This guide details how to bootstrap a fresh Supabase database project for LeadPilot AI CRM using the master `supabase/bootstrap.sql` script.

---

## 1. Migration Execution Order

When applying migrations individually or running the master script, execute in the following dependency order:

| Step | Migration File | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| **1** | `20260726103000_create_auth_rbac_tables.sql` | Creates `profiles`, `roles`, `user_roles`, triggers, and RBAC policies. | `auth.users` |
| **2** | `20260725133000_create_leads_table.sql` | Creates `public.leads` table and RLS policies. | None |
| **3** | `20260726104000_create_deals_table.sql` | Creates `public.deals` table, foreign keys, and RLS policies. | `public.leads` |

---

## 2. How to Run in Supabase SQL Editor

To set up a fresh Supabase project in under 60 seconds:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project (`epxgsurlzigtwlaqyvlv`).
2. Click **SQL Editor** in the left sidebar menu.
3. Click **New Query**.
4. Open [`supabase/bootstrap.sql`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/supabase/bootstrap.sql) in your editor and copy the entire contents.
5. Paste the SQL script into the Supabase SQL Editor query window.
6. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).

---

## 3. Expected Tables After Execution

After `supabase/bootstrap.sql` completes successfully, the following 5 tables will exist under `public` schema with Row Level Security (RLS) enabled:

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **`public.profiles`** | User metadata synchronized from `auth.users`. | `id` (UUID, FK `auth.users`), `full_name`, `email`, `avatar_url`, `organization_id` |
| **`public.roles`** | System RBAC roles definitions. | `id` (TEXT, PK), `name`, `description` |
| **`public.user_roles`** | Mapping table linking profiles to system roles. | `id` (UUID, PK), `user_id` (FK `profiles`), `role_id` (FK `roles`) |
| **`public.leads`** | Property buyer & seller inquiry records. | `id` (TEXT, PK), `full_name`, `email`, `phone`, `status`, `ai_propensity_score`, `budget_min`, `budget_max` |
| **`public.deals`** | High-value transaction pipeline records. | `id` (TEXT, PK), `title`, `company_name`, `stage`, `value`, `probability`, `lead_id` (FK `leads`) |

---

## 4. Troubleshooting Guide

### Issue A: "relation auth.users does not exist"
- **Cause:** Executing the script outside of a valid Supabase database instance.
- **Fix:** Ensure you are executing the script in the SQL Editor of your hosted Supabase project or local Supabase CLI instance (`supabase start`).

### Issue B: "policy already exists"
- **Cause:** Re-running migration scripts where policies were already created without `DROP POLICY IF EXISTS`.
- **Fix:** The `supabase/bootstrap.sql` script includes `DROP POLICY IF EXISTS` directives before each policy definition to prevent duplicate errors.

### Issue C: "permission denied for table profiles"
- **Cause:** Requesting data without an active user session or proper RLS policy setup.
- **Fix:** Verify Row Level Security is enabled and policies grant SELECT/INSERT permissions.
