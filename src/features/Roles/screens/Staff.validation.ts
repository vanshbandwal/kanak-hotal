import { z } from 'zod';

export const staffSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.string().min(1, 'Please select a role'),
});

export type StaffFormData = z.infer<typeof staffSchema>;
