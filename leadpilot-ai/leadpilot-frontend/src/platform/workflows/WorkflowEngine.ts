import { WorkflowDefinition, TriggerEvent } from "./WorkflowDefinition";
import { WorkflowRepository } from "./WorkflowRepository";
import { WorkflowRunner } from "./WorkflowRunner";
import { WorkflowValidator } from "./WorkflowValidator";
import { eventBus } from "@/platform/events/EventBus";

export class WorkflowEngine {
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;

    // Register default system workflows
    this.createDefaultWorkflows();

    // Subscribe to domain event bus triggers
    eventBus.subscribe("LeadCreated", async (event) => {
      await this.handleTrigger("LeadCreated", event.payload as Record<string, unknown>);
    });

    eventBus.subscribe("DealWon", async (event) => {
      await this.handleTrigger("DealWon", event.payload as Record<string, unknown>);
    });

    eventBus.subscribe("DocumentUploaded", async (event) => {
      await this.handleTrigger("DocumentUploaded", event.payload as Record<string, unknown>);
    });

    this.isInitialized = true;
    console.log("[WorkflowEngine] Automation engine initialized.");
  }

  public static async registerWorkflow(wfInput: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> {
    const { valid, errors } = WorkflowValidator.validate(wfInput);
    if (!valid) throw new Error(`[WorkflowEngine] Validation failed: ${errors.join(", ")}`);

    const wf: WorkflowDefinition = {
      id: wfInput.id || `wf-${Date.now()}`,
      name: wfInput.name!,
      description: wfInput.description,
      organizationId: wfInput.organizationId || "org-001",
      trigger: wfInput.trigger!,
      conditions: wfInput.conditions || [],
      actions: wfInput.actions || [],
      isActive: wfInput.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return WorkflowRepository.saveWorkflow(wf);
  }

  public static async handleTrigger(trigger: TriggerEvent, payload: Record<string, unknown>): Promise<void> {
    const workflows = WorkflowRepository.getWorkflowsByTrigger(trigger);
    for (const wf of workflows) {
      await WorkflowRunner.runWorkflow(wf, payload);
    }
  }

  private static createDefaultWorkflows(): void {
    this.registerWorkflow({
      id: "wf-new-lead-alert",
      name: "New High Value Lead Welcome Workflow",
      organizationId: "org-001",
      trigger: "LeadCreated",
      conditions: [],
      actions: [
        { id: "act-1", type: "SendNotification", params: { title: "New Lead Created", message: "Automated workflow triggered for new lead." } },
        { id: "act-2", type: "CreateTask", params: { title: "Schedule Initial Outreach Call" } },
      ],
      isActive: true,
    });
  }
}
