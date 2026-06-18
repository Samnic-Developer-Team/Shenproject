"use client";

import type { Salon } from "@/types/salon.types";

interface SalonLocationProps {
  salon: Salon;
}

const ADDRESS_MAPPINGS: Record<string, string> = {
  "aura-spa-studio": "Shop 12, Ganga Market, Itanagar, Arunachal Pradesh, 791111",
  "the-gilded-mane": "3rd Floor, GS Road, Christian Basti, Guwahati, Assam, 781005",
  "velvet-touch": "Doimukh Circle Road, Papum Pare, Arunachal Pradesh, 791112",
};

export function SalonLocation({ salon }: SalonLocationProps) {
  const address = ADDRESS_MAPPINGS[salon.slug] || `${salon.location || "Itanagar"}, India`;

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.name + " " + address)}`, "_blank");
  };

  return (
    <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary">map</span>
        <h4 className="font-bold text-on-surface">Location</h4>
      </div>

      {/* Map Mockup Image */}
      <div className="h-36 rounded-2xl overflow-hidden relative mb-4 shadow-inner border border-outline-variant/5">
        <img
          alt="Map location"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF5V4GGw7Z_fUqeZ-Uk8ULtLSjZ-7FhD-vQ5j5wwPVO5fEiYOpqaag5wqfDssftKlNuHkexDim7b6jIq3OrAe4wPGVTA7TojlrE8mDu5NtLrDUd4Nycc-UvXoXwY9_G7mVVCcLz_AUyyvTxhtm5Rf3FUfZUP3Z99iiatOzdK0yI-MvBejrNu_kWREwJ_AzBWm1IoCKE5AMP3fE0vwO9f91DIN4E7Z5yp86FX0unOK3GhY7OXu_wcy13zsgqmlvx_B3PaZzqEt8kA"
          className="w-full h-full object-cover opacity-60 grayscale"
        />
        {/* Floating location marker pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
            location_on
          </span>
        </div>
      </div>

      {/* Address */}
      <p className="text-sm font-semibold text-on-surface mb-3 leading-relaxed">
        {address}
      </p>

      {/* Directions Link */}
      <button
        onClick={handleDirections}
        className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer select-none active:scale-95 transition-all"
      >
        Get Directions
        <span className="material-symbols-outlined text-xs">arrow_forward</span>
      </button>
    </div>
  );
}

export default SalonLocation;
