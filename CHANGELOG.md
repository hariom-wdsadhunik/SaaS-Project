# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.2.0] - 2026-07-30

### Added
* **Formal QA Audit Report (`docs/qa-report.md`)**: Certified 100% test pass rate across 72 backend Jest suites and 6 Copilot engine unit tests.
* **UI Improvements Log (`docs/ui-improvements.md`)**: Documented standardized typography hierarchy, skeleton loading states, dark-mode card primitives, and Sonner toast notifications.
* **UX & Accessibility Review (`docs/ux-review.md`)**: Evaluated navigation flows, keyboard shortcuts (`⌘K` Command Palette, `⌘J` AI Assistant), and WCAG 2.2 AA accessibility standards.
* **Release Notes (`docs/releases/v3.2.0.md`)**: Final production release notes.

---

## [3.1.1] - 2026-07-30

### Fixed
* **Settings Route 404 Bug**: Created `apps/web/src/app/(dashboard)/settings/page.tsx`.
* **Theme System Dark Mode Hydration Bug**: Added `useSyncExternalStore` in `header.tsx`.
* **Navigation Links**: Replaced broken `/whatsapp` route in `sidebar.tsx` with `/communication`.
