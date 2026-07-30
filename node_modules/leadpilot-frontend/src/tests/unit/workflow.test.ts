import { WorkflowEngine } from "@/platform/workflows/WorkflowEngine";
import { WorkflowRepository } from "@/platform/workflows/WorkflowRepository";

describe("Workflow Automation Engine Unit Tests", () => {
  beforeAll(() => {
    WorkflowEngine.initialize();
  });

  test("registers new workflow definition and evaluates conditions", async () => {
    const wf = await WorkflowEngine.registerWorkflow({
      id: "wf-unit-test",
      name: "Deal Won Followup Workflow",
      organizationId: "org-001",
      trigger: "DealWon",
      conditions: [{ field: "value", operator: "GREATER_THAN", value: 100000 }],
      actions: [{ id: "a1", type: "SendNotification", params: { title: "Deal Won Alert" } }],
      isActive: true,
    });

    expect(wf.id).toBe("wf-unit-test");

    await WorkflowEngine.handleTrigger("DealWon", { value: 500000 });
    const logs = WorkflowRepository.getLogs();
    const testLog = logs.find((l) => l.workflowId === "wf-unit-test");
    expect(testLog).toBeDefined();
    expect(testLog?.status).toBe("SUCCESS");
  });
});
