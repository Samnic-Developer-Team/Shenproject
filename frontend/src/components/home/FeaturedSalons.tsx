"use client";

import { useEffect, useState } from "react";
import { listSalons, type Seller } from "@/services/salon.service";
import { SalonCard } from "./SalonCard";
import type { Salon } from "@/types/salon.types";

export function FeaturedSalons() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listSalons()
      .then((sellers: Seller[]) => {
        // Normalize Seller documents to the Salon type that SalonCard expects
        const normalized: Salon[] = sellers.slice(0, 6).map((s) => ({
          slug: s._id,
          name: s.salonName,
          rating: "4.8",
          distance: `${s.city}, ${s.state}`,
          price: "₹₹₹",
          description: s.bio || "",
          location: `${s.city}, ${s.state}`,
          image: s.shopImage,
        }));
        setSalons(normalized);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-16 bg-surface-container-low">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Title Block */}
        <div className="flex flex-col mb-10 select-none">
          <span className="text-secondary font-extrabold text-xs uppercase tracking-widest">
            Handpicked
          </span>
          <h2 className="text-3xl font-extrabold text-on-surface mt-2 tracking-tight">
            Curated Studios Near You
          </h2>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shrink-0 w-80 h-72 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : salons.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 pb-4">
            {salons.map((salon) => (
              <SalonCard key={salon.slug} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant text-sm">
            No salons registered yet. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedSalons;
