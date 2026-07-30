import { z } from "zod";

export const contactFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").or(z.literal("")).optional(),
    phone: z.string().optional(),
    status: z.enum(["ACTIVE", "PROSPECT", "CLIENT", "VIP", "ARCHIVED", "INACTIVE"], {
      message: "Contact status is required",
    }),
    assignedAgentName: z.string().min(2, "Assigned broker is required"),
    companyName: z.string().optional(),
    designation: z.string().optional(),
    tags: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => !!data.email || !!data.phone, {
    message: "At least one contact method (Email or Phone) is required",
    path: ["email"],
  });

export type ContactFormInput = z.infer<typeof contactFormSchema>;
