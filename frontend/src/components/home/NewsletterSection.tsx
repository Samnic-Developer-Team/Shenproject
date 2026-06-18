"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    alert(`Thank you for subscribing! We've sent an access link to ${email}`);
    setEmail("");
  };

  return (
    <section className="py-24 container mx-auto px-6 max-w-7xl overflow-hidden">
      <div className="relative bg-primary rounded-3xl p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden shadow-2xl">
        
        {/* Soft Decorative Gradient Circle */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-l from-fuchsia-400 to-transparent"></div>
        </div>

        {/* Text Content Block */}
        <div className="flex-1 relative z-10 text-on-primary">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Join the Atelier.
          </h2>
          <p className="text-on-primary-container text-base md:text-lg mb-10 max-w-md opacity-90 leading-relaxed font-medium">
            Get exclusive early access to curated salon drops, limited edition products, and beauty tips from India's top artists.
          </p>
          
          {/* Email Subscription Form */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="bg-primary-container/40 border border-on-primary-container/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white outline-none text-on-primary placeholder:text-on-primary-container/60 w-full sm:w-auto flex-1 font-medium text-sm transition-all"
            />
            <button 
              type="submit"
              className="bg-surface text-primary font-extrabold px-8 py-4 rounded-2xl hover:bg-surface-bright active:scale-95 shadow-md transition-all cursor-pointer text-sm"
            >
              Join Now
            </button>
          </form>
        </div>

        {/* Image & Floating Member Perks Card */}
        <div className="flex-1 w-full relative">
          <div className="relative w-full aspect-square md:aspect-[4/5] max-w-sm mx-auto">
            <img 
              alt="Atelier community of beautiful models with artistic makeup" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASb6V23J08ZQy2zKhKxCzDwJvpUSnsxB4si8s2BoOKAAXJYFrphabckTRBdfK57b9i9f2EYY8GSVLpiE3NuNTz71xe9UEuaucp6Px6G-j_0ARYofWiDquEIXUjeEPnthlBv_lrB13rk_15fDvPrQmld4SPAxXHMhlf6yfhz0vPp4A5apZtYtUNKOLzSTfwezdKP0B34SwD5t-2UWcrct5J8zhqqJ49eL-pffmCtNidx_lJ5UtTa1-KoKMyTV1VLOLMvfNhmY8fPg"
              className="w-full h-full object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 select-none"
            />
            {/* Rotated Perks Card (Hidden on mobile) */}
            <div className="absolute -bottom-6 -left-8 bg-secondary text-on-secondary p-6 rounded-3xl shadow-2xl -rotate-6 hidden md:block hover:rotate-0 transition-transform duration-300 select-none border border-white/10">
              <p className="text-[10px] font-black tracking-widest text-on-secondary-fixed opacity-90">MEMBER PERKS</p>
              <p className="text-3xl font-black text-white my-1">20% OFF</p>
              <p className="text-[10px] opacity-90 uppercase font-black tracking-wider text-secondary-fixed">First Booking</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default NewsletterSection;
