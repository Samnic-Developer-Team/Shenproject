"use client";

import { create } from "zustand";
import type { Booking } from "@/services/booking.service";
import { getUserBookings, getSellerBookings } from "@/services/booking.service";

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchUserBookings: () => Promise<void>;
  fetchSellerBookings: () => Promise<void>;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, update: Partial<Booking>) => void;
  clearBookings: () => void;
}

export const useBookingStore = create<BookingState>()((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchUserBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getUserBookings();
      set({ bookings, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch bookings", isLoading: false });
    }
  },

  fetchSellerBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getSellerBookings();
      set({ bookings, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch bookings", isLoading: false });
    }
  },

  addBooking: (booking) => {
    set((state) => ({ bookings: [booking, ...state.bookings] }));
  },

  updateBooking: (id, update) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        (b._id === id || b.id === id) ? { ...b, ...update } : b
      ),
    }));
  },

  clearBookings: () => set({ bookings: [] }),
}));
