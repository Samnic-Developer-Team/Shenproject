"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export function SellerLogin() {
  const router = useRouter();

  // ----------------------------------------------------
  // Form states
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill mockup credentials on mount for easy testing
  useEffect(() => {
    setFormData({
      email: "shena@example.com",
      password: "password",
    });
  }, []);

  // ----------------------------------------------------
  // Submit Handler
  // ----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailInput = formData.email.toLowerCase().trim();
      const passwordInput = formData.password;

      let authData: any;
      try {
        // Attempt backend login
        authData = await apiRequest("/auth/login", {
          method: "POST",
          bodyData: { email: emailInput, password: passwordInput }
        });
      } catch (loginErr: any) {
        // If it's the mock user and not registered, auto-register them
        if (emailInput === "shena@example.com" && passwordInput === "password") {
          try {
            await apiRequest("/auth/register", {
              method: "POST",
              bodyData: { name: "Shena", email: emailInput, password: passwordInput, role: "SELLER" }
            });
            // Try login again
            authData = await apiRequest("/auth/login", {
              method: "POST",
              bodyData: { email: emailInput, password: passwordInput }
            });
          } catch (regErr: any) {
            throw new Error(`Auto-registration failed: ${regErr.message}`);
          }
        } else {
          throw loginErr;
        }
      }

      if (authData && authData.data) {
        const { user, tokens } = authData.data;
        localStorage.setItem("shena_seller_logged_in", "true");
        localStorage.setItem("shena_seller_token", tokens.accessToken);
        localStorage.setItem("shena_current_seller", JSON.stringify({
          name: user.name,
          email: user.email,
          phone: "+91 98765 43210",
          category: "Salon",
        }));

        // Fetch their shop profile from the backend
        try {
          const profileData = await apiRequest("/sellers/me", {
            method: "GET"
          });

          if (profileData && profileData.data) {
            localStorage.setItem("shena_seller_salon_details", JSON.stringify(profileData.data));
            localStorage.setItem("shena_seller_salon_registered", "true");
          } else {
            localStorage.setItem("shena_seller_salon_registered", "false");
          }
        } catch (profileErr) {
          console.warn("Could not fetch seller profile:", profileErr);
          localStorage.setItem("shena_seller_salon_registered", "false");
        }

        router.push("/seller");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Invalid email address or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f6f8fd] text-[#151c27] min-h-screen flex items-center justify-center font-sans antialiased p-4">
      
      {/* Container Box */}
      <div className="max-w-4xl w-full bg-white border border-outline-variant/10 rounded-[36px] shadow-[0px_24px_56px_rgba(21,28,39,0.03)] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[550px]">
        
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
              Manage Your Business
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Access your real-time performance metrics, keep track of all appointments, edit product inventories, and check payouts.
            </p>
            
            {/* Quick stats indicators */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-white/95">
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
                <span className="block text-[8px] font-black uppercase text-white/60 tracking-wider">Active Bookings</span>
                <span className="text-base font-black mt-1 block">12 Today</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
                <span className="block text-[8px] font-black uppercase text-white/60 tracking-wider">Average Rating</span>
                <span className="text-base font-black mt-1 block">4.9 ★</span>
              </div>
            </div>
          </div>

          {/* Copyright copyright */}
          <p className="text-[9px] text-white/60 font-medium select-none">
            © 2024 Shena Atelier • Bangalore • Delhi
          </p>

        </div>

        {/* RIGHT COLUMN: LOGIN FORM (7 cols) */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          
          <div className="space-y-1.5 select-none">
            <h1 className="text-2xl font-black text-on-surface tracking-tight">
              Seller Portal Sign In
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Log in to access your shop dashboard and bookings.
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

            {/* Input: Email */}
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

            {/* Input: Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Use shena@example.com / password or create a new account."); }} className="text-[10px] text-primary hover:underline font-bold">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                placeholder="••••••••"
              />
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
                  Logging In...
                </span>
              ) : (
                "LOG IN"
              )}
            </button>

            <p className="text-center text-xs text-outline font-semibold select-none">
              New to Shena Seller?{" "}
              <Link href="/seller/register" className="text-primary hover:underline font-extrabold">
                Register here
              </Link>
            </p>
          </div>

          {/* Quick Mock Login Notice */}
          <div className="bg-violet-50/70 border border-violet-100/50 rounded-2xl p-3.5 select-none">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sm font-bold text-primary mt-0.5">info</span>
              <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-wider">Demo / testing account</h4>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-relaxed">
                  We prefilled the mockup partner profile <strong className="text-primary font-bold">shena@example.com</strong> / <strong className="text-primary font-bold">password</strong> to let you sign in and see the dashboard immediately!
                </p>
              </div>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
}

export default SellerLogin;
