import { WorkflowDefinition, WorkflowExecutionLog } from "./WorkflowDefinition";
import { ConditionEvaluator } from "./ConditionEvaluator";
import { ActionExecutor } from "./ActionExecutor";
import { WorkflowRepository } from "./WorkflowRepository";

export class WorkflowRunner {
  public static async runWorkflow(wf: WorkflowDefinition, payload: Record<string, unknown>): Promise<WorkflowExecutionLog> {
    const executedActions: string[] = [];
    const now = new Date().toISOString();

    const matches = ConditionEvaluator.evaluate(wf.conditions, payload);

    if (!matches) {
      const log: WorkflowExecutionLog = {
        id: `log-${Date.now()}`,
        workflowId: wf.id,
        triggerEvent: wf.trigger,
        status: "SKIPPED",
        executedActions: [],
        executedAt: now,
      };
      WorkflowRepository.logExecution(log);
      return log;
    }

    try {
      for (const action of wf.actions) {
        await ActionExecutor.executeAction(action, payload);
        executedActions.push(action.id);
      }

      const log: WorkflowExecutionLog = {
        id: `log-${Date.now()}`,
        workflowId: wf.id,
        triggerEvent: wf.trigger,
        status: "SUCCESS",
        executedActions,
        executedAt: now,
      };
      WorkflowRepository.logExecution(log);
      return log;
    } catch (err) {
      const log: WorkflowExecutionLog = {
        id: `log-${Date.now()}`,
        workflowId: wf.id,
        triggerEvent: wf.trigger,
        status: "FAILED",
        executedActions,
        errorMessage: String(err),
        executedAt: now,
      };
      WorkflowRepository.logExecution(log);
      return log;
    }
  }
}
