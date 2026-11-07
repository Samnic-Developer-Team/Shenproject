"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useAuthStore } from "@/store/authStore";

interface CartItemData {
  id: string;
  name: string;
  detail: string;
  image: string;
  price: number;
  quantity: number;
  type: "service" | "product";
  dateStr?: string; // only for service
  shipsInfo?: string; // only for product
}

export function CartFlow() {
  const router = useRouter();

  // ----------------------------------------------------
  // Default Cart Items List (matching mockup)
  // ----------------------------------------------------
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      id: "item-1",
      name: "Advanced Hair Spa & Gloss",
      detail: "The Glamour Studio • Itanagar, AP",
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

  // ----------------------------------------------------
  // Promo Code States
  // ----------------------------------------------------
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");

  // ----------------------------------------------------
  // Recalculations
  // ----------------------------------------------------
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const totalAmount = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // Total Quantity for Navbar / badges
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Synchronize cart count with navbar indicators dynamically if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shena_cart_items", JSON.stringify(cartItems));
      // Dispatch custom event to notify Navbar of cart updates
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cartItems]);

  // Load from localstorage if available on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shena_cart_items");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed);
          }
        } catch (e) {
          console.error("Failed to parse cart items from localStorage", e);
        }
      }
    }
  }, []);

  // ----------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME10" || code === "GLOW10") {
      setAppliedPromo(code);
      setDiscountPercent(10);
      setPromoInput("");
    } else if (code === "GLOW15" || code === "WELCOME15") {
      setAppliedPromo(code);
      setDiscountPercent(15);
      setPromoInput("");
    } else {
      setPromoError("Invalid promo code. Try WELCOME10 or GLOW15.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountPercent(0);
  };

  // Add recommendations to bag
  const handleAddRecommend = (prod: { name: string; price: number; image: string; detail: string }) => {
    const existing = cartItems.find((item) => item.name === prod.name);
    if (existing) {
      handleUpdateQuantity(existing.id, 1);
    } else {
      const newItem: CartItemData = {
        id: `recommend-${Date.now()}`,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        detail: prod.detail,
        quantity: 1,
        type: "product",
        shipsInfo: "Ships in 2-3 business days",
      };
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  const handleCheckoutRedirect = () => {
    if (cartItems.length === 0) return;
    const loggedIn = localStorage.getItem("shena_user_logged_in") === "true";
    if (!loggedIn) {
      alert("Please log in to complete your checkout.");
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="bg-[#f9f9ff] text-[#151c27] min-h-screen flex flex-col font-sans relative antialiased selection:bg-primary/10">
      
      {/* Navbar wrapper */}
      <Navbar />

      {/* Main Workspace */}
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <Container>
          
          {cartItems.length > 0 ? (
            <div className="space-y-8 select-none">
              
              {/* Shopping Bag Title Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                  REVIEW YOUR ORDER
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-on-surface">
                  Shopping Bag
                </h1>
              </div>

              {/* Grid Content Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Cart Items list */}
                <div className="lg:col-span-8 space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-3xl p-5 border border-outline-variant/10 shadow-[0px_8px_24px_rgba(21,28,39,0.01)] flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all hover:shadow-[0px_12px_32px_rgba(21,28,39,0.02)]"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-outline-variant/10 flex-shrink-0 bg-surface-container-low">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1 flex-grow">
                          <h3 className="font-extrabold text-sm sm:text-base text-on-surface">
                            {item.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant/80 font-medium">
                            {item.detail}
                          </p>

                          {/* Extra info based on type */}
                          {item.type === "service" && item.dateStr && (
                            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold bg-surface-container-low border border-outline-variant/10 px-3 py-1 rounded-xl mt-2 w-fit">
                              <span className="material-symbols-outlined text-sm font-bold text-primary select-none">calendar_today</span>
                              <span>{item.dateStr}</span>
                            </div>
                          )}

                          {item.type === "product" && item.shipsInfo && (
                            <p className="text-[10px] text-[#b4136d] font-bold uppercase tracking-wider mt-2.5">
                              {item.shipsInfo}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Quantity editor, Price & Remove CTA */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto sm:self-center border-t border-outline-variant/5 pt-4 sm:pt-0 sm:border-none">
                        
                        {/* Quantity adjust buttons */}
                        <div className="flex items-center bg-surface-container-low rounded-full px-2.5 py-1.5 border border-outline-variant/10 gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm text-on-surface hover:bg-white transition-colors cursor-pointer"
                          >
                            –
                          </button>
                          <span className="font-extrabold text-xs sm:text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm text-on-surface hover:bg-white transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price display */}
                        <div className="text-right sm:min-w-20 select-none">
                          <span className="font-extrabold text-base sm:text-lg text-on-surface block">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Remove trash icon */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-outline hover:text-secondary p-2 rounded-full hover:bg-secondary/5 transition-all cursor-pointer flex items-center justify-center"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-lg select-none">delete</span>
                          <span className="hidden sm:inline text-xs font-bold ml-1">Remove</span>
                        </button>

                      </div>

                    </div>
                  ))}
                </div>

                {/* RIGHT COLUMN: ORDER SUMMARY */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Summary card wrapper */}
                  <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-[0px_16px_40px_rgba(21,28,39,0.015)] space-y-6 relative overflow-hidden">
                    
                    <h3 className="text-lg sm:text-xl font-extrabold text-on-surface tracking-tight">
                      Order Summary
                    </h3>

                    {/* Breakdown items */}
                    <div className="space-y-3.5 text-xs sm:text-sm select-none">
                      
                      {/* Subtotal */}
                      <div className="flex justify-between items-center text-on-surface-variant font-semibold">
                        <span>Subtotal</span>
                        <span className="text-on-surface font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>

                      {/* Applied Promo Code */}
                      {appliedPromo && (
                        <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-1.5 animate-in slide-in-from-top-2 duration-300">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm font-bold">sell</span>
                            <span>Promo ({appliedPromo})</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                            <button 
                              onClick={handleRemovePromo}
                              className="text-emerald-800 hover:text-emerald-950 font-black cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </span>
                        </div>
                      )}

                      {/* Shipping */}
                      <div className="flex justify-between items-center text-on-surface-variant font-semibold">
                        <span>Delivery Fee</span>
                        <span className="text-emerald-600 font-extrabold uppercase tracking-wider text-xs">FREE</span>
                      </div>

                      {/* Tax */}
                      <div className="flex justify-between items-center text-on-surface-variant font-semibold">
                        <span>Estimated Tax</span>
                        <span className="text-on-surface font-bold">₹0.00</span>
                      </div>

                      <div className="h-[1px] bg-outline-variant/15 my-2" />

                      {/* Final Total */}
                      <div className="flex justify-between items-end">
                        <span className="font-extrabold text-sm sm:text-base text-on-surface">
                          Total
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-on-surface leading-none">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>

                    </div>

                    {/* Promo Code Input field */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo Code"
                          className="flex-grow bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="bg-primary hover:opacity-90 text-white rounded-2xl px-5 py-2.5 text-xs font-extrabold transition-all cursor-pointer active:scale-95"
                        >
                          APPLY
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-secondary font-bold ml-1 animate-pulse">
                          {promoError}
                        </p>
                      )}
                    </div>

                    {/* Proceed Button */}
                    <div className="space-y-4 pt-2">
                      <button
                        onClick={handleCheckoutRedirect}
                        className="w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-primary to-[#5a00c6] text-white shadow-primary/20 hover:opacity-[0.97]"
                      >
                        PROCEED TO PAY
                      </button>

                      {/* Secure Checkout Badge */}
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-outline font-bold select-none uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm font-bold text-primary">verified_user</span>
                        <span>Secure encrypted checkout</span>
                      </div>
                    </div>

                    {/* Payment Provider Badges */}
                    <div className="flex items-center justify-center gap-3 pt-2 select-none">
                      {["VISA", "Stripe", "RAZORPAY"].map((badge) => (
                        <span 
                          key={badge} 
                          className="text-[9px] font-black uppercase text-outline bg-surface-container-low border border-outline-variant/10 px-2.5 py-1.5 rounded-lg tracking-wider"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                  </div>

                </div>

              </div>

              {/* recommendations section */}
              <div className="space-y-6 pt-10">
                
                {/* recommendations Header */}
                <div className="flex justify-between items-center select-none">
                  <h2 className="text-lg sm:text-2xl font-black text-on-surface tracking-tight">
                    Pairs well with...
                  </h2>
                  <Link 
                    href="/products" 
                    className="text-xs sm:text-sm font-bold text-primary hover:opacity-90 transition-opacity uppercase tracking-wider"
                  >
                    View All
                  </Link>
                </div>

                {/* recommendation cards list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Rose Glow Mist",
                      price: 850,
                      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300",
                      detail: "Shena Essentials • 100ml",
                    },
                    {
                      name: "Satin Pillowcase",
                      price: 1200,
                      image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=300",
                      detail: "Luxurious Sleep Atelier • 1 Unit",
                    },
                  ].map((prod) => (
                    <div 
                      key={prod.name} 
                      className="bg-white border border-outline-variant/10 rounded-3xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/5 relative mb-4">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>

                      {/* Info & Price & CTA */}
                      <div className="space-y-3">
                        <div className="select-none">
                          <h4 className="font-extrabold text-xs sm:text-sm text-on-surface line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[10px] text-outline font-semibold mt-0.5">{prod.detail}</p>
                        </div>

                        <div className="flex justify-between items-center gap-2 pt-1">
                          <span className="font-extrabold text-xs sm:text-sm text-primary">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => handleAddRecommend(prod)}
                            className="bg-primary-fixed/20 hover:bg-primary hover:text-white text-primary text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                          >
                            + Add
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            
            /* EMPTY CART STATE */
            <div className="max-w-md mx-auto py-16 text-center space-y-6 select-none animate-in zoom-in-95 duration-400">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-outline/50 shadow-inner">
                  <span className="material-symbols-outlined text-4xl select-none">shopping_bag</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface">Your Shopping Bag is empty</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                  Add premium beauty products or book your self-care sessions to glow today.
                </p>
              </div>
              <Link 
                href="/explore" 
                className="inline-flex py-3.5 px-8 rounded-full font-bold text-sm bg-primary text-white hover:opacity-[0.97] active:scale-98 shadow-md shadow-primary/10 transition-all cursor-pointer"
              >
                Start Shopping
              </Link>
            </div>
            
          )}

        </Container>
      </main>

      {/* Footer wrapper */}
      <Footer />

    </div>
  );
}

export default CartFlow;
