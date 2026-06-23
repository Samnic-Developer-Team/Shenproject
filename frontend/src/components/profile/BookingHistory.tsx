"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export function BookingHistory() {
  const { bookings, isLoading, error, fetchUserBookings } = useBookingStore();

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  return (
    <div className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-black text-on-surface tracking-tight">Booking History</h2>
        <span className="text-xs text-on-surface-variant font-semibold bg-surface-container-low px-3 py-1 rounded-full">
          {bookings.length} bookings
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-container-low rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-rose-500 text-sm font-semibold">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">calendar_today</span>
          <p className="font-semibold text-sm">No bookings yet</p>
          <p className="text-xs mt-1">Book a service to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-on-surface truncate">
                  {booking.service?.title || booking.service?.label || "Salon Service"}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined !text-xs">calendar_today</span>
                  {booking.bookingDate} at {booking.timeSlot}
                </p>
              </div>
              <div className="ml-3 shrink-0">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[booking.bookingStatus] || "bg-slate-100 text-slate-700"}`}>
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
