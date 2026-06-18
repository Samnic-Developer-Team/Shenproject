import { ApiError } from '../../utils/ApiError';
import { BookingModel } from './booking.model';

export const bookingService = {
  async create(payload: Record<string, unknown>) {
    return BookingModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    return BookingModel.find(query).sort({ createdAt: -1 }).lean();
  },

  async update(bookingId: string, payload: Record<string, unknown>) {
    const booking = await BookingModel.findByIdAndUpdate(bookingId, payload, { new: true });
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    return booking;
  },
};
