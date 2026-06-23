"use client";

import { useEffect, useState } from "react";
import { getUserOrders, type Order } from "@/services/order.service";

const deliveryStatusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserOrders()
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-black text-on-surface tracking-tight">Order History</h2>
        <span className="text-xs text-on-surface-variant font-semibold bg-surface-container-low px-3 py-1 rounded-full">
          {orders.length} orders
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-container-low rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-rose-500 text-sm font-semibold">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">shopping_bag</span>
          <p className="font-semibold text-sm">No orders yet</p>
          <p className="text-xs mt-1">Your product orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface">
                    {order.orderedProducts.map((p) => p.name).join(", ")}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {order.orderedProducts.reduce((sum, p) => sum + p.quantity, 0)} item(s) • ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                  {order.createdAt && (
                    <p className="text-xs text-outline mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${deliveryStatusColors[order.deliveryStatus] || "bg-slate-100 text-slate-700"}`}>
                  {order.deliveryStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
