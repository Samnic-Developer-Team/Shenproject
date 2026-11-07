import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

interface Seller {
  _id: string;
  salonName: string;
  ownerName: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  shopLicence: string;
  shopImage?: string;
  profileImage?: string;
  bio?: string;
  isApproved: boolean;
  isActive: boolean;
  serviceCount: number;
  productCount: number;
  createdAt: string;
}

export function Sellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal view/edit states
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Seller>>({});
  const [isSaving, setIsSaving] = useState(false);

  async function fetchSellers() {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/sellers/admin/all");
      if (response.success && Array.isArray(response.data)) {
        setSellers(response.data);
      } else {
        setError("Failed to retrieve salons list");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading sellers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the details modal
    if (!confirm("Are you sure you want to approve this salon?")) return;
    try {
      setActionLoadingId(id);
      const response = await apiRequest(`/sellers/${id}/approve`, { method: "PATCH" });
      if (response.success) {
        setSellers(prev =>
          prev.map(seller => (seller._id === id ? { ...seller, isApproved: true } : seller))
        );
        if (selectedSeller?._id === id) {
          setSelectedSeller(prev => prev ? { ...prev, isApproved: true } : null);
        }
      } else {
        alert(response.message || "Approval failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to approve seller");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the details modal
    const actionText = currentActive ? "block and deactivate login for" : "unblock and reactivate";
    if (!confirm(`Are you sure you want to ${actionText} this salon?`)) return;
    try {
      setActionLoadingId(id);
      const response = await apiRequest(`/sellers/${id}/toggle-active`, { method: "PATCH" });
      if (response.success) {
        setSellers(prev =>
          prev.map(seller => (seller._id === id ? { ...seller, isActive: !currentActive } : seller))
        );
        if (selectedSeller?._id === id) {
          setSelectedSeller(prev => prev ? { ...prev, isActive: !currentActive } : null);
        }
      } else {
        alert(response.message || "Toggle status failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to toggle seller status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRowClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setEditForm(seller);
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeller) return;
    try {
      setIsSaving(true);
      const response = await apiRequest(`/sellers/${selectedSeller._id}`, {
        method: "PUT",
        bodyData: editForm,
      });
      if (response.success && response.data) {
        const updatedSeller = {
          ...response.data,
          serviceCount: selectedSeller.serviceCount, // retain counts from table
          productCount: selectedSeller.productCount,
        };
        setSellers(prev =>
          prev.map(s => (s._id === selectedSeller._id ? updatedSeller : s))
        );
        setSelectedSeller(updatedSeller);
        setIsEditing(false);
        alert("Salon details updated successfully!");
      } else {
        alert(response.message || "Failed to save profile changes");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch =
      seller.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PENDING" && !seller.isApproved) ||
      (statusFilter === "APPROVED" && seller.isApproved);

    return matchesSearch && matchesStatus;
  });

  if (loading && sellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading Salon Partners...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative text-slate-800">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by salon name, owner, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {(["ALL", "PENDING", "APPROVED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-blue-900 border-transparent text-white shadow-md shadow-blue-900/10"
                  : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Mobile Card List View (Visible only on mobile/tablet) */}
      <div className="block md:hidden space-y-4">
        {filteredSellers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">storefront</span>
            <p className="text-xs font-semibold">No salons match your selection criteria</p>
          </div>
        ) : (
          filteredSellers.map((seller) => {
            const image = seller.shopImage || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=300";
            const isPending = !seller.isApproved;

            return (
              <div
                key={seller._id}
                onClick={() => handleRowClick(seller)}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-350 transition-all cursor-pointer"
              >
                {/* Header row */}
                <div className="flex items-center gap-3">
                  <img
                    src={image}
                    alt={seller.salonName}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=300";
                    }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-slate-900 text-sm truncate">{seller.salonName}</span>
                    <span className="text-[10px] text-slate-550 font-semibold truncate">{seller.ownerName}</span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact</span>
                    <span className="block font-semibold text-slate-800 truncate">{seller.email}</span>
                    <span className="block text-[10px] text-slate-500 font-medium">{seller.contact}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</span>
                    <span className="block font-medium text-slate-700 truncate">{seller.city}</span>
                    <span className="block text-[10px] text-slate-450 font-medium">{seller.state}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Shop Licence</span>
                    <span className="inline-block font-mono text-[9px] px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-550 rounded-md">
                      {seller.shopLicence}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status</span>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[8px] font-extrabold uppercase tracking-wider">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-700 text-[8px] font-extrabold uppercase tracking-wider">
                        Approved
                      </span>
                    )}
                  </div>
                </div>

                {/* Module counts */}
                <div className="flex gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[9px] font-bold">
                    <span className="font-extrabold">{seller.serviceCount}</span> Services
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-pink-50 text-pink-850 text-[9px] font-bold">
                    <span className="font-extrabold">{seller.productCount}</span> Products
                  </span>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  {isPending && (
                    <button
                      onClick={(e) => handleApprove(seller._id, e)}
                      disabled={actionLoadingId === seller._id}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={(e) => handleToggleActive(seller._id, seller.isActive, e)}
                    disabled={actionLoadingId === seller._id}
                    className={`px-3.5 py-1.5 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer border ${
                      seller.isActive
                        ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-650"
                        : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                    }`}
                  >
                    {seller.isActive ? "Block" : "Unblock"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (Visible only on medium screens and up) */}
      <div className="hidden md:block rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredSellers.length === 0 ? (
            <div className="p-12 text-center text-slate-455">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-350">storefront</span>
              <p className="text-xs font-semibold">No salons match your selection criteria</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 pl-6">Salon & Studio Info (Click row to edit)</th>
                  <th className="py-4">Contact</th>
                  <th className="py-4">Location</th>
                  <th className="py-4 text-center">Modules</th>
                  <th className="py-4">Approval</th>
                  <th className="py-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSellers.map((seller) => {
                  const image = seller.shopImage || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=300";
                  const isPending = !seller.isApproved;

                  return (
                    <tr
                      key={seller._id}
                      onClick={() => handleRowClick(seller)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={image}
                            alt={seller.salonName}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            onError={(e) => {
                              (e.target as any).src = "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=300";
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-slate-950 text-sm truncate">{seller.salonName}</span>
                            <span className="text-[10px] text-slate-550 font-semibold truncate">{seller.ownerName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{seller.email}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{seller.contact}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{seller.city}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{seller.state}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <span className="inline-flex flex-col items-center min-w-10 px-1.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
                            <span className="font-extrabold text-xs">{seller.serviceCount}</span>
                            <span className="text-[7px] uppercase font-bold tracking-wider">Services</span>
                          </span>
                          <span className="inline-flex flex-col items-center min-w-10 px-1.5 py-0.5 rounded-lg bg-pink-50 border border-pink-100 text-pink-850">
                            <span className="font-extrabold text-xs">{seller.productCount}</span>
                            <span className="text-[7px] uppercase font-bold tracking-wider">Products</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-extrabold uppercase tracking-wider animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-amber-400" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-700 text-[9px] font-extrabold uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Approved
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {isPending && (
                            <button
                              onClick={(e) => handleApprove(seller._id, e)}
                              disabled={actionLoadingId === seller._id}
                              className="px-3 py-1.5 bg-emerald-550 hover:bg-emerald-600 border border-emerald-450 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={(e) => handleToggleActive(seller._id, seller.isActive, e)}
                            disabled={actionLoadingId === seller._id}
                            className={`px-3 py-1.5 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50 border ${
                              seller.isActive
                                ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-650"
                                : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                            }`}
                          >
                            {seller.isActive ? "Block" : "Unblock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Salon View/Edit Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-45 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image Header Banner */}
            <div className="h-44 relative bg-slate-100 border-b border-slate-200">
              <img
                src={editForm.shopImage || selectedSeller.shopImage || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=600"}
                alt={selectedSeller.salonName}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  (e.target as any).src = "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=600";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <button
                onClick={() => setSelectedSeller(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg block">close</span>
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold text-white truncate shadow-sm">
                    {isEditing ? "Edit Salon Details" : selectedSeller.salonName}
                  </h3>
                  <p className="text-xs text-slate-200 font-semibold mt-1 truncate">
                    Owner: {selectedSeller.ownerName}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {selectedSeller.isApproved ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 border border-emerald-400/20 text-white text-[9px] font-extrabold uppercase tracking-wider">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-550/90 border border-amber-400/20 text-white text-[9px] font-extrabold uppercase tracking-wider">
                      Pending
                    </span>
                  )}
                  {selectedSeller.isActive ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 border border-emerald-400/20 text-white text-[9px] font-extrabold uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-red-550/90 border border-red-400/20 text-white text-[9px] font-extrabold uppercase tracking-wider">
                      Blocked
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body content */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
              {!isEditing ? (
                /* Detail View Mode */
                <div className="space-y-6 text-xs leading-relaxed text-slate-600">
                  {selectedSeller.bio && (
                    <div>
                      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">About Studio</h4>
                      <p className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-700 italic font-medium">
                        "{selectedSeller.bio}"
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Contact details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-900 text-base">mail</span>
                          <span className="font-semibold text-slate-800">{selectedSeller.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-900 text-base">call</span>
                          <span className="font-semibold text-slate-800">{selectedSeller.contact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Business Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-905 text-base">badge</span>
                          <span className="font-mono text-slate-800 font-semibold">{selectedSeller.shopLicence}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-905 text-base">calendar_today</span>
                          <span>Registered {new Date(selectedSeller.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Location Address</h4>
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-blue-900 text-base mt-0.5">location_on</span>
                      <div>
                        <p className="font-bold text-slate-800">{selectedSeller.address}</p>
                        <p className="text-slate-500 font-medium mt-1">{selectedSeller.city}, {selectedSeller.state}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode Form */
                <form onSubmit={handleSaveEdit} className="space-y-4 text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Salon Name</label>
                      <input
                        type="text"
                        required
                        value={editForm.salonName || ""}
                        onChange={(e) => setEditForm({ ...editForm, salonName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Owner Name</label>
                      <input
                        type="text"
                        required
                        value={editForm.ownerName || ""}
                        onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Contact Number</label>
                      <input
                        type="text"
                        required
                        value={editForm.contact || ""}
                        onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        required
                        value={editForm.address || ""}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1.5">Shop Licence</label>
                      <input
                        type="text"
                        required
                        value={editForm.shopLicence || ""}
                        onChange={(e) => setEditForm({ ...editForm, shopLicence: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        value={editForm.city || ""}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">State</label>
                      <input
                        type="text"
                        required
                        value={editForm.state || ""}
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Shop Image URL</label>
                    <input
                      type="text"
                      value={editForm.shopImage || ""}
                      onChange={(e) => setEditForm({ ...editForm, shopImage: e.target.value })}
                      placeholder="https://example.com/shop.jpg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Salon Bio</label>
                    <textarea
                      rows={3}
                      value={editForm.bio || ""}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Describe services, specialities, etc."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Hidden Submit Button to allow submit on enter key */}
                  <button type="submit" className="hidden" />
                </form>
              )}
            </div>

            {/* Modal Action Buttons Footer */}
            <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                {!isEditing ? (
                  <div className="flex gap-2">
                    {!selectedSeller.isApproved && (
                      <button
                        onClick={(e) => handleApprove(selectedSeller._id, e)}
                        disabled={actionLoadingId === selectedSeller._id}
                        className="px-4 py-2.5 bg-emerald-555 hover:bg-emerald-600 border border-emerald-450 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Approve Salon
                      </button>
                    )}
                    <button
                      onClick={(e) => handleToggleActive(selectedSeller._id, selectedSeller.isActive, e)}
                      disabled={actionLoadingId === selectedSeller._id}
                      className={`px-4 py-2.5 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-50 border ${
                        selectedSeller.isActive
                          ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                          : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                      }`}
                    >
                      {selectedSeller.isActive ? "Block Logins" : "Unblock Logins"}
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 font-semibold italic">Ensure all fields contain valid business records</p>
                )}
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-900/10"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setSelectedSeller(null)}
                      className="px-5 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Close Details
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-900/10 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(selectedSeller);
                      }}
                      className="px-5 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-650 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sellers;
