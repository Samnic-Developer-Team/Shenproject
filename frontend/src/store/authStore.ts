"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/services/auth.service";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Also keep legacy localStorage keys for backward compat with SellerPortal
        if (typeof window !== "undefined") {
          localStorage.setItem("shena_seller_token", token);
          localStorage.setItem("shena_seller_logged_in", "true");
          localStorage.setItem(
            "shena_current_seller",
            JSON.stringify({ name: user.name, email: user.email })
          );
        }
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("shena_seller_token");
          localStorage.removeItem("shena_seller_logged_in");
          localStorage.removeItem("shena_current_seller");
          localStorage.removeItem("shena_seller_salon_registered");
          localStorage.removeItem("shena_seller_salon_details");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "shena-auth-store",
      // Only persist user and token, not derived state
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
