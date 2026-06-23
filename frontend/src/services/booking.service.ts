import { apiRequest } from "@/lib/api";

export interface Booking {
  _id: string;
  id?: string;
  userId: string;
  sellerId: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  createdAt?: string;
  // Populated fields
  service?: { title?: string; label?: string; price?: number };
  seller?: { salonName?: string };
  user?: { name?: string; email?: string };
}

export interface CreateBookingPayload {
  userId: string;
  sellerId: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  bookingStatus?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const res = await apiRequest<{ data: Booking }>("/bookings", {
    method: "POST",
    bodyData: payload,
  });
  return res.data;
}

export async function getUserBookings(): Promise<Booking[]> {
  const res = await apiRequest<{ data: Booking[] }>("/bookings/user");
  return res.data || [];
}

export async function getSellerBookings(): Promise<Booking[]> {
  const res = await apiRequest<{ data: Booking[] }>("/bookings/seller");
  return res.data || [];
}

export async function updateBooking(id: string, payload: Partial<Booking>): Promise<Booking> {
  const res = await apiRequest<{ data: Booking }>(`/bookings/${id}`, {
    method: "PATCH",
    bodyData: payload,
  });
  return res.data;
}
