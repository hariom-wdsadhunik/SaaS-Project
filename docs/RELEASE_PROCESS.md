# LeadPilot AI CRM — Release Process & Quality Standard

---

## 1. Branching & Release Strategy

LeadPilot AI CRM follows GitFlow with strict release tags (`vX.Y.Z`).

- `main`: Protected production branch.
- Feature commits are merged into `main` after passing quality gates.

---

## 2. Mandatory Quality Gates

Before any commit or tag release:

1. **Linting Verification:**
   ```bash
   npm run lint
   ```
   *Requirement:* Must pass with 0 errors.

2. **TypeScript Compilation & Next.js Build:**
   ```bash
   npm run build
   ```
   *Requirement:* Must compile 20/20 static routes with 0 type errors.

3. **Database Bootstrap Integrity:**
   - Any new migration in `supabase/migrations/` MUST be reflected in `supabase/bootstrap.sql`.
   - RLS policies MUST be present on every table (**never `USING (true)`**).

4. **Git Tag & Push Sequence:**
   ```bash
   git status
   git add .
   git commit -m "<type>(<scope>): <description>"
   git push origin main
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
