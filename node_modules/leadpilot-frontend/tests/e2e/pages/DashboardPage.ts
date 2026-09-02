import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly kpiCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator("h1");
    this.kpiCards = page.locator(".grid > div");
  }

  async goto() {
    await this.navigateTo("/dashboard");
  }

  async verifyDashboardLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.kpiCards.first()).toBeVisible();
  }
}
