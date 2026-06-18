"use client";

interface ProductCategoriesProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Skincare", value: "skincare" },
  { label: "Haircare", value: "haircare" },
  { label: "Makeup", value: "makeup" },
  { label: "Nails", value: "nails" },
];

export function ProductCategories({
  selectedCategory,
  setSelectedCategory,
}: ProductCategoriesProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar select-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category.value;
        return (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`shrink-0 px-8 py-3 rounded-full text-sm transition-all duration-300 active:scale-95 cursor-pointer ${
              isActive
                ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                : "bg-surface-container-lowest text-on-surface font-medium border border-outline-variant/10 hover:bg-primary-fixed hover:text-on-primary-fixed hover:border-transparent"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

export default ProductCategories;
