"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { ServicesHero } from "@/components/service/ServicesHero";
import { ServiceGrid } from "@/components/service/ServiceGrid";
import { listServices, type Service } from "@/services/service.service";
import type { Service as ServiceType } from "@/types/service.types";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [allServices, setAllServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch services from API on mount
  useEffect(() => {
    listServices()
      .then((apiServices: Service[]) => {
        const normalized: ServiceType[] = apiServices.map((s) => ({
          slug: s._id,
          label: s.title || (s as any).label || s.category,
          icon: "spa",
          description: s.description,
          price: s.price,
          duration: typeof s.duration === "number" ? `${s.duration} mins` : s.duration,
          rating: 4.8,
          category: s.category?.toLowerCase() || "wellness",
          image: s.image,
        }));
        setAllServices(normalized);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    { label: "All", value: "all" },
    { label: "Haircare", value: "hair" },
    { label: "Skincare", value: "skin" },
    { label: "Massage & Wellness", value: "wellness" },
    { label: "Nails Atelier", value: "nails" },
    { label: "Makeup Glam", value: "makeup" },
  ];

  const filteredServices = useMemo(() => {
    let result = [...allServices];

    if (selectedCategory !== "all") {
      result = result.filter(
        (service) => service.category?.toLowerCase() === selectedCategory
      );
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.label.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.label.localeCompare(b.label));
    }

    return result;
  }, [allServices, selectedCategory, sortBy, searchQuery]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-24 md:pb-12">
        <Container>
          <ServicesHero />

          <div id="services-list-section" className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 select-none scroll-mt-28">
            <div>
              <h2 className="text-on-background font-bold text-2xl md:text-3xl tracking-tight">
                Services Menu
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
                Browse our premium salon services
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface transition-all"
                />
              </div>

              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="text-primary hover:text-primary-container font-semibold text-sm flex items-center gap-2 select-none active:scale-95 transition-all duration-200 cursor-pointer border border-outline-variant/10 bg-surface-container-lowest py-2.5 px-4 rounded-2xl shadow-sm"
                >
                  Sort
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>
                    filter_list
                  </span>
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl border border-outline-variant/10 shadow-xl p-3.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1">
                      {[
                        { label: "Default", value: "default" },
                        { label: "Price: Low to High", value: "price-asc" },
                        { label: "Price: High to Low", value: "price-desc" },
                        { label: "Name: A - Z", value: "name-asc" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                          className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            sortBy === option.value
                              ? "bg-primary/5 text-primary"
                              : "text-on-surface hover:bg-surface-container-low"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar select-none mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => {
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-surface-container-low rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ServiceGrid services={filteredServices} />
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}