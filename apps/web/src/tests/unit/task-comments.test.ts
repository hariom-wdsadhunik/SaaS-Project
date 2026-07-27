import { supabaseTaskRepository } from "@/infrastructure/repositories/SupabaseTaskRepository";

describe("Task Comments Engine Unit Tests", () => {
  test("addComment, getTaskComments, and deleteComment flow", async () => {
    const tasks = await supabaseTaskRepository.getTasks();
    const taskId = tasks[0].id;

    // 1. Add comment
    const comment = await supabaseTaskRepository.addComment(
      taskId,
      "Client confirmed availability for 3 PM showing tomorrow.",
      "Sarah Jenkins"
    );

    expect(comment.id).toBeDefined();
    expect(comment.taskId).toBe(taskId);
    expect(comment.authorName).toBe("Sarah Jenkins");
    expect(comment.content).toContain("Client confirmed availability");

    // 2. Fetch comments
    const comments = await supabaseTaskRepository.getTaskComments(taskId);
    expect(comments.length).toBeGreaterThan(0);
    expect(comments.some((c) => c.id === comment.id)).toBe(true);

    // 3. Delete comment
    const deleted = await supabaseTaskRepository.deleteComment(comment.id);
    expect(deleted).toBe(true);
  });
});
