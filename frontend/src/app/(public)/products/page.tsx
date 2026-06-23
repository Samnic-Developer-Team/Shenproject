"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { ProductsHero } from "@/components/product/ProductsHero";
import { ProductCategories } from "@/components/product/ProductCategories";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { listProducts, type Product } from "@/services/product.service";
import type { Product as ProductType } from "@/types/product.types";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listProducts()
      .then((apiProducts: Product[]) => {
        // Normalize API products to the ProductType used by ProductGrid
        const normalized: ProductType[] = apiProducts.map((p) => ({
          id: p._id,
          slug: p._id,
          name: p.name,
          title: p.name,
          brand: p.brand,
          price: p.price,
          oldPrice: p.mrp,
          isSale: p.discount ? p.discount > 0 : false,
          category: p.category?.toLowerCase(),
          image: p.image,
          description: p.description,
        }));
        setAllProducts(normalized);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Filter and sort products dynamically
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category?.toLowerCase() === selectedCategory
      );
    }

    if (showSaleOnly) {
      result = result.filter((product) => product.isSale);
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price).replace(/[^\d]/g, "")) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price).replace(/[^\d]/g, "")) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price).replace(/[^\d]/g, "")) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price).replace(/[^\d]/g, "")) || 0;
        return priceB - priceA;
      });
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => {
        const nameA = (a.title || a.name || "").toLowerCase();
        const nameB = (b.title || b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    return result;
  }, [allProducts, selectedCategory, sortBy, showSaleOnly]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-24 md:pb-12">
        <Container>
          <ProductsHero />

          <div id="boutique-section" className="flex items-center justify-between mb-6 scroll-mt-28 select-none">
            <div>
              <h2 className="text-on-background font-bold text-2xl md:text-3xl tracking-tight">
                The Boutique
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
                Browse by category
              </p>
            </div>
            <ProductFilters
              sortBy={sortBy}
              setSortBy={setSortBy}
              showSaleOnly={showSaleOnly}
              setShowSaleOnly={setShowSaleOnly}
            />
          </div>

          <div className="mb-12">
            <ProductCategories
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 bg-surface-container-low rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}