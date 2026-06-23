"use client";

import { useEffect, useState } from "react";
import { listProducts, type Product } from "@/services/product.service";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listProducts({ limit: "8" })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

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

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shrink-0 w-72 md:w-auto flex-1 h-80 bg-surface-container-low rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div 
            id="products-grid"
            className="flex md:grid md:grid-cols-4 gap-8 overflow-x-auto md:overflow-x-visible hide-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0"
          >
            {products.map((product) => {
              // Normalize API product to match ProductCard's expected shape
              const normalized = {
                ...product,
                id: product._id,
                slug: product._id,
                title: product.name,
                isSale: product.discount ? product.discount > 0 : false,
                oldPrice: product.mrp,
              };
              return (
                <div key={product._id} className="shrink-0 w-72 md:w-auto">
                  <ProductCard product={normalized as any} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant text-sm">
            No products available yet. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
