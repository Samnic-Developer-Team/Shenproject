"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { services as allServices } from "@/data/services";
import { salons as allSalons } from "@/data/salons";
import type { Service } from "@/types/service.types";
import type { Salon } from "@/types/salon.types";

export function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ----------------------------------------------------
  // States
  // ----------------------------------------------------
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Schedule, 2: Confirm, 3: Payment, 4: Success
  const [selectedDate, setSelectedDate] = useState("2024-10-15"); // default YYYY-MM-DD
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("11:30 AM");
  
  // Calendar month selection
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: October is 9

  // Contact Info Step (Step 2)
  const [contactInfo, setContactInfo] = useState({
    firstName: "Kishan",
    lastName: "Kumar",
    email: "kishan@example.com",
    phone: "+91 98765 43210",
    notes: "",
  });

  // Payment Step (Step 3)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "salon">("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [upiId, setUpiId] = useState("");

  const [bookingId, setBookingId] = useState("");

  // Loading animation state for payment simulation
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // ----------------------------------------------------
  // Parse Query Parameters / Default Mock Data
  // ----------------------------------------------------
  const bookingData = useMemo(() => {
    const salonSlug = searchParams.get("salon");
    const serviceSlugs = searchParams.get("services")?.split(",") || [];
    const dateParam = searchParams.get("date");
    const timeParam = searchParams.get("time");

    // Resolve Salon
    let salon: Salon | undefined = allSalons.find((s) => s.slug === salonSlug);
    if (!salon) {
      // Default fallback salon
      salon = {
        slug: "shena-atelier",
        name: "Shena Atelier",
        location: "GS Road, Guwahati",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3U--B6Fg150P23L0X7vArxGc3SEsTB22EKyAJ8I5CiVuYSdeCvR1sM7IL9O6N5Req9Pn76s1jSh4_F-WLwVbJb0S4ZynaanN8A0avba9tW25W3TKZ1tIG8wCRsSAw95udWGCjbwg8xTuiddoMO6DoxV0eY0HBQqg8-ec8K5k7qHeUwEvWBFgcmsp72y-7i0ZEPWUyYl0cmmVji-5kXvBqkpn--WayanFFq9EQwYMYhMmRZRV-ea1PBQvpHc5eoeo5rPSsjixt9Q",
        rating: "4.9",
        distance: "0.5 km",
      };
    }

    // Resolve Services
    let services: Service[] = [];
    serviceSlugs.forEach((slug) => {
      const s = allServices.find((item) => item.slug === slug);
      if (s) services.push(s);
    });

    // Default fallback service to match the mockup exactly
    if (services.length === 0) {
      services = [
        {
          slug: "balayage-hair",
          label: "Balayage",
          icon: "content_cut",
          description: "French hand-painted sun-kissed highlighting.",
          price: 4500,
          duration: "150 mins",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTiZkBArq0KoSUCTCCNizTzBLU55r_VJOaY7XOUaZwwW2HzdfNKtzX8QfShDGVN6aA5WGu2aOk0MdR70LNX0vZvMeXN8FBI6Hvf3FQElGLXFA0nBgjiXyrEFSoruadIvwSjTvLKyh7PncYkPejreKrjmkJcLEk_fI8BcAd4tyYARXmc_mXb0UiGmhSQGhuGYJJKIQDSe49j0tW1ajrIE3Xy_iZ2kEdfsbEfYy-RtAIbiwiUD4Guh-x4wS9ekVKh9mCOxAQ8WPOvA",
        },
      ];
    }

    // If query params had dates, sync them
    return {
      salon,
      services,
      initialDate: dateParam || "2024-10-15",
      initialTime: timeParam || "11:30 AM",
    };
  }, [searchParams]);

  // Sync initial query params on mount
  useEffect(() => {
    if (searchParams.get("date")) {
      setSelectedDate(searchParams.get("date")!);
      const parsedDate = new Date(searchParams.get("date")!);
      if (!isNaN(parsedDate.getTime())) {
        setCurrentYear(parsedDate.getFullYear());
        setCurrentMonth(parsedDate.getMonth());
      }
    }
    if (searchParams.get("time")) {
      setSelectedTimeSlot(searchParams.get("time")!);
    }
  }, [searchParams]);

  // ----------------------------------------------------
  // Dynamic Pricing Calculation
  // ----------------------------------------------------
  const totalPrice = useMemo(() => {
    // If it's our default balayage from query param resolve, let's keep it 4500 to match mockup
    return bookingData.services.reduce((sum, s) => {
      if (s.slug === "balayage-hair" && s.price === 6500 && !searchParams.get("services")) {
        return sum + 4500; // default mockup override
      }
      return sum + (s.price || 0);
    }, 0);
  }, [bookingData.services, searchParams]);

  // ----------------------------------------------------
  // Calendar Grid Builder (Standard Correct Calendar)
  // ----------------------------------------------------
  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const numDays = endOfMonth.getDate();
    
    // Day of the week for first day (0 = Sunday, 1 = Monday... 6 = Saturday)
    let startDayOfWeek = startOfMonth.getDay();
    // Convert to Monday start: (0 -> 6, 1 -> 0, 2 -> 1, 3 -> 2, 4 -> 3, 5 -> 4, 6 -> 5)
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days = [];

    // Padding days from previous month
    const prevMonthEnd = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthEnd - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Days in current month
    for (let d = 1; d <= numDays; d++) {
      days.push({
        day: d,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Padding days from next month to round up grid to multiples of 7
    const remainingCells = 42 - days.length; // standard 6-row layout
    for (let d = 1; d <= remainingCells; d++) {
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const monthName = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [currentYear, currentMonth]);

  // Calendar navigations
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // ----------------------------------------------------
  // Date Formatter Helper
  // ----------------------------------------------------
  const formattedDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    
    return `${day}${suffix} ${month}, ${year}`;
  };

  // ----------------------------------------------------
  // Wizard Handlers
  // ----------------------------------------------------
  const handleProceed = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Validate contact form
      if (!contactInfo.firstName.trim() || !contactInfo.email.trim() || !contactInfo.phone.trim()) {
        alert("Please fill in all required fields (First Name, Email, Phone).");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Validate payment details
      if (paymentMethod === "card") {
        if (!cardInfo.cardNumber || !cardInfo.expiry || !cardInfo.cvv) {
          alert("Please fill in your credit card details.");
          return;
        }
      } else if (paymentMethod === "upi") {
        if (!upiId) {
          alert("Please enter your UPI ID.");
          return;
        }
      }

      // Simulate payment processing loader
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setBookingId(`SHN-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`);
        setStep(4);
      }, 1500); // 1.5s visual loader
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else {
      // Step 1: go back in browser history or to salon page
      router.back();
    }
  };

  const handleClose = () => {
    // Navigate back to the salon details or dashboard
    const salonSlug = searchParams.get("salon");
    if (salonSlug) {
      router.push(`/salons/${salonSlug}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="bg-[#f9f9ff] text-[#151c27] min-h-screen flex flex-col font-sans relative antialiased selection:bg-primary/10">
      
      {/* ----------------------------------------------------
          MINIMALIST CHECKOUT TOP HEADER
          ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-outline-variant/10 shadow-sm py-4 px-6 flex items-center justify-between transition-all">
        {/* Back Arrow + Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-1.5 hover:bg-surface-container-low rounded-full transition-all active:scale-90 flex items-center justify-center cursor-pointer text-[#151c27]"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-2xl font-bold select-none">arrow_back</span>
          </button>
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity">
            Shena
          </Link>
        </div>

        {/* Center Booking Badge */}
        <div className="hidden sm:flex items-center justify-center bg-surface-container-low/75 border border-outline-variant/10 px-4 py-1.5 rounded-full select-none shadow-sm">
          <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Booking for Shena
          </span>
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="p-1.5 hover:bg-surface-container-low rounded-full transition-all active:scale-90 flex items-center justify-center cursor-pointer text-[#151c27]"
          title="Cancel Booking"
        >
          <span className="material-symbols-outlined text-2xl select-none">close</span>
        </button>
      </header>

      {/* ----------------------------------------------------
          STEP PROGRESS TRACKER (Omit on Success page)
          ---------------------------------------------------- */}
      {step < 4 && (
        <div className="w-full bg-white/70 backdrop-blur-md border-b border-outline-variant/5 py-4 select-none">
          <div className="max-w-2xl mx-auto flex items-center justify-between px-6">
            
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                step >= 1 ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {step > 1 ? "✓" : "1"}
              </span>
              <span className={`text-xs font-bold transition-colors ${step >= 1 ? "text-primary" : "text-outline"}`}>
                Schedule
              </span>
            </div>

            {/* Line 1 */}
            <div className={`flex-grow h-[1px] mx-4 transition-all duration-500 ${step >= 2 ? "bg-primary" : "bg-outline-variant/20"}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                step >= 2 ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {step > 2 ? "✓" : "2"}
              </span>
              <span className={`text-xs font-bold transition-colors ${step >= 2 ? "text-primary" : "text-outline"}`}>
                Confirm
              </span>
            </div>

            {/* Line 2 */}
            <div className={`flex-grow h-[1px] mx-4 transition-all duration-500 ${step >= 3 ? "bg-primary" : "bg-outline-variant/20"}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                step >= 3 ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                3
              </span>
              <span className={`text-xs font-bold transition-colors ${step >= 3 ? "text-primary" : "text-outline"}`}>
                Payment
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MAIN CONTENT WORKSPACE
          ---------------------------------------------------- */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pb-24">
        
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE STEP VIEWS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: SCHEDULE VIEW */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Step Header */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                      STEP 01
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                      Select your session
                    </h2>
                  </div>

                  {/* Dynamic Calendar Widget */}
                  <div className="bg-white rounded-3xl p-5 border border-outline-variant/10 shadow-[0px_8px_24px_rgba(21,28,39,0.02)] select-none">
                    
                    {/* Calendar Month Header */}
                    <div className="flex items-center justify-between mb-6 px-1">
                      <span className="font-bold text-on-surface text-base sm:text-lg">{monthName}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={handlePrevMonth}
                          className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-low transition-colors active:scale-90 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                        </button>
                        <button
                          onClick={handleNextMonth}
                          className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-low transition-colors active:scale-90 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-3">
                      {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((dayName) => (
                        <span key={dayName} className="text-[10px] font-bold text-outline uppercase tracking-wider">
                          {dayName}
                        </span>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((cell, idx) => {
                        const isSelected = selectedDate === cell.dateStr;
                        const isToday = cell.dateStr === "2024-10-15"; // reference center date
                        
                        return (
                          <button
                            key={`${cell.dateStr}-${idx}`}
                            onClick={() => {
                              setSelectedDate(cell.dateStr);
                              // Auto sync current view settings if clicked padding month day
                              if (cell.month !== currentMonth) {
                                setCurrentMonth(cell.month);
                                setCurrentYear(cell.year);
                              }
                            }}
                            className={`aspect-square w-full rounded-2xl flex items-center justify-center text-xs sm:text-sm font-semibold transition-all relative cursor-pointer active:scale-90 ${
                              !cell.isCurrentMonth ? "text-outline/40 hover:bg-surface-container-low/40" : ""
                            } ${
                              cell.isCurrentMonth && !isSelected ? "text-on-surface hover:bg-surface-container-low" : ""
                            } ${
                              isSelected
                                ? "bg-primary text-white font-bold shadow-md shadow-primary/20 scale-102"
                                : ""
                            }`}
                          >
                            <span>{cell.day}</span>
                            {/* Tiny dot indicators for demo */}
                            {isToday && !isSelected && (
                              <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-secondary"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                  </div>

                  {/* Available Time Slots Selector */}
                  <div className="space-y-3 select-none">
                    <h3 className="font-bold text-on-surface text-base">Available Slots</h3>
                    <div className="flex flex-wrap gap-3">
                      {["10:00 AM", "11:30 AM", "2:00 PM"].map((slot) => {
                        const isActive = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 active:scale-95 cursor-pointer shadow-sm ${
                              isActive
                                ? "bg-primary text-white shadow-primary/20 scale-102"
                                : "bg-white text-on-surface hover:bg-surface-container-low border border-outline-variant/15"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CONFIRM CONTACT DETAILS */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Step Header */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                      STEP 02
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                      Enter contact details
                    </h2>
                  </div>

                  {/* Form Container */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/10 shadow-[0px_8px_24px_rgba(21,28,39,0.02)] space-y-5">
                    
                    {/* Row: First and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">
                          First Name <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                          placeholder="e.g. Kishan"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-outline block">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                          placeholder="e.g. Kumar"
                        />
                      </div>
                    </div>

                    {/* Input: Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline block">
                        Email Address <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                        placeholder="e.g. kishan@example.com"
                      />
                    </div>

                    {/* Input: Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline block">
                        Phone Number <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>

                    {/* Textarea: Notes */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline block">
                        Special Instructions / Notes
                      </label>
                      <textarea
                        rows={4}
                        value={contactInfo.notes}
                        onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none resize-none"
                        placeholder="Any custom preferences (e.g. hair allergies, sensitive skin, style references...)"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Step Header */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                      STEP 03
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                      Choose payment method
                    </h2>
                  </div>

                  {/* Payment Option Selector */}
                  <div className="space-y-4 select-none">
                    
                    {/* Card Method option */}
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full text-left bg-white border rounded-3xl p-5 transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/2 shadow-md shadow-primary/5"
                          : "border-outline-variant/15 hover:border-primary/40 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">credit_card</span>
                        <div>
                          <p className="font-bold text-sm text-on-surface">Credit or Debit Card</p>
                          <p className="text-[11px] text-outline">Visa, Mastercard, RuPay, Amex</p>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        paymentMethod === "card" ? "border-primary bg-primary" : "border-outline-variant"
                      }`}>
                        {paymentMethod === "card" && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </span>
                    </button>

                    {/* Card Inputs Form */}
                    {paymentMethod === "card" && (
                      <div className="bg-white rounded-3xl p-6 border border-primary/20 shadow-md space-y-4 -mt-2 animate-in slide-in-from-top-3 duration-300">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardInfo.cardNumber}
                            onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                            placeholder="4000 1234 5678 9010"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Expiry Date</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardInfo.expiry}
                              onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                              className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-wider text-outline block">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardInfo.cvv}
                              onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                              className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                              placeholder="•••"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Option */}
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`w-full text-left bg-white border rounded-3xl p-5 transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === "upi"
                          ? "border-primary bg-primary/2 shadow-md shadow-primary/5"
                          : "border-outline-variant/15 hover:border-primary/40 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                        <div>
                          <p className="font-bold text-sm text-on-surface">UPI ID (GPay, PhonePe, Paytm)</p>
                          <p className="text-[11px] text-outline">Fast, instant booking checkout</p>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        paymentMethod === "upi" ? "border-primary bg-primary" : "border-outline-variant"
                      }`}>
                        {paymentMethod === "upi" && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </span>
                    </button>

                    {/* UPI Inputs Form */}
                    {paymentMethod === "upi" && (
                      <div className="bg-white rounded-3xl p-6 border border-primary/20 shadow-md space-y-4 -mt-2 animate-in slide-in-from-top-3 duration-300">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-wider text-outline block">UPI ID</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
                            placeholder="username@okaxis"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pay at Salon Option */}
                    <button
                      onClick={() => setPaymentMethod("salon")}
                      className={`w-full text-left bg-white border rounded-3xl p-5 transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === "salon"
                          ? "border-primary bg-primary/2 shadow-md shadow-primary/5"
                          : "border-outline-variant/15 hover:border-primary/40 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">store</span>
                        <div>
                          <p className="font-bold text-sm text-on-surface">Pay at Salon</p>
                          <p className="text-[11px] text-outline">Pay using cash or card directly at the counter</p>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        paymentMethod === "salon" ? "border-primary bg-primary" : "border-outline-variant"
                      }`}>
                        {paymentMethod === "salon" && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </span>
                    </button>

                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: STICKY BOOKING SUMMARY PANEL */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              {/* Light Blue-Purple Card Container */}
              <div className="bg-[#eff3ff] border border-outline-variant/5 rounded-[32px] p-6 sm:p-8 shadow-[0px_16px_40px_rgba(37,0,90,0.03)] space-y-6 relative overflow-hidden">
                
                {/* Visual Glassmorphism Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* Card Title & Subtitle */}
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-on-surface tracking-tight">
                    Booking Summary
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    Review your selection before checkout
                  </p>
                </div>

                {/* Service Card */}
                <div className="space-y-3">
                  {bookingData.services.map((service, idx) => (
                    <div 
                      key={`${service.slug}-${idx}`} 
                      className="bg-white rounded-2xl p-4 flex gap-4 items-center border border-outline-variant/10 shadow-sm transition-all hover:scale-[1.01] duration-300"
                    >
                      {/* Service Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low border border-outline-variant/10">
                        <img 
                          src={service.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=200"} 
                          alt={service.label} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Service Details info */}
                      <div className="flex-grow select-none">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#b4136d] block mb-0.5">
                          SERVICE
                        </span>
                        <h4 className="font-extrabold text-sm text-on-surface leading-snug">
                          {service.slug === "balayage-hair" ? "Balayage" : service.label}
                        </h4>
                        <p className="text-xs text-on-surface-variant/80 font-medium mt-0.5">
                          Artist: Shena
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date & Time Side-by-Side Chips */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Date Card */}
                  <div className="bg-white rounded-2xl p-4 border border-outline-variant/10 shadow-sm select-none">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                      DATE
                    </span>
                    <p className="font-bold text-xs sm:text-sm text-on-surface">
                      {formattedDateLabel(selectedDate)}
                    </p>
                  </div>

                  {/* Time Card */}
                  <div className="bg-white rounded-2xl p-4 border border-outline-variant/10 shadow-sm select-none">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#b4136d] block mb-1">
                      TIME
                    </span>
                    <p className="font-bold text-xs sm:text-sm text-on-surface">
                      {selectedTimeSlot}
                    </p>
                  </div>

                </div>

                {/* Border Divider */}
                <div className="h-[1px] bg-outline-variant/20 my-2" />

                {/* Total pricing details block */}
                <div className="flex items-start justify-between select-none">
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-on-surface">
                      Total Amount
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-on-surface">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="block text-[9px] text-outline font-semibold italic mt-0.5">
                      *Taxes calculated at checkout
                    </span>
                  </div>
                </div>

                {/* Premium CTA Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleProceed}
                    disabled={isProcessingPayment}
                    className={`w-full py-4 sm:py-4.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-primary to-[#5a00c6] text-white shadow-primary/20 hover:opacity-[0.97]`}
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        Processing Payment...
                      </span>
                    ) : step === 1 ? (
                      "CONFIRM & PROCEED"
                    ) : step === 2 ? (
                      "PROCEED TO PAYMENT"
                    ) : (
                      "PAY & COMPLETE BOOKING"
                    )}
                  </button>

                  {/* Secure Booking Badge */}
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-outline font-bold select-none uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm font-bold text-primary">verified_user</span>
                    <span>Secure booking via Shena</span>
                  </div>
                </div>

              </div>

              {/* Artist Profile Card (Below Booking Summary) */}
              <div className="flex items-center gap-3.5 bg-white border border-outline-variant/10 rounded-[28px] p-4.5 shadow-sm max-w-sm mx-auto sm:ml-0 transition-transform hover:scale-[1.01] select-none">
                
                {/* Artist avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/10 shadow-inner flex-shrink-0 bg-surface-container-low">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuADAbuBiVVuF4bU3Ryk_ykqbGp0R3jvNnhQPSDKrOUapyDRrIwPMs3PvvDOzE2aSgGVe42VzB9FTABxgkoXRnsGW8em_cGpkyyAEUgn6dqwIDi9ON-DG_1bC8MHGLOUuXicwtIdtSkuubPDETpPeye_WYjg35uqFSnj3Ybv7UWYoIH2qIyiqnN2muLLwO8xKOj05oLrFHbLTSfmmhE7fxrH3NJ9kD64cccxL6-XLPlwi8aEwRLok-ie1Lm8G819ZPGh5x_NUlLYqw" 
                    alt="Shena Artist" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Artist Rating */}
                <div>
                  <h4 className="font-extrabold text-sm text-on-surface leading-tight">
                    Booking with Shena
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-outline font-bold">(120+ Reviews)</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          
          /* ----------------------------------------------------
             STEP 4: BOOKING SUCCESS / CONFIRMATION PAGE
             ---------------------------------------------------- */
          <div className="max-w-2xl mx-auto py-8 animate-in zoom-in-95 duration-400">
            
            {/* Success Card */}
            <div className="bg-white border border-outline-variant/10 rounded-[36px] p-6 sm:p-10 shadow-[0px_24px_56px_rgba(21,28,39,0.03)] text-center space-y-6 relative overflow-hidden">
              
              {/* Confetti Glow decoration */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Checkmark animation container */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-500/5 animate-bounce">
                  <span className="material-symbols-outlined text-3xl font-extrabold select-none">check</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 select-none">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-on-surface">
                  Booking Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant font-medium max-w-md mx-auto">
                  Your appointment at <strong className="text-primary">{bookingData.salon.name}</strong> has been successfully scheduled. A confirmation receipt has been sent to your email.
                </p>
              </div>

              {/* Booking Reference Badge */}
              <div className="bg-surface-container-low px-4.5 py-2.5 rounded-2xl inline-flex flex-col items-center gap-1 border border-outline-variant/5 shadow-inner select-none">
                <span className="text-[9px] font-black uppercase tracking-wider text-outline">
                  Booking Reference
                </span>
                <span className="font-mono font-bold text-sm text-primary tracking-wider">
                  {bookingId}
                </span>
              </div>

              {/* Details Overview Card */}
              <div className="bg-surface-container-low/40 rounded-3xl p-5 sm:p-6 border border-outline-variant/10 text-left space-y-4">
                
                {/* Header title */}
                <h4 className="font-extrabold text-sm text-on-surface border-b border-outline-variant/10 pb-2.5 uppercase tracking-wider text-[10px] text-outline">
                  Appointment Details
                </h4>

                {/* Information grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  
                  {/* Service item */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Service</span>
                    <span className="font-extrabold text-on-surface">
                      {bookingData.services.map(s => s.slug === "balayage-hair" ? "Balayage" : s.label).join(", ")}
                    </span>
                  </div>

                  {/* Salon Location item */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Salon Location</span>
                    <span className="font-extrabold text-on-surface">
                      {bookingData.salon.name} • <span className="font-semibold text-on-surface-variant">{bookingData.salon.location}</span>
                    </span>
                  </div>

                  {/* Date & Time item */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Date & Time</span>
                    <span className="font-extrabold text-on-surface">
                      {formattedDateLabel(selectedDate)} at <span className="text-primary">{selectedTimeSlot}</span>
                    </span>
                  </div>

                  {/* Booking Artist item */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Assigned Artist</span>
                    <span className="font-extrabold text-on-surface">Shena (Elite Haircare Expert)</span>
                  </div>

                  {/* Customer Info item */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Customer Contact</span>
                    <span className="font-extrabold text-on-surface">
                      {contactInfo.firstName} {contactInfo.lastName} • <span className="font-medium text-on-surface-variant">{contactInfo.phone}</span>
                    </span>
                  </div>

                  {/* Payment Amount item */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-outline uppercase tracking-wider">Amount Paid</span>
                    <span className="font-extrabold text-emerald-600">
                      ₹{totalPrice.toLocaleString("en-IN")} <span className="text-[10px] uppercase font-bold text-outline-variant bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5 ml-1">PAID</span>
                    </span>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/"
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm border border-outline-variant/30 text-on-surface hover:bg-surface-container-low active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  Back to Home
                </Link>
                <Link
                  href="/orders"
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-primary text-white hover:opacity-[0.97] active:scale-98 shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  View My Bookings
                </Link>
              </div>

            </div>

          </div>

        )}

      </main>

      {/* ----------------------------------------------------
          FOOTER COPYRIGHT
          ---------------------------------------------------- */}
      <footer className="w-full bg-[#f9f9ff] py-8 border-t border-outline-variant/5 text-center mt-auto select-none">
        <p className="text-[10px] sm:text-xs text-outline font-semibold tracking-wide">
          © 2024 Shena Atelier • Bangalore • Mumbai • Delhi
        </p>
      </footer>

    </div>
  );
}

export default BookingFlow;
