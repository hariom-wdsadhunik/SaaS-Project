import { test, expect } from "../fixtures/testFixtures";

test.describe("CRM Modules E2E Tests", () => {
  test("Leads module renders lead table", async ({ leadsPage }) => {
    await leadsPage.goto();
    await leadsPage.verifyLeadsTableVisible();
  });

  test("Deals module renders Kanban pipeline", async ({ dealsPage }) => {
    await dealsPage.goto();
    await dealsPage.verifyKanbanLoaded();
  });
});
