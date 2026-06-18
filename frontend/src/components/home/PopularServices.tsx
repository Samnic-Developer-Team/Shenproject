import Link from "next/link";
import { services } from "@/data/services";

// Mappings for specific styles described in Figma reference
const serviceStyles: Record<string, { bgClass: string; iconClass: string }> = {
  haircut: {
    bgClass: "bg-secondary-fixed",
    iconClass: "text-on-secondary-fixed-variant",
  },
  facial: {
    bgClass: "bg-violet-100",
    iconClass: "text-primary",
  },
  massage: {
    bgClass: "bg-orange-100",
    iconClass: "text-orange-600",
  },
  nails: {
    bgClass: "bg-green-100",
    iconClass: "text-green-700",
  },
  makeup: {
    bgClass: "bg-blue-100",
    iconClass: "text-blue-700",
  },
};

export function PopularServices() {
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

        {/* Scrollable Categories List */}
        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
          {services.map((service) => {
            const style = serviceStyles[service.slug] || {
              bgClass: "bg-surface-container-low",
              iconClass: "text-primary",
            };

            return (
              <div 
                key={service.slug} 
                className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer"
              >
                {/* Circle Container */}
                <div 
                  className={`w-20 h-20 rounded-full ${style.bgClass} flex items-center justify-center ${style.iconClass} group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}
                >
                  <span className="material-symbols-outlined !text-4xl select-none" data-icon={service.icon}>
                    {service.icon}
                  </span>
                </div>
                {/* Label */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
                  {service.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default PopularServices;
