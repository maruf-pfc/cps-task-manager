import { z } from 'zod';

const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']);
const priorityEnum = z.enum(['NORMAL', 'MEDIUM', 'HIGH']);

export const createMarketingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedTo: z.string().optional(),
  reportedTo: z.string().optional(),
  startDate: z.string().optional().or(z.date().optional()),
  dueDate: z.string().optional().or(z.date().optional()),
  notes: z.string().optional(),
});

export const updateMarketingSchema = createMarketingSchema.partial();
