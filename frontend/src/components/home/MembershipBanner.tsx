import Link from "next/link";

export function MembershipBanner() {
  return (
    <section className="py-8 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="relative bg-radial from-slate-900 via-violet-950 to-slate-950 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-white/5 select-none">
          
          {/* Ambient Lighting Overlay */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-secondary-fixed-dim font-bold text-xs uppercase tracking-widest mb-3 block">
                Exclusive Membership
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Unlock GlowHub Pass & Save on Every Visit
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Enjoy priority booking slots, unlimited free cancellations, and a flat 15% cashback on beauty products and premium treatments.
              </p>
            </div>

            {/* Glassmorphic Pricing/Perk card */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full sm:w-80 flex flex-col gap-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Annual Pass</span>
                <span className="bg-secondary-container/90 text-on-secondary-fixed text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                  Best Value
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">₹999</span>
                <span className="text-white/50 text-xs font-medium">/ year</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  15% instant savings on all salons
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  Free product samples on every order
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  Priority artist reservations
                </li>
              </ul>
              <Link 
                href="/membership"
                className="bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center hover:opacity-90 active:scale-95 transition-all shadow-md mt-2"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MembershipBanner;
