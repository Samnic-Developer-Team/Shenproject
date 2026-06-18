"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { ProductsHero } from "@/components/product/ProductsHero";
import { ProductCategories } from "@/components/product/ProductCategories";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  // Filter and sort products dynamically
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category?.toLowerCase() === selectedCategory
      );
    }

    // Filter by sale only
    if (showSaleOnly) {
      result = result.filter((product) => product.isSale);
    }

    // Apply sorting
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
  }, [selectedCategory, sortBy, showSaleOnly]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Premium Glass Header & Navigation */}
      <Navbar />

      {/* Main Marketplace Area */}
      <main className="flex-grow pt-28 pb-24 md:pb-12">
        <Container>
          {/* Editorial Split Hero Section */}
          <ProductsHero />

          {/* Boutique Filter & Navigation Section */}
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

          {/* Category Pill Controls */}
          <div className="mb-12">
            <ProductCategories
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {/* Premium Product Grid */}
          <ProductGrid products={filteredProducts} />
        </Container>
      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}