import { z } from 'zod';

const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']);
const priorityEnum = z.enum(['NORMAL', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  reportedTo: z.string().min(1, 'Reported user is required'),
  startDate: z.string().optional().or(z.date().optional()),
  dueDate: z.string().optional().or(z.date().optional()),
  notes: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const addCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  parentId: z.string().nullable().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});
