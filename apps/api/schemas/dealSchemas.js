const { z } = require('zod');

const createDealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  deal_value: z.union([z.number(), z.string()]).optional(),
  deal_stage: z.string().optional().default('Prospecting'),
  lead_id: z.string().optional(),
  property_id: z.string().optional(),
  closing_date: z.string().optional()
});

const updateDealSchema = createDealSchema.partial();

module.exports = { createDealSchema, updateDealSchema };
