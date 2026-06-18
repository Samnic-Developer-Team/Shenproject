import type { OrderStatusType } from '../../constants/orderStatus';
import type { PaymentStatusType } from '../../constants/paymentStatus';

export interface OrderedProductItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface OrderPayload {
  userId: string;
  sellerId: string;
  orderedProducts: OrderedProductItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: PaymentStatusType;
  deliveryStatus?: OrderStatusType;
  shippingAddress: ShippingAddress;
}
