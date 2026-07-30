import { WorkflowEngine } from "@/domain/automation/WorkflowEngine";
import { WorkflowCondition } from "@/domain/automation/WorkflowTypes";

describe("Workflow Automation Engine Unit Tests", () => {
  test("WorkflowEngine evaluates EQUALS and CONTAINS conditions correctly", () => {
    const condEquals: WorkflowCondition = {
      id: "c1",
      field: "source",
      operator: "EQUALS",
      value: "Website Inquiry",
    };
    expect(WorkflowEngine.evaluateCondition(condEquals, { source: "Website Inquiry" })).toBe(true);
    expect(WorkflowEngine.evaluateCondition(condEquals, { source: "Referral" })).toBe(false);

    const condContains: WorkflowCondition = {
      id: "c2",
      field: "notes",
      operator: "CONTAINS",
      value: "Gurgaon",
    };
    expect(WorkflowEngine.evaluateCondition(condContains, { notes: "Looking in Gurgaon DLF Phase 5" })).toBe(true);
  });

  test("WorkflowEngine evaluates GREATER_THAN numeric condition", () => {
    const condGt: WorkflowCondition = {
      id: "c3",
      field: "budget",
      operator: "GREATER_THAN",
      value: 1000000,
    };
    expect(WorkflowEngine.evaluateCondition(condGt, { budget: 2500000 })).toBe(true);
    expect(WorkflowEngine.evaluateCondition(condGt, { budget: 500000 })).toBe(false);
  });

  test("WorkflowEngine returns templates gallery", () => {
    const templates = WorkflowEngine.getTemplates();
    expect(templates.length).toBe(7);
  });

  test("WorkflowEngine executes active triggers and logs execution details", async () => {
    const logs = await WorkflowEngine.executeTrigger("LEAD_CREATED", { source: "Website Inquiry" }, "org-1");
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].result).toBe("SUCCESS");
  });

  test("WorkflowEngine toggles rule active state", async () => {
    const initialState = (await WorkflowEngine.getWorkflows("org-1"))[0].enabled;
    const toggledState = await WorkflowEngine.toggleWorkflow("wf-101");
    expect(toggledState).toBe(!initialState);
  });
});
