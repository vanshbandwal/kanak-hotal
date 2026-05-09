import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string()
    .min(1, 'Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isActive: z.boolean(),
  order: z.number().int().min(0, 'Order must be a positive number'),
});

export type BrandFormData = z.infer<typeof brandSchema>;
