import { z } from "zod";

export const appointmentFormSchema = z.object({
  title: z.string().min(2, "Meeting title is required"),
  description: z.string().optional(),
  location: z.string().min(2, "Location or meeting link is required"),
  meetingType: z.enum(["CALL", "VIDEO", "IN_PERSON", "SITE_VISIT", "DEMO", "FOLLOW_UP"], {
    message: "Meeting type is required",
  }),
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"], {
    message: "Status is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  assignedTo: z.string().min(2, "Assigned broker is required"),
  meetingLink: z.string().optional(),
  contactId: z.string().optional(),
  leadId: z.string().optional(),
  dealId: z.string().optional(),
  taskId: z.string().optional(),
  notes: z.string().optional(),
});

export type AppointmentFormInput = z.infer<typeof appointmentFormSchema>;
