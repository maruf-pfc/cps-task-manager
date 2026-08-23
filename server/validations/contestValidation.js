import { z } from 'zod';

const courseEnum = z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']);
const ojEnum = z.enum(['Leetcode', 'Vjudge']);
const platformEnum = z.enum(['Google Classroom', 'Website']);
const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']);
const priorityEnum = z.enum(['NORMAL', 'MEDIUM', 'HIGH']);

export const createContestSchema = z.object({
  courseName: courseEnum,
  batchNo: z.number({ invalid_type_error: 'Batch number must be a number' }),
  contestName: z.string().min(1, 'Contest name is required'),
  onlineJudge: ojEnum,
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  reportedTo: z.string().min(1, 'Reported user is required'),
  startDate: z.string().optional().or(z.date().optional()),
  dueDate: z.string().optional().or(z.date().optional()),
  notes: z.string().optional(),
});

export const updateContestSchema = createContestSchema.partial();

export const createContestVideoSolutionSchema = z.object({
  courseName: courseEnum,
  batchNo: z.string().min(1, 'Batch number is required'),
  contestName: z.string().min(1, 'Contest name is required'),
  onlineJudge: ojEnum,
  platform: platformEnum,
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  reportedTo: z.string().min(1, 'Reported user is required'),
  startDate: z.string().optional().or(z.date().optional()),
  dueDate: z.string().optional().or(z.date().optional()),
  notes: z.string().optional(),
});

export const updateContestVideoSolutionSchema = createContestVideoSolutionSchema.partial();
