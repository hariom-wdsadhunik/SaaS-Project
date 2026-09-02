import { test, expect } from "../fixtures/testFixtures";

test.describe("Workflow Automation E2E Tests", () => {
  test("Workflow automation page renders rule list", async ({ page }) => {
    await page.goto("/automation");
    await expect(page.locator("h1")).toBeVisible();
  });
});
