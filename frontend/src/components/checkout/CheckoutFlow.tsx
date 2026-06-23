"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useAuthStore } from "@/store/authStore";

interface CheckoutItemData {
  id: string;
  name: string;
  detail: string;
  image: string;
  price: number;
  quantity: number;
  type: "service" | "product";
  dateStr?: string;
  shipsInfo?: string;
}

export function CheckoutFlow() {
  const router = useRouter();

  // ----------------------------------------------------
  // States
  // ----------------------------------------------------
  const [items, setItems] = useState<CheckoutItemData[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const [step, setStep] = useState<"checkout" | "success">("checkout");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form Fields
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "Kishan",
    lastName: "Kumar",
    email: "kishan@example.com",
    phone: "+91 98765 43210",
    address: "A-102, Green Meadows Apartment",
    city: "Guwahati",
    state: "Assam",
    zipCode: "781005",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [upiId, setUpiId] = useState("");

  // ----------------------------------------------------
  // Load State from LocalStorage
  // ----------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("shena_user_logged_in") === "true";
      if (!loggedIn) {
        alert("Please log in to complete your checkout.");
        router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
        return;
      }

      const savedItems = localStorage.getItem("shena_cart_items");
      if (savedItems) {
        try {
          const parsed = JSON.parse(savedItems);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // Mock default checkout items matching mockup if empty
        setItems([
          {
            id: "item-1",
            name: "Advanced Hair Spa & Gloss",
            detail: "The Glamour Studio • Mumbai, IN",
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400",
            price: 3450,
            quantity: 1,
            type: "service",
            dateStr: "24 Oct, 2023 • 11:30 AM",
          },
          {
            id: "item-2",
            name: "Radiance Silk Hair Serum",
            detail: "Shena Essentials • 50ml",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
            price: 2300,
            quantity: 1,
            type: "product",
            shipsInfo: "Ships in 2-3 business days",
          },
        ]);
      }

      // Check for applied promo from localStorage if saved, or just mock it
      // Let's check if the total matched ₹5750 - if it matches, and they had a promo, we resolve it.
      const savedPromo = localStorage.getItem("shena_applied_promo");
      const savedDiscount = localStorage.getItem("shena_discount_percent");
      if (savedPromo && savedDiscount) {
        setAppliedPromo(savedPromo);
        setDiscountPercent(Number(savedDiscount));
      }
    }
  }, [router]);

  // ----------------------------------------------------
  // Calculations
  // ----------------------------------------------------
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    // If they got here and used mockup defaults, let's mock no promo unless applied in cart
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const totalAmount = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // ----------------------------------------------------
  // Place Order Action
  // ----------------------------------------------------
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!shippingInfo.firstName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber || !cardInfo.expiry || !cardInfo.cvv) {
        alert("Please enter card payment information.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID.");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment response
    setTimeout(() => {
      setIsProcessing(false);
      setOrderId(`SHN-ORD-${Math.floor(10000 + Math.random() * 90000)}-2026`);
      setStep("success");

      // Clear Cart from LocalStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("shena_cart_items");
        localStorage.removeItem("shena_applied_promo");
        localStorage.removeItem("shena_discount_percent");
        window.dispatchEvent(new Event("cart-updated"));
      }
    }, 1500);
  };

  return (
    <div className="bg-[#f9f9ff] text-[#151c27] min-h-screen flex flex-col font-sans relative antialiased selection:bg-primary/10">
      
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <Container>
          
          {step === "checkout" ? (
            <div className="space-y-8 select-none">
              
              {/* Page Title */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                  PAYMENT PROCEED
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-on-surface">
                  Secure Checkout
                </h1>
              </div>

              {/* Checkout Columns grid */}
              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Shipping & Payment details */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Section 1: Contact Details */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/10 shadow-[0px_8px_24px_rgba(21,28,39,0.01)] space-y-4">
                    <h2 className="text-base sm:text-lg font-extrabold text-on-surface flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">1</span>
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">First Name</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Last Name</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email Address</label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Shipping / Delivery Details */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/10 shadow-[0px_8px_24px_rgba(21,28,39,0.01)] space-y-4">
                    <h2 className="text-base sm:text-lg font-extrabold text-on-surface flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">2</span>
                      Shipping / Delivery Address
                    </h2>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Street Address</label>
                      <input
                        type="text"
                        required
                        placeholder="Suite, apartment, street name..."
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">City</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">State</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">ZIP / Postal Code</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Payment details */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/10 shadow-[0px_8px_24px_rgba(21,28,39,0.01)] space-y-4">
                    <h2 className="text-base sm:text-lg font-extrabold text-on-surface flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">3</span>
                      Payment Method
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Card Selection */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 border rounded-2xl text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/2 shadow-inner font-bold"
                            : "border-outline-variant/10 hover:border-primary/50 bg-transparent"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-2xl">credit_card</span>
                        <span className="text-xs text-on-surface">Credit / Debit Card</span>
                      </button>

                      {/* UPI Selection */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-4 border rounded-2xl text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                          paymentMethod === "upi"
                            ? "border-primary bg-primary/2 shadow-inner font-bold"
                            : "border-outline-variant/10 hover:border-primary/50 bg-transparent"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                        <span className="text-xs text-on-surface">UPI ID (GPay, Paytm)</span>
                      </button>

                      {/* COD Selection */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-4 border rounded-2xl text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                          paymentMethod === "cod"
                            ? "border-primary bg-primary/2 shadow-inner font-bold"
                            : "border-outline-variant/10 hover:border-primary/50 bg-transparent"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                        <span className="text-xs text-on-surface">Cash on Delivery</span>
                      </button>
                    </div>

                    {/* Card fields */}
                    {paymentMethod === "card" && (
                      <div className="border border-outline-variant/10 rounded-3xl p-5 bg-surface-container-low/40 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Card Number</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardInfo.cardNumber}
                            onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                            className="w-full bg-white border border-outline-variant/20 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                            placeholder="4000 1234 5678 9010"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Expiry</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={cardInfo.expiry}
                              onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                              className="w-full bg-white border border-outline-variant/20 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-wider text-outline block">CVV</label>
                            <input
                              type="password"
                              required
                              maxLength={3}
                              value={cardInfo.cvv}
                              onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                              className="w-full bg-white border border-outline-variant/20 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                              placeholder="•••"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI fields */}
                    {paymentMethod === "upi" && (
                      <div className="border border-outline-variant/10 rounded-3xl p-5 bg-surface-container-low/40 space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-[9px] font-black uppercase tracking-wider text-outline block">UPI ID</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white border border-outline-variant/20 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                          placeholder="username@okaxis"
                        />
                      </div>
                    )}

                  </div>

                </div>

                {/* RIGHT COLUMN: STICKY ORDER PREVIEW */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                  
                  <div className="bg-[#eff3ff] border border-outline-variant/5 rounded-[32px] p-6 sm:p-8 shadow-[0px_16px_40px_rgba(37,0,90,0.03)] space-y-5">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-outline">
                      Checkout Items ({items.reduce((s, i) => s + i.quantity, 0)})
                    </h3>

                    {/* Preview list */}
                    <div className="space-y-3">
                      {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-3 items-center bg-white rounded-2xl p-3 border border-outline-variant/5">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-grow select-none">
                            <h4 className="font-bold text-xs text-on-surface line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] text-outline font-semibold mt-0.5">Qty {item.quantity} • ₹{item.price.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-[1px] bg-outline-variant/10 my-2" />

                    {/* Price breakdown */}
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center text-on-surface-variant font-semibold">
                        <span>Subtotal</span>
                        <span className="text-on-surface font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      
                      {appliedPromo && (
                        <div className="flex justify-between items-center text-emerald-600 font-bold">
                          <span>Promo Discount ({appliedPromo})</span>
                          <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-on-surface-variant font-semibold">
                        <span>Delivery</span>
                        <span className="text-emerald-600 font-bold uppercase">FREE</span>
                      </div>

                      <div className="h-[1px] bg-outline-variant/10 my-1" />

                      <div className="flex justify-between items-end">
                        <span className="font-extrabold text-on-surface">Total Amount</span>
                        <span className="text-lg font-black text-on-surface">₹{totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Pay CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-primary to-[#5a00c6] text-white shadow-primary/20 hover:opacity-[0.97]"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                            Completing Order...
                          </span>
                        ) : (
                          "PAY & PLACE ORDER"
                        )}
                      </button>
                    </div>

                  </div>

                </div>

              </form>

            </div>
          ) : (
            
            /* SUCCESS CONFIRMATION PAGE */
            <div className="max-w-2xl mx-auto py-8 animate-in zoom-in-95 duration-400">
              
              <div className="bg-white border border-outline-variant/10 rounded-[36px] p-6 sm:p-10 shadow-[0px_24px_56px_rgba(21,28,39,0.03)] text-center space-y-6 relative overflow-hidden">
                
                {/* glow banner */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* animated checkmark */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-500/5 animate-bounce">
                    <span className="material-symbols-outlined text-3xl font-extrabold select-none">check</span>
                  </div>
                </div>

                {/* Header */}
                <div className="space-y-2 select-none">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-on-surface">
                    Order Confirmed!
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant font-medium max-w-md mx-auto">
                    Your beauty products are on their way, and your sessions are successfully registered. We have sent a confirmation details invoice email to you.
                  </p>
                </div>

                {/* Order Ref */}
                <div className="bg-surface-container-low px-4.5 py-2.5 rounded-2xl inline-flex flex-col items-center gap-1 border border-outline-variant/5 shadow-inner select-none">
                  <span className="text-[9px] font-black uppercase tracking-wider text-outline">
                    Order Reference
                  </span>
                  <span className="font-mono font-bold text-sm text-primary tracking-wider">
                    {orderId}
                  </span>
                </div>

                {/* Details Overview Card */}
                <div className="bg-surface-container-low/40 rounded-3xl p-5 sm:p-6 border border-outline-variant/10 text-left space-y-4">
                  
                  <h4 className="font-extrabold text-sm text-on-surface border-b border-outline-variant/10 pb-2.5 uppercase tracking-wider text-[10px] text-outline">
                    Order details overview
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    
                    {/* Items ordered */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Items Ordered</span>
                      <span className="font-extrabold text-on-surface">
                        {items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                      </span>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Delivery Address</span>
                      <span className="font-extrabold text-on-surface">
                        {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.zipCode}
                      </span>
                    </div>

                    {/* Est Delivery Date */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Estimated Delivery</span>
                      <span className="font-extrabold text-on-surface text-primary">
                        Monday, 8th Jun, 2026
                      </span>
                    </div>

                    {/* Contact recipient */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Recipient Contact</span>
                      <span className="font-extrabold text-on-surface">
                        {shippingInfo.firstName} {shippingInfo.lastName} • {shippingInfo.phone}
                      </span>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Payment Method</span>
                      <span className="font-extrabold text-on-surface">
                        {paymentMethod === "card" ? "Credit Card" : paymentMethod === "upi" ? "UPI ID" : "Cash on Delivery"}
                      </span>
                    </div>

                    {/* Total Paid */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Total Paid Amount</span>
                      <span className="font-extrabold text-emerald-600">
                        ₹{totalAmount.toLocaleString("en-IN")} <span className="text-[10px] uppercase font-bold text-outline-variant bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5 ml-1">PAID</span>
                      </span>
                    </div>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/explore"
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm border border-outline-variant/30 text-on-surface hover:bg-surface-container-low active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">shopping_bag</span>
                    Continue Shopping
                  </Link>
                  <Link
                    href="/track-order"
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-primary text-white hover:opacity-[0.97] active:scale-98 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    Track My Order
                  </Link>
                </div>

              </div>

            </div>
          )}

        </Container>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default CheckoutFlow;
