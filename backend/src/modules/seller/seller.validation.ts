import { z } from 'zod';

export const createSellerSchema = z.object({
  body: z.object({
    salonName: z.string().min(2),
    ownerName: z.string().min(2),
    contact: z.string().min(10),
    email: z.string().email(),
    address: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    shopLicence: z.string().min(2),
    shopImage: z.string().min(2),
    bio: z.string().optional(),
    profileImage: z.string().url().optional(),
  }),
});
