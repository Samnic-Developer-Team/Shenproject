import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/users");
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError("Failed to retrieve customers list");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const actionText = currentActive ? "block and deactivate login for" : "unblock and reactivate";
    if (!confirm(`Are you sure you want to ${actionText} this customer?`)) return;
    try {
      setActionLoadingId(id);
      const response = await apiRequest(`/users/${id}/toggle-active`, { method: "PATCH" });
      if (response.success) {
        setUsers(prev =>
          prev.map(user => (user._id === id ? { ...user, isActive: !currentActive } : user))
        );
      } else {
        alert(response.message || "Toggle status failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to toggle customer status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading Customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
          />
        </div>

        <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
          Total Customers: {filteredUsers.length}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Users Grid / Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">group</span>
              <p className="text-xs font-semibold">No customers registered yet</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 pl-6">Customer Name</th>
                  <th className="py-4">Email Address</th>
                  <th className="py-4">Role</th>
                  <th className="py-4">Registration Date</th>
                  <th className="py-4">Login Status</th>
                  <th className="py-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsers.map((user) => {
                  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
                  return (
                    <tr key={user._id} className="hover:bg-slate-55/10 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 font-extrabold text-xs">
                            {initial}
                          </div>
                          <span className="font-extrabold text-slate-900 text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-slate-800">{user.email}</span>
                      </td>
                      <td className="py-4 font-mono text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-700 text-[9px] font-extrabold uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-650 text-[9px] font-extrabold uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right pr-6">
                        <button
                          onClick={() => handleToggleActive(user._id, user.isActive)}
                          disabled={actionLoadingId === user._id}
                          className={`px-3 py-1.5 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50 border ${
                            user.isActive
                              ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                              : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                          }`}
                        >
                          {user.isActive ? "Block User" : "Unblock User"}
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

export default Users;
