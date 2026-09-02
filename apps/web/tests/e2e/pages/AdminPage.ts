import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminPage extends BasePage {
  readonly adminHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.adminHeader = page.locator("h1");
  }

  async goto() {
    await this.navigateTo("/admin");
  }

  async verifyAdminConsoleLoaded() {
    await expect(this.adminHeader).toBeVisible();
  }
}
