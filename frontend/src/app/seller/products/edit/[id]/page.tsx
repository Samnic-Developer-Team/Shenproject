"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

const EMPTY_PRODUCT = {
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
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [step, setStep] = useState(1);
  const [product, setProduct] = useState({ ...EMPTY_PRODUCT });
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("Your Shop");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("shena_seller_logged_in");
      if (loggedIn !== "true") {
        router.push("/seller/login");
        return;
      }

      const salonDetailsStr = localStorage.getItem("shena_seller_salon_details");
      if (salonDetailsStr) {
        try {
          const details = JSON.parse(salonDetailsStr);
          if (details._id) setSellerId(details._id);
          if (details.salonName) setShopName(details.salonName);
        } catch (e) {
          console.error(e);
        }
      }

      // Load product from localStorage (set by SellerPortal)
      const editingProductStr = localStorage.getItem("shena_editing_product");
      if (editingProductStr) {
        try {
          const item = JSON.parse(editingProductStr);
          setProduct({
            name: item.name || "",
            brand: item.brand || "",
            category: item.category || "Haircare",
            subCategory: item.subCategory || "",
            productType: item.productType || "",
            price: String(item.price || ""),
            mrp: item.mrp ? String(item.mrp) : "",
            discount: item.discount || 0,
            stock: String(item.stock || ""),
            status: item.status || "Active",
            image: item.image || "",
            gallery: item.gallery || [],
            description: item.description || "",
            fullDescription: item.fullDescription || "",
            skinType: item.skinType || "All",
            hairType: item.hairType || "All",
            tags: item.tags || [],
            weight: item.weight || "",
            shippingCharge: item.shippingCharge ? String(item.shippingCharge) : "",
            metaTitle: item.metaTitle || "",
            metaDescription: item.metaDescription || "",
            size: item.size || "",
            ingredients: item.ingredients || "",
            howToUse: item.howToUse || "",
          });
        } catch (e) {
          console.error(e);
        }
      }

      setIsLoading(false);
    }
  }, [router, productId]);

  const handleSubmit = async (publishStatus: "Active" | "Draft") => {
    if (!product.name || !product.brand || !product.price || !product.stock || !product.description) {
      alert("Please fill in all required fields: Name, Brand, Price, Stock, and Short Description.");
      return;
    }
    if (!product.image) {
      alert("Please upload a featured product image.");
      return;
    }
    if (!sellerId) {
      alert("Seller profile not loaded.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        sellerId,
        name: product.name,
        brand: product.brand,
        category: product.category,
        subCategory: product.subCategory || undefined,
        productType: product.productType || undefined,
        price: Number(product.price),
        mrp: product.mrp ? Number(product.mrp) : undefined,
        discount: product.discount || undefined,
        stock: Number(product.stock),
        status: publishStatus,
        image: product.image,
        gallery: product.gallery || [],
        description: product.description,
        fullDescription: product.fullDescription || undefined,
        skinType: product.skinType || undefined,
        hairType: product.hairType || undefined,
        tags: product.tags || [],
        weight: product.weight || undefined,
        shippingCharge: product.shippingCharge ? Number(product.shippingCharge) : undefined,
        metaTitle: product.metaTitle || undefined,
        metaDescription: product.metaDescription || undefined,
        size: product.size || undefined,
        ingredients: product.ingredients || undefined,
        howToUse: product.howToUse || undefined,
      };

      await apiRequest(`/products/${productId}`, { method: "PATCH", bodyData: payload });

      // Clear editing product from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("shena_editing_product");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/seller?tab=products");
      }, 1800);
    } catch (err: any) {
      console.error("Failed to update product:", err);
      alert(err.message || "Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8fd] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fd] font-sans antialiased">
      {/* ── Top Navigation Bar ─────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-outline-variant/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
              <span className="text-white text-sm font-black leading-none select-none">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase tracking-widest text-outline block">Seller Portal</span>
              <span className="text-xs font-extrabold text-on-surface">{shopName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-outline select-none">
            <Link href="/seller" className="hover:text-violet-600 transition-colors">Dashboard</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span
              className="hover:text-violet-600 transition-colors cursor-pointer"
              onClick={() => router.push("/seller?tab=products")}
            >
              Products
            </span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface font-bold">Edit Product</span>
          </div>

          <Link
            href="/seller?tab=products"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-outline-variant/20 text-[11px] font-bold text-on-surface hover:bg-[#f6f8fd] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="hidden sm:inline">Back to Catalog</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
              Editing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-on-surface">Edit Product</h1>
          <p className="text-sm text-on-surface-variant font-medium">Update the product details below. Changes will reflect immediately after saving.</p>
        </div>

        <div className="bg-white border border-outline-variant/10 rounded-[32px] shadow-sm p-6 sm:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

          {isSubmitting && (
            <div className="absolute inset-0 bg-white/96 rounded-[32px] flex flex-col items-center justify-center space-y-4 z-50 animate-in fade-in">
              <div className="w-14 h-14 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
              <p className="text-xs font-black text-outline uppercase tracking-widest animate-pulse">Saving Changes...</p>
            </div>
          )}

          {isSuccess && (
            <div className="absolute inset-0 bg-white rounded-[32px] flex flex-col items-center justify-center space-y-4 z-50 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-emerald-500 text-4xl font-bold">check_circle</span>
              </div>
              <h3 className="text-xl font-black text-on-surface">Product Updated!</h3>
              <p className="text-xs text-outline font-medium">Changes saved successfully.</p>
            </div>
          )}

          {/* Step Progress */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 select-none">
              {["Basic Info", "Pricing & Inventory", "Media & Details", "Save"].map((label, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                      step > idx + 1
                        ? "bg-violet-600 border-violet-600 text-white"
                        : step === idx + 1
                        ? "bg-white border-violet-600 text-violet-600"
                        : "bg-white border-outline-variant/30 text-outline"
                    }`}
                  >
                    {step > idx + 1 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : idx + 1}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wide hidden sm:block ${step === idx + 1 ? "text-violet-600" : "text-outline"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-violet-600" : "bg-outline-variant/20"}`} />
              ))}
            </div>
          </div>

          {/* ── STEP 1 ─────────────────── */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
              <div className="border-b border-outline-variant/10 pb-3">
                <h2 className="text-base font-black text-on-surface">Step 1: Basic Information</h2>
                <p className="text-[11px] text-outline font-medium mt-0.5">Update your product's basic details.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Product Name <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="e.g. Silk Moisture Hair Mask" value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Brand Name <span className="text-rose-500">*</span></label>
                  <input type="text" placeholder="e.g. Shena Essentials" value={product.brand}
                    onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Category <span className="text-rose-500">*</span></label>
                  <select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none cursor-pointer transition-all">
                    <option value="Haircare">Haircare</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Nails">Nails</option>
                    <option value="Body Care">Body Care</option>
                    <option value="Fragrance">Fragrance</option>
                    <option value="Tools">Tools & Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Sub Category</label>
                  <input type="text" placeholder="e.g. Serums, Masks" value={product.subCategory}
                    onChange={(e) => setProduct({ ...product, subCategory: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Product Type</label>
                  <input type="text" placeholder="e.g. Cream, Gel, Spray" value={product.productType}
                    onChange={(e) => setProduct({ ...product, productType: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Size / Volume</label>
                  <input type="text" placeholder="e.g. 100ml" value={product.size}
                    onChange={(e) => setProduct({ ...product, size: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Ingredients</label>
                  <input type="text" placeholder="e.g. Argan Oil, Vitamin E" value={product.ingredients}
                    onChange={(e) => setProduct({ ...product, ingredients: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Skin Type</label>
                  <select value={product.skinType} onChange={(e) => setProduct({ ...product, skinType: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none cursor-pointer transition-all">
                    <option value="All">All Skin Types</option>
                    <option value="Dry">Dry Skin</option>
                    <option value="Oily">Oily Skin</option>
                    <option value="Sensitive">Sensitive Skin</option>
                    <option value="Combination">Combination Skin</option>
                    <option value="Normal">Normal Skin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Hair Type</label>
                  <select value={product.hairType} onChange={(e) => setProduct({ ...product, hairType: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none cursor-pointer transition-all">
                    <option value="All">All Hair Types</option>
                    <option value="Straight">Straight Hair</option>
                    <option value="Wavy">Wavy Hair</option>
                    <option value="Curly">Curly Hair</option>
                    <option value="Dry">Dry / Damaged Hair</option>
                    <option value="Oily">Oily Hair</option>
                    <option value="Color-Treated">Color Treated</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => {
                  if (!product.name || !product.brand) { alert("Please fill Product Name and Brand."); return; }
                  setStep(2);
                }} className="px-8 py-3 bg-violet-600 text-white rounded-2xl text-sm font-black hover:bg-violet-700 active:scale-95 transition-all shadow-md shadow-violet-200 flex items-center gap-2">
                  Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ─────────────────── */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
              <div className="border-b border-outline-variant/10 pb-3">
                <h2 className="text-base font-black text-on-surface">Step 2: Pricing & Inventory</h2>
                <p className="text-[11px] text-outline font-medium mt-0.5">Update your selling rates and stock.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Selling Price (₹) <span className="text-rose-500">*</span></label>
                  <input type="number" min="0" placeholder="e.g. 1500" value={product.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProduct((prev) => {
                        const mrpNum = prev.mrp ? Number(prev.mrp) : 0;
                        const prcNum = val ? Number(val) : 0;
                        const dsc = mrpNum > prcNum && mrpNum > 0 ? Math.round(((mrpNum - prcNum) / mrpNum) * 100) : 0;
                        return { ...prev, price: val, discount: dsc };
                      });
                    }}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">MRP (₹)</label>
                  <input type="number" min="0" placeholder="e.g. 2000" value={product.mrp}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProduct((prev) => {
                        const mrpNum = val ? Number(val) : 0;
                        const prcNum = prev.price ? Number(prev.price) : 0;
                        const dsc = mrpNum > prcNum && mrpNum > 0 ? Math.round(((mrpNum - prcNum) / mrpNum) * 100) : 0;
                        return { ...prev, mrp: val, discount: dsc };
                      });
                    }}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Discount</label>
                  <div className={`w-full rounded-2xl px-4 py-3 text-sm font-black border flex items-center gap-2 ${
                    product.discount > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-[#f6f8fd] border-outline-variant/20 text-outline"
                  }`}>
                    {product.discount > 0 ? <><span className="material-symbols-outlined text-sm">local_offer</span>{product.discount}% Off</> : <span className="font-medium text-xs">Auto-calculated</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Stock Quantity <span className="text-rose-500">*</span></label>
                  <input type="number" min="0" placeholder="e.g. 50" value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Product Status</label>
                  <select value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value as any })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none cursor-pointer transition-all">
                    <option value="Active">Active — Live on Marketplace</option>
                    <option value="Draft">Draft — Hidden from Customers</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Product Weight</label>
                  <input type="text" placeholder="e.g. 150g" value={product.weight}
                    onChange={(e) => setProduct({ ...product, weight: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Shipping Charge (₹)</label>
                  <input type="number" min="0" placeholder="e.g. 50" value={product.shippingCharge}
                    onChange={(e) => setProduct({ ...product, shippingCharge: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border border-outline-variant/30 text-outline rounded-2xl text-sm font-bold hover:bg-[#f6f8fd] transition-all flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>Back
                </button>
                <button type="button" onClick={() => {
                  if (!product.price || !product.stock) { alert("Please fill in Selling Price and Stock."); return; }
                  setStep(3);
                }} className="px-8 py-3 bg-violet-600 text-white rounded-2xl text-sm font-black hover:bg-violet-700 active:scale-95 transition-all shadow-md shadow-violet-200 flex items-center gap-2">
                  Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ─────────────────── */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
              <div className="border-b border-outline-variant/10 pb-3">
                <h2 className="text-base font-black text-on-surface">Step 3: Media & Description</h2>
                <p className="text-[11px] text-outline font-medium mt-0.5">Update product images and description.</p>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Featured Product Image <span className="text-rose-500">*</span></label>
                <div onClick={() => document.getElementById("edit-featured-img")?.click()}
                  className={`w-full border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    product.image ? "border-emerald-300 bg-emerald-50/30" : "border-outline-variant/30 hover:border-violet-400 bg-[#f6f8fd]"
                  }`}>
                  <input id="edit-featured-img" type="file" className="hidden" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setProduct((prev) => ({ ...prev, image: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }} />
                  {product.image ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={product.image} alt="Featured" className="w-32 h-32 object-cover rounded-2xl shadow-md border border-white" />
                      <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>Image ready — Click to change
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-violet-600 text-3xl">cloud_upload</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-extrabold text-on-surface block">Click to upload featured image</span>
                        <span className="text-xs text-outline font-medium">PNG, JPG, WEBP up to 5MB</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Product Gallery (Optional)</label>
                <div onClick={() => document.getElementById("edit-gallery-img")?.click()}
                  className="w-full border-2 border-dashed border-outline-variant/30 hover:border-violet-400 bg-[#f6f8fd] rounded-2xl p-5 cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                  <input id="edit-gallery-img" type="file" className="hidden" multiple accept="image/*"
                    onChange={(e) => {
                      Array.from(e.target.files || []).forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => setProduct((prev) => ({ ...prev, gallery: [...prev.gallery, reader.result as string] }));
                        reader.readAsDataURL(file);
                      });
                    }} />
                  <span className="material-symbols-outlined text-outline text-2xl">add_photo_alternate</span>
                  <span className="text-sm font-bold text-on-surface">Click to add gallery photos</span>
                </div>
                {product.gallery.length > 0 && (
                  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 pt-1">
                    {product.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/10 group">
                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={(e) => {
                          e.stopPropagation();
                          setProduct((prev) => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }));
                        }} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Short Description <span className="text-rose-500">*</span></label>
                  <textarea rows={3} placeholder="Brief overview of the product..." value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none resize-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Full Description</label>
                  <textarea rows={5} placeholder="Detailed description, ingredients, usage instructions..." value={product.fullDescription}
                    onChange={(e) => setProduct({ ...product, fullDescription: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none resize-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">How to Use</label>
                  <textarea rows={2} placeholder="Step-by-step usage instructions..." value={product.howToUse}
                    onChange={(e) => setProduct({ ...product, howToUse: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none resize-none transition-all" />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 border border-outline-variant/30 text-outline rounded-2xl text-sm font-bold hover:bg-[#f6f8fd] transition-all flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>Back
                </button>
                <button type="button" onClick={() => {
                  if (!product.image || !product.description) { alert("Please upload an image and fill in the description."); return; }
                  setStep(4);
                }} className="px-8 py-3 bg-violet-600 text-white rounded-2xl text-sm font-black hover:bg-violet-700 active:scale-95 transition-all shadow-md shadow-violet-200 flex items-center gap-2">
                  Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4 ─────────────────── */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
              <div className="border-b border-outline-variant/10 pb-3">
                <h2 className="text-base font-black text-on-surface">Step 4: Tags & Save</h2>
                <p className="text-[11px] text-outline font-medium mt-0.5">Confirm tags, SEO settings, then save changes.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Product Tags</label>
                <div className="flex flex-wrap gap-3">
                  {["Bestseller", "Organic", "Professional", "Vegan", "New Arrival", "Salon Exclusive", "Limited Edition"].map((tag) => {
                    const checked = product.tags.includes(tag);
                    return (
                      <button key={tag} type="button"
                        onClick={() => setProduct((prev) => ({ ...prev, tags: checked ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          checked ? "bg-violet-600 text-white border-violet-600 shadow-sm" : "bg-white text-outline border-outline-variant/30 hover:border-violet-400 hover:text-violet-600"
                        }`}>
                        {checked && <span className="mr-1">✓</span>}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-outline-variant/10">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-outline">SEO Details (Optional)</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Meta Title</label>
                  <input type="text" placeholder="Title shown in Google search results..." value={product.metaTitle}
                    onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Meta Description</label>
                  <textarea rows={2} placeholder="Short summary for search results..." value={product.metaDescription}
                    onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })}
                    className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none resize-none transition-all" />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#f6f8fd] border border-outline-variant/15 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-black text-violet-600 uppercase tracking-wider block border-b border-outline-variant/10 pb-2">Changes Preview</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    ["Name", product.name || "—"],
                    ["Brand", product.brand || "—"],
                    ["Category", product.category],
                    ["Price / MRP", `₹${product.price} / ₹${product.mrp || "—"}`],
                    ["Stock", product.stock ? `${product.stock} units` : "—"],
                    ["Status", product.status],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="font-bold text-outline">{k}:</span>
                      <span className="font-extrabold text-on-surface text-right line-clamp-1">{v}</span>
                    </div>
                  ))}
                </div>
                {product.image && (
                  <div className="pt-2 border-t border-outline-variant/10 flex items-center gap-3">
                    <img src={product.image} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-outline-variant/10" />
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>Featured image ready
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setStep(3)} className="px-6 py-3.5 border border-outline-variant/30 text-outline rounded-2xl text-sm font-bold hover:bg-[#f6f8fd] transition-all flex items-center gap-1.5 justify-center">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>Back
                </button>
                <button type="button" onClick={() => handleSubmit("Draft")}
                  className="flex-1 py-3.5 border-2 border-violet-200 hover:bg-violet-50 text-violet-700 rounded-2xl text-sm font-black transition-all cursor-pointer justify-center flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">save</span>SAVE AS DRAFT
                </button>
                <button type="button" onClick={() => handleSubmit("Active")}
                  className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-2xl text-sm font-black hover:from-violet-700 hover:to-purple-800 active:scale-95 transition-all shadow-lg shadow-violet-200 cursor-pointer justify-center flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>SAVE CHANGES
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
