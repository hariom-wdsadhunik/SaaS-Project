import { workflowRegistry } from "@/domain/communication/automation/WorkflowRegistry";
import { automationEventBus } from "@/domain/communication/automation/AutomationEventBus";
import { WorkflowExecutor } from "@/domain/communication/automation/WorkflowExecutor";

describe("Communication Automation Engine Unit Tests", () => {
  test("WorkflowRegistry resolves rules for LeadCreated trigger", () => {
    const rules = workflowRegistry.getMatchingRules("LeadCreated");
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0].actions[0].type).toBe("SendMessage");
  });

  test("AutomationEventBus publishes and triggers callbacks", () => {
    let triggered = false;
    automationEventBus.subscribe("DealWon", () => {
      triggered = true;
    });

    automationEventBus.publish("DealWon", { dealId: "deal-1" });
    expect(triggered).toBe(true);
  });

  test("WorkflowExecutor executes rule actions", async () => {
    const rules = workflowRegistry.getMatchingRules("LeadCreated");
    const result = await WorkflowExecutor.executeRule(rules[0], { leadId: "lead-99" });
    expect(result).toBe(true);
  });
});
