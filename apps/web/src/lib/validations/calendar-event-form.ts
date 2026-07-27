import { z } from "zod";

export const calendarEventFormSchema = z
  .object({
    title: z.string().min(2, "Event title must be at least 2 characters."),
    description: z.string().optional(),
    eventType: z.enum(
      ["TASK", "APPOINTMENT", "MEETING", "FOLLOW_UP", "PROPERTY_VISIT", "REMINDER", "SYSTEM"],
      { message: "Valid event type is required." }
    ),
    priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"], {
      message: "Valid priority level is required.",
    }),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "IN_PROGRESS"], {
      message: "Valid status is required.",
    }),
    start: z.string().min(1, "Start date and time are required."),
    end: z.string().min(1, "End date and time are required."),
    assignedAgentName: z.string().min(1, "Assigned agent is required."),
    relatedEntityType: z.enum(["LEAD", "DEAL", "PROPERTY", "CONTACT", "TASK"]).optional(),
    relatedEntityName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.start && data.end) {
        return new Date(data.start) < new Date(data.end);
      }
      return true;
    },
    {
      message: "End date/time must be strictly after Start date/time.",
      path: ["end"],
    }
  );

export type CalendarEventFormInput = z.infer<typeof calendarEventFormSchema>;
