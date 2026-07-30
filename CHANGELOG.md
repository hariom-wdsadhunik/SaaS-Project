# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.1.1] - 2026-07-30

### Fixed
* **Settings Route 404 Bug**: Created `apps/web/src/app/(dashboard)/settings/page.tsx` with user profile, organization preferences, theme switcher, and security controls.
* **Theme System Dark Mode Hydration Bug**: Added `mounted` lifecycle check in `header.tsx` to ensure initial SSR and CSR render match 100% without icon flicker or hydration errors.
* **Navigation Links**: Replaced broken `/whatsapp` route in `sidebar.tsx` with `/communication` (Omnichannel Messaging Suite).
* **Header Profile Link**: Linked "Profile Settings" in user menu directly to `/settings`.

### Added
* **Repository Audit Report**: Published `docs/repository-audit.md`.

---

## [3.1.0] - 2026-07-27

### Added
* **AI Lead Summary Engine (`LeadSummaryEngine.ts`)**: Summarizes lead history, key facts, risks, and opportunities.
* **AI Email Assistant (`EmailCopilotService.ts`)**: Follow-up generation, tone adjustment, message rewriting, and thread summarization.
* **AI WhatsApp Assistant (`WhatsAppCopilotService.ts`)**: Instant reply drafting, follow-up prompts, and chat summaries.
* **Meeting Preparation Engine (`MeetingPrepEngine.ts`)**: Generates lead overview, timeline, previous interactions, open tasks, and recommended talking points.
* **Daily Morning AI Brief (`DailyBriefEngine.ts`)**: Priority lead ranking, deals at risk alerts, tasks due today, and suggested actions.
* **Deal Health Engine (`DealHealthEngine.ts`)**: Closing probability scoring (0-100), health grading (A-F), missing document flags, and next best action.
* **AI Command Center Dashboard (`/copilot`)**: Consolidated UI combining daily brief, deal health grid, copilot action tools, and interactive chat.
* **API v1 Endpoints (`/api/v1/copilot/*`)**: Created 6 dynamic API v1 routes.
