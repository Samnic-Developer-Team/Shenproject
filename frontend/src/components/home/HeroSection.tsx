"use client";

import { useState } from "react";

export function HeroSection() {
  const [location, setLocation] = useState("Mumbai, MH");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "in:", location);
    alert(`Searching for "${searchQuery}" in ${location}`);
  };

  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      {/* Background Image & Soft Gradient Overlays */}
      <div className="absolute inset-0 z-0 select-none">
        <img 
          alt="Luxury spa interior" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDISfM-E_l-JVMTf9iyP3omLFCyyBnc2RZOzNbzW_2VSyrE9cZAxlv_PyvsC2FWiUesc7BKu3rzOW3rAW97b4f78mdhotr66tw3gKsDQpb2B4C4r7Mek_9wYX9QZSuNRL-_Plhi8rPRgAUPQo-J4aBaboXRi2Bc-vElXkD7djt-S3sBzb52Ww_kv_EjORfu_7b039kNRzc09pc3O8_5dUK4GY3Ga8LBRXxowNpvo6NZ3Oaz_MZSYi5gXs9CbHp6tjlbo3CPwX8ISA"
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
            className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2.5 max-w-2xl border border-outline-variant/15"
          >
            {/* Location Select */}
            <div className="flex-1 flex items-center px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus-within:border-primary/20 transition-all">
              <span className="material-symbols-outlined text-primary mr-2 select-none">location_on</span>
              <div className="relative w-full">
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-on-surface font-semibold w-full pr-6 cursor-pointer appearance-none text-sm"
                >
                  <option className="bg-white text-on-surface">Mumbai, MH</option>
                  <option className="bg-white text-on-surface">Delhi, NCR</option>
                  <option className="bg-white text-on-surface">Bangalore, KA</option>
                </select>
                <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-base select-none">keyboard_arrow_down</span>
                </div>
              </div>
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
