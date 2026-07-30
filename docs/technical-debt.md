# LeadPilot AI CRM — Technical Debt & Refactoring Report

**Version:** v3.8.0  
**Assessment Date:** July 30, 2026  

---

## 1. Technical Debt Inventory

### A. Code Duplication
- **Data Facades vs Demo Mode Mocks:** In client-side domain services (`ConnectorRegistry`, `ReportingEngine`, `AiIntelligenceEngine`, `AdminService`), initial state is initialized with rich mock data for instant preview capability alongside real Supabase persistence proxies.
- **Table Components Pattern:** `lead-table.tsx`, `contact-table.tsx`, `property-table.tsx`, and `task-table.tsx` share similar TanStack Table configuration boilerplate.

### B. Component Complexity & Sizing
- **Large Table Views:** `lead-table.tsx` contains multi-column filtering, modal triggers, and bulk action handlers in a single ~300 line file.

### C. Performance & React Compiler Warnings
- **TanStack Table & React Hook Form:** React Compiler logs `Compilation Skipped: Use of incompatible library` for `useReactTable` and `watch()` hook usages in form components. This does not break execution but skips memoization.

---

## 2. Refactoring Recommendations for v4.0.0

1. **Abstract Generic DataTable Wrapper:** Extract shared TanStack Table state (sorting, pagination, column visibility) into `@/components/ui/data-table.tsx`.
2. **Unified Mock/Live Toggle:** Move domain service mock fallbacks behind a global environment configuration switch (`NEXT_PUBLIC_ENABLE_MOCK_FALLBACKS`).
