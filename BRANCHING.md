# LeadPilot AI CRM — Git Branching & Tagging Policy

---

## Branch Structure

- `main`: Production-ready stability branch. All CI quality gates must pass.
- `develop`: Integration branch for sprint features.
- `feature/<name>`: Topic feature branches.
- `fix/<name>`: Bugfix or CI stabilization branches.

---

## Tagging Standard

Follow Semantic Versioning: `vMAJOR.MINOR.PATCH` (e.g., `v3.0.0`).
Release commits follow Conventional Commits: `release(v3.0.0): <description>`.
