import { supabaseTaskRepository } from "@/infrastructure/repositories/SupabaseTaskRepository";
import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";

describe("Task Timeline Integration Unit Tests", () => {
  test("Task activity history and contact timeline cross-module integration", async () => {
    // 1. Get contact ID
    const contacts = await supabaseContactRepository.getContacts();
    const contactId = contacts[0].id;

    // 2. Create task associated with contact
    const task = await supabaseTaskRepository.createTask({
      title: "Schedule Investment Portfolio Review",
      description: "Discuss Q3 real estate portfolio expansion.",
      priority: "HIGH",
      status: "TODO",
      category: "MEETING",
      dueDate: "2026-07-31T14:00:00Z",
      assignedAgentName: "Alex Morgan",
      contactId,
    });

    // 3. Verify task activity captured
    const activity = await supabaseTaskRepository.getTaskActivity(task.id);
    expect(activity.length).toBeGreaterThan(0);
    expect(activity[0].eventType).toBe("Task Created");

    // 4. Verify contact timeline event was automatically appended
    const contactTimeline = await supabaseContactRepository.getTimelineEvents(contactId);
    expect(contactTimeline.length).toBeGreaterThan(0);
    const taskEvents = contactTimeline.filter((e) => e.eventType === "Task");
    expect(taskEvents.length).toBeGreaterThan(0);

    // 5. Complete task
    await supabaseTaskRepository.completeTask(task.id);
    const updatedActivity = await supabaseTaskRepository.getTaskActivity(task.id);
    expect(updatedActivity.some((a) => a.eventType === "Task Completed")).toBe(true);
  });
});
