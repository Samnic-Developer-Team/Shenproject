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

  const discountPercent = product.oldPrice && Number(product.oldPrice) > Number(product.price)
    ? Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block bg-surface-container-lowest rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group select-none border border-outline-variant/10 cursor-pointer flex flex-col h-full"
    >
      {/* Product Image and Overlay Wrapper */}
      <div className="aspect-[4/5] bg-surface-container-low rounded-2xl mb-4 overflow-hidden relative shadow-inner">
        {product.image ? (
          <img 
            alt={product.name} 
            src={product.image}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl select-none">shopping_basket</span>
          </div>
        )}

        {/* Gradient Overlay for Image Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Sale / Discount Badge */}
        {product.isSale && (
          <div className="absolute top-3 left-3 bg-error text-on-error font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
            Sale
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-secondary text-on-secondary font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Add to Cart Overlay Button */}
        <button 
          onClick={handleCartClick}
          className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md text-on-surface py-3 rounded-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white transition-all duration-300 font-extrabold text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span className="material-symbols-outlined text-base select-none">shopping_cart</span>
          Add to Cart
        </button>
      </div>

      {/* Brand & Info */}
      <div className="px-1.5 flex flex-col flex-grow">
        <span className="text-[10px] uppercase font-black text-secondary tracking-widest block opacity-75">
          {product.brand}
        </span>
        
        <h4 className="text-base font-bold text-on-surface mt-1.5 group-hover:text-primary transition-colors line-clamp-2 min-h-[44px] leading-snug">
          {product.name}
        </h4>
        
        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-outline-variant/5">
          <span className="text-primary font-extrabold text-lg">
            ₹{product.price}
          </span>
          {product.oldPrice && Number(product.oldPrice) > Number(product.price) && (
            <span className="text-outline text-xs line-through font-medium">
              ₹{product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
