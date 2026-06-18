"use client";

interface SalonTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: "services", label: "Services" },
  { id: "products", label: "Products" },
  { id: "reviews", label: "Reviews" },
  { id: "about", label: "About" },
];

export function SalonTabs({ activeTab, setActiveTab }: SalonTabsProps) {
  return (
    <div className="flex items-center space-x-8 border-b border-outline-variant/20 overflow-x-auto hide-scrollbar select-none">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
              isActive
                ? "font-extrabold border-b-2 border-primary text-primary"
                : "font-semibold text-slate-500 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default SalonTabs;
