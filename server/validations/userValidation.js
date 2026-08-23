import { z } from 'zod';

const roleEnum = z.enum([
  'ADMIN',
  'MANAGER',
  'TRAINER',
  'Developer',
  'Teaching Assistant',
  'MEMBER',
]);

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: roleEnum.optional(),
  phone: z.string().optional(),
  facebookUrl: z.string().optional(),
  profileImage: z.string().optional(),
});

export const updateUserRoleSchema = z.object({
  role: roleEnum,
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  facebookUrl: z.string().optional(),
  profileImage: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const adminUpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: roleEnum.optional(),
  phone: z.string().optional(),
  facebookUrl: z.string().optional(),
  profileImage: z.string().optional(),
  password: z.string().min(6).optional(),
});
