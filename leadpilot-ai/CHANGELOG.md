# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-07-26

### Added
* **Brand Foundation (`docs/design/brand-foundation.md`)**: Brand vision, values, mission statement, tone of voice, brand story, and tagline options.
* **Design Tokens (`src/styles/tokens.css`)**: Centralized CSS tokens for colors, typography scales, spacing, border radius curves, elevation shadows, and dark/light themes.
* **Component Library Primitives (`src/components/ui/`)**: Reusable UI components (`Button`, `Input`, `Card`, `Badge`, `Modal`, `CommandPalette` ⌘K search).
* **CRM Layout Shell System (`src/components/layout/AppLayout.tsx`)**: Responsive top navigation, sidebar, mobile menu, and main content grid.
* **Iconography & Illustration Guidelines (`docs/design/iconography-illustrations.md`)**: Line icon standards and illustration direction.
* **Design System Guide (`DESIGN.md`)**: Complete token and component usage reference manual.
* **Unit Test Suite**: Created `design-system.test.ts`.

---

## [1.0.1] - 2026-07-26

### Added
* **First Run Experience (`src/components/onboarding/OnboardingWizard.tsx`)**: Created `OnboardingWizard` and `SampleDataLoader.ts`.
