import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TasksPage extends BasePage {
  readonly taskList: Locator;
  readonly createTaskButton: Locator;
  readonly titleInput: Locator;
  readonly dueDateInput: Locator;
  readonly prioritySelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.taskList = page.locator('[data-testid="task-list"], table, ul');
    this.createTaskButton = page.locator('button:has-text("Create Task"), button:has-text("Add Task")');
    this.titleInput = page.locator('input[name="title"], input[placeholder*="Task title"]');
    this.dueDateInput = page.locator('input[type="date"], input[name="due_date"]');
    this.prioritySelect = page.locator('select[name="priority"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Create")');
  }

  async goto() {
    await this.navigateTo('/tasks');
  }

  async createTask(title: string, priority: string = 'High') {
    await this.createTaskButton.click();
    await this.titleInput.fill(title);
    if (await this.prioritySelect.isVisible()) {
      await this.prioritySelect.selectOption(priority);
    }
    await this.submitButton.click();
  }

  async verifyTaskExists(title: string) {
    await expect(this.page.locator(`text=${title}`)).toBeVisible();
  }
}
