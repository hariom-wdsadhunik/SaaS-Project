import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly userAvatar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator("aside");
    this.userAvatar = page.locator('[aria-label="User profile menu"]');
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyTitle(titleSubstring: string) {
    await expect(this.page).toHaveTitle(new RegExp(titleSubstring, "i"));
  }
}
