import { z } from "zod";

export const appointmentFormSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().optional(),
    customerName: z.string().min(1, "Customer name is required."),
    propertyName: z.string().min(1, "Property name is required."),
    assignedAgentName: z.string().min(1, "Assigned agent is required."),
    start: z.string().min(1, "Start time is required."),
    end: z.string().min(1, "End time is required."),
    priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
    status: z.enum([
      "SCHEDULED",
      "CONFIRMED",
      "CHECKED_IN",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
      "RESCHEDULED",
    ]),
    appointmentType: z.enum([
      "PROPERTY_VIEWING",
      "CLIENT_CONSULTATION",
      "LISTING_PRESENTATION",
      "CONTRACT_SIGNING",
      "INSPECTION",
    ]),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.start || !data.end) return true;
      return new Date(data.start) < new Date(data.end);
    },
    {
      message: "End time must be strictly after start time.",
      path: ["end"],
    }
  );

export type AppointmentFormInput = z.infer<typeof appointmentFormSchema>;
