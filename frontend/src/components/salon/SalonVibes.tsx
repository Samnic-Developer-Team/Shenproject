"use client";

interface Vibe {
  icon: string;
  label: string;
  bgClass: string;
  iconClass: string;
}

const VIBES: Vibe[] = [
  {
    icon: "favorite",
    label: "Bridal",
    bgClass: "bg-secondary-fixed",
    iconClass: "text-on-secondary-fixed-variant",
  },
  {
    icon: "spa",
    label: "Minimalist",
    bgClass: "bg-primary-fixed",
    iconClass: "text-on-primary-fixed-variant",
  },
  {
    icon: "celebration",
    label: "Festive",
    bgClass: "bg-tertiary-fixed",
    iconClass: "text-on-tertiary-fixed-variant",
  },
  {
    icon: "auto_awesome",
    label: "Daily Glow",
    bgClass: "bg-surface-container-highest",
    iconClass: "text-on-surface-variant",
  },
];

export function SalonVibes() {
  const handleVibeClick = (label: string) => {
    console.log("Selected vibe:", label);
  };

  return (
    <div className="py-8 border-t border-outline-variant/10 select-none">
      <h3 className="text-lg font-bold text-on-surface mb-6">Choose Your Vibe</h3>
      <div className="flex flex-wrap gap-6 sm:gap-8">
        {VIBES.map((vibe) => (
          <div
            key={vibe.label}
            onClick={() => handleVibeClick(vibe.label)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            {/* Circle */}
            <div
              className={`w-20 h-20 rounded-full ${vibe.bgClass} flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 ${vibe.iconClass}`}
            >
              <span className="material-symbols-outlined !text-3xl select-none">
                {vibe.icon}
              </span>
            </div>
            {/* Label */}
            <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">
              {vibe.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalonVibes;
