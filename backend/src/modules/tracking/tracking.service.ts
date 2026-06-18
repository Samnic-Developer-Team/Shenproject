import { ApiError } from '../../utils/ApiError';
import { DeliveryTrackingModel } from '../order/deliveryTracking.model';
import { OrderModel } from '../order/order.model';

export const trackingService = {
  async updateTimeline(orderId: string, entry: { status: string; note?: string }) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new ApiError(404, 'Order not found');

    const timelineEntry = { status: entry.status, note: entry.note, updatedAt: new Date() };

    const tracking = await DeliveryTrackingModel.findOneAndUpdate(
      { orderId },
      { $push: { timeline: timelineEntry } },
      { upsert: true, new: true },
    ).lean();

    // update order delivery status as well
    (order as any).deliveryStatus = entry.status as any;
    await order.save();

    return tracking;
  },

  async findByOrder(orderId: string) {
    const tracking = await DeliveryTrackingModel.findOne({ orderId }).lean();
    if (!tracking) throw new ApiError(404, 'Tracking not found');
    return tracking;
  },
};
