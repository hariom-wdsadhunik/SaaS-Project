import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DealsPage extends BasePage {
  readonly kanbanBoard: Locator;

  constructor(page: Page) {
    super(page);
    this.kanbanBoard = page.locator('body').first();
  }

  async goto() {
    await this.navigateTo("/deals");
  }

  async verifyKanbanLoaded() {
    await expect(this.kanbanBoard).toBeVisible({ timeout: 15000 });
  }
}
