"use client";

import { useEffect, useState } from "react";
import { listSalons, type Seller } from "@/services/salon.service";
import { SalonCard } from "@/components/salon/SalonCard";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Salon } from "@/types/salon.types";

export default function Page() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listSalons()
      .then((sellers: Seller[]) => {
        const normalized: Salon[] = sellers.map((s) => ({
          slug: s._id,
          name: s.salonName,
          rating: "4.8",
          distance: `${s.city}, ${s.state}`,
          price: "₹₹₹",
          description: s.bio || "",
          location: `${s.city}, ${s.state}`,
          image: s.shopImage,
        }));
        setSalons(normalized);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-24 md:pb-12">
        <Container>
          <SectionTitle title="Salons & Studios" description="Discover beauty salons, wellness spas, and grooming studios near you." />
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-surface-container-low rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : salons.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {salons.map((salon) => (
                <SalonCard key={salon.slug} salon={salon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">spa</span>
              <p className="font-semibold">No salons registered yet.</p>
              <p className="text-sm mt-1">Check back soon or become a seller!</p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}