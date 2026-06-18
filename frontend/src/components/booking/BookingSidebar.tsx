"use client";

import type { Service } from "@/types/service.types";
import { BookingDateSelector } from "./BookingDateSelector";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { BookingSummary } from "./BookingSummary";

interface BookingSidebarProps {
  selectedServices: Service[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  onConfirmBooking: () => void;
}

export function BookingSidebar({
  selectedServices,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  onConfirmBooking,
}: BookingSidebarProps) {
  // Calculate total price
  const totalPrice = selectedServices.reduce(
    (acc, service) => acc + (service.price || 0),
    0
  );

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-md border border-outline-variant/10 space-y-6 select-none">
      <h3 className="text-lg sm:text-xl font-extrabold text-on-surface">
        Book Appointment
      </h3>

      {/* Date selector */}
      <BookingDateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* Time slots selector */}
      <TimeSlotSelector
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
      />

      {/* Calculations & Checkout action */}
      <BookingSummary
        selectedServices={selectedServices}
        totalPrice={totalPrice}
        onConfirmBooking={onConfirmBooking}
      />
    </div>
  );
}

export default BookingSidebar;
