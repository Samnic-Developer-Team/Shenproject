"use client";

import type { Service } from "@/types/service.types";

interface SalonServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export function SalonServiceCard({
  service,
  isSelected,
  onToggleSelect,
}: SalonServiceCardProps) {
  return (
    <div className="group bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-6 hover:shadow-md transition-shadow border border-outline-variant/5 select-none">
      {/* Service Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low">
        {service.image ? (
          <img
            alt={service.label}
            src={service.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-2xl">spa</span>
          </div>
        )}
      </div>

      {/* Title and Duration */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
          {service.label}
        </h3>
        {service.duration && (
          <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 mt-1 font-medium">
            <span className="material-symbols-outlined !text-sm">schedule</span>
            {service.duration}
          </p>
        )}
      </div>

      {/* Pricing & Booking CTA */}
      <div className="text-right flex-shrink-0">
        <div className="text-lg sm:text-xl font-black text-on-surface mb-2">
          ₹{service.price?.toLocaleString("en-IN") || "Free"}
        </div>
        <button
          onClick={onToggleSelect}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
            isSelected
              ? "bg-secondary-fixed text-on-secondary-fixed-variant hover:opacity-90"
              : "bg-primary text-on-primary hover:bg-primary-container"
          }`}
        >
          {isSelected ? "Remove" : "Book"}
        </button>
      </div>
    </div>
  );
}

export default SalonServiceCard;
