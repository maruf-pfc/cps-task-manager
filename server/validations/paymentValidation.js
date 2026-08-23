import { z } from 'zod';

const statusEnum = z.enum(['Pending', 'Paid']);
const priorityEnum = z.enum(['NORMAL', 'MEDIUM', 'HIGH']);
const courseEnum = z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']);

export const createPaymentSchema = z.object({
  trainer: z.string().min(1, 'Trainer is required'),
  name: z.string().min(1, 'Name is required'),
  classTitle: z.string().min(1, 'Class title is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedTo: z.string().optional(),
  reportedTo: z.string().optional(),
  startDate: z.string().optional().or(z.date().optional()),
  dueDate: z.string().optional().or(z.date().optional()),
  notes: z.string().optional(),
  details: z
    .object({
      courseName: courseEnum.optional(),
      batchNo: z.string().optional(),
      classNo: z.string().optional(),
    })
    .optional(),
});

export const updatePaymentSchema = createPaymentSchema.partial();
