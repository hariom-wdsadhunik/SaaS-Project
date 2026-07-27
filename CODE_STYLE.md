# LeadPilot AI CRM — Code Style & Formatting Specification

---

## 1. TypeScript & JavaScript Standards

- Use strict TypeScript typing; avoid explicit `any` usage.
- Prefer functional components and React 19 hooks for UI elements.
- Export named components and types; avoid default exports where applicable.

---

## 2. ESLint & Formatting Controls

- Run `npm run lint` prior to submitting pull requests.
- All dynamic API routes MUST include `export const dynamic = "force-dynamic";`.
- All CSS design tokens must draw from `src/styles/tokens.css`.
