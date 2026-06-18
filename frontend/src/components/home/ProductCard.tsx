"use client";

import Link from "next/link";
import type { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.log("Added product to cart:", product.name);
      alert(`"${product.name}" added to cart!`);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group select-none">
      {/* Product Image and Overlay Wrapper */}
      <div className="aspect-[4/5] bg-surface-container-low rounded-2xl mb-4 overflow-hidden relative">
        {product.image ? (
          <img 
            alt={product.name} 
            src={product.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl select-none">shopping_basket</span>
          </div>
        )}

        {/* Add to Cart Overlay Button */}
        <button 
          onClick={handleCartClick}
          className="absolute bottom-4 left-4 right-4 bg-on-surface text-surface py-3.5 rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
        >
          Add to Cart
        </button>
      </div>

      {/* Brand & Info */}
      <div className="px-1.5 pb-2">
        <span className="text-[10px] uppercase font-black text-secondary tracking-widest block">
          {product.brand}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h4 className="text-lg font-bold text-on-surface mt-1 hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h4>
        </Link>
        <p className="text-primary font-extrabold text-xl mt-2">
          {product.price}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
