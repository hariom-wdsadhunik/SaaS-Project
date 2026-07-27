# LeadPilot AI CRM — Enterprise CI/CD Pipeline Documentation

**Module:** Infrastructure & CI/CD  
**Version:** v2.4.0  

---

## 1. Architecture Overview

The GitHub Actions CI/CD pipeline consists of two parallel verification workflows:

- **Frontend Verification (`ci.yml -> frontend-build-and-verify`):**
  - Working directory: `leadpilot-ai/leadpilot-frontend`
  - Cache dependency path: `leadpilot-ai/leadpilot-frontend/package-lock.json`
  - Runs `npm ci`, `npm run lint`, `npm run build`
  - Uploads Next.js build output artifact.

- **Backend Verification (`ci.yml -> backend-build-and-verify`):**
  - Working directory: `leadpilot-ai`
  - Cache dependency path: `leadpilot-ai/package-lock.json`
  - Runs `npm ci`, `npm test`.

---

## 2. Hardening Features

- **Idempotent Caching:** Dependency caching keyed strictly off subfolder `package-lock.json` paths.
- **Concurrency Cancellation:** Automatic cancellation of redundant pipeline runs on rapid pushes.
- **Fail-Fast & Timeouts:** Strict 15-minute execution timeouts preventing hung builds.
