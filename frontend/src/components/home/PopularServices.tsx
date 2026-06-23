"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listServices, type Service } from "@/services/service.service";

// Style mappings for service categories
const serviceStyles: Record<string, { bgClass: string; iconClass: string }> = {
  haircut: { bgClass: "bg-secondary-fixed", iconClass: "text-on-secondary-fixed-variant" },
  facial: { bgClass: "bg-violet-100", iconClass: "text-primary" },
  massage: { bgClass: "bg-orange-100", iconClass: "text-orange-600" },
  nails: { bgClass: "bg-green-100", iconClass: "text-green-700" },
  makeup: { bgClass: "bg-blue-100", iconClass: "text-blue-700" },
  hair: { bgClass: "bg-secondary-fixed", iconClass: "text-on-secondary-fixed-variant" },
  skin: { bgClass: "bg-violet-100", iconClass: "text-primary" },
  wellness: { bgClass: "bg-orange-100", iconClass: "text-orange-600" },
};

const categoryIcons: Record<string, string> = {
  hair: "content_cut",
  haircut: "content_cut",
  skin: "face",
  facial: "face",
  wellness: "spa",
  massage: "spa",
  nails: "pan_tool_alt",
  makeup: "brush",
};

export function PopularServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listServices({ limit: "8" })
      .then(setServices)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-12 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Block */}
        <div className="flex items-center justify-between mb-8 select-none">
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Popular Services</h2>
          <Link href="/services" className="text-secondary font-bold text-sm hover:underline transition-all">
            View All
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-20 h-20 rounded-full bg-surface-container-low animate-pulse" />
                <div className="w-16 h-3 bg-surface-container-low rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
            {services.map((service) => {
              const catKey = service.category?.toLowerCase() || "";
              const style = serviceStyles[catKey] || { bgClass: "bg-surface-container-low", iconClass: "text-primary" };
              const icon = categoryIcons[catKey] || "spa";
              const label = service.title || (service as any).label || service.category;

              return (
                <div 
                  key={service._id} 
                  className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer"
                >
                  {/* Circle Container */}
                  <div 
                    className={`w-20 h-20 rounded-full ${style.bgClass} flex items-center justify-center ${style.iconClass} group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}
                  >
                    <span className="material-symbols-outlined !text-4xl select-none">
                      {icon}
                    </span>
                  </div>
                  {/* Label */}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors text-center max-w-[80px] leading-tight">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-on-surface-variant text-sm">
            No services listed yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularServices;
