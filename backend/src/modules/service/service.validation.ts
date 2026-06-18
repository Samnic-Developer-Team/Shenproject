import { z } from 'zod';

export const serviceSchema = z.object({
  body: z.object({
    sellerId: z.string().min(1),
    title: z.string().min(2),
    description: z.string().min(2),
    category: z.string().min(2),
    duration: z.number().int().positive(),
    price: z.number().nonnegative(),
    images: z.array(
      z.object({
        url: z.string().min(1),
        publicId: z.string().optional(),
      }),
    ).optional(),
    benefits: z.string().optional(),
    image: z.string().optional(),
    subCategory: z.string().optional(),
    fullDescription: z.string().optional(),
    availableDays: z.array(z.string()).optional(),
    gender: z.enum(['Men', 'Women', 'Unisex']).optional(),
    status: z.enum(['Active', 'Draft']).optional(),
    homeServiceAvailable: z.boolean().optional(),
    featuredService: z.boolean().optional(),
  }),
});
