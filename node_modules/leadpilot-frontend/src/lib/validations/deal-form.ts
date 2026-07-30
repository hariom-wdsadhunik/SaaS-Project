import { z } from "zod";

export const dealFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Deal title must be at least 2 characters")
    .max(100, "Deal title cannot exceed 100 characters"),

  relatedLeadId: z.string().min(1, "Related lead selection is required"),

  stage: z.enum(["NEW", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"]),

  value: z
    .number()
    .positive("Deal monetary value must be greater than zero"),

  probability: z
    .number()
    .min(0, "Probability cannot be less than 0%")
    .max(100, "Probability cannot exceed 100%"),

  priority: z.enum(["URGENT", "HIGH", "NORMAL", "LOW"]),

  expectedCloseDate: z.string().min(1, "Expected close date is required"),

  assignedAgentName: z.string().min(1, "Assigned agent is required"),

  companyName: z.string().optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export type DealFormInput = z.infer<typeof dealFormSchema>;
