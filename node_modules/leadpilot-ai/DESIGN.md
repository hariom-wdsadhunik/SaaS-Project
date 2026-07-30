# LeadPilot AI CRM — Design System Guide & Token Specification (v2.0.0)

**Version:** v2.0.0  
**Design Philosophy:** Minimalist, Precision-Engineered, Enterprise-Ready (Inspired by Apple, Stripe, Linear, Notion, Vercel).

---

## 1. Design Tokens Reference ([`src/styles/tokens.css`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/styles/tokens.css))

- **Background Colors:** Dark (`#09090b`), Secondary (`#121215`), Borders (`#27272a`).
- **Accent Colors:** Primary Blue (`#3b82f6`), Emerald (`#10b981`), Amber (`#f59e0b`), Rose (`#f43f5e`).
- **Typography:** `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`.
- **Border Radii:** `sm (6px)`, `md (8px)`, `lg (12px)`, `xl (16px)`, `full (9999px)`.

---

## 2. Reusable UI Components ([`src/components/ui/`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/))

- [`Button.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/Button.tsx): Button primitive with `primary`, `secondary`, `outline`, `danger`, `ghost` variants.
- [`Input.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/Input.tsx): Input primitive with label and error state handling.
- [`Card.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/Card.tsx): Bordered surface container with hover highlight transitions.
- [`Badge.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/Badge.tsx): Status indicator badge primitive (`blue`, `emerald`, `amber`, `rose`, `zinc`).
- [`Modal.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/Modal.tsx): Dialog primitive with backdrop blur and Escape key handler.
- [`CommandPalette.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/ui/CommandPalette.tsx): Global search modal (⌘K shortcut).

---

## 3. CRM Layout Shell System ([`AppLayout.tsx`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/components/layout/AppLayout.tsx))

Provides top navigation, collapsible mobile menu, offline indicator banner, command palette container, and main viewport grid.
