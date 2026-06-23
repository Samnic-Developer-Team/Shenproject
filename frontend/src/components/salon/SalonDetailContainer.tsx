"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { SalonHero } from "./SalonHero";
import { SalonTabs } from "./SalonTabs";
import { SalonServiceList } from "./SalonServiceList";
import { SalonInfo } from "./SalonInfo";
import { SalonReviews } from "./SalonReviews";
import { SalonGallery } from "./SalonGallery";
import { SalonLocation } from "./SalonLocation";
import { SalonVibes } from "./SalonVibes";
import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { listServices } from "@/services/service.service";
import type { Salon } from "@/types/salon.types";
import type { Service } from "@/types/service.types";


interface SalonDetailContainerProps {
  salon: Salon;
}

export function SalonDetailContainer({ salon }: SalonDetailContainerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("services");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("02:30 PM");

  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    listServices({ sellerId: salon.slug })
      .then((apiServices) => {
        const normalized = apiServices.map((s) => ({
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
        setServicesList(normalized);
      })
      .catch(console.error)
      .finally(() => setIsLoadingServices(false));
  }, [salon.slug]);


  const handleToggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.slug === service.slug);
      if (exists) {
        return prev.filter((s) => s.slug !== service.slug);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleConfirmBooking = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    const serviceSlugs = selectedServices.map((s) => s.slug).join(",");
    router.push(
      `/booking?salon=${salon.slug}&services=${serviceSlugs}&date=${selectedDate}&time=${encodeURIComponent(
        selectedTimeSlot
      )}`
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Details Wrapper */}
      <main className="flex-grow pb-24 md:pb-12">
        {/* Editorial Cover Banner */}
        <SalonHero salon={salon} />

        <Container>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Tab Selector */}
              <SalonTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* Dynamic Tab Panel */}
              <div className="mt-6">
                {activeTab === "services" && (
                  isLoadingServices ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-28 bg-surface-container-low rounded-3xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <SalonServiceList
                      services={servicesList}
                      selectedServices={selectedServices}
                      onToggleService={handleToggleService}
                    />
                  )
                )}
                {activeTab === "products" && (
                  <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm text-center py-12 select-none">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                      shopping_bag
                    </span>
                    <h4 className="font-bold text-on-surface text-lg">
                      Salon Products Boutique
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-2 max-w-sm mx-auto">
                      Premium care hair oils, growth droppers, and repair styling serums available at the counter.
                    </p>
                  </div>
                )}
                {activeTab === "reviews" && <SalonReviews targetId={salon.slug} type="SALON" />}
                {activeTab === "about" && (
                  <div className="space-y-8">
                    <SalonInfo salon={salon} />
                    <SalonGallery salon={salon} />
                  </div>
                )}
              </div>

              {/* Vibe Chips Section */}
              <SalonVibes />
            </div>

            {/* Right Sticky Sidebar Column */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Sticky Booking Selector Card */}
                <BookingSidebar
                  selectedServices={selectedServices}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  setSelectedTimeSlot={setSelectedTimeSlot}
                  onConfirmBooking={handleConfirmBooking}
                />

                {/* Stylized Location Card */}
                <SalonLocation salon={salon} />
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}

export default SalonDetailContainer;
