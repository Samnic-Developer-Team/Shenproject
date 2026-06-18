"use client";

import Link from "next/link";

export interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  brand: string;
  price: number;
  oldPrice?: number;
  isSale?: boolean;
  slug: string;
}

export function ProductCard({
  id,
  title,
  image,
  brand,
  price,
  oldPrice,
  isSale,
  slug,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added product to cart:", title);
    alert(`"${title}" added to cart!`);
  };

  return (
    <div className="group flex flex-col space-y-4 select-none">
      {/* Product Image and Overlay Wrapper */}
      <Link href={`/products/${slug}`} className="relative block aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container-low border border-outline-variant/10 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer">
        {image ? (
          <img
            alt={title}
            src={image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl select-none">
              shopping_basket
            </span>
          </div>
        )}

        {/* Sale Badge */}
        {isSale && (
          <span className="absolute top-4 left-4 bg-secondary text-on-secondary px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
            Sale
          </span>
        )}

        {/* Add to Cart Overlay Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center border border-outline-variant/10"
        >
          <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>
            add_shopping_cart
          </span>
        </button>
      </Link>

      {/* Brand & Info */}
      <div className="flex flex-col px-1.5">
        <span className="text-on-surface-variant text-[10px] uppercase font-extrabold tracking-widest block">
          {brand}
        </span>
        <Link href={`/products/${slug}`} className="cursor-pointer">
          <h3 className="text-on-surface font-bold text-base mt-1.5 hover:text-primary transition-colors duration-200 line-clamp-1">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-primary font-black text-base">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {oldPrice && (
            <span className="text-outline text-xs line-through font-medium">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
