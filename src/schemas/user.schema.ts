import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['admin', 'manager', 'operator', 'viewer']),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  companyId: z.string().optional(),
});

export const createUserSchema = userSchema.omit({ id: true });

export const updateUserSchema = userSchema.partial().extend({
  id: z.string().min(1, 'User ID is required'),
});

export const changeUserRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newRole: z.enum(['admin', 'manager', 'operator', 'viewer']),
});

export const toggleUserStatusSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ChangeUserRoleFormData = z.infer<typeof changeUserRoleSchema>;
export type ToggleUserStatusFormData = z.infer<typeof toggleUserStatusSchema>;
