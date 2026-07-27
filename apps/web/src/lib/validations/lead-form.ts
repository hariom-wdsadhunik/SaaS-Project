import { z } from "zod";

export const leadFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email format")
      .or(z.literal("")),

    phone: z
      .string()
      .trim()
      .regex(/^(\+?[0-9\s\-()]{7,20})?$/, "Invalid phone number format")
      .or(z.literal("")),

    source: z.string().min(1, "Lead source is required"),
    status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "NURTURING", "LOST"]),

    budgetMin: z
      .number()
      .nonnegative("Budget must be greater than or equal to zero")
      .optional(),
    budgetMax: z
      .number()
      .nonnegative("Budget must be greater than or equal to zero")
      .optional(),

    preferredPropertyType: z.string().optional(),
    preferredLocation: z.string().optional(),
    assignedBrokerName: z.string().optional(),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
  })
  .refine(
    (data) => {
      // Business Rule: Either Email OR Phone MUST be provided
      const hasEmail = Boolean(data.email && data.email.length > 0);
      const hasPhone = Boolean(data.phone && data.phone.length > 0);
      return hasEmail || hasPhone;
    },
    {
      message: "At least one contact method (Phone or Email) is required",
      path: ["email"], // Attaches error to email field
    }
  )
  .refine(
    (data) => {
      if (data.budgetMin && data.budgetMax) {
        return data.budgetMax >= data.budgetMin;
      }
      return true;
    },
    {
      message: "Maximum budget cannot be less than minimum budget",
      path: ["budgetMax"],
    }
  );

export type LeadFormInput = z.infer<typeof leadFormSchema>;
