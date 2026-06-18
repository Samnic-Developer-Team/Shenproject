"use client";

import type { Salon } from "@/types/salon.types";

interface SalonInfoProps {
  salon: Salon;
}

export function SalonInfo({ salon }: SalonInfoProps) {
  return (
    <div className="space-y-8 select-none">
      {/* About Section */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
        <h3 className="text-xl font-bold text-on-surface mb-4">
          About {salon.name}
        </h3>
        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
          {salon.description || "Welcome to the salon."}
        </p>
        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mt-4">
          Established in 2024, our salon serves as Northeast India's premier beauty boutique. We blend classical cosmetology standards with clean, organic clinical brands to restore and highlight your organic radiance.
        </p>
      </div>

      {/* Salon Highlights */}
      <div>
        <h4 className="text-lg font-bold text-on-surface mb-4">Atelier Highlights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "verified_user",
              title: "Premium Products",
              desc: "Exclusively using global clinical brands like Olaplex and Charlotte Tilbury.",
            },
            {
              icon: "brush",
              title: "Expert Artists",
              desc: "Styling and therapy conducted only by certified master-level cosmetologists.",
            },
            {
              icon: "spa",
              title: "Serene Environment",
              desc: "Enjoy private styling suites, ambient soundscapes, and calming aromatics.",
            },
            {
              icon: "volunteer_activism",
              title: "Tailored Care",
              desc: "Every appointment includes a personal skin or hair health consultation.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/5 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <h5 className="font-bold text-on-surface text-sm">{item.title}</h5>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SalonInfo;
