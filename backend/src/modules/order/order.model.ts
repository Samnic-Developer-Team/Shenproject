import { Schema, model, type Types } from 'mongoose';
import { OrderStatus } from '../../constants/orderStatus';
import { PaymentStatus } from '../../constants/paymentStatus';
import type { OrderPayload } from './order.interface';

export interface OrderDocument extends Omit<OrderPayload, 'userId' | 'sellerId'> {
  _id: string;
  userId: Types.ObjectId;
  sellerId: Types.ObjectId;
}

const orderedProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: String,
    country: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    orderedProducts: { type: [orderedProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.UNPAID },
    deliveryStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    shippingAddress: { type: shippingAddressSchema, required: true },
  },
  { timestamps: true },
);

export const OrderModel = model<OrderDocument>('Order', orderSchema);
