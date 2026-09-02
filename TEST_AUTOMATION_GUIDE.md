# LeadPilot AI CRM — Enterprise Test Automation Guide (v4.0.0)

**Version:** v4.0.0  

---

## 1. Page Object Model (POM) Best Practices

Every web page component is modeled as a class extending `BasePage`:

```ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LeadsPage extends BasePage {
  readonly leadTable: Locator;

  constructor(page: Page) {
    super(page);
    this.leadTable = page.locator("table");
  }

  async goto() {
    await this.navigateTo("/leads");
  }
}
```

---

## 2. Test Fixture Dependency Injection

Tests consume typed page instances automatically:

```ts
import { test, expect } from "../fixtures/testFixtures";

test("Leads module renders lead table", async ({ leadsPage }) => {
  await leadsPage.goto();
  await leadsPage.verifyLeadsTableVisible();
});
```
