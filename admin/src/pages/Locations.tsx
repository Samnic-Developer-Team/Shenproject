import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

interface ManagedLocation {
  _id: string;
  city: string;
  state: string;
  isActive: boolean;
  createdAt?: string;
}

interface ShopownerLocation {
  city: string;
  state: string;
}

export function Locations() {
  const [managedLocations, setManagedLocations] = useState<ManagedLocation[]>([]);
  const [shopownerLocations, setShopownerLocations] = useState<ShopownerLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Form state
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("Arunachal Pradesh");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tabs for Locations page
  const [activeTab, setActiveTab] = useState<"MANAGED" | "SUGGESTIONS">("MANAGED");

  async function fetchLocationsData() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both managed locations and seller unique locations
      const [managedRes, shopownerRes] = await Promise.all([
        apiRequest("/locations"),
        apiRequest("/locations/shopowner-locations")
      ]);

      if (managedRes.success && Array.isArray(managedRes.data)) {
        setManagedLocations(managedRes.data);
      } else {
        setError("Failed to fetch managed locations");
      }

      if (shopownerRes.success && Array.isArray(shopownerRes.data)) {
        setShopownerLocations(shopownerRes.data);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading locations data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLocationsData();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.trim() || !newState.trim()) {
      setFormError("City and State are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const response = await apiRequest("/locations", {
        method: "POST",
        bodyData: {
          city: newCity.trim(),
          state: newState.trim(),
          isActive: true
        }
      });

      if (response.success && response.data) {
        setManagedLocations((prev) => [response.data, ...prev].sort((a, b) => a.city.localeCompare(b.city)));
        setNewCity("");
        setNewState("Arunachal Pradesh");
        alert("Location added successfully!");
      } else {
        setFormError(response.message || "Failed to create location");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to add location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportShopownerLocation = async (city: string, state: string) => {
    try {
      setActionLoadingId(`${city}-${state}`);
      const response = await apiRequest("/locations", {
        method: "POST",
        bodyData: {
          city,
          state,
          isActive: true
        }
      });

      if (response.success && response.data) {
        setManagedLocations((prev) => [response.data, ...prev].sort((a, b) => a.city.localeCompare(b.city)));
        alert(`Location "${city}, ${state}" imported and activated!`);
      } else {
        alert(response.message || "Import failed");
      }
    } catch (err: any) {
      alert(err.message || "Import failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      setActionLoadingId(id);
      const response = await apiRequest(`/locations/${id}/toggle-active`, {
        method: "PATCH"
      });

      if (response.success && response.data) {
        setManagedLocations((prev) =>
          prev.map((loc) => (loc._id === id ? { ...loc, isActive: !currentActive } : loc))
        );
      } else {
        alert(response.message || "Failed to toggle status");
      }
    } catch (err: any) {
      alert(err.message || "Failed to toggle status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      setActionLoadingId(id);
      const response = await apiRequest(`/locations/${id}`, {
        method: "DELETE"
      });

      if (response.success) {
        setManagedLocations((prev) => prev.filter((loc) => loc._id !== id));
      } else {
        alert(response.message || "Delete failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete location");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter managed locations based on search
  const filteredManagedLocations = managedLocations.filter((loc) => {
    const term = searchQuery.toLowerCase();
    return loc.city.toLowerCase().includes(term) || loc.state.toLowerCase().includes(term);
  });

  // Filter unique shopowner locations that are NOT yet managed
  const unmanagedShopownerLocations = shopownerLocations.filter((sl) => {
    return !managedLocations.some(
      (ml) =>
        ml.city.toLowerCase() === sl.city.toLowerCase() &&
        ml.state.toLowerCase() === sl.state.toLowerCase()
    );
  });

  if (loading && managedLocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading Locations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Page header controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("MANAGED")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "MANAGED"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Managed Locations ({filteredManagedLocations.length})
          </button>
          <button
            onClick={() => setActiveTab("SUGGESTIONS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "SUGGESTIONS"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Shopowner Suggestions ({unmanagedShopownerLocations.length})
          </button>
        </div>

        {/* Search Filter for Managed Locations */}
        {activeTab === "MANAGED" && (
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 transition-all"
            />
          </div>
        )}
      </div>

      {/* Main Grid: Management Form and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Add Location Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Add New Location
          </h3>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                City / Region
              </label>
              <input
                type="text"
                placeholder="e.g. Pune"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900 focus:bg-white transition-all text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                State / Province Code
              </label>
              <input
                type="text"
                placeholder="e.g. MH or NCR"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900 focus:bg-white transition-all text-slate-900"
              />
            </div>

            {formError && (
              <p className="text-[11px] font-semibold text-red-650 bg-red-50 p-2.5 rounded-lg border border-red-150">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-blue-950 hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {isSubmitting ? "Creating..." : "Create Location"}
            </button>
          </form>
        </div>

        {/* Right Side: Locations Display */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {activeTab === "MANAGED" ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                {filteredManagedLocations.length === 0 ? (
                  <div className="p-12 text-center text-slate-450">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-350">location_on</span>
                    <p className="text-xs font-semibold">No managed locations found</p>
                    {searchQuery && <p className="text-[10px] text-slate-400 mt-1">Try resetting your search query.</p>}
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-6">Location</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                      {filteredManagedLocations.map((loc) => (
                        <tr key={loc._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {loc.city}, {loc.state}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                                loc.isActive
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {loc.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleToggleActive(loc._id, loc.isActive)}
                              disabled={actionLoadingId === loc._id}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                loc.isActive
                                  ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                                  : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                              }`}
                              title={loc.isActive ? "Deactivate" : "Activate"}
                            >
                              {actionLoadingId === loc._id ? "..." : loc.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDelete(loc._id, `${loc.city}, ${loc.state}`)}
                              disabled={actionLoadingId === loc._id}
                              className="p-1.5 rounded-lg border bg-red-50 border-red-200 text-red-650 hover:bg-red-100 transition-all cursor-pointer"
                              title="Delete Location"
                            >
                              {actionLoadingId === loc._id && actionLoadingId !== loc._id ? "..." : (
                                <span className="material-symbols-outlined !text-sm leading-none align-middle">delete</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  These locations were submitted by shopowners when registering their shops, but are not yet registered in the main managed list. Importing them will add them as <strong>Active</strong> in the searchable list.
                </p>
              </div>
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                {unmanagedShopownerLocations.length === 0 ? (
                  <div className="p-12 text-center text-slate-450">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-350">storefront</span>
                    <p className="text-xs font-semibold">No pending shopowner suggestions</p>
                    <p className="text-[10px] text-slate-400 mt-1">All registered shopowner locations are already in the managed list.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-6">Suggested Location</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                      {unmanagedShopownerLocations.map((loc) => {
                        const key = `${loc.city}-${loc.state}`;
                        return (
                          <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6 font-bold text-slate-900">
                              {loc.city}, {loc.state}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleImportShopownerLocation(loc.city, loc.state)}
                                disabled={actionLoadingId === key}
                                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ml-auto disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-xs">download</span>
                                {actionLoadingId === key ? "Importing..." : "Import & Activate"}
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
          )}
        </div>
      </div>
    </div>
  );
}
