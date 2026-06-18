"use client";

import type { Service } from "@/types/service.types";
import { SalonServiceCard } from "./SalonServiceCard";

interface SalonServiceListProps {
  services: Service[];
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
}

export function SalonServiceList({
  services,
  selectedServices,
  onToggleService,
}: SalonServiceListProps) {
  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex flex-col select-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">
          Featured Experience
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface">
          Curated Glow Treatments
        </h2>
      </div>

      {/* Services Cards List */}
      <div className="space-y-4">
        {services.map((service) => {
          const isSelected = selectedServices.some((s) => s.slug === service.slug);
          return (
            <SalonServiceCard
              key={service.slug}
              service={service}
              isSelected={isSelected}
              onToggleSelect={() => onToggleService(service)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SalonServiceList;
