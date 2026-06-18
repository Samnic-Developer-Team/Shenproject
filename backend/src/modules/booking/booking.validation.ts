import { z } from 'zod';

export const bookingSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    sellerId: z.string().min(1),
    serviceId: z.string().min(1),
    bookingDate: z.string().min(1),
    timeSlot: z.string().min(1),
  }),
});
