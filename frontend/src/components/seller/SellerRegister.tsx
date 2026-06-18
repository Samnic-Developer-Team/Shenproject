"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SellerRegister() {
  const router = useRouter();

  // ----------------------------------------------------
  // Form states
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Salon",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------------------
  // Submit Handler
  // ----------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    // Simulate saving account details to localStorage
    setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          const existingAccounts = JSON.parse(localStorage.getItem("shena_seller_accounts") || "[]");
          
          // Check if email already registered
          const emailExists = existingAccounts.some((acc: any) => acc.email.toLowerCase() === formData.email.toLowerCase());
          if (emailExists) {
            setError("This email address is already registered.");
            setIsSubmitting(false);
            return;
          }

          const newAccount = {
            id: `acc-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            category: formData.category,
            password: formData.password,
          };

          existingAccounts.push(newAccount);
          localStorage.setItem("shena_seller_accounts", JSON.stringify(existingAccounts));

          alert("Seller account created successfully! Please log in.");
          router.push("/seller/login");
        } catch (e) {
          console.error(e);
          setError("Failed to create account. Please try again.");
        }
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-[#f6f8fd] text-[#151c27] min-h-screen flex items-center justify-center font-sans antialiased p-4">
      
      {/* Container Box */}
      <div className="max-w-4xl w-full bg-white border border-outline-variant/10 rounded-[36px] shadow-[0px_24px_56px_rgba(21,28,39,0.03)] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[600px]">
        
        {/* LEFT COLUMN: BRAND MARKETING (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-violet-700 to-[#5a00c6] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative Glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-white select-none">
            Shena Seller
          </Link>

          {/* Marketing text */}
          <div className="space-y-6 my-8 md:my-0 select-none">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Grow Your Beauty Studio
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Join 10,000+ beauty salons, luxury spas, and independent artist partners growing their monthly bookings by 40% using Shena.
            </p>
            
            {/* Features ledger */}
            <div className="space-y-3.5 pt-4 text-xs font-semibold text-white/90">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm font-bold text-fuchsia-300">check_circle</span>
                <span>24/7 calendar booking schedule</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm font-bold text-fuchsia-300">check_circle</span>
                <span>List services & retail products</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm font-bold text-fuchsia-300">check_circle</span>
                <span>Detailed earnings payouts ledger</span>
              </div>
            </div>
          </div>

          {/* Copyright copyright */}
          <p className="text-[9px] text-white/60 font-medium select-none">
            © 2024 Shena Atelier • Bangalore • Delhi
          </p>

        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM (7 cols) */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          
          <div className="space-y-1.5 select-none">
            <h1 className="text-2xl font-black text-on-surface tracking-tight">
              Create Seller Account
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Start receiving online bookings in under 5 minutes.
            </p>
          </div>

          {/* Form inputs */}
          <div className="space-y-4">
            
            {/* Error display */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl px-4 py-2.5 animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {/* Input: Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                placeholder="e.g. Kishan Kumar"
              />
            </div>

            {/* Row: Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  placeholder="name@studio.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>

            {/* Input: Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Salon / Business Type</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Salon">Hair & Beauty Salon</option>
                <option value="Spa">Spa & Wellness Retreat</option>
                <option value="Makeup Studio">Makeup Glam Studio</option>
                <option value="Nails">Nails Boutique</option>
              </select>
            </div>

            {/* Row: Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-primary to-[#5a00c6] text-white shadow-primary/20 hover:opacity-[0.97]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>

            <p className="text-center text-xs text-outline font-semibold select-none">
              Already have a seller account?{" "}
              <Link href="/seller/login" className="text-primary hover:underline font-extrabold">
                Log in here
              </Link>
            </p>
          </div>

        </form>

      </div>

    </div>
  );
}

export default SellerRegister;
