"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
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
    try {
      // Register and auto-login
      const regRes = await apiRequest<{ data: { user: any; tokens: { accessToken: string } } }>("/auth/register", {
        method: "POST",
        bodyData: {
          name: formData.name,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: "USER",
        },
      });

      if (regRes?.data) {
        const { user, tokens } = regRes.data;
        setAuth(user, tokens.accessToken);
        localStorage.setItem("shena_user_token", tokens.accessToken);
        localStorage.setItem("shena_user_logged_in", "true");
        localStorage.setItem("shena_current_user", JSON.stringify(user));
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f6f8fd] text-[#151c27] min-h-screen flex items-center justify-center font-sans antialiased p-4">
      <div className="max-w-4xl w-full bg-white border border-outline-variant/10 rounded-[36px] shadow-[0px_24px_56px_rgba(21,28,39,0.03)] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[580px]">
        
        {/* LEFT: Branding */}
        <div className="md:col-span-5 bg-black p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />

          <Link href="/" className="flex items-center select-none">
            <img
              src="/logo.jpeg"
              alt="Shena Logo"
              className="w-20 rounded-2xl object-cover border border-white/20 shadow-md"
            />
          </Link>

          <div className="space-y-6 my-8 md:my-0 select-none">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Join the Beauty Community
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Create your free account to book premium salon appointments, shop beauty products, and more.
            </p>

            <div className="space-y-3.5 pt-4 text-xs font-semibold text-white/90">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm font-bold text-neutral-300">check_circle</span>
                <span>Book appointments instantly</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm font-bold text-neutral-300">check_circle</span>
                <span>Shop curated beauty products</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm font-bold text-neutral-300">check_circle</span>
                <span>Track bookings & order history</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Registration Form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1.5 select-none">
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Create Your Account</h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Free to join. No credit card required.
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl px-4 py-2.5">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-black focus:ring-2 focus:ring-black/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-black focus:ring-2 focus:ring-black/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-black focus:ring-2 focus:ring-black/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-black focus:ring-2 focus:ring-black/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-black text-white shadow-black/20 hover:bg-neutral-900"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  Creating Account...
                </span>
              ) : "CREATE ACCOUNT"}
            </button>

            <p className="text-center text-xs text-outline font-semibold select-none">
              Already have an account?{" "}
              <Link href="/login" className="text-black hover:underline font-extrabold">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}