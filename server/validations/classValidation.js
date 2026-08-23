import { z } from 'zod';

const courseEnum = z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']);
const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']);
const priorityEnum = z.enum(['NORMAL', 'MEDIUM', 'HIGH']);

export const createClassSchema = z.object({
  courseName: courseEnum,
  batchNo: z.number({ invalid_type_error: 'Batch number must be a number' }),
  classNo: z.number({ invalid_type_error: 'Class number must be a number' }),
  classTitle: z.string().min(1, 'Class title is required'),
  description: z.string().optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  reportedTo: z.string().min(1, 'Reported user is required'),
  startDate: z.string().optional().or(z.date().optional()),
  dueDate: z.string().optional().or(z.date().optional()),
  notes: z.string().optional(),
});

export const updateClassSchema = createClassSchema.partial();
