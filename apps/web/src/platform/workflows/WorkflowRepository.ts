import { WorkflowDefinition, WorkflowExecutionLog } from "./WorkflowDefinition";

export class WorkflowRepository {
  private static workflows: Map<string, WorkflowDefinition> = new Map();
  private static logs: WorkflowExecutionLog[] = [];

  public static saveWorkflow(wf: WorkflowDefinition): WorkflowDefinition {
    this.workflows.set(wf.id, wf);
    return wf;
  }

  public static getWorkflowsByTrigger(trigger: string): WorkflowDefinition[] {
    return Array.from(this.workflows.values()).filter((w) => w.isActive && w.trigger === trigger);
  }

  public static logExecution(log: WorkflowExecutionLog): void {
    this.logs.push(log);
  }

  public static getLogs(): WorkflowExecutionLog[] {
    return [...this.logs];
  }
}
