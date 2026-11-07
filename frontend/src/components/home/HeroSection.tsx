"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { listActiveLocations, type Location } from "@/services/location.service";

export function HeroSection() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState("Itanagar, Arunachal Pradesh");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    listActiveLocations().then((data) => {
      setLocations(data);
      if (data.length > 0) {
        setLocation(`${data[0].city}, ${data[0].state}`);
      }
    });
  }, []);

  // Close dropdown on click outside
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (location) {
      queryParams.set("location", location);
    }
    if (searchQuery.trim()) {
      queryParams.set("search", searchQuery.trim());
    }
    router.push(`/explore?${queryParams.toString()}`);
  };

  const getShortState = (stateName: string) => {
    return stateName === "Arunachal Pradesh" ? "AP" : stateName;
  };

  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      {/* Background Image & Soft Gradient Overlays */}
      <div className="absolute inset-0 z-0 select-none">
        <img 
          alt="Luxury spa interior" 
          src="/hero-salon.png"
          className="w-full h-full object-cover"
        />
        {/* Responsive gradient overlay to guarantee readability of light elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-transparent md:via-surface/60"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="max-w-2xl">
          <span className="text-primary font-semibold tracking-[0.15em] text-xs uppercase mb-4 block">
            Redefining Beauty in India
          </span>
          <h1 className="text-on-surface font-extrabold text-5xl md:text-7xl leading-tight mb-8 tracking-tight">
            The Digital Atelier <br className="hidden sm:inline" />
            for Self-Care.
          </h1>
          
          {/* Search Box Form */}
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2.5 max-w-2xl border border-outline-variant/15 relative z-30"
          >
            {/* Location Select (Custom Dropdown) */}
            <div 
              ref={dropdownRef}
              className="flex-1 relative flex items-center px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus-within:border-primary/20 transition-all cursor-pointer select-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="material-symbols-outlined text-primary mr-2.5 select-none">location_on</span>
              <div className="flex-grow flex items-center justify-between">
                <span className="text-on-surface font-bold text-sm tracking-wide">
                  {(() => {
                    const parts = location.split(", ");
                    if (parts.length > 1) {
                      return `${parts[0]}, ${getShortState(parts[1])}`;
                    }
                    return location;
                  })()}
                </span>
                <span className={`material-symbols-outlined text-on-surface-variant text-base select-none transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                  keyboard_arrow_down
                </span>
              </div>

              {/* Styled Dropdown Menu */}
              {isOpen && (
                <div className="absolute left-0 right-0 top-[108%] bg-white/95 backdrop-blur-lg border border-outline-variant/20 rounded-2xl shadow-2xl p-2 z-50 max-h-60 overflow-y-auto space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {locations.length > 0 ? (
                    locations.map((loc) => {
                      const displayFull = `${loc.city}, ${loc.state}`;
                      const displayShort = `${loc.city}, ${getShortState(loc.state)}`;
                      const isSelected = location === displayFull;

                      return (
                        <div
                          key={loc._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(displayFull);
                            setIsOpen(false);
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm opacity-60">pin_drop</span>
                            <span>{displayShort}</span>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-sm font-extrabold text-primary">check</span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    [
                      { city: "Itanagar", state: "Arunachal Pradesh" },
                      { city: "Naharlagun", state: "Arunachal Pradesh" },
                      { city: "Pasighat", state: "Arunachal Pradesh" },
                    ].map((loc, idx) => {
                      const displayFull = `${loc.city}, ${loc.state}`;
                      const displayShort = `${loc.city}, ${getShortState(loc.state)}`;
                      const isSelected = location === displayFull;

                      return (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(displayFull);
                            setIsOpen(false);
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm opacity-60">pin_drop</span>
                            <span>{displayShort}</span>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-sm font-extrabold text-primary">check</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Query Input */}
            <div className="flex-[1.5] flex items-center px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus-within:border-primary/20 transition-all">
              <span className="material-symbols-outlined text-outline mr-2 select-none">search</span>
              <input 
                type="text" 
                placeholder="Find a salon or service near you" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 w-full text-sm font-medium"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold text-sm hover:opacity-95 shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Search
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
