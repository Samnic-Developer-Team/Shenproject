"use client";

import { useState, useRef, useEffect } from "react";

interface ProductFiltersProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  showSaleOnly: boolean;
  setShowSaleOnly: (show: boolean) => void;
}

export function ProductFilters({
  sortBy,
  setSortBy,
  showSaleOnly,
  setShowSaleOnly,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary hover:text-primary-container font-semibold text-sm flex items-center gap-2 select-none active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Filters
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>
          filter_list
        </span>
      </button>

      {/* Luxury Filter Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-outline-variant/10 shadow-xl p-5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {/* Sort Section */}
            <div>
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-2">
                Sort By
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "Default", value: "default" },
                  { label: "Price: Low to High", value: "price-asc" },
                  { label: "Price: High to Low", value: "price-desc" },
                  { label: "Name: A - Z", value: "name-asc" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      sortBy === option.value
                        ? "bg-primary/5 text-primary"
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-outline-variant/10" />

            {/* Toggle Section */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-on-surface">
                Sale Items Only
              </span>
              <button
                onClick={() => setShowSaleOnly(!showSaleOnly)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showSaleOnly ? "bg-primary" : "bg-surface-container-high"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    showSaleOnly ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductFilters;
