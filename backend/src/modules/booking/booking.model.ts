import { Schema, model, type Types } from 'mongoose';
import { BookingStatus } from '../../constants/bookingStatus';
import { PaymentStatus } from '../../constants/paymentStatus';
import type { BookingPayload } from './booking.interface';

export interface BookingDocument extends Omit<BookingPayload, 'userId' | 'sellerId' | 'serviceId'> {
  _id: string;
  userId: Types.ObjectId;
  sellerId: Types.ObjectId;
  serviceId: Types.ObjectId;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    bookingStatus: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.UNPAID },
  },
  { timestamps: true },
);

export const BookingModel = model<BookingDocument>('Booking', bookingSchema);
