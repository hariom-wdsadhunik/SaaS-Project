import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(2, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    message: "Priority level is required",
  }),
  status: z.enum(["DRAFT", "TODO", "IN_PROGRESS", "WAITING", "COMPLETED", "CANCELLED", "ARCHIVED"], {
    message: "Status is required",
  }),
  category: z.enum(["CALL", "MEETING", "EMAIL", "FOLLOW_UP", "CONTRACT_REVIEW", "SITE_VISIT"], {
    message: "Category is required",
  }),
  dueDate: z.string().min(1, "Due date is required"),
  assignedAgentName: z.string().min(2, "Assigned broker is required"),
  relatedEntityType: z.enum(["CONTACT", "LEAD", "DEAL", "PROPERTY"]).optional(),
  relatedEntityName: z.string().optional(),
  contactId: z.string().optional(),
  leadId: z.string().optional(),
  dealId: z.string().optional(),
});

export type TaskFormInput = z.infer<typeof taskFormSchema>;
