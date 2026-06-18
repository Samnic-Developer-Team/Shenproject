import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    sellerId: z.string().min(1),
    name: z.string().min(2),
    description: z.string().min(2),
    category: z.string().min(2),
    brand: z.string().optional(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    images: z.array(
      z.object({
        url: z.string().min(1),
        publicId: z.string().optional(),
      }),
    ).optional(),
    image: z.string().optional(),
    size: z.string().optional(),
    ingredients: z.string().optional(),
    howToUse: z.string().optional(),
    subCategory: z.string().optional(),
    productType: z.string().optional(),
    mrp: z.number().optional(),
    discount: z.number().optional(),
    status: z.enum(['Active', 'Draft', 'Out of Stock']).optional(),
    gallery: z.array(z.string()).optional(),
    fullDescription: z.string().optional(),
    skinType: z.string().optional(),
    hairType: z.string().optional(),
    tags: z.array(z.string()).optional(),
    weight: z.string().optional(),
    shippingCharge: z.number().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});
