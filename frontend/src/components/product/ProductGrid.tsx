"use client";

import type { Product } from "@/types/product.types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-4 text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
          sentiment_neutral
        </span>
        <p className="text-lg font-bold">No products found</p>
        <p className="text-sm mt-1 text-outline">Try choosing another category or clearing filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
      {products.map((product) => {
        // Safely parse price and oldPrice to numbers
        const priceNum = typeof product.price === "number"
          ? product.price
          : parseFloat(String(product.price).replace(/[^\d]/g, "")) || 0;

        const oldPriceNum = product.oldPrice
          ? (typeof product.oldPrice === "number"
              ? product.oldPrice
              : parseFloat(String(product.oldPrice).replace(/[^\d]/g, "")) || undefined)
          : undefined;

        return (
          <ProductCard
            key={product.slug}
            id={product.id || product.slug}
            title={product.title || product.name}
            image={product.image || ""}
            brand={product.brand}
            price={priceNum}
            oldPrice={oldPriceNum}
            isSale={product.isSale}
            slug={product.slug}
          />
        );
      })}
    </div>
  );
}

export default ProductGrid;
