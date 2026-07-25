import { WorkflowTriggerType } from "./WorkflowRule";
import { workflowRegistry } from "./WorkflowRegistry";
import { WorkflowExecutor } from "./WorkflowExecutor";
import { automationEventBus } from "./AutomationEventBus";

export class WorkflowEngine {
  constructor() {
    this.initSubscriptions();
  }

  private initSubscriptions(): void {
    const triggers: WorkflowTriggerType[] = [
      "LeadCreated",
      "LeadAssigned",
      "LeadQualified",
      "DealCreated",
      "DealWon",
      "DealLost",
      "AppointmentScheduled",
      "AppointmentConfirmed",
      "AppointmentCompleted",
      "TaskAssigned",
      "TaskCompleted",
    ];

    triggers.forEach((trigger) => {
      automationEventBus.subscribe(trigger, (payload) => this.handleEvent(trigger, payload));
    });
  }

  async handleEvent(trigger: WorkflowTriggerType, payload: Record<string, unknown>): Promise<void> {
    const rules = workflowRegistry.getMatchingRules(trigger);
    for (const rule of rules) {
      await WorkflowExecutor.executeRule(rule, payload);
    }
  }
}

export const workflowEngine = new WorkflowEngine();
