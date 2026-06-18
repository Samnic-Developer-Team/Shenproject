import type { BookingStatusType } from '../../constants/bookingStatus';
import type { PaymentStatusType } from '../../constants/paymentStatus';

export interface BookingPayload {
  userId: string;
  sellerId: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  bookingStatus?: BookingStatusType;
  paymentStatus?: PaymentStatusType;
}
