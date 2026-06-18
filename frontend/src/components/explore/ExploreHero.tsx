"use client";

interface ExploreHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholderText?: string;
}

export function ExploreHero({
  searchQuery,
  setSearchQuery,
  placeholderText = "Search salons, services, or locations...",
}: ExploreHeroProps) {
  return (
    <section className="relative mb-16 overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant/10 p-8 sm:p-12 md:p-16 flex flex-col items-center text-center">
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Small Label */}
      <span className="text-secondary font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 block z-10">
        Discover & Explore
      </span>

      {/* Main Title */}
      <h1 className="text-primary font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-4 max-w-2xl z-10">
        Find Your Atelier.
      </h1>

      {/* Subtext Tagline */}
      <p className="text-on-surface-variant text-base sm:text-lg mb-8 max-w-lg leading-relaxed z-10">
        Discover top-tier luxury salons, wellness sanctuaries, and elite beauty artists in papum-pare.
      </p>

      {/* Premium Search Bar */}
      <div className="relative w-full max-w-xl z-10 animate-fade-in">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
          search
        </span>
        <input
          type="text"
          placeholder={placeholderText}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant/15 rounded-2xl py-4 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface transition-all shadow-md placeholder-outline-variant/80"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default ExploreHero;
