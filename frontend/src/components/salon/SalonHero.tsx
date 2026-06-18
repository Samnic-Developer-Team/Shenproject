"use client";

import type { Salon } from "@/types/salon.types";

interface SalonHeroProps {
  salon: Salon;
}

export function SalonHero({ salon }: SalonHeroProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: salon.name,
          text: salon.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Salon link copied to clipboard!");
    }
  };

  const handleCall = () => {
    alert("Calling Enchanted Beauty Lounge artist at +91 98765 43210...");
  };

  return (
    <section className="relative">
      {/* Cover Image Background */}
      <div className="h-[250px] sm:h-[350px] md:h-[450px] w-full overflow-hidden relative">
        {salon.image ? (
          <img
            alt={`${salon.name} cover`}
            src={salon.image}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Floating Salon Card Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-lg border border-outline-variant/10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Logo & Main Details */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-surface shadow-md bg-white -mt-16 md:-mt-24 flex-shrink-0">
              <img
                alt={`${salon.name} Logo`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxMPLS6MabxZc99QlUqV_QzCPUOJV6WvensdCuK8pxoAMSy31a2CjqxbvMLAPlf9IdplHyf3nIDfWikruwbKWdnHHJjGYInFTEWnLn6OuChZkFn9nilllc0fV1AzW-RTcWDDybSIr189IHZRlT4gOZyXf9xH5oG4VM-Y_71QzAKmg9fvnVOiE9gLqbfM9v8CkSK2XcwCg7-qR-Sduw-04Tc2cVaeOeS298eSfR8rNZCQxsQ-1G53JizYaT6sgpDidBNctBi9UxeQ"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  Premium Partner
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                {salon.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-on-surface-variant font-medium text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-500 !text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-on-surface">{salon.rating || "4.8"}</span>
                  <span className="text-outline">(1.2k+ Reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined !text-base text-primary">
                    location_on
                  </span>
                  <span>{salon.location || "Itanagar, Arunachal"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleShare}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-surface-container-low text-primary font-bold text-xs uppercase tracking-wider hover:bg-surface-container-high transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border border-outline-variant/10"
            >
              <span className="material-symbols-outlined !text-lg">share</span>
              Share
            </button>
            <button
              onClick={handleCall}
              className="flex-1 md:flex-none px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-102 hover:shadow-xl hover:shadow-primary/30 active:scale-98 transition-all duration-300 cursor-pointer"
            >
              Call Artist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SalonHero;
