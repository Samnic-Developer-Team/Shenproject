import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),
  }),
});

export const addressSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    city: z.string().min(2),
    state: z.string().optional(),
    country: z.string().min(2),
    postalCode: z.string().optional(),
    street: z.string().optional(),
  }),
});

export const wishlistParamSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
  }),
});
