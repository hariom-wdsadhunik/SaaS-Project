# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-07-26

### Added
* **First Run Experience (`src/components/onboarding/OnboardingWizard.tsx`)**: Created `OnboardingWizard` and `SampleDataLoader.ts` for workspace setup, team invitations, and sample CRM data seeding.
* **Guided Product Tours (`src/platform/tour/`)**: Created `ProductTourService` and `ProductTourOverlay` supporting guided tours for Dashboard, Leads, Deals, Calendar, Documents, Communication, Analytics, and AI Workspace.
* **Demo Mode Subsystem (`src/platform/demo/DemoModeService.ts`)**: Created interactive demo workspace toggle.
* **Enhanced Error Pages & Resiliency**: Built branded 404 page (`src/app/not-found.tsx`), 500 error boundary (`src/app/error.tsx`), and network offline alert (`src/components/common/OfflineBanner.tsx`).
* **Accessibility Hardening (`src/platform/a11y/accessibility.ts`)**: Added screen reader announcer helper and focus trapping utilities.
* **Launch Documentation**: Created `GettingStarted.md`, `AdministratorGuide.md`, and `UserGuide.md`.
* **Unit Test Suite**: Added `onboarding.test.ts`, `demo.test.ts`, `tour.test.ts`, and `a11y.test.ts`.

---

## [1.0.0] - 2026-07-26

### Added
* **AI Workspace (`src/domain/ai/workspace/`)**: Introduced `AIConversation`, `AIContextBuilder`, `AIResponseFormatter`, `ConversationMemory`, and `AIWorkspace` facade.
