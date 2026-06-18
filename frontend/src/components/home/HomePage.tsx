"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { HeroSection } from "./HeroSection";
import { PopularServices } from "./PopularServices";
import { FeaturedSalons } from "./FeaturedSalons";
import { FeaturedProducts } from "./FeaturedProducts";
import { MembershipBanner } from "./MembershipBanner";
import { BecomeSellerSection } from "./BecomeSellerSection";
import { NewsletterSection } from "./NewsletterSection";

export function HomePage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Premium Glass Header & Navigation */}
      <Navbar />
      
      {/* Main Content Areas */}
      <main className="flex-grow pt-20 pb-24 md:pb-0">
        <HeroSection />
        <PopularServices />
        <FeaturedSalons />
        <FeaturedProducts />
        <MembershipBanner />
        <BecomeSellerSection />
        <NewsletterSection />
      </main>

      {/* Floating Action Button (FAB) for Quick booking/AI recommendation */}
      <button 
        onClick={() => alert("Quick Booking Assistant opening...")}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-primary to-primary-container text-on-primary p-4 rounded-full shadow-2xl z-30 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-primary/20 cursor-pointer"
      >
        <span className="material-symbols-outlined !text-3xl select-none" data-icon="bolt">
          bolt
        </span>
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;