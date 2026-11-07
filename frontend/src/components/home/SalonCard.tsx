import Link from "next/link";
import type { Salon } from "@/types/salon.types";

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  return (
    <Link 
      href={`/salons/${salon.slug}`}
      className="block shrink-0 w-80 bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group select-none cursor-pointer"
    >
      {/* Salon Image wrapper with Rating Badge */}
      <div className="h-48 relative overflow-hidden">
        {salon.image ? (
          <img 
            alt={salon.name} 
            src={salon.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl select-none">spa</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {salon.rating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm border border-outline-variant/10">
            <span className="material-symbols-outlined text-yellow-500 !text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="text-xs font-bold text-on-surface">{salon.rating}</span>
          </div>
        )}
      </div>

      {/* Details Box */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
          {salon.name}
        </h3>
        
        <p className="text-on-surface-variant text-sm mb-5 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-primary !text-sm select-none">location_on</span>
          {salon.distance || salon.location}
        </p>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
          <span className="text-on-surface-variant font-bold text-xs tracking-normal">
            {salon.serviceCount ?? 0} Services • {salon.productCount ?? 0} Products
          </span>
          <span 
            className="text-primary font-bold text-sm flex items-center gap-1 group/btn"
          >
            Book Now
            <span className="material-symbols-outlined !text-sm group-hover/btn:translate-x-1.5 transition-transform duration-300 select-none">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default SalonCard;
