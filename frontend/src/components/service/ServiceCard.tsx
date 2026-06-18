"use client";

import Link from "next/link";
import type { Service } from "@/types/service.types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Booking service:", service.label);
    alert(`Redirecting to booking system for "${service.label}"...`);
  };

  return (
    <div className="group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none flex flex-col h-full">
      {/* Service Image Showcase & Badges */}
      <Link href={`/services/${service.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-surface-container-low cursor-pointer">
        {service.image ? (
          <img
            alt={service.label}
            src={service.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl select-none">
              spa
            </span>
          </div>
        )}

        {/* Floating Rating Badge */}
        {service.rating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm border border-outline-variant/10">
            <span className="material-symbols-outlined text-yellow-500 !text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="text-xs font-bold text-on-surface">
              {service.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Floating Duration Pin */}
        {service.duration && (
          <div className="absolute bottom-4 left-4 bg-on-surface/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm text-white">
            <span className="material-symbols-outlined !text-sm select-none">
              schedule
            </span>
            <span className="text-[10px] font-bold tracking-wider">
              {service.duration}
            </span>
          </div>
        )}
      </Link>

      {/* Details Area */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category Label */}
        {service.category && (
          <span className="text-[10px] uppercase font-black text-secondary tracking-widest block mb-2">
            {service.category}
          </span>
        )}

        {/* Service Title */}
        <Link href={`/services/${service.slug}`} className="cursor-pointer">
          <h3 className="text-lg font-bold text-on-surface hover:text-primary transition-colors duration-200 line-clamp-1">
            {service.label}
          </h3>
        </Link>

        {/* Service Description */}
        <p className="text-on-surface-variant text-sm mt-2 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        {/* Price and Book Action */}
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-auto">
          <span className="text-primary font-black text-lg">
            ₹{service.price?.toLocaleString("en-IN") || "Free"}
          </span>
          <button
            onClick={handleBook}
            className="text-primary font-bold text-sm flex items-center gap-1 group/btn active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Book Now
            <span className="material-symbols-outlined !text-sm group-hover/btn:translate-x-1.5 transition-transform duration-300 select-none">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
