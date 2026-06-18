import { Suspense } from "react";
import { CartFlow } from "@/components/cart/CartFlow";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f9f9ff] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="text-xs text-outline font-semibold mt-3 animate-pulse">Loading shopping bag...</p>
      </div>
    }>
      <CartFlow />
    </Suspense>
  );
}