"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

interface ServiceData {
  id: string;
  label: string;
  price: number;
  duration: string;
  category: string;
  description: string;
  image?: string;
  benefits?: string;
  subCategory?: string;
  fullDescription?: string;
  availableDays?: string[];
  gender?: "Men" | "Women" | "Unisex";
  status?: "Active" | "Draft";
  homeServiceAvailable?: boolean;
  featuredService?: boolean;
}

interface ProductData {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  size?: string;
  ingredients?: string;
  howToUse?: string;
  subCategory?: string;
  productType?: string;
  mrp?: number;
  discount?: number;
  status?: "Active" | "Draft" | "Out of Stock";
  gallery?: string[];
  fullDescription?: string;
  skinType?: string;
  hairType?: string;
  tags?: string[];
  weight?: string;
  shippingCharge?: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface BookingData {
  id: string;
  customerName: string;
  avatarInitials: string;
  service: string;
  date: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  colorClass: string;
}

interface OrderData {
  id: string;
  customerName: string;
  productName: string;
  qty: number;
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
  date: string;
}

export function SellerPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read ?tab= query param to auto-switch tabs (used by Back to Catalog links)
  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam && ["dashboard", "bookings", "products", "orders", "earnings", "settings", "profile", "services"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // ----------------------------------------------------
  // Auth & Onboarding State
  // ----------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [currentSeller, setCurrentSeller] = useState({
    name: "Shena",
    email: "shena@example.com",
    phone: "+91 98765 43210",
    category: "Salon",
  });

  // ----------------------------------------------------
  // Navigation & Tab state
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "products" | "orders" | "earnings" | "settings" | "profile" | "services">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ----------------------------------------------------
  // Shop details (Shop Registration state)
  // ----------------------------------------------------
  const [isRegistered, setIsRegistered] = useState(true);
  const [shopDetails, setShopDetails] = useState({
    salonName: "Shena Studio",
    ownerName: "Shena Owner",
    contact: "+91 98765 43210",
    email: "shena@example.com",
    address: "GS Road, Guwahati",
    city: "Guwahati",
    state: "Assam",
    shopLicence: "licence_no_12345.pdf",
    shopImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600",
    description: "Elite luxury hair styling, organic skincare therapies, and occasions makeup atelier.",
    category: "Salon",
    hours: "09:00 AM - 08:30 PM",
    bannerImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600",
  });

  // Onboarding wizard form state
  const [shopRegisterData, setShopRegisterData] = useState({
    salonName: "",
    ownerName: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
    shopLicence: "",
    shopImage: "",
    description: "",
    category: "Salon",
    hours: "09:00 AM - 08:30 PM",
    bannerImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600",
  });

  // ----------------------------------------------------
  // Authentication & Onboarding Checks
  // ----------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("shena_seller_logged_in");
      if (loggedIn !== "true") {
        router.push("/seller/login");
        return;
      }

      // Load current seller details
      const sellerStr = localStorage.getItem("shena_current_seller");
      let sellerObj: any = null;
      if (sellerStr) {
        try {
          sellerObj = JSON.parse(sellerStr);
          setCurrentSeller(sellerObj);
          
          // Pre-fill wizard category and details with user registration details
          setShopRegisterData((prev) => ({
            ...prev,
            ownerName: sellerObj.name || "",
            email: sellerObj.email || "",
            contact: sellerObj.phone || "",
            category: sellerObj.category || "Salon",
          }));
        } catch (e) {
          console.error(e);
        }
      }

      // Check shop registration status
      const salonRegistered = localStorage.getItem("shena_seller_salon_registered");
      if (salonRegistered === "true") {
        setIsRegistered(true);
        const salonDetailsStr = localStorage.getItem("shena_seller_salon_details");
        if (salonDetailsStr) {
          try {
            setShopDetails(JSON.parse(salonDetailsStr));
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        setIsRegistered(false);
      }

      setIsLoading(false);
    }
  }, [router]);

  // ----------------------------------------------------
  // Logout & Shop Setup Handlers
  // ----------------------------------------------------
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("shena_seller_logged_in");
      localStorage.removeItem("shena_current_seller");
      router.push("/seller/login");
    }
  };

  const handleRegisterShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shopRegisterData.salonName ||
      !shopRegisterData.ownerName ||
      !shopRegisterData.contact ||
      !shopRegisterData.email ||
      !shopRegisterData.address ||
      !shopRegisterData.city ||
      !shopRegisterData.state ||
      !shopRegisterData.shopLicence ||
      !shopRegisterData.shopImage
    ) {
      alert("Please fill in all required registration fields, upload your Shop Licence, and upload your Shop Image.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("shena_seller_salon_details", JSON.stringify(shopRegisterData));
      localStorage.setItem("shena_seller_salon_registered", "true");
      setShopDetails(shopRegisterData);
      setIsRegistered(true);
      alert("Salon successfully registered! Welcome to your dashboard.");
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shopDetails.salonName ||
      !shopDetails.ownerName ||
      !shopDetails.contact ||
      !shopDetails.email ||
      !shopDetails.address ||
      !shopDetails.city ||
      !shopDetails.state ||
      !shopDetails.shopLicence ||
      !shopDetails.shopImage
    ) {
      alert("Please fill in all required shop details, including Shop Licence and Shop Image.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("shena_seller_salon_details", JSON.stringify(shopDetails));
      localStorage.setItem("shena_seller_salon_registered", "true");
      setIsRegistered(true);
      alert("Salon details successfully updated!");
    }
  };

  const [services, setServices] = useState<ServiceData[]>([
    {
      id: "ser-1",
      label: "Bridal Glow Facial",
      price: 3500,
      duration: "60 mins",
      category: "Skincare",
      description: "Signature skin brightening treatment using active organic ingredients.",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400",
      benefits: "Deep cleanse, organic brightening mask, immediate hydration & glow boost.",
    },
    {
      id: "ser-2",
      label: "Silk Therapy Mask",
      price: 2200,
      duration: "45 mins",
      category: "Haircare",
      description: "Hydrating deep hair smoothing and repair conditioning scalp treatment.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
      benefits: "Restores hair elasticity, intense moisture infusion, controls frizz for up to 3 washes.",
    },
    {
      id: "ser-3",
      label: "Full Body Spa",
      price: 4200,
      duration: "75 mins",
      category: "Wellness",
      description: "Therapeutic oil massage for absolute muscle relaxation and stress relief.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400",
      benefits: "Relieves muscle tension, promotes circulation, standard warm herbal compress included.",
    },
    {
      id: "ser-4",
      label: "Men's Facial",
      price: 1500,
      duration: "30 mins",
      category: "Skincare",
      description: "Deep clinical pore cleansing facial optimized for active skin.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400",
      benefits: "Unclogs pores, controls excess oil, soothing post-shave skin therapy.",
    },
  ]);

  // ----------------------------------------------------
  // Products state
  // ----------------------------------------------------
  const [products, setProducts] = useState<ProductData[]>([
    {
      id: "prod-1",
      name: "Radiance Silk Hair Serum",
      brand: "Shena Essentials",
      price: 2300,
      stock: 24,
      category: "Haircare",
      description: "Smoothing organic botanical serum that locks in moisture and shine.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
      size: "100 ml",
      ingredients: "Organic Argan Oil, Cyclomethicone, Vitamin E, Lavender Extract.",
      howToUse: "Apply 2-3 drops to damp hair from mid-lengths to ends before styling.",
    },
    {
      id: "prod-2",
      name: "Rose Glow Mist",
      brand: "Shena Essentials",
      price: 850,
      stock: 42,
      category: "Skincare",
      description: "Refreshing herbal mist with vitamin E and active floral extracts.",
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=200",
      size: "250 ml",
      ingredients: "Pure Rosewater, Witch Hazel, Hyaluronic Acid, Glycerin.",
      howToUse: "Mist onto face and neck as needed to refresh, hydrate, or set makeup.",
    },
    {
      id: "prod-3",
      name: "Satin Pillowcase",
      brand: "Luxurious Sleep Atelier",
      price: 1200,
      stock: 15,
      category: "Wellness",
      description: "Elite double-sided satin pillowcase that prevents hair frizz and skin folds.",
      image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=200",
      size: "Standard (20x26 inches)",
      ingredients: "100% Premium Satin Polyester.",
      howToUse: "Slip over standard pillows. Machine wash cold on gentle cycle, tumble dry low.",
    },
  ]);

  // ----------------------------------------------------
  // Bookings state (matching mockup names and services)
  // ----------------------------------------------------
  const [bookings, setBookings] = useState<BookingData[]>([
    {
      id: "bk-1",
      customerName: "Ananya P.",
      avatarInitials: "AP",
      service: "Bridal Glow Facial",
      date: "24 Oct, 11:30 AM",
      status: "Confirmed",
      colorClass: "bg-purple-100 text-purple-700",
    },
    {
      id: "bk-2",
      customerName: "Rohan K.",
      avatarInitials: "RK",
      service: "Silk Therapy Mask",
      date: "24 Oct, 02:00 PM",
      status: "Pending",
      colorClass: "bg-rose-100 text-rose-700",
    },
    {
      id: "bk-3",
      customerName: "Sana M.",
      avatarInitials: "SM",
      service: "Full Body Spa",
      date: "25 Oct, 10:00 AM",
      status: "Confirmed",
      colorClass: "bg-blue-100 text-blue-700",
    },
    {
      id: "bk-4",
      customerName: "John B.",
      avatarInitials: "JB",
      service: "Men's Facial",
      date: "25 Oct, 04:30 PM",
      status: "Pending",
      colorClass: "bg-slate-100 text-slate-700",
    },
  ]);

  // ----------------------------------------------------
  // Orders state
  // ----------------------------------------------------
  const [orders, setOrders] = useState<OrderData[]>([
    {
      id: "ord-101",
      customerName: "Kishan K.",
      productName: "Radiance Silk Hair Serum",
      qty: 1,
      total: 2300,
      status: "Pending",
      date: "03 Jun, 2026",
    },
    {
      id: "ord-102",
      customerName: "Meera R.",
      productName: "Rose Glow Mist",
      qty: 2,
      total: 1700,
      status: "Shipped",
      date: "02 Jun, 2026",
    },
    {
      id: "ord-103",
      customerName: "Dev P.",
      productName: "Satin Pillowcase",
      qty: 1,
      total: 1200,
      status: "Delivered",
      date: "31 May, 2026",
    },
  ]);

  // ----------------------------------------------------
  // Modal toggle states & inputs
  // ----------------------------------------------------
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    label: "",
    price: "",
    duration: "60 Minutes",
    category: "Haircut",
    subCategory: "",
    description: "",
    fullDescription: "",
    image: "",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    gender: "Unisex" as "Men" | "Women" | "Unisex",
    status: "Active" as "Active" | "Draft",
    homeServiceAvailable: false,
    featuredService: false,
    benefits: "",
  });

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productFormStep, setProductFormStep] = useState(1);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "Haircare",
    subCategory: "",
    productType: "",
    price: "",
    mrp: "",
    discount: 0,
    stock: "",
    status: "Active" as "Active" | "Draft" | "Out of Stock",
    image: "",
    gallery: [] as string[],
    description: "",
    fullDescription: "",
    skinType: "All",
    hairType: "All",
    tags: [] as string[],
    weight: "",
    shippingCharge: "",
    metaTitle: "",
    metaDescription: "",
    size: "",
    ingredients: "",
    howToUse: "",
  });

  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isProductSuccess, setIsProductSuccess] = useState(false);

  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [isServiceSuccess, setIsServiceSuccess] = useState(false);

  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    service: "Bridal Glow Facial",
    date: "26 Oct",
    time: "11:30 AM",
  });

  // ----------------------------------------------------
  // Modal handlers
  // ----------------------------------------------------
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.label || !newService.price) {
      alert("Please fill in the service name and price.");
      return;
    }
    
    setIsSubmittingService(true);
    setTimeout(() => {
      setIsSubmittingService(false);
      setIsServiceSuccess(true);
      
      const created: ServiceData = {
        id: `ser-${Date.now()}`,
        label: newService.label,
        price: Number(newService.price),
        duration: newService.duration,
        category: newService.category,
        subCategory: newService.subCategory,
        description: newService.description,
        fullDescription: newService.fullDescription,
        image: newService.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
        availableDays: newService.availableDays,
        gender: newService.gender,
        status: newService.status,
        homeServiceAvailable: newService.homeServiceAvailable,
        featuredService: newService.featuredService,
        benefits: newService.description,
      };

      setServices((prev) => [...prev, created]);
      
      setTimeout(() => {
        setIsServiceSuccess(false);
        setNewService({
          label: "",
          price: "",
          duration: "60 Minutes",
          category: "Haircut",
          subCategory: "",
          description: "",
          fullDescription: "",
          image: "",
          availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          gender: "Unisex",
          status: "Active",
          homeServiceAvailable: false,
          featuredService: false,
          benefits: "",
        });
        setShowAddServiceModal(false);
      }, 1000);
    }, 1200);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.price || !newProduct.stock || !newProduct.description) {
      alert("Please fill in all required fields: Name, Brand, Price, Stock, and Short Description.");
      return;
    }
    if (!newProduct.image) {
      alert("Please upload a featured product image.");
      return;
    }

    setIsSubmittingProduct(true);
    setTimeout(() => {
      setIsSubmittingProduct(false);
      setIsProductSuccess(true);

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: newProduct.name,
                  brand: newProduct.brand,
                  category: newProduct.category,
                  subCategory: newProduct.subCategory,
                  productType: newProduct.productType,
                  price: Number(newProduct.price),
                  mrp: newProduct.mrp ? Number(newProduct.mrp) : undefined,
                  discount: newProduct.discount,
                  stock: Number(newProduct.stock),
                  status: newProduct.status,
                  image: newProduct.image,
                  gallery: newProduct.gallery,
                  description: newProduct.description,
                  fullDescription: newProduct.fullDescription,
                  skinType: newProduct.skinType,
                  hairType: newProduct.hairType,
                  tags: newProduct.tags,
                  weight: newProduct.weight,
                  shippingCharge: newProduct.shippingCharge ? Number(newProduct.shippingCharge) : undefined,
                  metaTitle: newProduct.metaTitle,
                  metaDescription: newProduct.metaDescription,
                  ingredients: newProduct.ingredients,
                  howToUse: newProduct.howToUse,
                  size: newProduct.size || "Standard",
                }
              : p
          )
        );
      } else {
        const created: ProductData = {
          id: `prod-${Date.now()}`,
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          subCategory: newProduct.subCategory,
          productType: newProduct.productType,
          price: Number(newProduct.price),
          mrp: newProduct.mrp ? Number(newProduct.mrp) : undefined,
          discount: newProduct.discount,
          stock: Number(newProduct.stock),
          status: newProduct.status,
          image: newProduct.image,
          gallery: newProduct.gallery,
          description: newProduct.description,
          fullDescription: newProduct.fullDescription,
          skinType: newProduct.skinType,
          hairType: newProduct.hairType,
          tags: newProduct.tags,
          weight: newProduct.weight,
          shippingCharge: newProduct.shippingCharge ? Number(newProduct.shippingCharge) : undefined,
          metaTitle: newProduct.metaTitle,
          metaDescription: newProduct.metaDescription,
          size: newProduct.size || "Standard",
          ingredients: newProduct.ingredients,
          howToUse: newProduct.howToUse,
        };
        setProducts((prev) => [...prev, created]);
      }

      setTimeout(() => {
        setIsProductSuccess(false);
        setProductFormStep(1);
        setEditingProduct(null);
        setNewProduct({
          name: "",
          brand: "",
          category: "Haircare",
          subCategory: "",
          productType: "",
          price: "",
          mrp: "",
          discount: 0,
          stock: "",
          status: "Active",
          image: "",
          gallery: [],
          description: "",
          fullDescription: "",
          skinType: "All",
          hairType: "All",
          tags: [],
          weight: "",
          shippingCharge: "",
          metaTitle: "",
          metaDescription: "",
          size: "",
          ingredients: "",
          howToUse: "",
        });
        setShowAddProductModal(false);
      }, 1000);
    }, 1200);
  };

  const handleEditProductClick = (item: ProductData) => {
    // Store product in localStorage for the edit page to pick up
    if (typeof window !== "undefined") {
      localStorage.setItem("shena_editing_product", JSON.stringify(item));
    }
    router.push(`/seller/products/edit/${item.id}`);
  };

  const handleAddBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerName) return;

    const initials = newBooking.customerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const colors = [
      "bg-purple-100 text-purple-700",
      "bg-blue-100 text-blue-700",
      "bg-rose-100 text-rose-700",
      "bg-slate-100 text-slate-700",
    ];

    const created: BookingData = {
      id: `bk-${Date.now()}`,
      customerName: newBooking.customerName,
      avatarInitials: initials || "C",
      service: newBooking.service,
      date: `${newBooking.date}, ${newBooking.time}`,
      status: "Pending",
      colorClass: colors[Math.floor(Math.random() * colors.length)],
    };

    setBookings((prev) => [created, ...prev]);
    setNewBooking({ customerName: "", service: "Bridal Glow Facial", date: "26 Oct", time: "11:30 AM" });
    setShowAddBookingModal(false);
  };

  const handleToggleBookingStatus = (id: string, status: "Confirmed" | "Pending" | "Cancelled") => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, status } : bk))
    );
  };

  const handleToggleOrderStatus = (id: string, status: "Pending" | "Shipped" | "Delivered") => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord))
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8fd] flex flex-col items-center justify-center font-sans antialiased">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="text-xs text-outline font-semibold mt-3 animate-pulse">Verifying authentication...</p>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="bg-[#f6f8fd] text-[#151c27] min-h-screen flex items-center justify-center font-sans antialiased p-4 sm:p-6">
        <div className="max-w-3xl w-full bg-white border border-outline-variant/10 rounded-[36px] shadow-[0px_24px_56px_rgba(21,28,39,0.03)] p-6 sm:p-10 space-y-8 relative overflow-hidden">
          {/* Glowing accents */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-center select-none relative z-10">
            <div className="space-y-1.5">
              <span className="bg-violet-100 text-primary border border-violet-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider block w-fit">
                ONBOARDING STEP 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                Register Your Shop
              </h1>
              <p className="text-xs text-on-surface-variant font-medium">
                Set up your salon, spa, or studio details to list on the Shena marketplace.
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-xs font-bold">logout</span>
              Cancel / Logout
            </button>
          </div>

          <form onSubmit={handleRegisterShopSubmit} className="space-y-8 relative z-10">
            
            {/* Section 1: General Business Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-outline-variant/10 pb-1.5">1. General Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Salon / Shop Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavender Luxury Wellness"
                    value={shopRegisterData.salonName}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, salonName: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Category Classification</label>
                  <select
                    value={shopRegisterData.category}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, category: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Salon">Hair & Beauty Salon</option>
                    <option value="Spa">Spa & Wellness Retreat</option>
                    <option value="Makeup Studio">Makeup Glam Studio</option>
                    <option value="Nails">Nails Boutique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Owner Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Pandey"
                    value={shopRegisterData.ownerName}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, ownerName: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Contact Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={shopRegisterData.contact}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, contact: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. contact@lavender.com"
                    value={shopRegisterData.email}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, email: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Operation Opening Hours</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:30 AM - 08:30 PM"
                    value={shopRegisterData.hours}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, hours: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Location Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-outline-variant/10 pb-1.5">2. Location Details</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Physical Address <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop No. 12, GS Road, Opposite Central Mall"
                    value={shopRegisterData.address}
                    onChange={(e) => setShopRegisterData({ ...shopRegisterData, address: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">City <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Guwahati"
                      value={shopRegisterData.city}
                      onChange={(e) => setShopRegisterData({ ...shopRegisterData, city: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">State <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Assam"
                      value={shopRegisterData.state}
                      onChange={(e) => setShopRegisterData({ ...shopRegisterData, state: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Verification & Marketing */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-outline-variant/10 pb-1.5">3. Verification & Branding</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Shop Licence (Verification Document) <span className="text-rose-500">*</span></label>
                  <div 
                    onClick={() => document.getElementById('licence-file-input')?.click()}
                    className={`w-full bg-[#f6f8fd] border-2 border-dashed ${shopRegisterData.shopLicence ? 'border-emerald-300 bg-emerald-50/20' : 'border-outline-variant/30 hover:border-primary'} focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
                  >
                    <input 
                      id="licence-file-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setShopRegisterData(prev => ({ ...prev, shopLicence: file.name }));
                        }
                      }}
                    />
                    {shopRegisterData.shopLicence ? (
                      <>
                        <span className="material-symbols-outlined text-emerald-600 text-2xl font-bold">check_circle</span>
                        <span className="text-xs font-bold text-on-surface line-clamp-1">{shopRegisterData.shopLicence}</span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Document Uploaded</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-outline text-2xl animate-pulse">cloud_upload</span>
                        <span className="text-xs font-bold text-on-surface">Click to upload Shop Licence</span>
                        <span className="text-[9px] text-outline font-semibold">Supports PDF, PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Shop Image <span className="text-rose-500">*</span></label>
                  <div 
                    onClick={() => document.getElementById('shop-image-file-input')?.click()}
                    className={`w-full bg-[#f6f8fd] border-2 border-dashed ${shopRegisterData.shopImage ? 'border-emerald-300 bg-emerald-50/20' : 'border-outline-variant/30 hover:border-primary'} focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
                  >
                    <input 
                      id="shop-image-file-input"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setShopRegisterData(prev => ({ ...prev, shopImage: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {shopRegisterData.shopImage ? (
                      <div className="flex flex-col items-center gap-1 select-none">
                        <img src={shopRegisterData.shopImage} alt="Shop Uploaded" className="w-16 h-10 object-cover rounded-lg shadow-sm border border-outline-variant/10" />
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Shop Image Loaded</span>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-outline text-2xl">image</span>
                        <span className="text-xs font-bold text-on-surface">Click to upload Shop Image</span>
                        <span className="text-[9px] text-outline font-semibold">Supports PNG, JPG, WEBP up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Shop Biography / Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your salon biography, specialized services, treatments, etc..."
                  value={shopRegisterData.description}
                  onChange={(e) => setShopRegisterData({ ...shopRegisterData, description: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-outline-variant/5">
              <p className="text-[10px] text-outline font-semibold">
                You can change these coordinates at any time in the Shop Profile settings.
              </p>
              <button
                type="submit"
                className="bg-primary hover:opacity-90 text-white rounded-2xl px-8 py-3.5 text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-primary/20 active:scale-98"
              >
                REGISTER & ACTIVATE SHOP
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8fd] text-[#151c27] min-h-screen flex flex-col lg:flex-row font-sans antialiased relative overflow-x-hidden">
      
      {/* Mobile Header Bar */}
      <header className="lg:hidden bg-white border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30 select-none w-full shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl border border-outline-variant/15 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold">menu</span>
          </button>
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">
            Shena Seller
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/10 shadow-inner flex items-center justify-center font-extrabold text-primary bg-primary/10 text-xs">
            {currentSeller.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#151c27]/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ----------------------------------------------------
          SIDEBAR NAVIGATION
          ---------------------------------------------------- */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-outline-variant/10 flex flex-col justify-between flex-shrink-0 select-none transition-transform duration-300 transform lg:translate-x-0 lg:flex h-full overflow-y-auto lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 space-y-8">
          
          {/* Logo & Close Button */}
          <div className="flex justify-between items-center select-none">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent tracking-tight block hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shena Seller
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 rounded-xl border border-outline-variant/15 flex items-center justify-center text-outline hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">close</span>
            </button>
          </div>

          {/* Seller Profile Summary info */}
          <div className="flex items-center gap-3 bg-surface-container-low/50 border border-outline-variant/5 rounded-2xl p-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/10 shadow-inner flex-shrink-0 bg-surface-container-low flex items-center justify-center font-extrabold text-primary bg-primary/10 text-xs">
              {currentSeller.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-on-surface leading-tight">{currentSeller.name}</h3>
              <p className="text-[10px] text-outline font-black tracking-widest uppercase mt-0.5">{currentSeller.category} Partner</p>
            </div>
          </div>

          {/* Sidebar Menu items list */}
          <nav className="flex flex-col gap-1.5 pt-4">
            {[
              { id: "dashboard", label: "Dashboard", icon: "dashboard" },
              { id: "bookings", label: "Bookings", icon: "calendar_month" },
              { id: "services", label: "Services", icon: "spa" },
              { id: "products", label: "Products", icon: "shopping_bag" },
              { id: "orders", label: "Orders", icon: "assignment" },
              { id: "earnings", label: "Earnings", icon: "payments" },
              { id: "profile", label: "Shop Profile", icon: "store" },
              { id: "settings", label: "Settings", icon: "settings" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer group text-left ${
                    isActive
                      ? "bg-violet-100/70 text-primary border-r-4 border-primary rounded-r-none relative"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {/* Badge count indicators */}
                  {tab.id === "bookings" && bookings.filter(b => b.status === "Pending").length > 0 && (
                    <span className="bg-secondary text-white text-[9px] font-black rounded-full px-1.5 py-0.5">
                      {bookings.filter(b => b.status === "Pending").length}
                    </span>
                  )}
                  {tab.id === "orders" && orders.filter(o => o.status === "Pending").length > 0 && (
                    <span className="bg-secondary text-white text-[9px] font-black rounded-full px-1.5 py-0.5">
                      {orders.filter(o => o.status === "Pending").length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Back to Website links */}
        <div className="p-6 pb-20 lg:pb-12 border-t border-outline-variant/10 space-y-4">
          <button 
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm select-none">logout</span>
            Sign Out
          </button>
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-outline hover:text-primary transition-colors justify-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
            Back to Customer Site
          </Link>
        </div>

      </aside>

      {/* ----------------------------------------------------
          MAIN CONTENT VIEWPORT
          ---------------------------------------------------- */}
      <div className="flex-grow lg:pl-64 w-full flex flex-col">
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8 w-full">
        
        {/* top header greeting & action */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-on-surface">
              {activeTab === "dashboard" ? `Welcome back, ${currentSeller.name}` : activeTab === "profile" ? "Shop Profile" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
              {activeTab === "dashboard" && "Here's what's happening with your studio today."}
              {activeTab === "profile" && "Register or update your beauty salon coordinates."}
              {activeTab === "services" && "Manage your beauty treatments menu items."}
              {activeTab === "products" && "Manage your retail skincare and haircare inventory."}
              {activeTab === "bookings" && "Accept, confirm, or modify client salon appointments."}
              {activeTab === "orders" && "Fulfill customer physical product deliveries."}
              {activeTab === "earnings" && "Monitor monthly revenue and weekly performance charts."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification circle */}
            <button className="w-10 h-10 rounded-full border border-outline-variant/10 bg-white flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors relative cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-lg select-none">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary"></span>
            </button>

            {/* Shop Image Display */}
            {shopDetails.shopImage ? (
              <div 
                className="w-10 h-10 rounded-xl overflow-hidden border border-outline-variant/15 shadow-sm select-none cursor-pointer group relative"
                title={`${shopDetails.salonName} Image`}
                onClick={() => setActiveTab("profile")}
              >
                <img 
                  src={shopDetails.shopImage} 
                  alt="Shop Thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
            ) : (
              <div 
                className="w-10 h-10 rounded-xl border border-outline-variant/10 bg-white flex items-center justify-center text-outline hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm select-none"
                onClick={() => setActiveTab("profile")}
                title="Upload Shop Image"
              >
                <span className="material-symbols-outlined text-lg">store</span>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC TAB VIEW LAYOUT */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Row of stats cards (3 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 select-none">
              
              {/* Card 1: Today's Bookings */}
              <div className="bg-white border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-700 w-fit flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg select-none" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-on-surface block leading-none">12</span>
                    <span className="text-[9px] font-black uppercase text-outline tracking-wider mt-1.5 block">Today's Bookings</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  +4 vs yesterday
                </span>
              </div>

              {/* Card 2: Pending Orders */}
              <div className="bg-white border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="space-y-4">
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 w-fit flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg select-none" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-on-surface block leading-none">5</span>
                    <span className="text-[9px] font-black uppercase text-outline tracking-wider mt-1.5 block">Pending Orders</span>
                  </div>
                </div>
                <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Requires Action
                </span>
              </div>

              {/* Card 3: Monthly Revenue */}
              <div className="bg-white border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 w-fit flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg select-none" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-on-surface block leading-none">₹1.2L</span>
                    <span className="text-[9px] font-black uppercase text-outline tracking-wider mt-1.5 block">Monthly Revenue</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  12% growth
                </span>
              </div>

            </div>

            {/* Bottom layout: Left Column (Recent Bookings Table), Right Column (Weekly earnings bar + pro tip) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Table */}
              <div className="lg:col-span-8 bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="flex justify-between items-center select-none">
                  <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Recent Bookings</h2>
                  <button 
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs font-bold text-primary uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse select-none">
                    <thead>
                      <tr className="border-b border-outline-variant/10 text-[10px] text-outline font-black uppercase tracking-wider pb-3 block sm:table-row">
                        <th className="pb-3 pr-4">Customer</th>
                        <th className="pb-3 pr-4">Service</th>
                        <th className="pb-3 pr-4">Date & Time</th>
                        <th className="pb-3 pr-4 text-center">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {bookings.slice(0, 4).map((bk) => (
                        <tr key={bk.id} className="hover:bg-surface-container-lowest/30 transition-colors block sm:table-row py-3 sm:py-0 border-b border-outline-variant/5 sm:border-none">
                          
                          {/* Customer */}
                          <td className="py-3.5 pr-4 block sm:table-cell">
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${bk.colorClass} shadow-inner`}>
                                {bk.avatarInitials}
                              </span>
                              <span className="font-extrabold text-on-surface">{bk.customerName}</span>
                            </div>
                          </td>

                          {/* Service */}
                          <td className="py-3.5 pr-4 block sm:table-cell text-on-surface-variant font-semibold">
                            {bk.service}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 pr-4 block sm:table-cell text-on-surface-variant/80 font-medium">
                            {bk.date}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 pr-4 block sm:table-cell text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                              bk.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : bk.status === "Pending"
                                ? "bg-amber-50 text-amber-800 border border-amber-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {bk.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 block sm:table-cell text-right">
                            {bk.status === "Pending" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleToggleBookingStatus(bk.id, "Confirmed")}
                                  className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-emerald-100 shadow-sm"
                                  title="Confirm Booking"
                                >
                                  <span className="material-symbols-outlined text-sm font-bold select-none">check</span>
                                </button>
                                <button
                                  onClick={() => handleToggleBookingStatus(bk.id, "Cancelled")}
                                  className="p-1 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-rose-100 shadow-sm"
                                  title="Decline / Cancel"
                                >
                                  <span className="material-symbols-outlined text-sm font-bold select-none">close</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-outline font-semibold italic">Settled</span>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Right Column details */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Card 1: Weekly earnings bar chart */}
                <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 shadow-sm space-y-6 select-none">
                  
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-extrabold text-on-surface tracking-tight">Weekly Earnings</h2>
                    <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors select-none">more_horiz</span>
                  </div>

                  {/* Simulated Chart Bars */}
                  <div className="flex items-end justify-between h-32 px-2 pt-4">
                    {[
                      { day: "MON", percent: "55%", active: false },
                      { day: "TUE", percent: "75%", active: false },
                      { day: "WED", percent: "68%", active: false },
                      { day: "THU", percent: "95%", active: true },
                      { day: "FRI", percent: "45%", active: false },
                      { day: "SAT", percent: "88%", active: false },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                        <div className="w-6.5 rounded-t-lg relative transition-all duration-300 group-hover:scale-y-105" style={{ 
                          height: bar.percent, 
                          backgroundColor: bar.active ? "var(--primary)" : "rgba(99, 14, 212, 0.25)"
                        }} />
                        <span className="text-[8px] font-black text-outline tracking-wider uppercase">{bar.day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary info */}
                  <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/5 pt-4 text-xs">
                    <div>
                      <span className="block text-[8px] font-black uppercase text-outline tracking-wider">Best Day</span>
                      <span className="font-extrabold text-on-surface text-sm sm:text-base mt-1 block">Thursday</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black uppercase text-outline tracking-wider">Total</span>
                      <span className="font-extrabold text-primary text-sm sm:text-base mt-1 block">₹69,000</span>
                    </div>
                  </div>

                </div>

                {/* Card 2: Pro Tip gradient card */}
                <div className="bg-gradient-to-br from-primary to-[#5a00c6] rounded-[32px] p-6 shadow-md shadow-primary/10 text-white space-y-4">
                  <span className="bg-white/10 text-white border border-white/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider block w-fit">
                    PRO TIP
                  </span>
                  <div className="space-y-1.5 select-none">
                    <h4 className="font-black text-base leading-tight">Increase Sales with Bundles</h4>
                    <p className="text-xs text-white/80 font-medium leading-relaxed">
                      Sellers who bundle facials with home-care kits see 25% higher monthly revenue.
                    </p>
                  </div>
                  <button className="w-full py-3 bg-white text-primary rounded-2xl text-xs font-extrabold hover:bg-white/95 transition-all cursor-pointer shadow-sm active:scale-98">
                    CREATE BUNDLE
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Shop Registration & Profile */}
        {activeTab === "profile" && (
          <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4 select-none">
              <div>
                <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Salon Settings</h2>
                <p className="text-xs text-outline font-medium mt-0.5">Register your beauty salon coords in the marketplace.</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                isRegistered 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                  : "bg-amber-50 text-amber-800 border border-amber-100"
              }`}>
                {isRegistered ? "REGISTERED & ACTIVE" : "REGISTRATION PENDING"}
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              
              {/* Section 1: General Business Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-outline-variant/10 pb-1.5">1. General Business Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Salon / Shop Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={shopDetails.salonName}
                      onChange={(e) => setShopDetails({ ...shopDetails, salonName: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Category Classification</label>
                    <select
                      value={shopDetails.category}
                      onChange={(e) => setShopDetails({ ...shopDetails, category: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Salon">Beauty Salon</option>
                      <option value="Spa">Spa & Wellness Center</option>
                      <option value="Makeup Studio">Makeup Glam Studio</option>
                      <option value="Nails">Nails Boutique</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Owner Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={shopDetails.ownerName}
                      onChange={(e) => setShopDetails({ ...shopDetails, ownerName: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Contact Number <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={shopDetails.contact}
                      onChange={(e) => setShopDetails({ ...shopDetails, contact: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={shopDetails.email}
                      onChange={(e) => setShopDetails({ ...shopDetails, email: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Operation Opening Hours</label>
                    <input
                      type="text"
                      required
                      value={shopDetails.hours}
                      onChange={(e) => setShopDetails({ ...shopDetails, hours: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-outline-variant/10 pb-1.5">2. Location Details</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Physical Address <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={shopDetails.address}
                      onChange={(e) => setShopDetails({ ...shopDetails, address: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline block">City <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={shopDetails.city}
                        onChange={(e) => setShopDetails({ ...shopDetails, city: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline block">State <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={shopDetails.state}
                        onChange={(e) => setShopDetails({ ...shopDetails, state: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Verification & Marketing */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-outline-variant/10 pb-1.5">3. Verification & Branding</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Shop Licence (Verification Document) <span className="text-rose-500">*</span></label>
                    <div 
                      onClick={() => document.getElementById('licence-file-input-edit')?.click()}
                      className={`w-full bg-[#f6f8fd] border-2 border-dashed ${shopDetails.shopLicence ? 'border-emerald-300 bg-emerald-50/20' : 'border-outline-variant/30 hover:border-primary'} focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
                    >
                      <input 
                        id="licence-file-input-edit"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setShopDetails(prev => ({ ...prev, shopLicence: file.name }));
                          }
                        }}
                      />
                      {shopDetails.shopLicence ? (
                        <>
                          <span className="material-symbols-outlined text-emerald-600 text-2xl font-bold">check_circle</span>
                          <span className="text-xs font-bold text-on-surface line-clamp-1">{shopDetails.shopLicence}</span>
                          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Document Uploaded</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-outline text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-on-surface">Click to upload Shop Licence</span>
                          <span className="text-[9px] text-outline font-semibold">Supports PDF, PNG, JPG up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Shop Image <span className="text-rose-500">*</span></label>
                    <div 
                      onClick={() => document.getElementById('shop-image-file-input-edit')?.click()}
                      className={`w-full bg-[#f6f8fd] border-2 border-dashed ${shopDetails.shopImage ? 'border-emerald-300 bg-emerald-50/20' : 'border-outline-variant/30 hover:border-primary'} focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
                    >
                      <input 
                        id="shop-image-file-input-edit"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setShopDetails(prev => ({ ...prev, shopImage: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {shopDetails.shopImage ? (
                        <div className="flex flex-col items-center gap-1 select-none">
                          <img src={shopDetails.shopImage} alt="Shop Uploaded" className="w-16 h-10 object-cover rounded-lg shadow-sm border border-outline-variant/10" />
                          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Shop Image Loaded</span>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-outline text-2xl">image</span>
                          <span className="text-xs font-bold text-on-surface">Click to upload Shop Image</span>
                          <span className="text-[9px] text-outline font-semibold">Supports PNG, JPG, WEBP up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Salon Biography Description</label>
                  <textarea
                    rows={4}
                    required
                    value={shopDetails.description}
                    onChange={(e) => setShopDetails({ ...shopDetails, description: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-primary hover:opacity-90 text-white rounded-2xl px-8 py-3.5 text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  SAVE COORDINATES
                </button>
              </div>

            </form>

          </div>
        )}

        {/* Tab 3: Bookings Management */}
        {activeTab === "bookings" && (
          <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            
            <div className="flex justify-between items-center select-none">
              <div>
                <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Active Bookings</h2>
                <p className="text-xs text-outline font-medium mt-0.5">Full registry of salon appointment bookings.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-[10px] text-outline font-black uppercase tracking-wider pb-3">
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Service</th>
                    <th className="pb-3 pr-4">Scheduled Date</th>
                    <th className="pb-3 pr-4 text-center">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {bookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-surface-container-lowest/30 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${bk.colorClass} shadow-inner`}>
                            {bk.avatarInitials}
                          </span>
                          <span className="font-extrabold text-on-surface">{bk.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-on-surface-variant font-semibold">{bk.service}</td>
                      <td className="py-3.5 pr-4 text-on-surface-variant/80 font-medium">{bk.date}</td>
                      <td className="py-3.5 pr-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          bk.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : bk.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {bk.status !== "Confirmed" && (
                            <button
                              onClick={() => handleToggleBookingStatus(bk.id, "Confirmed")}
                              className="px-2.5 py-1.5 hover:bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold text-[10px] transition-colors cursor-pointer shadow-sm"
                            >
                              Confirm
                            </button>
                          )}
                          {bk.status !== "Cancelled" && (
                            <button
                              onClick={() => handleToggleBookingStatus(bk.id, "Cancelled")}
                              className="px-2.5 py-1.5 hover:bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold text-[10px] transition-colors cursor-pointer shadow-sm"
                            >
                              Cancel
                            </button>
                          )}
                          {bk.status === "Cancelled" && (
                            <span className="text-[10px] text-outline font-semibold italic">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 4: Services coordinates list */}
        {activeTab === "services" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center select-none">
              <div>
                <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Active Treatments</h2>
                <p className="text-xs text-outline font-medium mt-0.5">Manage services offered at your salon counter.</p>
              </div>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="bg-primary hover:opacity-90 text-white rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-bold select-none">add</span>
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((item) => (
                <div key={item.id} className="bg-white border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                  {item.image && (
                    <div className="w-full aspect-[21/9] bg-surface-container-low border-b border-outline-variant/5 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.label} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="bg-purple-100 text-primary text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="font-extrabold text-primary text-sm sm:text-base">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-on-surface">{item.label}</h3>
                      <p className="text-xs text-on-surface-variant font-medium leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      {item.benefits && (
                        <div className="mt-2 text-[10px] text-outline font-semibold leading-relaxed border-t border-outline-variant/5 pt-2">
                          <span className="font-extrabold text-on-surface block mb-0.5">Benefits / Requirements:</span>
                          <span className="italic line-clamp-2 text-on-surface-variant">{item.benefits}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t border-outline-variant/5 pt-3 select-none">
                      <span className="text-[10px] text-outline font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {item.duration}
                      </span>
                      <button
                        onClick={() => setServices((prev) => prev.filter((s) => s.id !== item.id))}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 5: Products coordinates list */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center select-none">
              <div>
                <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Product Catalog</h2>
                <p className="text-xs text-outline font-medium mt-0.5">Manage products offered in your retail store.</p>
              </div>
              <button
                onClick={() => router.push("/seller/products/add")}
                className="bg-primary hover:opacity-90 text-white rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-bold select-none">add</span>
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto bg-white border border-outline-variant/10 rounded-[32px] p-6 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-[10px] text-outline font-black uppercase tracking-wider pb-3">
                    <th className="pb-3 pr-4">Product ID</th>
                    <th className="pb-3 pr-4">Thumbnail</th>
                    <th className="pb-3 pr-4">Product Name</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Price</th>
                    <th className="pb-3 pr-4 text-center">Stocks</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-lowest/30 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-outline text-[10px]">{item.id}</td>
                      <td className="py-3.5 pr-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div>
                          <span className="text-[9px] font-black text-outline uppercase tracking-wider block">{item.brand}</span>
                          <span className="font-extrabold text-on-surface text-xs sm:text-sm">{item.name}</span>
                          {item.size && (
                            <span className="text-[10px] text-outline block mt-0.5">Size: {item.size}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="bg-purple-100 text-primary text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-primary">₹{item.price.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 pr-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          item.stock > 20 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {item.stock} Qty
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProductClick(item)}
                            className="px-2.5 py-1.5 hover:bg-primary/5 text-primary border border-primary/20 rounded-xl font-bold text-[10px] transition-colors cursor-pointer shadow-sm active:scale-95"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setProducts((prev) => prev.filter((p) => p.id !== item.id))}
                            className="px-2.5 py-1.5 hover:bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold text-[10px] transition-colors cursor-pointer shadow-sm active:scale-95"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 6: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            
            <div className="flex justify-between items-center select-none">
              <div>
                <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Product Orders</h2>
                <p className="text-xs text-outline font-medium mt-0.5">Track and ship boutique physical products.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-[10px] text-outline font-black uppercase tracking-wider pb-3">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Product Name</th>
                    <th className="pb-3 pr-4 text-center">Qty</th>
                    <th className="pb-3 pr-4 text-center">Total Paid</th>
                    <th className="pb-3 pr-4 text-center">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-surface-container-lowest/30 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-primary">{ord.id}</td>
                      <td className="py-3.5 pr-4 font-extrabold text-on-surface">{ord.customerName}</td>
                      <td className="py-3.5 pr-4 text-on-surface-variant font-semibold">{ord.productName}</td>
                      <td className="py-3.5 pr-4 text-center text-on-surface-variant/80 font-medium">{ord.qty}</td>
                      <td className="py-3.5 pr-4 text-center font-bold text-on-surface">₹{ord.total.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 pr-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : ord.status === "Shipped"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-amber-50 text-amber-800 border border-amber-100"
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ord.status === "Pending" && (
                            <button
                              onClick={() => handleToggleOrderStatus(ord.id, "Shipped")}
                              className="px-2.5 py-1.5 bg-primary text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                              Mark Shipped
                            </button>
                          )}
                          {ord.status === "Shipped" && (
                            <button
                              onClick={() => handleToggleOrderStatus(ord.id, "Delivered")}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {ord.status === "Delivered" && (
                            <span className="text-[10px] text-outline font-semibold italic">Fulfilled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 7: Earnings info */}
        {activeTab === "earnings" && (
          <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Revenue Analytics</h2>
            <div className="p-8 border border-outline-variant/10 rounded-2xl bg-surface-container-low/30 text-center select-none py-16">
              <span className="material-symbols-outlined text-4xl text-primary mb-2">monitoring</span>
              <h3 className="font-extrabold text-lg text-on-surface">Weekly Revenue Ledger</h3>
              <p className="text-xs text-outline font-medium mt-1 max-w-sm mx-auto">
                Comprehensive chart analytics, customer checkout billing, and payouts processing settlements.
              </p>
            </div>
          </div>
        )}

        {/* Tab 8: General settings */}
        {activeTab === "settings" && (
          <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-extrabold text-on-surface tracking-tight">Account Settings</h2>
            <div className="space-y-4 max-w-md select-none">
              <div className="p-4 bg-surface-container-low border border-outline-variant/5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface">Email Notifications</h4>
                  <p className="text-[10px] text-outline font-medium mt-0.5">Send alerts for new appointment bookings.</p>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl cursor-pointer">toggle_on</span>
              </div>
              <div className="p-4 bg-surface-container-low border border-outline-variant/5 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface">Auto-Confirm Booking</h4>
                  <p className="text-[10px] text-outline font-medium mt-0.5">Automatically confirm slots upon booking checkouts.</p>
                </div>
                <span className="material-symbols-outlined text-outline text-2xl cursor-pointer">toggle_off</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>

      {/* ----------------------------------------------------
          MODAL: ADD SERVICE FORM
          ---------------------------------------------------- */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-[#151c27]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowAddServiceModal(false)}>
          <div 
            className="bg-white rounded-[32px] border border-outline-variant/10 shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading State Overlay */}
            {isSubmittingService && (
              <div className="absolute inset-0 bg-white/95 rounded-[32px] flex flex-col items-center justify-center space-y-3 z-50 animate-in fade-in">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider animate-pulse">Creating Service...</p>
              </div>
            )}

            {/* Success State Overlay */}
            {isServiceSuccess && (
              <div className="absolute inset-0 bg-white rounded-[32px] flex flex-col items-center justify-center space-y-3 z-50 animate-in zoom-in-95">
                <span className="material-symbols-outlined text-emerald-500 text-6xl font-bold animate-bounce">check_circle</span>
                <h4 className="text-lg font-black text-on-surface">Service Created!</h4>
                <p className="text-xs text-outline font-medium">Successfully published and added to menu.</p>
              </div>
            )}

            <div className="flex justify-between items-center select-none border-b border-outline-variant/5 pb-3">
              <div>
                <h3 className="font-black text-lg text-on-surface">Create Service</h3>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-0.5">Offer custom beauty salon treatments</p>
              </div>
              <button 
                onClick={() => setShowAddServiceModal(false)}
                className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-[#f6f8fd] transition-colors cursor-pointer text-on-surface"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="space-y-4 pt-2">
              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-primary border-b border-primary/5 pb-1">1. Basic Information</h4>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Service Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radiance Glow Facial"
                    value={newService.label}
                    onChange={(e) => setNewService({ ...newService, label: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Category <span className="text-rose-500">*</span></label>
                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Haircut">Haircut</option>
                      <option value="Facial">Facial</option>
                      <option value="Hair Spa">Hair Spa</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Nails">Nails</option>
                      <option value="Massage">Massage</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Sub Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Skin Brightening"
                      value={newService.subCategory}
                      onChange={(e) => setNewService({ ...newService, subCategory: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Duration */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-primary border-b border-primary/5 pb-1">2. Pricing & Duration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Price (₹) <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1200"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Duration <span className="text-rose-500">*</span></label>
                    <select
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="45 Minutes">45 Minutes</option>
                      <option value="60 Minutes">60 Minutes</option>
                      <option value="90 Minutes">90 Minutes</option>
                      <option value="120 Minutes">120 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Media & Description */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-primary border-b border-primary/5 pb-1">3. Media & Description</h4>
                
                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Featured Service Image</label>
                  <div 
                    onClick={() => document.getElementById('featured-service-image-file')?.click()}
                    className={`w-full bg-[#f6f8fd] border-2 border-dashed ${newService.image ? 'border-emerald-300 bg-emerald-50/20' : 'border-outline-variant/30 hover:border-primary'} focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
                  >
                    <input 
                      id="featured-service-image-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewService(prev => ({ ...prev, image: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {newService.image ? (
                      <div className="flex flex-col items-center gap-1.5 select-none">
                        <img src={newService.image} alt="Featured Service" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-outline-variant/10 animate-in fade-in" />
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Service Image Loaded</span>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-outline text-2xl animate-pulse">cloud_upload</span>
                        <span className="text-xs font-bold text-on-surface">Click/Drag to upload Service Image</span>
                        <span className="text-[9px] text-outline font-semibold">Supports PNG, JPG, WEBP up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Short Description <span className="text-rose-500">*</span></label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Short description for display card..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Full Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide full details of the treatment, steps involved, skin benefits, etc."
                    value={newService.fullDescription}
                    onChange={(e) => setNewService({ ...newService, fullDescription: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Section 4: Availability & Extra Settings */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-primary border-b border-primary/5 pb-1">4. Availability & Settings</h4>
                
                {/* Available Days */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const isChecked = newService.availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setNewService((prev) => {
                              const list = prev.availableDays.includes(day)
                                ? prev.availableDays.filter((d) => d !== day)
                                : [...prev.availableDays, day];
                              return { ...prev, availableDays: list };
                            });
                          }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            isChecked 
                              ? "bg-primary text-white border-primary shadow-sm" 
                              : "bg-[#f6f8fd] text-outline border-outline-variant/20 hover:border-primary/40"
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  {/* Gender Option */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Gender Target</label>
                    <div className="flex bg-[#f6f8fd] border border-outline-variant/20 p-1 rounded-2xl gap-1">
                      {["Men", "Women", "Unisex"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setNewService({ ...newService, gender: g as any })}
                          className={`flex-1 text-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                            newService.gender === g 
                              ? "bg-white text-primary shadow-sm border border-outline-variant/10" 
                              : "text-outline hover:text-on-surface"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Service Status</label>
                    <select
                      value={newService.status}
                      onChange={(e) => setNewService({ ...newService, status: e.target.value as any })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 pt-2 border-t border-outline-variant/5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newService.homeServiceAvailable}
                      onChange={(e) => setNewService({ ...newService, homeServiceAvailable: e.target.checked })}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-outline">Home Service Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newService.featuredService}
                      onChange={(e) => setNewService({ ...newService, featuredService: e.target.checked })}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-outline">Featured Service</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-4 pt-4 border-t border-outline-variant/5">
                <button
                  type="button"
                  onClick={() => {
                    setNewService(prev => ({ ...prev, status: "Draft" }));
                    setTimeout(() => {
                      document.getElementById('service-submit-btn')?.click();
                    }, 50);
                  }}
                  className="flex-1 py-3 border border-outline-variant/30 hover:bg-[#f6f8fd] text-outline hover:text-on-surface rounded-2xl text-xs font-extrabold transition-all cursor-pointer text-center"
                >
                  SAVE DRAFT
                </button>
                <button
                  id="service-submit-btn"
                  type="submit"
                  onClick={() => setNewService(prev => ({ ...prev, status: "Active" }))}
                  className="flex-1 py-3 bg-primary text-white rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-98"
                >
                  PUBLISH SERVICE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: ADD PRODUCT FORM
          ---------------------------------------------------- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-[#151c27]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => { setShowAddProductModal(false); setProductFormStep(1); setEditingProduct(null); }}>
          <div 
            className="bg-white rounded-[32px] border border-outline-variant/10 shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Overlay */}
            {isSubmittingProduct && (
              <div className="absolute inset-0 bg-white/95 rounded-[32px] flex flex-col items-center justify-center space-y-3 z-50 animate-in fade-in">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider animate-pulse">Publishing Product...</p>
              </div>
            )}

            {/* Success Overlay */}
            {isProductSuccess && (
              <div className="absolute inset-0 bg-white rounded-[32px] flex flex-col items-center justify-center space-y-3 z-50 animate-in zoom-in-95">
                <span className="material-symbols-outlined text-emerald-500 text-6xl font-bold animate-bounce">check_circle</span>
                <h4 className="text-lg font-black text-on-surface">{editingProduct ? "Product Updated!" : "Product Added!"}</h4>
                <p className="text-xs text-outline font-medium">Successfully catalogued in your store inventory.</p>
              </div>
            )}

            <div className="flex justify-between items-center select-none border-b border-outline-variant/5 pb-3">
              <div>
                <h3 className="font-black text-lg text-on-surface">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-0.5">Step {productFormStep} of 4</p>
              </div>
              <button 
                onClick={() => { setShowAddProductModal(false); setProductFormStep(1); setEditingProduct(null); }}
                className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-[#f6f8fd] transition-colors cursor-pointer text-on-surface"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center gap-1 select-none pt-1">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    productFormStep >= step ? "bg-primary" : "bg-outline-variant/20"
                  }`}
                />
              ))}
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 pt-2">
              {/* STEP 1: Basic Information */}
              {productFormStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-primary">Step 1: Basic Information</h4>
                    <p className="text-[10px] text-outline">Tell us about your product basics.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Product Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Silk Moisture Hair Mask"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Brand Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shena Essentials"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Category <span className="text-rose-500">*</span></label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="Haircare">Haircare</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Wellness">Wellness</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Sub Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Hair Treatment"
                        value={newProduct.subCategory}
                        onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Product Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Cream Mask"
                        value={newProduct.productType}
                        onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Skin Type Option</label>
                      <select
                        value={newProduct.skinType}
                        onChange={(e) => setNewProduct({ ...newProduct, skinType: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Skin Types</option>
                        <option value="Dry">Dry Skin</option>
                        <option value="Oily">Oily Skin</option>
                        <option value="Sensitive">Sensitive Skin</option>
                        <option value="Combination">Combination Skin</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Hair Type Option</label>
                      <select
                        value={newProduct.hairType}
                        onChange={(e) => setNewProduct({ ...newProduct, hairType: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Hair Types</option>
                        <option value="Straight">Straight Hair</option>
                        <option value="Wavy">Wavy Hair</option>
                        <option value="Curly">Curly Hair</option>
                        <option value="Dry">Dry/Damaged Hair</option>
                        <option value="Oily">Oily Hair</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProduct.name || !newProduct.brand || !newProduct.category) {
                          alert("Please fill in all required fields marked with * before proceeding.");
                          return;
                        }
                        setProductFormStep(2);
                      }}
                      className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      Continue
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Pricing & Inventory */}
              {productFormStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-primary">Step 2: Pricing & Inventory</h4>
                    <p className="text-[10px] text-outline">Manage selling rates, discounts, and stocks.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Selling Price (₹) <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 1500"
                        value={newProduct.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewProduct((prev) => {
                            const mrpNum = prev.mrp ? Number(prev.mrp) : 0;
                            const prcNum = val ? Number(val) : 0;
                            const dsc = mrpNum > prcNum && mrpNum > 0 ? Math.round(((mrpNum - prcNum) / mrpNum) * 100) : 0;
                            return { ...prev, price: val, discount: dsc };
                          });
                        }}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">MRP (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 2000"
                        value={newProduct.mrp}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewProduct((prev) => {
                            const mrpNum = val ? Number(val) : 0;
                            const prcNum = prev.price ? Number(prev.price) : 0;
                            const dsc = mrpNum > prcNum && mrpNum > 0 ? Math.round(((mrpNum - prcNum) / mrpNum) * 100) : 0;
                            return { ...prev, mrp: val, discount: dsc };
                          });
                        }}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  {newProduct.mrp && Number(newProduct.mrp) > Number(newProduct.price) && (
                    <div className="bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2 text-[10px] font-bold flex items-center gap-1.5 animate-in slide-in-from-top-1 select-none">
                      <span className="material-symbols-outlined text-sm">local_offer</span>
                      Auto-calculated discount: <span className="font-black text-xs">{newProduct.discount}% Off</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Stock Quantity <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Product Status</label>
                      <select
                        value={newProduct.status}
                        onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as any })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Weight (e.g. 150g)</label>
                      <input
                        type="text"
                        placeholder="e.g. 150g"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Shipping Charge (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={newProduct.shippingCharge}
                        onChange={(e) => setNewProduct({ ...newProduct, shippingCharge: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 select-none">
                    <button
                      type="button"
                      onClick={() => setProductFormStep(1)}
                      className="px-5 py-2.5 border border-outline-variant/30 text-outline rounded-xl text-xs font-bold hover:bg-[#f6f8fd] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProduct.price || !newProduct.stock) {
                          alert("Please fill in price and stock parameters.");
                          return;
                        }
                        setProductFormStep(3);
                      }}
                      className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      Continue
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Media & Description */}
              {productFormStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-primary">Step 3: Media & Description</h4>
                    <p className="text-[10px] text-outline">Upload product photos and detail specifications.</p>
                  </div>

                  {/* Featured Image Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Featured Product Image <span className="text-rose-500">*</span></label>
                    <div 
                      onClick={() => document.getElementById('featured-product-image-file')?.click()}
                      className={`w-full bg-[#f6f8fd] border-2 border-dashed ${newProduct.image ? 'border-emerald-300 bg-emerald-50/20' : 'border-outline-variant/30 hover:border-primary'} focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
                    >
                      <input 
                        id="featured-product-image-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProduct(prev => ({ ...prev, image: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {newProduct.image ? (
                        <div className="flex flex-col items-center gap-1.5 select-none">
                          <img src={newProduct.image} alt="Featured Uploaded" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-outline-variant/10 animate-in fade-in" />
                          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Featured Image Loaded</span>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-outline text-2xl animate-pulse">cloud_upload</span>
                          <span className="text-xs font-bold text-on-surface">Click/Drag to upload Featured Image</span>
                          <span className="text-[9px] text-outline font-semibold">Supports PNG, JPG, WEBP up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Product Gallery Upload (Multiple) */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Product Gallery (Optional Multiple Uploads)</label>
                    <div 
                      onClick={() => document.getElementById('gallery-product-images-file')?.click()}
                      className="w-full bg-[#f6f8fd] border-2 border-dashed border-outline-variant/30 hover:border-primary rounded-2xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <input 
                        id="gallery-product-images-file"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProduct((prev) => ({ 
                                ...prev, 
                                gallery: [...prev.gallery, reader.result as string] 
                              }));
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                      <span className="material-symbols-outlined text-outline text-xl">add_photo_alternate</span>
                      <span className="text-[11px] font-bold text-on-surface">Click to add photos to gallery</span>
                    </div>

                    {/* Gallery Preview Grid */}
                    {newProduct.gallery.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in duration-300">
                        {newProduct.gallery.map((imgBase, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10 group">
                            <img src={imgBase} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setNewProduct((prev) => ({
                                    ...prev,
                                    gallery: prev.gallery.filter((_, idx) => idx !== index)
                                  }));
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer shadow-md select-none animate-in scale-in"
                            >
                              <span className="text-[10px] font-bold leading-none">×</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Short Description <span className="text-rose-500">*</span></label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief overview summary of the product features..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Full Description</label>
                    <textarea
                      rows={3}
                      placeholder="Detailed instructions, full ingredient listing, application directions, and warnings."
                      value={newProduct.fullDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, fullDescription: e.target.value })}
                      className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-between pt-3 select-none">
                    <button
                      type="button"
                      onClick={() => setProductFormStep(2)}
                      className="px-5 py-2.5 border border-outline-variant/30 text-outline rounded-xl text-xs font-bold hover:bg-[#f6f8fd] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProduct.image || !newProduct.description) {
                          alert("Please upload a Featured Image and fill in Short Description before proceeding.");
                          return;
                        }
                        setProductFormStep(4);
                      }}
                      className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      Continue
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Tags & SEO Publish */}
              {productFormStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-primary">Step 4: Publish Parameters</h4>
                    <p className="text-[10px] text-outline">Specify product tags and search engine settings.</p>
                  </div>

                  {/* Tags Selector */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Product Tags</label>
                    <div className="flex flex-wrap gap-3">
                      {["Bestseller", "Organic", "Professional", "Vegan"].map((tag) => {
                        const isChecked = newProduct.tags.includes(tag);
                        return (
                          <label key={tag} className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setNewProduct((prev) => {
                                  const list = prev.tags.includes(tag)
                                    ? prev.tags.filter((t) => t !== tag)
                                    : [...prev.tags, tag];
                                  return { ...prev, tags: list };
                                });
                              }}
                              className="accent-primary w-4 h-4 rounded"
                            />
                            <span className="text-[10px] font-bold text-outline hover:text-on-surface">{tag}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* SEO Configuration */}
                  <div className="space-y-3 pt-1 border-t border-outline-variant/5">
                    <h5 className="text-[9px] font-black text-outline uppercase tracking-wider block">SEO Custom Details</h5>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Meta Title</label>
                      <input
                        type="text"
                        placeholder="Meta Tag title for Google search display..."
                        value={newProduct.metaTitle}
                        onChange={(e) => setNewProduct({ ...newProduct, metaTitle: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Meta Description</label>
                      <textarea
                        rows={2}
                        placeholder="Snippet summarized description for index ranking..."
                        value={newProduct.metaDescription}
                        onChange={(e) => setNewProduct({ ...newProduct, metaDescription: e.target.value })}
                        className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Summary Check Grid */}
                  <div className="bg-[#f6f8fd] border border-outline-variant/15 p-3 rounded-2xl space-y-2 select-none text-[10px] font-bold text-outline">
                    <span className="text-[9px] font-black text-primary uppercase block tracking-wider pb-1 border-b border-outline-variant/5">Submission Preview</span>
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="text-on-surface line-clamp-1">{newProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price / Stock:</span>
                      <span className="text-on-surface">₹{newProduct.price} / Qty: {newProduct.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-on-surface">{newProduct.status}</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 select-none gap-4">
                    <button
                      type="button"
                      onClick={() => setProductFormStep(3)}
                      className="px-4 py-3 border border-outline-variant/30 text-outline rounded-xl text-xs font-bold hover:bg-[#f6f8fd] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setNewProduct(prev => ({ ...prev, status: "Draft" }));
                        setTimeout(() => {
                          document.getElementById('product-submit-btn')?.click();
                        }, 50);
                      }}
                      className="flex-1 py-3 border border-primary/20 hover:bg-primary/5 text-primary rounded-xl text-xs font-black transition-all cursor-pointer text-center"
                    >
                      SAVE DRAFT
                    </button>

                    <button
                      id="product-submit-btn"
                      type="submit"
                      onClick={() => {
                        if (newProduct.status === "Draft") return;
                        setNewProduct(prev => ({ ...prev, status: "Active" }));
                      }}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-95"
                    >
                      PUBLISH PRODUCT
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}



      {/* ----------------------------------------------------
          MODAL: NEW BOOKING LOGGER
          ---------------------------------------------------- */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 bg-[#151c27]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowAddBookingModal(false)}>
          <div 
            className="bg-white rounded-[32px] border border-outline-variant/10 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center select-none">
              <h3 className="font-black text-lg text-on-surface">Log Manual Appointment</h3>
              <button 
                onClick={() => setShowAddBookingModal(false)}
                className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-[#f6f8fd] transition-colors cursor-pointer text-on-surface"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleAddBookingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kishan Kumar"
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Treatment Service</label>
                <select
                  value={newBooking.service}
                  onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {services.map((item) => (
                    <option key={item.id} value={item.label}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 26 Oct"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-outline block">Time Slot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-98"
                >
                  LOG APPOINTMENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SellerPortal;
