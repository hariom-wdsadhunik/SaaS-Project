import { WorkflowRule, WorkflowTriggerType } from "./WorkflowRule";

export class WorkflowRegistry {
  private rules: WorkflowRule[] = [];

  registerRule(rule: WorkflowRule): void {
    this.rules.push(rule);
  }

  getMatchingRules(trigger: WorkflowTriggerType): WorkflowRule[] {
    return this.rules
      .filter((r) => r.enabled && r.trigger === trigger)
      .sort((a, b) => b.priority - a.priority);
  }
}

export const defaultWorkflowRules: WorkflowRule[] = [
  {
    id: "rule-101",
    name: "Send Welcome WhatsApp on Lead Creation",
    trigger: "LeadCreated",
    enabled: true,
    priority: 10,
    actions: [
      {
        type: "SendMessage",
        params: { channel: "WHATSAPP", content: "Welcome to LeadPilot AI! A broker will contact you shortly." },
      },
    ],
  },
  {
    id: "rule-102",
    name: "Create Internal Note on Deal Won",
    trigger: "DealWon",
    enabled: true,
    priority: 5,
    actions: [
      {
        type: "CreateInternalNote",
        params: { content: "Deal successfully closed and converted!" },
      },
    ],
  },
];

export const workflowRegistry = new WorkflowRegistry();
defaultWorkflowRules.forEach((r) => workflowRegistry.registerRule(r));
