const { z } = require('zod');

const createSequenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  trigger_type: z.string().min(1, 'Trigger type is required'),
  trigger_config: z.record(z.any()).optional(),
  steps: z.array(z.object({
    action: z.enum(['email', 'sms', 'note', 'update_status', 'assign']),
    subject: z.string().optional(),
    body: z.string().optional(),
    message: z.string().optional(),
    delay_days: z.number().optional(),
    delay_hours: z.number().optional(),
    status: z.string().optional(),
    user_id: z.string().optional()
  })).optional()
});

module.exports = { createSequenceSchema };
