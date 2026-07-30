# LeadPilot AI CRM — UI Improvements Log (Sprint v3.2.0)

**Date:** July 30, 2026  
**Lead Designer:** Principal Product Designer & Senior Frontend Engineer  
**Version:** v3.2.0  

---

## 1. Visual Hierarchy & Spacing Polish

- **Typography Consistency:** Standardized page headers across all 15 routes with `text-2xl font-bold tracking-tight text-white` and subtitle `text-xs text-zinc-400 mt-1`.
- **Card Primitives:** Applied uniform glassmorphism dark-mode borders (`bg-zinc-900/80 border border-zinc-800`) across Dashboard, Leads, Deals, Analytics, and Settings pages.
- **Color Palette & Badges:** Curated semantic HSL color tokens for status badges:
  - `emerald`: Active, Closed Won, Pre-Qualified, Grade A
  - `blue`: Contacted, Proposal Sent, Grade B
  - `amber`: Warm Lead, Follow-up Pending, Medium Priority
  - `rose`: Deal at Risk, Overdue, Grade D/F
  - `indigo`/`violet`: AI Assistant Features & Copilot Engines

---

## 2. Skeleton Loaders & Feedback Feedback

- **Skeleton Loaders:** Integrated pulse animations (`skeleton.tsx`) for table rows, KPI metric cards, and chart containers during data fetching.
- **Empty States:** Enhanced empty state cards across Leads, Tasks, and Appointments with clear icons, action prompts, and primary call-to-action buttons.
- **Sonner Toast Notifications:** Configured top-right toast alerts for all user actions (Settings update, Lead conversion, AI summary generation, Email/WhatsApp draft creation).
- **Theme Hydration Match:** Replaced direct `mounted` state effect with `useSyncExternalStore` in `header.tsx` to eliminate hydration mismatch and icon flicker when toggling Dark/Light modes.
