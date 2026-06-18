import { Suspense } from "react";
import { SellerLogin } from "@/components/seller/SellerLogin";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f8fd] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="text-xs text-outline font-semibold mt-3 animate-pulse">Loading login...</p>
      </div>
    }>
      <SellerLogin />
    </Suspense>
  );
}
