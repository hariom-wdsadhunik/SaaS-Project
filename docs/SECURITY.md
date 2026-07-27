# LeadPilot AI CRM — Security Architecture & Guidelines

---

## 1. Authentication & Session Security
- User identity is authenticated using Supabase Auth with JWT tokens stored in secure, encrypted HTTP cookies / local session storage.
- Password hashes are managed exclusively by Supabase Auth using `bcrypt` / `argon2`.

---

## 2. Row-Level Security (RLS) Matrix

All 10 database tables enforce PostgreSQL Row Level Security (RLS):

| Table | Policy Rule | Permitted Roles |
| :--- | :--- | :--- |
| `public.profiles` | `auth.uid() = id` for updates; authenticated read. | Authenticated User |
| `public.user_roles` | Admin / Self insert & read. | Authenticated User |
| `public.leads` | Authenticated / Anon app client read & write. | Authenticated User / Anon Client |
| `public.deals` | Authenticated read & write. | Authenticated User / Anon Client |
| `public.contacts` | Authenticated read & write. | Authenticated User / Anon Client |
| `public.contact_timeline` | Authenticated read & write. | Authenticated User / Anon Client |
| `public.tasks` | Authenticated read & write. | Authenticated User / Anon Client |
| `public.task_comments` | Authenticated read & write. | Authenticated User / Anon Client |
| `public.task_activity` | Authenticated read & write. | Authenticated User / Anon Client |

---

## 3. Secret Management & Input Sanitization
- API keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are scoped exclusively to public frontend operations.
- Service Role keys are strictly forbidden in client-side bundles.
- All user inputs are parsed through Zod validation schemas (`src/lib/validations/`) before reaching database layers.
