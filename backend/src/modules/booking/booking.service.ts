import { ApiError } from '../../utils/ApiError';
import { BookingModel } from './booking.model';

export const bookingService = {
  async create(payload: Record<string, unknown>) {
    return BookingModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    const { limit, page, sortBy, sortOrder, ...filters } = query;
    const mongooseQuery = BookingModel.find(filters).populate('userId sellerId serviceId');
    if (limit) {
      mongooseQuery.limit(Number(limit));
    }
    if (page && limit) {
      mongooseQuery.skip((Number(page) - 1) * Number(limit));
    }
    const sortField = (sortBy as string) || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    return mongooseQuery.sort({ [sortField]: order }).lean();
  },

  async update(bookingId: string, payload: Record<string, unknown>) {
    const booking = await BookingModel.findByIdAndUpdate(bookingId, payload, { new: true });
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    return booking;
  },
};
