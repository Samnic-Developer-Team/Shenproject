import { z } from 'zod';

export const reviewSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    targetId: z.string().min(1),
    type: z.enum(['PRODUCT', 'SERVICE', 'SALON']),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
});
