import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LeadsPage extends BasePage {
  readonly addLeadButton: Locator;
  readonly leadTable: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.addLeadButton = page.locator('button:has-text("Add Lead")');
    this.leadTable = page.locator("table");
    this.searchInput = page.locator('input[placeholder*="Search"]');
  }

  async goto() {
    await this.navigateTo("/leads");
  }

  async verifyLeadsTableVisible() {
    await expect(this.leadTable).toBeVisible();
  }
}
