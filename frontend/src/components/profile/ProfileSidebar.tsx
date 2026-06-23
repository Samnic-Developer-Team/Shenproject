"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { label: "My Profile", icon: "person", href: "/profile" },
  { label: "Booking History", icon: "calendar_today", href: "/profile" },
  { label: "Order History", icon: "shopping_bag", href: "/orders" },
  { label: "Wishlist", icon: "favorite", href: "/profile" },
  { label: "Settings", icon: "settings", href: "/profile" },
];

export function ProfileSidebar() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("shena_user_token");
    localStorage.removeItem("shena_user_logged_in");
    localStorage.removeItem("shena_current_user");
    router.push("/login");
  };

  return (
    <div className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm h-fit">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-3 pb-6 border-b border-outline-variant/10 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-2xl font-black select-none shadow-lg shadow-rose-200">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="text-center">
          <p className="font-black text-on-surface">{user?.name || "Guest"}</p>
          <p className="text-xs text-on-surface-variant mt-0.5 truncate max-w-[180px]">{user?.email || ""}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-6">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-on-surface hover:bg-rose-50 hover:text-rose-600 transition-colors group"
          >
            <span className="material-symbols-outlined !text-base text-on-surface-variant group-hover:text-rose-500 transition-colors">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-rose-100"
      >
        <span className="material-symbols-outlined !text-base">logout</span>
        Sign Out
      </button>
    </div>
  );
}

export default ProfileSidebar;
