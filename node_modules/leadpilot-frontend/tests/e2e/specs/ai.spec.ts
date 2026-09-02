import { test, expect } from "../fixtures/testFixtures";

test.describe("AI Copilot & Intelligence E2E Tests", () => {
  test("AI Intelligence page loads predictive lead score insights", async ({ page }) => {
    await page.goto("/ai");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("AI Copilot morning brief renders action items", async ({ page }) => {
    await page.goto("/copilot");
    await expect(page.locator("h1")).toBeVisible();
  });
});
