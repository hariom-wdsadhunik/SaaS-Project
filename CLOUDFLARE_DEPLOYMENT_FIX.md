# LeadPilot — Cloudflare Workers Build & Deployment Fix Guide (Pass 2)

## 1. Root Cause Analysis & Node 22 Requirement
The Cloudflare Workers build failed during the dependency installation step (`npm clean-install`).

### Key Contributing Factors:
- **Node Engine Incompatibility (Node 20 vs Supabase >=22):** The project depends on `@supabase/supabase-js@2.110.8` (and `@supabase/auth-js`, `@supabase/postgrest-js`, `@supabase/realtime-js`, `@supabase/storage-js`), which explicitly specify `"engines": { "node": ">=22.0.0" }`. Standardizing on Node 20.18.0 caused `npm clean-install` under npm 10.8.2 / 10.9.2 to reject the dependency engines.
- **npm `allow-scripts` Script Execution:** Modern npm versions enforce lifecycle script approvals (`allowScripts`). Approved packages (`sharp` and `unrs-resolver`) are configured in `package.json` and `.npmrc`.
- **Missing Dashboard Build Command:** Cloudflare deployment settings had `Build command: None`, skipping Next.js application compilation (`apps/web`).

---

## 2. Technical Decisions & Changes Made

### Files Added / Updated:
1. **`.nvmrc`**: Set Node version to `22.14.0` (Node 22 LTS).
2. **`.node-version`**: Set Node version to `22.14.0` for multi-tool version manager support.
3. **`.npmrc`**: Set `strict-allow-scripts=false` to prevent unapproved script installation failures.
4. **`package.json`**:
   - Updated `"engines": { "node": ">=22.0.0 <25.0.0" }`.
   - Added `"allowScripts": { "sharp": true, "unrs-resolver": true }`.
   - Added `"build": "npm run build --prefix apps/web"`.
5. **`apps/web/package.json`**:
   - Added `"engines": { "node": ">=22.0.0" }`.

---

## 3. Recommended Cloudflare Workers Build Settings

In the Cloudflare Workers / Pages Dashboard under **Settings > Builds & Deployments**:

| Setting | Value | Rationale |
| :--- | :--- | :--- |
| **Repository** | `hariom-wdsadhunik/SaaS-Project` | Source repository |
| **Root Directory** | `/` | Monorepo root to preserve workspace resolution |
| **Build Command** | `npm run build:web` | Compiles `apps/web` Next.js application |
| **Deploy Command** | `npx wrangler deploy` | Executes Cloudflare Worker deployment |
| **Node.js Version** | `22.14.0` (or set `NODE_VERSION=22`) | Node 22 LTS required by `@supabase/supabase-js` |

---

## 4. Environment Variables Reference

| Variable | Scope | Required at Build? | Required at Runtime? | Exposure | Purpose |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `NODE_VERSION` | Cloudflare Build | Yes | No | Build Config | Forces Node 22 LTS build environment (`22.14.0`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `apps/web` | Yes | Yes | Public | Supabase API endpoint URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `apps/web` | Yes | Yes | Public | Supabase client anon API key |
| `NEXT_PUBLIC_API_URL` | `apps/web` | Yes | Yes | Public | Backend API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/api` | No | Yes | Private Secret | Supabase admin operations |
| `JWT_SECRET` | `apps/api` | No | Yes | Private Secret | Backend authentication signing key |

---

## 5. Verification Commands

Run locally to verify build pipeline integrity:

```bash
# 1. Verify Node engine (must be >= 22.0.0)
node --version

# 2. Clean reproducible dependency installation
npm ci

# 3. Lint frontend codebase
npm run lint:web

# 4. Production Next.js build
npm run build:web
```
