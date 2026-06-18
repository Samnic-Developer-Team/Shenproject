import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f9f9ff] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="text-xs text-outline font-semibold mt-3 animate-pulse">Loading booking wizard...</p>
      </div>
    }>
      <BookingFlow />
    </Suspense>
  );
}