const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed']).optional().default('pending'),
  assigned_to: z.string().optional(),
  lead_id: z.string().optional()
});

const updateTaskSchema = createTaskSchema.partial();

module.exports = { createTaskSchema, updateTaskSchema };
