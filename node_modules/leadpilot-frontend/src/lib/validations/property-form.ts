import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z
    .string()
    .min(3, "Property title must be at least 3 characters")
    .max(120, "Property title cannot exceed 120 characters"),
  propertyType: z.enum(
    ["PENTHOUSE", "VILLA", "APARTMENT", "COMMERCIAL", "DUPLEX", "TOWNHOUSE"],
    { message: "Property type is required" }
  ),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "OFF_MARKET"], {
    message: "Property status is required",
  }),
  price: z
    .number({ message: "Price must be a valid number" })
    .positive("Price must be greater than 0"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  zipCode: z.string().min(3, "Zip code is required"),
  bedrooms: z
    .number({ message: "Bedrooms must be a number" })
    .min(0, "Bedrooms cannot be negative"),
  bathrooms: z
    .number({ message: "Bathrooms must be a number" })
    .min(0, "Bathrooms cannot be negative"),
  areaSqFt: z
    .number({ message: "Area must be a number" })
    .positive("Area must be greater than 0 sqft"),
  assignedAgentName: z.string().min(2, "Assigned agent is required"),
  coverImageUrl: z
    .string()
    .url("Must be a valid image URL")
    .or(z.literal(""))
    .optional(),
  description: z.string().optional(),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;
