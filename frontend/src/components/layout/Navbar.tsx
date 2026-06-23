"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/common/SearchBar";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("shena_user_token");
    localStorage.removeItem("shena_user_logged_in");
    localStorage.removeItem("shena_current_user");
    window.location.href = "/";
  };

  // State to track dynamic cart items count
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const saved = localStorage.getItem("shena_cart_items");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const count = parsed.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(count);
          }
        } catch (e) {
          console.error("Failed to parse cart items", e);
        }
      } else {
        // Mock default state of 2 items matching initial mockup cart
        setCartCount(2);
      }
    };

    // Load initial count
    updateCartCount();

    // Listen for update events
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant/10 bg-white shadow-sm transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
            >
              Shena
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={pathname === "/"
                  ? "text-primary font-semibold border-b-2 border-primary pb-1 transition-all duration-300"
                  : "text-on-surface-variant font-medium hover:text-primary pb-1 transition-all duration-300"}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className={pathname === "/explore"
                  ? "text-primary font-semibold border-b-2 border-primary pb-1 transition-all duration-300"
                  : "text-on-surface-variant font-medium hover:text-primary pb-1 transition-all duration-300"}
              >
                Explore
              </Link>
              <Link
                href="/services"
                className={pathname === "/services" || pathname.startsWith("/services/")
                  ? "text-primary font-semibold border-b-2 border-primary pb-1 transition-all duration-300"
                  : "text-on-surface-variant font-medium hover:text-primary pb-1 transition-all duration-300"}
              >
                Services
              </Link>
              <Link
                href="/products"
                className={pathname === "/products" || pathname.startsWith("/products/")
                  ? "text-primary font-semibold border-b-2 border-primary pb-1 transition-all duration-300"
                  : "text-on-surface-variant font-medium hover:text-primary pb-1 transition-all duration-300"}
              >
                Products
              </Link>
            </nav>
          </div>

          {/* Desktop Search, Cart, Avatar & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">

            {/* Search Input (Desktop Only) */}
            <div className="hidden md:block w-64 lg:w-72">
              <SearchBar placeholder="Search services..." />
            </div>

            {/* Become a Seller Button (Desktop Only) */}
            <Link 
              href="/seller/login"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary hover:text-violet-800 rounded-full text-xs font-extrabold transition-all duration-300 active:scale-95 shadow-sm"
              title="Seller Portal Login / Registration"
            >
              <span className="material-symbols-outlined text-sm font-bold">storefront</span>
              Become a Seller
            </Link>

            {/* Cart Icon */}
            <Link 
              href="/cart"
              className="relative p-2.5 text-on-surface-variant hover:bg-surface-variant/40 rounded-full transition-all group active:scale-95 flex items-center justify-center cursor-pointer"
              title="Shopping Bag"
            >
              <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-secondary text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center px-1 animate-in zoom-in duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login Action */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed/80 cursor-pointer shadow-sm hover:border-primary transition-all flex items-center justify-center bg-violet-100 text-primary text-sm font-bold focus:outline-none"
                >
                  {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-48 bg-white border border-outline-variant/15 rounded-2xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-outline-variant/10">
                      <p className="text-xs font-black text-on-surface line-clamp-1">{user.name}</p>
                      <p className="text-[10px] text-outline font-semibold line-clamp-1">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">person</span>
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-outline-variant/5"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white hover:bg-violet-800 rounded-full text-xs font-extrabold transition-all duration-300 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                Sign In
              </Link>
            )}

            {/* Hamburger (Mobile/Tablet Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-full transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl select-none">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute top-20 right-4 left-4 rounded-2xl bg-white p-6 shadow-2xl border border-outline-variant/10 flex flex-col gap-4 animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full">
              <SearchBar placeholder="Search services..." onFocus={() => setIsMobileMenuOpen(false)} />
            </div>

            <nav className="flex flex-col gap-3 pt-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={pathname === "/"
                  ? "flex items-center gap-3 py-2 px-4 rounded-xl text-primary font-bold bg-primary-fixed/30"
                  : "flex items-center gap-3 py-2 px-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors"}
              >
                <span className="material-symbols-outlined">home</span>
                Home
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className={pathname === "/cart"
                  ? "flex items-center justify-between py-2 px-4 rounded-xl text-primary font-bold bg-primary-fixed/30"
                  : "flex items-center justify-between py-2 px-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors"}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Cart
                </div>
                {cartCount > 0 && (
                  <span className="bg-secondary text-white text-[9px] font-black rounded-full px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className={pathname === "/explore"
                  ? "flex items-center gap-3 py-2 px-4 rounded-xl text-primary font-bold bg-primary-fixed/30"
                  : "flex items-center gap-3 py-2 px-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors"}
              >
                <span className="material-symbols-outlined">explore</span>
                Explore
              </Link>
              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className={pathname === "/services" || pathname.startsWith("/services/")
                  ? "flex items-center gap-3 py-2 px-4 rounded-xl text-primary font-bold bg-primary-fixed/30"
                  : "flex items-center gap-3 py-2 px-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors"}
              >
                <span className="material-symbols-outlined">design_services</span>
                Services
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className={pathname === "/products" || pathname.startsWith("/products/")
                  ? "flex items-center gap-3 py-2 px-4 rounded-xl text-primary font-bold bg-primary-fixed/30"
                  : "flex items-center gap-3 py-2 px-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors"}
              >
                <span className="material-symbols-outlined">shopping_basket</span>
                Products
              </Link>
              
              {/* Become a Seller Link (Mobile Only) */}
              <Link
                href="/seller/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 px-4 rounded-xl text-primary font-bold bg-primary-fixed/15 hover:bg-primary-fixed/35 transition-colors border border-primary/10 mt-2"
              >
                <span className="material-symbols-outlined">storefront</span>
                Become a Seller
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 px-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors mt-2"
                  >
                    <span className="material-symbols-outlined">person</span>
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 py-2 px-4 rounded-xl text-rose-600 font-bold hover:bg-rose-50 transition-colors w-full text-left mt-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 px-4 rounded-xl text-primary font-bold bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/10 mt-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab-Bar Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-surface/90 backdrop-blur-2xl flex justify-around items-center px-4 pb-6 pt-2 rounded-t-3xl shadow-[0px_-12px_32px_rgba(21,28,39,0.08)] border-t border-outline-variant/10">
        <Link
          href="/"
          className={pathname === "/"
            ? "flex flex-col items-center justify-center bg-violet-100/80 text-primary rounded-2xl px-5 py-2.5 scale-105 transition-all duration-300"
            : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-low rounded-xl transition-all active:scale-105"}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: pathname === "/" ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className={`text-[10px] ${pathname === "/" ? "font-bold" : "font-medium"} mt-1 uppercase tracking-wider`}>Home</span>
        </Link>
        <Link
          href="/explore"
          className={pathname === "/explore"
            ? "flex flex-col items-center justify-center bg-violet-100/80 text-primary rounded-2xl px-5 py-2.5 scale-105 transition-all duration-300"
            : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-low rounded-xl transition-all active:scale-105"}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: pathname === "/explore" ? "'FILL' 1" : "'FILL' 0" }}>search</span>
          <span className={`text-[10px] ${pathname === "/explore" ? "font-bold" : "font-medium"} mt-1 uppercase tracking-wider`}>Search</span>
        </Link>
        <Link
          href={isAuthenticated ? "/bookings" : "/login?redirect=/bookings"}
          className={pathname === "/bookings"
            ? "flex flex-col items-center justify-center bg-violet-100/80 text-primary rounded-2xl px-5 py-2.5 scale-105 transition-all duration-300"
            : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-low rounded-xl transition-all active:scale-105"}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: pathname === "/bookings" ? "'FILL' 1" : "'FILL' 0" }}>calendar_month</span>
          <span className={`text-[10px] ${pathname === "/bookings" ? "font-bold" : "font-medium"} mt-1 uppercase tracking-wider`}>Bookings</span>
        </Link>
        <Link
          href="/cart"
          className={pathname === "/cart"
            ? "flex flex-col items-center justify-center bg-violet-100/80 text-primary rounded-2xl px-5 py-2.5 scale-105 transition-all duration-300 relative"
            : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-low rounded-xl transition-all active:scale-105 relative"}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: pathname === "/cart" ? "'FILL' 1" : "'FILL' 0" }}>shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-3 min-w-[16px] h-4 bg-secondary text-white text-[8px] font-black rounded-full border border-white flex items-center justify-center px-0.5">
              {cartCount}
            </span>
          )}
          <span className={`text-[10px] ${pathname === "/cart" ? "font-bold" : "font-medium"} mt-1 uppercase tracking-wider`}>Cart</span>
        </Link>
        <Link
          href={isAuthenticated ? "/profile" : "/login?redirect=/profile"}
          className={pathname === "/profile"
            ? "flex flex-col items-center justify-center bg-violet-100/80 text-primary rounded-2xl px-5 py-2.5 scale-105 transition-all duration-300"
            : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-low rounded-xl transition-all active:scale-105"}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: pathname === "/profile" ? "'FILL' 1" : "'FILL' 0" }}>person</span>
          <span className={`text-[10px] ${pathname === "/profile" ? "font-bold" : "font-medium"} mt-1 uppercase tracking-wider`}>Profile</span>
        </Link>
      </nav>
    </>
  );
}

export default Navbar;
