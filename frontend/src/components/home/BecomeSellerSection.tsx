"use client";

import Link from "next/link";

export function BecomeSellerSection() {
  return (
    <section className="bg-gradient-to-br from-[#f8f9fe] via-[#f1f4ff] to-[#faf8ff] border-t border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Marketing Info */}
        <div className="lg:col-span-7 space-y-8 select-none">
          <div className="space-y-4">
            <span className="bg-violet-100 text-primary border border-violet-200 text-xs font-black uppercase px-3.5 py-1.5 rounded-full tracking-wider block w-fit">
              Partner With Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-tight">
              Grow Your Beauty Salon <br />
              & Wellness Business
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant font-medium max-w-xl leading-relaxed">
              List your premium services, schedule calendar bookings, manage physical product orders, and track your daily payouts with Shena Seller. Join 10,000+ beauty studios expanding their clientele.
            </p>
          </div>

          {/* Core Benefits List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            {[
              { icon: "schedule", title: "24/7 Appointments", desc: "No more phone tags. Clients book slots online anytime." },
              { icon: "inventory_2", title: "List Retail Products", desc: "Sell hair serums, glow mists, and luxury cosmetics." },
              { icon: "query_stats", title: "Real-time Analytics", desc: "Monitor booking trends, top services, and earnings." },
              { icon: "account_balance_wallet", title: "Weekly Direct Payouts", desc: "Secure automated earnings directly to your bank account." }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-outline-variant/10 shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-base select-none">{benefit.icon}</span>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-on-surface">{benefit.title}</h4>
                  <p className="text-[11px] text-outline font-medium mt-0.5 leading-snug">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/seller/register"
              className="px-8 py-4 bg-gradient-to-r from-primary to-[#5a00c6] hover:opacity-[0.97] text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">person_add</span>
              REGISTER YOUR SALON
            </Link>
            <Link
              href="/seller/login"
              className="px-8 py-4 bg-white border border-outline-variant/20 text-on-surface hover:text-primary hover:border-primary/40 rounded-2xl text-xs font-extrabold shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">login</span>
              SELLER SIGN IN
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Dashboard Mockup Card */}
        <div className="lg:col-span-5 relative">
          
          {/* Decorative Backdrops */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Mockup Card */}
          <div className="relative bg-white border border-outline-variant/15 rounded-[36px] shadow-2xl p-6 space-y-6 overflow-hidden select-none">
            
            {/* Mock Header */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-primary font-black text-xs">
                  LA
                </div>
                <div>
                  <h4 className="text-xs font-black text-on-surface leading-none">Lavender Spa</h4>
                  <span className="text-[9px] text-outline font-black mt-0.5 tracking-wider block uppercase">Spa Partner</span>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f6f8fd] border border-outline-variant/5 rounded-2xl p-3.5">
                <span className="text-[9px] font-black uppercase text-outline tracking-wider block">Today's Bookings</span>
                <span className="text-xl font-black text-on-surface mt-1 block">12</span>
              </div>
              <div className="bg-[#f6f8fd] border border-outline-variant/5 rounded-2xl p-3.5">
                <span className="text-[9px] font-black uppercase text-outline tracking-wider block">Weekly Earnings</span>
                <span className="text-xl font-black text-primary mt-1 block">₹69,000</span>
              </div>
            </div>

            {/* Booking Slot mock card */}
            <div className="bg-gradient-to-br from-primary to-[#5a00c6] rounded-2xl p-4 text-white space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-white/70">
                <span>Incoming Appointment</span>
                <span>Now</span>
              </div>
              <div>
                <h5 className="text-xs font-black">Ananya P. • Bridal Glow Facial</h5>
                <p className="text-[10px] text-white/80 font-medium mt-1">Scheduled for Today at 02:30 PM</p>
              </div>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 py-1.5 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer">
                  Accept
                </button>
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer">
                  Decline
                </button>
              </div>
            </div>

            {/* Bottom Chart Indicator */}
            <div className="space-y-2 pt-1">
              <span className="text-[9px] font-black uppercase text-outline tracking-wider block">Real-time Traffic</span>
              <div className="flex items-end justify-between h-12 pt-2 px-1">
                {[30, 45, 25, 60, 90, 40, 75].map((h, i) => (
                  <div key={i} className="w-4 rounded-t bg-violet-100 relative h-full">
                    <div 
                      className={`absolute bottom-0 left-0 w-full rounded-t ${i === 4 ? "bg-primary" : "bg-primary/30"}`} 
                      style={{ height: `${h}%` }} 
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
          
        </div>

      </div>
    </section>
  );
}

export default BecomeSellerSection;
