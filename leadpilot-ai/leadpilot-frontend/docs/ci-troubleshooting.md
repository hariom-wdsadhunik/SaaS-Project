# LeadPilot AI CRM — CI Troubleshooting Guide

**Module:** Infrastructure & CI/CD  
**Version:** v2.4.0  

---

## 1. Resolved Failure: "Dependencies lock file is not found"

- **Symptom:** `actions/setup-node@v4` fails with `Dependencies lock file is not found`.
- **Root Cause:** Default setup-node searches repository root (`./package-lock.json`), but project lockfiles reside in `leadpilot-ai/package-lock.json` and `leadpilot-ai/leadpilot-frontend/package-lock.json`.
- **Resolution:** Explicitly set `cache-dependency-path` and `defaults.run.working-directory` in workflow YAML definitions.
