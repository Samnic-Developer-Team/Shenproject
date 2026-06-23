"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest<{ data: { user: any; tokens: { accessToken: string } } }>("/auth/login", {
        method: "POST",
        bodyData: { email: formData.email.toLowerCase().trim(), password: formData.password },
      });

      if (res?.data) {
        const { user, tokens } = res.data;
        setAuth(user, tokens.accessToken);
        localStorage.setItem("shena_user_token", tokens.accessToken);
        localStorage.setItem("shena_user_logged_in", "true");
        localStorage.setItem("shena_current_user", JSON.stringify(user));
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f6f8fd] text-[#151c27] min-h-screen flex items-center justify-center font-sans antialiased p-4">
      <div className="max-w-4xl w-full bg-white border border-outline-variant/10 rounded-[36px] shadow-[0px_24px_56px_rgba(21,28,39,0.03)] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[520px]">
        
        {/* LEFT: Branding */}
        <div className="md:col-span-5 bg-gradient-to-br from-rose-500 to-[#c2185b] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />

          <Link href="/" className="text-xl font-bold tracking-tight text-white select-none">
            Shena
          </Link>

          <div className="space-y-6 my-8 md:my-0 select-none">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Your Beauty Journey Starts Here
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Book premium salon appointments, track your orders, and manage your beauty profile in one place.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-white/95">
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
                <span className="block text-[8px] font-black uppercase text-white/60 tracking-wider">Services</span>
                <span className="text-base font-black mt-1 block">500+</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
                <span className="block text-[8px] font-black uppercase text-white/60 tracking-wider">Partner Studios</span>
                <span className="text-base font-black mt-1 block">100+</span>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-white/60 font-medium select-none">
            © 2024 Shena Atelier • Bangalore • Delhi
          </p>
        </div>

        {/* RIGHT: Login Form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1.5 select-none">
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Welcome Back</h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Sign in to book services and manage your appointments.
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl px-4 py-2.5">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Password</label>
                <Link href="/forgot-password" className="text-[10px] text-rose-500 hover:underline font-bold">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-rose-500 to-[#c2185b] text-white shadow-rose-500/20 hover:opacity-[0.97]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  Signing In...
                </span>
              ) : "SIGN IN"}
            </button>

            <p className="text-center text-xs text-outline font-semibold select-none">
              New to Shena?{" "}
              <Link href="/register" className="text-rose-500 hover:underline font-extrabold">
                Create an account
              </Link>
            </p>

            <div className="border-t border-outline-variant/10 pt-4 text-center">
              <p className="text-xs text-outline font-medium">
                Are you a salon partner?{" "}
                <Link href="/seller/login" className="text-primary hover:underline font-bold">
                  Seller login →
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}