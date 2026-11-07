"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

interface AuthResponse {
  data: {
    user: {
      name: string;
      email: string;
    };
    tokens: {
      accessToken: string;
    };
  };
}

export function SellerLogin() {
  const router = useRouter();

  // ----------------------------------------------------
  // Form states (pre-filled with mockup credentials for testing)
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    email: "shena@example.com",
    password: "password",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      let authData: AuthResponse | null = null;
      try {
        // Attempt backend login
        authData = await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          bodyData: { email: emailInput, password: passwordInput }
        });
      } catch (loginErr: unknown) {
        // If it's the mock user and not registered, auto-register them
        if (emailInput === "shena@example.com" && passwordInput === "password") {
          try {
            await apiRequest("/auth/register", {
              method: "POST",
              bodyData: { name: "Shena", email: emailInput, password: passwordInput, role: "SELLER" }
            });
            // Try login again
            authData = await apiRequest<AuthResponse>("/auth/login", {
              method: "POST",
              bodyData: { email: emailInput, password: passwordInput }
            });
          } catch (regErr: unknown) {
            const regMsg = regErr instanceof Error ? regErr.message : String(regErr);
            throw new Error(`Auto-registration failed: ${regMsg}`);
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
          const profileData = await apiRequest<{ data?: Record<string, unknown> | null }>("/sellers/me", {
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
    } catch (e: unknown) {
      console.error(e);
      const errMsg = e instanceof Error ? e.message : "Invalid email address or password. Please try again.";
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 min-h-screen flex items-center justify-center font-sans antialiased p-4 relative overflow-hidden">
      
      {/* Background Animated/Glow Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Container Box */}
      <div className="max-w-4xl w-full bg-white border border-slate-100 rounded-[36px] shadow-[0px_32px_64px_rgba(30,41,59,0.06)] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[580px] relative z-10 transition-all duration-300">
        
        {/* LEFT COLUMN: BRAND MARKETING (5 cols) */}
        <div className="md:col-span-5 bg-black p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/5">
          {/* Subtle Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Decorative Glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <Link href="/" className="flex items-center select-none z-10">
            <img
              src="/logo.jpeg"
              alt="Shena Logo"
              className="w-20 rounded-2xl object-cover border border-white/20 shadow-md"
            />
          </Link>

          {/* Marketing text */}
          <div className="space-y-6 my-8 md:my-0 select-none z-10">
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
              Elevate Your <br /> Salon Business
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-semibold">
              Access real-time performance analytics, manage client appointments, maintain your service boutique, and secure swift payouts from Arunachal&apos;s premium salon network.
            </p>
            
            {/* Quick stats indicators */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
                <span className="block text-[8px] font-black uppercase text-white/60 tracking-wider">Active Bookings</span>
                <span className="text-sm font-black mt-0.5 block text-white">12 Today</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
                <span className="block text-[8px] font-black uppercase text-white/60 tracking-wider">Average Rating</span>
                <span className="text-sm font-black mt-0.5 block text-pink-300 flex items-center gap-0.5">
                  4.9 <span className="material-symbols-outlined text-[10px] text-pink-300 select-none">star</span>
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[9px] text-white/60 font-semibold select-none z-10 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[10px] text-white/40">location_on</span>
            <span>© 2026 Shena Atelier • Itanagar • Naharlagun • Pasighat</span>
          </p>

        </div>

        {/* RIGHT COLUMN: LOGIN FORM (7 cols) */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-white">
          
          <div className="space-y-1.5 select-none">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Seller Portal Sign In
            </h1>
            <p className="text-xs text-slate-400 font-semibold">
              Log in to access your shop dashboard and bookings.
            </p>
          </div>

          {/* Form inputs */}
          <div className="space-y-4">
            
            {/* Error display */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl px-4 py-2.5 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Input: Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 text-base pointer-events-none">mail</span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-200/60 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
                  placeholder="name@studio.com"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Use shena@example.com / password or create a new account."); }} className="text-[10px] text-black hover:underline font-extrabold transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-455 text-base pointer-events-none">lock</span>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-200/60 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
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
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-black/10 hover:shadow-black/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-black text-white hover:bg-neutral-900 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  Logging In...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">login</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-450 font-semibold select-none">
              New to Shena Seller?{" "}
              <Link href="/seller/register" className="text-black hover:underline font-extrabold transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Quick Mock Login Notice */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 select-none relative overflow-hidden group">
            {/* Subtle glow highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/3 to-neutral-900/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-start gap-3 relative z-10">
              <span className="material-symbols-outlined text-sm font-bold text-black mt-0.5 bg-black/10 p-1.5 rounded-lg">info</span>
              <div>
                <h4 className="text-[10px] font-black text-black uppercase tracking-wider">Demo / testing account</h4>
                <p className="text-[10px] text-slate-455 font-semibold mt-0.5 leading-relaxed">
                  We prefilled the mockup partner profile <strong className="text-black font-black">shena@example.com</strong> / <strong className="text-black font-bold">password</strong> to let you sign in and see the dashboard immediately!
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
