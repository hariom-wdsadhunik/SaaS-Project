import { supabaseTaskRepository } from "@/infrastructure/repositories/SupabaseTaskRepository";

describe("SupabaseTaskRepository Unit Tests", () => {
  test("getTasks returns array of task entities", async () => {
    const tasks = await supabaseTaskRepository.getTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  test("getTaskById retrieves specific task entity", async () => {
    const tasks = await supabaseTaskRepository.getTasks();
    const firstId = tasks[0].id;
    const task = await supabaseTaskRepository.getTaskById(firstId);
    expect(task).not.toBeNull();
    expect(task?.id).toBe(firstId);
  });

  test("createTask creates and persists new task record", async () => {
    const newTask = await supabaseTaskRepository.createTask({
      title: "Review Executive Investment Agreement",
      description: "Review contract terms for Palm Jumeirah transaction.",
      priority: "HIGH",
      status: "TODO",
      category: "CONTRACT_REVIEW",
      dueDate: "2026-07-30T10:00:00Z",
      assignedAgentName: "Alex Morgan",
    });

    expect(newTask.id).toBeDefined();
    expect(newTask.title).toBe("Review Executive Investment Agreement");
    expect(newTask.priority).toBe("HIGH");

    const fetched = await supabaseTaskRepository.getTaskById(newTask.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe("Review Executive Investment Agreement");
  });

  test("completeTask marks task status COMPLETED and records completedAt timestamp", async () => {
    const tasks = await supabaseTaskRepository.getTasks();
    const testId = tasks[0].id;

    const completed = await supabaseTaskRepository.completeTask(testId);
    expect(completed.status).toBe("COMPLETED");
    expect(completed.completedAt).toBeDefined();
  });

  test("archiveTask sets status ARCHIVED", async () => {
    const tasks = await supabaseTaskRepository.getTasks();
    const testId = tasks[tasks.length - 1].id;

    const archived = await supabaseTaskRepository.archiveTask(testId);
    expect(archived.status).toBe("ARCHIVED");
  });

  test("assignTask updates assignedAgentName", async () => {
    const tasks = await supabaseTaskRepository.getTasks();
    const testId = tasks[0].id;

    const assigned = await supabaseTaskRepository.assignTask(testId, "Sarah Jenkins");
    expect(assigned.assignedAgentName).toBe("Sarah Jenkins");
  });

  test("deleteTask removes task from repository", async () => {
    const tempTask = await supabaseTaskRepository.createTask({
      title: "Temporary Task To Delete",
      priority: "LOW",
      status: "TODO",
      category: "FOLLOW_UP",
      dueDate: "2026-08-01T10:00:00Z",
      assignedAgentName: "Alex Morgan",
    });

    const success = await supabaseTaskRepository.deleteTask(tempTask.id);
    expect(success).toBe(true);

    const fetched = await supabaseTaskRepository.getTaskById(tempTask.id);
    expect(fetched).toBeNull();
  });
});
