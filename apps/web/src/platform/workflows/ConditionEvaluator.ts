import { WorkflowCondition } from "./WorkflowDefinition";

export class ConditionEvaluator {
  public static evaluate(conditions: WorkflowCondition[], payload: Record<string, unknown>): boolean {
    if (!conditions || conditions.length === 0) return true;

    for (const cond of conditions) {
      const val = payload[cond.field];

      switch (cond.operator) {
        case "EQUALS":
          if (val !== cond.value) return false;
          break;
        case "NOT_EQUALS":
          if (val === cond.value) return false;
          break;
        case "CONTAINS":
          if (typeof val !== "string" || !val.includes(String(cond.value))) return false;
          break;
        case "GREATER_THAN":
          if (Number(val) <= Number(cond.value)) return false;
          break;
        case "LESS_THAN":
          if (Number(val) >= Number(cond.value)) return false;
          break;
      }
    }

    return true;
  }
}
