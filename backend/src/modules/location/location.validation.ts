import { z } from 'zod';

export const createLocationSchema = z.object({
  body: z.object({
    city: z.string().min(2, 'City name must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    isActive: z.boolean().optional(),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    isActive: z.boolean().optional(),
  }),
});
