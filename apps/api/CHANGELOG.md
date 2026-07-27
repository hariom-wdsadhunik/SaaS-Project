# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.4.0] - 2026-07-27

### Added
* **GitHub Actions CI Repair (`.github/workflows/ci.yml`)**: Added `cache-dependency-path` targeting `leadpilot-ai/package-lock.json` and `leadpilot-ai/leadpilot-frontend/package-lock.json`.
* **Working Directory Standardization**: Added `defaults.run.working-directory` ensuring subfolder command execution.
* **Pipeline Controls**: Added concurrency cancellation, 15-minute step timeouts, artifact uploads, and separate frontend & backend verification jobs.
* **Documentation**: Created `docs/ci-cd.md` and `docs/ci-troubleshooting.md`.

---

## [2.3.0] - 2026-07-26

### Added
* **Support Domain (`src/domain/support/`)**: Created `Article.ts`, `Feedback.ts`, and `Ticket.ts`.
