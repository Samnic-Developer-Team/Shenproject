"use client";

import type { Service } from "@/types/service.types";

interface BookingSummaryProps {
  selectedServices?: Service[];
  totalPrice?: number;
  onConfirmBooking?: () => void;
}

export function BookingSummary({
  selectedServices = [],
  totalPrice = 0,
  onConfirmBooking = () => {},
}: BookingSummaryProps) {
  const serviceCount = selectedServices.length;

  return (
    <div className="pt-4 border-t border-outline-variant/25 select-none">
      {/* Selected services count */}
      <div className="flex justify-between items-center mb-2 font-semibold text-xs sm:text-sm text-on-surface-variant">
        <span>Selected Services ({serviceCount})</span>
        <span>₹{totalPrice.toLocaleString("en-IN")}</span>
      </div>

      {/* Final Total price */}
      <div className="flex justify-between items-center mb-6 font-extrabold text-base sm:text-lg text-on-surface">
        <span>Total Amount</span>
        <span className="text-primary font-black">
          ₹{totalPrice.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Confirm CTA */}
      <button
        onClick={onConfirmBooking}
        disabled={serviceCount === 0}
        className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer ${
          serviceCount > 0
            ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-primary/20 hover:opacity-90"
            : "bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-60 shadow-none"
        }`}
      >
        Confirm Booking
      </button>

      {/* Policy */}
      <p className="text-center text-[10px] text-outline mt-4 font-semibold">
        Free cancellation up to 24 hours before appointment
      </p>
    </div>
  );
}

export default BookingSummary;
