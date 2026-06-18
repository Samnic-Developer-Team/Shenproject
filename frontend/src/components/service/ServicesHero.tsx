"use client";

export function ServicesHero() {
  const handleScrollToServices = () => {
    const listSection = document.getElementById("services-list-section");
    if (listSection) {
      listSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative mb-16 overflow-hidden rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant/10">
      <div className="grid md:grid-cols-2 items-center">
        {/* Left Content Side */}
        <div className="p-8 sm:p-12 md:p-16 z-10 flex flex-col justify-center">
          <span className="text-secondary font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 block">
            Treatment Edit 2026
          </span>
          <h1 className="text-primary font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Elegance Defined. Wellness Refined.
          </h1>
          <p className="text-on-surface-variant text-base sm:text-lg mb-8 max-w-md leading-relaxed">
            Step into our world of elite styling, clinical skincare, and luxury nail art ateliers, designed for post-salon restoration.
          </p>
          <div>
            <button
              onClick={handleScrollToServices}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-primary/20 active:scale-98 cursor-pointer select-none"
            >
              Explore Services
            </button>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="relative h-[350px] sm:h-[450px] md:h-[600px] w-full overflow-hidden">
          <img
            alt="Luxury Spa & Studio Session"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBWnw-mcpKb0Dmdhn3eTTntMK3D3Qe-gbs1fO8ip5JUt5BHqgBpvDpPxIX4t4-IjVzSfZJiy-YZ1p6RyBTC71ywMWe5E_u44yLQWRX9wFAPFXNuU1hEPE8cgrk99f8HelLSQnLtKeEGNdlAMElmn9yENlTerb7g2EiEvjh12vYGeHar5CywdsrcsLDJysqmSFRZyUV8Qn_j278NTz0R2pKHDuJYqFHjCBCW5Z0hWLyp7y0OTTtJtZwSmt_yEcRo3fbLB3wjZHeHw"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

export default ServicesHero;
