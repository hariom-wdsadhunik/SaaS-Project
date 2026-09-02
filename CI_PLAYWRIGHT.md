# LeadPilot AI CRM — GitHub Actions CI/CD Playwright Integration (v4.0.0)

**Workflow File:** `.github/workflows/playwright.yml`  

---

## CI Pipeline Workflow Steps

1. **Checkout Code:** Retrieves repository commit.
2. **Setup Node.js 20 & npm Cache:** Restores package cache from root `package-lock.json`.
3. **Install Dependencies:** Executed at monorepo root (`npm ci`).
4. **Install Playwright Browsers:** `npx playwright install --with-deps`.
5. **Build Next.js Application:** Pre-renders frontend app.
6. **Execute Playwright Tests:** Runs test specs across Chromium, Firefox, WebKit, and Mobile Chrome.
7. **Upload Reports:** Uploads HTML report (`playwright-report`), JUnit XML (`test-results/junit.xml`), JSON results (`test-results/results.json`), screenshots, and trace recordings.
