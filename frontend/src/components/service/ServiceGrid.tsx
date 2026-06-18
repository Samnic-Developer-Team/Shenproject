"use client";

import type { Service } from "@/types/service.types";
import { ServiceCard } from "./ServiceCard";

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-4 text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
          sentiment_neutral
        </span>
        <p className="text-lg font-bold">No services found</p>
        <p className="text-sm mt-1 text-outline">Try choosing another category or clearing filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}

export default ServiceGrid;
