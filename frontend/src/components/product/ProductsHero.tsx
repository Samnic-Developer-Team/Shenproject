"use client";

import Image from "next/image";

export function ProductsHero() {
  const handleScrollToBoutique = () => {
    const boutiqueSection = document.getElementById("boutique-section");
    if (boutiqueSection) {
      boutiqueSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative mb-16 overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant/10">
      <div className="grid md:grid-cols-2 items-center">
        {/* Left Side Content */}
        <div className="p-8 sm:p-12 md:p-16 z-10 flex flex-col justify-center">
          <span className="text-secondary font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 block animate-fade-in">
            Summer Edit 2024
          </span>
          <h1 className="text-primary font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Radiance Reimagined.
          </h1>
          <p className="text-on-surface-variant text-base sm:text-lg mb-8 max-w-md leading-relaxed">
            Curated selection of global clinical brands, exclusively sourced for the Indian atelier.
          </p>
          <div>
            <button
              onClick={handleScrollToBoutique}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-primary/20 active:scale-98 cursor-pointer select-none"
            >
              Explore Collections
            </button>
          </div>
        </div>

        {/* Right Side Image Showcase */}
        <div className="relative h-[350px] sm:h-[450px] md:h-[600px] w-full overflow-hidden">
          <img
            alt="Beauty Product Showcase"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR1DXk_kWir6pXEXSy91OTlXazy8zvfCegg2E-z4_Z0tY3Ai8moe0q0qlj_OFocJTBsCdo5ryT3kzg-KjNopdAl5DUjfUxPcNoBe-sPOAyeIKaaMddVxqzifvI1wY7JmgY69Ze_UIvIbGVARyqaVaI7xriJykX-JpU72EZvzOmn9Bb7ECZahpz36QzbT9dQWNVwml-Le_fmrj-ptzaEUTOwIOo3GRV_lMNwIlK4x_YEu1vfnFe3wUR5ZGtyOUQi_hGoyErBPDdYQ"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
          />
          {/* Subtle soft gradient reflection overlay to enhance premium look */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

export default ProductsHero;
