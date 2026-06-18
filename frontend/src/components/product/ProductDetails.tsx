import type { Product } from "@/types/product.types";

export function ProductDetails({ product }: { product: Product }) {
  return <section className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm"><h1 className="text-3xl font-semibold text-on-surface">{product.name}</h1><p className="mt-2 text-sm text-on-surface-variant">{product.description}</p></section>;
}
