import { salons } from "@/data/salons";
import { SalonCard } from "./SalonCard";

export function FeaturedSalons() {
  return (
    <section className="py-16 bg-surface-container-low">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Title Block */}
        <div className="flex flex-col mb-10 select-none">
          <span className="text-secondary font-extrabold text-xs uppercase tracking-widest">
            Handpicked
          </span>
          <h2 className="text-3xl font-extrabold text-on-surface mt-2 tracking-tight">
            Curated Studios in Itanagar & Guwahati
          </h2>
        </div>

        {/* Horizontal scroll grid */}
        <div className="flex gap-6 overflow-x-auto hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 pb-4">
          {salons.map((salon) => (
            <SalonCard key={salon.slug} salon={salon} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedSalons;
