# LeadPilot — Cloudflare Workers Build & Deployment Fix Guide

## 1. Root Cause Analysis
The Cloudflare Workers build failed during the initial dependency installation step (`npm clean-install`).

### Key Contributing Factors:
- **npm `allow-scripts` Blocking (Primary Cause):** Starting in npm 10.9.0+, npm enforces lifecycle script permissions (`allowScripts`). When running `npm clean-install` in environments with strict script policies (such as Node 24.18.0 / npm 10.9.2), npm flags unapproved lifecycle scripts (`sharp@0.34.5` and `unrs-resolver@1.12.2`) and terminates installation with error code 1.
- **Unpinned Experimental Node Version:** Cloudflare detected Node `24.18.0`. Node 24 is a non-LTS development release.
- **Missing Build Command:** Cloudflare deployment settings had `Build command: None`, skipping compilation of the Next.js web application (`apps/web`).
- **Unconfigured Deployment Workspace:** The root directory was `/` without specifying the workspace build command.

---

## 2. Technical Decisions & Changes Made

### Files Added / Updated:
1. **`.nvmrc`**: Set Node version to `20.18.0` (Active LTS).
2. **`.node-version`**: Set Node version to `20.18.0` for multi-tool version manager support.
3. **`.npmrc`**: Set `strict-allow-scripts=false` to prevent unapproved script installation failures.
4. **`package.json`**:
   - Added `"engines": { "node": ">=20.0.0 <25.0.0" }`.
   - Added `"allowScripts": { "sharp": true, "unrs-resolver": true }` to approve required trusted dependencies.
   - Added `"build": "npm run build --prefix apps/web"` to ensure `npm run build` at monorepo root correctly builds the `apps/web` Next.js frontend application.

---

## 3. Recommended Cloudflare Workers Build Settings

In the Cloudflare Workers / Pages Dashboard under **Settings > Builds & Deployments**:

| Setting | Value | Rationale |
| :--- | :--- | :--- |
| **Repository** | `hariom-wdsadhunik/SaaS-Project` | Source repository |
| **Root Directory** | `/` | Monorepo root to preserve workspace resolution |
| **Build Command** | `npm run build:web` (or `npm run build`) | Compiles `apps/web` Next.js application |
| **Deploy Command** | `npx wrangler deploy` | Executes Cloudflare Worker deployment |
| **Node.js Version** | `20.18.0` (or set `NODE_VERSION=20`) | Recommended production Node LTS version |

---

## 4. Environment Variables Reference

| Variable | Scope | Required at Build? | Required at Runtime? | Exposure | Purpose |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `NODE_VERSION` | Cloudflare Build | Yes | No | Build Config | Forces Node 20 LTS build environment |
| `NEXT_PUBLIC_SUPABASE_URL` | `apps/web` | Yes | Yes | Public | Supabase API endpoint URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `apps/web` | Yes | Yes | Public | Supabase client anon API key |
| `NEXT_PUBLIC_API_URL` | `apps/web` | Yes | Yes | Public | Backend API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/api` | No | Yes | Private Secret | Supabase admin operations |
| `JWT_SECRET` | `apps/api` | No | Yes | Private Secret | Backend authentication signing key |

---

## 5. Verification Commands

Run locally to verify build pipeline integrity:

```bash
# 1. Clean reproducible dependency installation
npm ci

# 2. Lint frontend codebase
npm run lint:web

# 3. Production Next.js build
npm run build:web
```

---

## 6. Next Steps & Cloudflare Deployment Retry
1. Commit the configuration changes to the repository (`git commit -m "fix(deploy): fix Cloudflare Workers production build"`).
2. Push the commit to GitHub.
3. Update the Cloudflare Dashboard **Build command** setting to `npm run build:web`.
4. Trigger a new build deployment in Cloudflare Workers.
