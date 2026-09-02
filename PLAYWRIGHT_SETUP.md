# LeadPilot AI CRM — Playwright Test Suite Setup & Architecture Guide (v4.0.0)

**Version:** v4.0.0  
**Framework:** Playwright (TypeScript + Page Object Model)  

---

## 1. Directory Topology

```text
apps/web/
├── playwright.config.ts          # Master Playwright configuration
└── tests/e2e/
    ├── fixtures/
    │   └── testFixtures.ts       # Custom Playwright test extension fixtures
    ├── pages/                    # Page Object Model (POM) layer
    │   ├── BasePage.ts
    │   ├── LoginPage.ts
    │   ├── DashboardPage.ts
    │   ├── LeadsPage.ts
    │   ├── DealsPage.ts
    │   └── AdminPage.ts
    └── specs/                    # Automated test specifications
        ├── auth.spec.ts
        ├── crm.spec.ts
        ├── ai.spec.ts
        ├── admin.spec.ts
        └── workflows.spec.ts
```

---

## 2. Installation & Prerequisites

```bash
# 1. Install Monorepo Dependencies
npm install

# 2. Install Playwright Browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```
