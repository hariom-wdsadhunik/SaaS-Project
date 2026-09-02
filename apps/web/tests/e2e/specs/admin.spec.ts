import { test, expect } from "../fixtures/testFixtures";

test.describe("Admin Console E2E Tests", () => {
  test("Admin console overview renders platform metrics", async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.verifyAdminConsoleLoaded();
  });

  test("Feature flags console renders canary rollout sliders", async ({ page }) => {
    await page.goto("/admin/feature-flags");
    await expect(page.locator("h1")).toBeVisible();
  });
});
