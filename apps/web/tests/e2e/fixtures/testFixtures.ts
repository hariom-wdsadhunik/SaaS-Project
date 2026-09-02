/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LeadsPage } from "../pages/LeadsPage";
import { DealsPage } from "../pages/DealsPage";
import { AdminPage } from "../pages/AdminPage";

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  leadsPage: LeadsPage;
  dealsPage: DealsPage;
  adminPage: AdminPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  leadsPage: async ({ page }, use) => {
    await use(new LeadsPage(page));
  },
  dealsPage: async ({ page }, use) => {
    await use(new DealsPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
});

export { expect } from "@playwright/test";
