"use client";

import Link from "next/link";
import type { Salon } from "@/types/salon.types";

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group select-none flex flex-col h-full">
      {/* Salon Banner Image with Rating Overlay */}
      <Link href={`/salons/${salon.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-surface-container-low cursor-pointer">
        {salon.image ? (
          <img
            alt={salon.name}
            src={salon.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl select-none">
              spa
            </span>
          </div>
        )}

        {/* Rating Overlay */}
        {salon.rating && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm border border-outline-variant/10">
            <span className="material-symbols-outlined text-yellow-500 !text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="text-xs font-bold text-on-surface">
              {salon.rating}
            </span>
          </div>
        )}
      </Link>

      {/* Salon Details Box */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name */}
        <Link href={`/salons/${salon.slug}`} className="cursor-pointer">
          <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {salon.name}
          </h3>
        </Link>

        {/* Location / Neighborhood */}
        <p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-primary !text-sm select-none">
            location_on
          </span>
          <span className="line-clamp-1">{salon.distance || salon.location}</span>
        </p>

        {/* Description Tagline */}
        {salon.description && (
          <p className="text-outline text-xs leading-relaxed mb-6 line-clamp-2">
            {salon.description}
          </p>
        )}

        {/* Price Level & Book CTA */}
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-auto">
          <span className="text-primary font-extrabold text-base tracking-widest">
            {salon.price || "₹₹"}
          </span>
          <Link
            href={`/salons/${salon.slug}`}
            className="text-primary font-bold text-sm flex items-center gap-1 group/btn cursor-pointer active:scale-95 transition-all"
          >
            Book Now
            <span className="material-symbols-outlined !text-sm group-hover/btn:translate-x-1.5 transition-transform duration-300 select-none">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SalonCard;
