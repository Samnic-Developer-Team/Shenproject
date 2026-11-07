import { ApiError } from '../../utils/ApiError';
import { DeliveryTrackingModel } from './deliveryTracking.model';
import { OrderModel } from './order.model';

export const orderService = {
  async create(payload: Record<string, unknown>) {
    const order = await OrderModel.create(payload);
    await DeliveryTrackingModel.create({
      orderId: order._id,
      timeline: [{ status: 'PENDING', note: 'Order placed', updatedAt: new Date() }],
    });
    return order;
  },

  async findAll(query: Record<string, unknown>) {
    const { limit, page, sortBy, sortOrder, ...filters } = query;
    const mongooseQuery = OrderModel.find(filters).populate('userId sellerId');
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

  async findById(orderId: string) {
    const order = await OrderModel.findById(orderId).lean();
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
  },

  async update(orderId: string, payload: Record<string, unknown>) {
    const order = await OrderModel.findByIdAndUpdate(orderId, payload, { new: true });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  },
};
