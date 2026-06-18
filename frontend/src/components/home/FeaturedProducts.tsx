"use client";

import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const handleScroll = (direction: "left" | "right") => {
    const grid = document.getElementById("products-grid");
    if (grid) {
      const scrollAmount = direction === "left" ? -350 : 350;
      grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 select-none">
          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-3">
              Shop Your Glow.
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              Premium skincare and beauty products curated by our top artists for your post-salon care.
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll("left")}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container hover:border-primary/20 hover:text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">chevron_left</span>
            </button>
            <button 
              onClick={() => handleScroll("right")}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container hover:border-primary/20 hover:text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Products Grid (scrollable on mobile, grid on desktop) */}
        <div 
          id="products-grid"
          className="flex md:grid md:grid-cols-4 gap-8 overflow-x-auto md:overflow-x-visible hide-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {products.map((product) => (
            <div key={product.slug} className="shrink-0 w-72 md:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;
