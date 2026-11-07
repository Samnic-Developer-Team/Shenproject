import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  image?: string;
  status: string;
  sellerId?: {
    _id: string;
    salonName: string;
    ownerName: string;
  } | any;
  createdAt: string;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/products");
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setError("Failed to retrieve products list");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the product "${name}"?`)) return;
    try {
      setActionLoadingId(id);
      const response = await apiRequest(`/products/${id}`, { method: "DELETE" });
      if (response.success) {
        setProducts(prev => prev.filter(product => product._id !== id));
      } else {
        alert(response.message || "Delete failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Get unique categories for filtering
  const categories = ["ALL", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sellerId?.salonName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || product.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter !== "ALL") {
      if (statusFilter === "ACTIVE") {
        matchesStatus = product.stock > 0 && product.status !== "Out of Stock";
      } else if (statusFilter === "OUT_OF_STOCK") {
        matchesStatus = product.stock === 0 || product.status === "Out of Stock";
      }
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by name, brand, salon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-900 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-455 text-lg pointer-events-none">expand_more</span>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-900 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock / 0 Stock</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-455 text-lg pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-655 text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Products Grid / Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">shopping_bag</span>
              <p className="text-xs font-semibold">No products matches your filter criteria</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 pl-6">Product Detail</th>
                  <th className="py-4">Salon / Studio</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Brand</th>
                  <th className="py-4">Stock</th>
                  <th className="py-4">Price</th>
                  <th className="py-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredProducts.map((product) => {
                  const defaultImg = "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=300";
                  const image = product.image || defaultImg;
                  const salonName = product.sellerId?.salonName || "Unknown Salon";
                  const ownerName = product.sellerId?.ownerName || "";
                  const isOutOfStock = product.stock === 0 || product.status === "Out of Stock";

                  return (
                    <tr key={product._id} className="hover:bg-slate-55/10 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-4 max-w-sm">
                          <img
                            src={image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                            onError={(e) => {
                              (e.target as any).src = defaultImg;
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-slate-900 text-sm truncate">{product.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[280px]">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{salonName}</span>
                          {ownerName && <span className="text-[10px] text-slate-400 font-medium">{ownerName}</span>}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-pink-700">{product.category}</span>
                      </td>
                      <td className="py-4 font-semibold text-slate-650">
                        {product.brand || "N/A"}
                      </td>
                      <td className="py-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-600 text-[9px] font-extrabold uppercase">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="font-bold text-slate-700">
                            {product.stock} units
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-slate-900 font-extrabold text-sm">
                        ₹{product.price}
                      </td>
                      <td className="py-4 text-right pr-6">
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={actionLoadingId === product._id}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-655 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
