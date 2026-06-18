import { z } from 'zod';

export const orderSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    sellerId: z.string().min(1),
    orderedProducts: z.array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    ),
    totalAmount: z.number().nonnegative(),
    paymentMethod: z.string().min(1),
    shippingAddress: z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      addressLine1: z.string().min(1),
      city: z.string().min(1),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().min(1),
    }),
  }),
});
