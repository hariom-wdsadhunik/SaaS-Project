import { contactFormSchema } from "@/lib/validations/contact-form";
import { taskFormSchema } from "@/lib/validations/task-form";

describe("Entity Form Zod Validators Unit Tests", () => {
  test("contactFormSchema validates valid contact input", () => {
    const validResult = contactFormSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      status: "ACTIVE",
      assignedAgentName: "Alex Morgan",
    });
    expect(validResult.success).toBe(true);
  });

  test("contactFormSchema rejects missing contact channels", () => {
    const invalidResult = contactFormSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      status: "ACTIVE",
      assignedAgentName: "Alex Morgan",
    });
    expect(invalidResult.success).toBe(false);
  });

  test("taskFormSchema validates valid task input", () => {
    const validResult = taskFormSchema.safeParse({
      title: "Schedule Site Visit",
      priority: "HIGH",
      status: "TODO",
      category: "SITE_VISIT",
      dueDate: "2026-07-26T14:00",
      assignedAgentName: "Alex Morgan",
    });
    expect(validResult.success).toBe(true);
  });

  test("taskFormSchema rejects empty task title", () => {
    const invalidResult = taskFormSchema.safeParse({
      title: "",
      priority: "HIGH",
      status: "TODO",
      category: "SITE_VISIT",
      dueDate: "2026-07-26T14:00",
      assignedAgentName: "Alex Morgan",
    });
    expect(invalidResult.success).toBe(false);
  });
});
