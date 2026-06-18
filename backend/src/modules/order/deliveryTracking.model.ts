import { Schema, model, type Types } from 'mongoose';
import { OrderStatus } from '../../constants/orderStatus';

export interface DeliveryTimelineEntry {
  status: keyof typeof OrderStatus;
  note?: string;
  updatedAt: Date;
}

export interface DeliveryTrackingDocument {
  _id: string;
  orderId: Types.ObjectId;
  timeline: DeliveryTimelineEntry[];
}

const deliveryTrackingSchema = new Schema<DeliveryTrackingDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    timeline: [
      {
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        note: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const DeliveryTrackingModel = model<DeliveryTrackingDocument>('DeliveryTracking', deliveryTrackingSchema);
