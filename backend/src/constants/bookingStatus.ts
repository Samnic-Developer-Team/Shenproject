export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const;

export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];
