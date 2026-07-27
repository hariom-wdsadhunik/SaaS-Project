const { z } = require('zod');

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost']).optional().default('new'),
  source: z.string().optional().default('website'),
  budget: z.union([z.string(), z.number()]).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  assigned_to: z.string().optional()
});

const updateLeadSchema = createLeadSchema.partial();

module.exports = { createLeadSchema, updateLeadSchema };
