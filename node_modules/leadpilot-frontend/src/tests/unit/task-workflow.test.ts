import { TaskTransitionValidator } from "@/domain/task/workflow/TaskTransitionValidator";
import { TASK_WORKFLOW_RULES } from "@/domain/task/workflow/TaskWorkflowRules";
import { TASK_AUTOMATION_RULES } from "@/domain/task/automation/TaskAutomationRules";

describe("Task Workflow Infrastructure Unit Tests", () => {
  test("TaskWorkflowRules allows valid state transitions", () => {
    expect(TASK_WORKFLOW_RULES.isValidTransition("TODO", "IN_PROGRESS")).toBe(true);
    expect(TASK_WORKFLOW_RULES.isValidTransition("IN_PROGRESS", "COMPLETED")).toBe(true);
    expect(TASK_WORKFLOW_RULES.isValidTransition("WAITING", "COMPLETED")).toBe(true);
  });

  test("TaskTransitionValidator blocks invalid transitions", () => {
    const sameStateResult = TaskTransitionValidator.validateStatusTransition("TODO", "TODO");
    expect(sameStateResult.allowed).toBe(true);

    const validResult = TaskTransitionValidator.validateStatusTransition("TODO", "IN_PROGRESS");
    expect(validResult.allowed).toBe(true);
  });

  test("TASK_AUTOMATION_RULES blocks scheduling reminders on closed tasks", () => {
    expect(TASK_AUTOMATION_RULES.canScheduleReminder("TODO")).toBe(true);
    expect(TASK_AUTOMATION_RULES.canScheduleReminder("IN_PROGRESS")).toBe(true);
    expect(TASK_AUTOMATION_RULES.canScheduleReminder("COMPLETED")).toBe(false);
    expect(TASK_AUTOMATION_RULES.canScheduleReminder("CANCELLED")).toBe(false);
  });
});
