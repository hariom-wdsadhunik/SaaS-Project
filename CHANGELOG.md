# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.8.0] - 2026-07-30

### Added
* **Global Administration Console (`AdminService.ts`)**: Centralized multi-tenant organization provisioning, global user directory management, and license seat controls.
* **Centralized Feature Flags Studio (`/admin/feature-flags`)**: Environment-scoped feature toggles, percentage rollout sliders (0-100%), and organization-targeted overrides.
* **Infrastructure Telemetry Dashboard (`/admin/monitoring`)**: Live cluster health monitoring for CPU, memory, API latency, database connection pools, and AI inference engines.
* **Background Jobs & Retry Queue Manager (`/admin/jobs`)**: BullMQ worker monitoring, failed task retries, and job execution logs.
* **Security Operations Center (SOC) (`/admin/audit`)**: Real-time security incident alerts, failed login tracking, role elevation logs, and tamper-proof audit exports.
* **System Operations & Backup Recovery (`/admin/system`)**: Database snapshot history, retention policies, and SHA-256 integrity checksum verification.
* **Admin UI Sub-App (`/admin/*`)**: Created 8 admin operational pages (`/admin`, `/admin/system`, `/admin/organizations`, `/admin/users`, `/admin/jobs`, `/admin/monitoring`, `/admin/feature-flags`, `/admin/audit`).
* **Unit Tests & Documentation**: Added `admin-service.test.ts` unit test suite and system documentation (`admin-console.md`, `monitoring.md`, `feature-flags.md`, `operations.md`, `security-operations.md`).

---

## [3.7.0] - 2026-07-30

### Added
* **Centralized AI Intelligence Engine (`AiIntelligenceEngine.ts`)**: Modular machine learning predictor providing Lead Scoring, Opportunity Win Probability, Churn Risk, Revenue Forecasting, and Next Best Actions.
* **Predictive Lead & Opportunity Scoring**: Propensity scores (0-100), grades (A-D), confidence levels, and feature importance weighting.
* **AI Revenue Forecasting**: Monthly, quarterly, and annual projections with Monte Carlo simulations, best/worst case scenarios, and 85-95% confidence intervals.
* **Next Best Action Engine**: Prescriptive sales guidance prioritizing critical follow-ups based on expected revenue impact and urgency.
* **Explainable AI (XAI)**: Transparent reasoning breakdowns showing positive and negative feature drivers.
* **AI Platform UI Sub-App (`/ai/*`)**: Created 5 AI intelligence pages (`/ai`, `/ai/insights`, `/ai/forecast`, `/ai/leads`, `/ai/recommendations`).
* **Unit Tests & Documentation**: Added `ai-intelligence-engine.test.ts` unit test suite and system documentation (`ai-engine.md`, `lead-scoring.md`, `forecasting.md`, `recommendation-engine.md`, `next-best-action.md`).
