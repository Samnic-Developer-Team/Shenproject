export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
