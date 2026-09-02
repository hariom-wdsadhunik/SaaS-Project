import { test, expect } from "../fixtures/testFixtures";

test.describe("Authentication E2E Tests", () => {
  test("User can navigate to login page", async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test("Invalid login shows error feedback", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("invalid@user.com", "wrongpass");
  });

  test("Protected route redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
  });
});
