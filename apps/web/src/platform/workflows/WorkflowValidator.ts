import { WorkflowDefinition } from "./WorkflowDefinition";
import { TriggerRegistry } from "./TriggerRegistry";

export class WorkflowValidator {
  public static validate(def: Partial<WorkflowDefinition>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!def.name) errors.push("Workflow name is required.");
    if (!def.trigger) errors.push("Workflow trigger is required.");
    else if (!TriggerRegistry.isSupported(def.trigger)) errors.push(`Trigger '${def.trigger}' is not supported.`);

    if (!def.actions || def.actions.length === 0) errors.push("Workflow must contain at least one action step.");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
