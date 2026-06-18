"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { ExploreHero } from "@/components/explore/ExploreHero";
import { SalonCard } from "@/components/salon/SalonCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { salons } from "@/data/salons";
import { services } from "@/data/services";
import { BecomeSellerSection } from "@/components/home/BecomeSellerSection";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"salons" | "services">("salons");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dynamic lists filtering
  const filteredSalons = useMemo(() => {
    let result = [...salons];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (salon) =>
          salon.name.toLowerCase().includes(q) ||
          salon.location?.toLowerCase().includes(q) ||
          salon.description?.toLowerCase().includes(q)
      );
    }

    if (selectedLocation !== "all") {
      result = result.filter((salon) =>
        salon.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    return result;
  }, [searchQuery, selectedLocation]);

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.label.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (service) => service.category?.toLowerCase() === selectedCategory
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Navigation Header */}
      <Navbar />

      {/* Explore Contents */}
      <main className="flex-grow pt-28 pb-24 md:pb-12">
        <Container>
          {/* Premium Search Hero */}
          <ExploreHero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholderText={
              activeTab === "salons"
                ? "Search salons by name, location, or features..."
                : "Search beauty treatments, hair styling, facials..."
            }
          />

          {/* Tab Navigation & Sub-Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-outline-variant/10 pb-6 mb-10 gap-6 select-none">
            {/* Tab switchers */}
            <div className="flex bg-surface-container-low p-1.5 rounded-2xl self-start">
              <button
                onClick={() => {
                  setActiveTab("salons");
                  setSearchQuery("");
                }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === "salons"
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                Salons Ateliers
              </button>
              <button
                onClick={() => {
                  setActiveTab("services");
                  setSearchQuery("");
                }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === "services"
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                Services Boutique
              </button>
            </div>

            {/* Sub-Filters dropdowns */}
            <div className="flex items-center gap-4">
              {activeTab === "salons" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-on-surface-variant">Location:</span>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface transition-all cursor-pointer"
                  >
                    <option value="all">All Locations</option>
                    <option value="itanagar">Itanagar</option>
                    <option value="guwahati">Guwahati</option>
                    <option value="papum">Papum Pare</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-on-surface-variant">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface transition-all cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="hair">Haircare</option>
                    <option value="skin">Skincare</option>
                    <option value="wellness">Massage & Wellness</option>
                    <option value="nails">Nails Atelier</option>
                    <option value="makeup">Makeup Glam</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Grids Display Area */}
          {activeTab === "salons" ? (
            filteredSalons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4 text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
                  sentiment_neutral
                </span>
                <p className="text-lg font-bold">No salons found</p>
                <p className="text-sm mt-1 text-outline">Try search queries or choosing another neighborhood.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSalons.map((salon) => (
                  <SalonCard key={salon.slug} salon={salon} />
                ))}
              </div>
            )
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
                sentiment_neutral
              </span>
              <p className="text-lg font-bold">No services found</p>
              <p className="text-sm mt-1 text-outline">Try search queries or choosing another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          )}
        </Container>

        {/* Become a Salon Seller marketing section */}
        <div className="mt-16 md:mt-24">
          <BecomeSellerSection />
        </div>
      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}
