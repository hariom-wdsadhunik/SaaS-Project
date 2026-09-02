import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly teamSettingsTab: Locator;
  readonly integrationsTab: Locator;
  readonly saveSettingsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.teamSettingsTab = page.locator('button:has-text("Team"), a:has-text("Team")');
    this.integrationsTab = page.locator('button:has-text("Integrations"), a:has-text("Integrations")');
    this.saveSettingsButton = page.locator('button:has-text("Save Settings"), button:has-text("Save")');
  }

  async goto() {
    await this.navigateTo('/settings');
  }

  async verifySettingsPageLoaded() {
    await expect(this.page).toHaveURL(/.*settings/);
  }
}
