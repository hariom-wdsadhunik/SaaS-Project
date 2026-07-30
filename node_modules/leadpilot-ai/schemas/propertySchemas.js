const { z } = require('zod');

const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  property_type: z.string().optional().default('Residential'),
  price: z.union([z.number(), z.string()]).optional(),
  location: z.string().optional(),
  status: z.string().optional().default('Available'),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area_sqft: z.number().optional()
});

const updatePropertySchema = createPropertySchema.partial();

module.exports = { createPropertySchema, updatePropertySchema };
