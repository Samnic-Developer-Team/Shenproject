import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { Link } from "react-router-dom";

interface StatsData {
  totalUsers: number;
  totalSellers: number;
  totalServices: number;
  totalProducts: number;
  totalBookings: number;
  recentSellers: any[];
  recentBookings: any[];
}

export function Dashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest("/admins/stats");
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading dashboard intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto mt-12">
        <span className="material-symbols-outlined text-red-600 text-4xl mb-3">error</span>
        <h3 className="text-red-700 font-extrabold text-base mb-1">Data Retrieval Failed</h3>
        <p className="text-red-600/80 text-xs font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-98"
        >
          Try Again
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Customers",
      value: stats?.totalUsers ?? 0,
      icon: "group",
      gradient: "from-blue-600/10 to-indigo-600/10",
      bgLight: "bg-blue-50 border-blue-200 text-blue-700",
      description: "Registered users",
      link: "/users"
    },
    {
      title: "Salons & Studios",
      value: stats?.totalSellers ?? 0,
      icon: "storefront",
      gradient: "from-pink-600/10 to-rose-600/10",
      bgLight: "bg-pink-50 border-pink-200 text-pink-700",
      description: "Partner outlets",
      link: "/sellers"
    },
    {
      title: "Total Services",
      value: stats?.totalServices ?? 0,
      icon: "content_cut",
      gradient: "from-purple-600/10 to-violet-600/10",
      bgLight: "bg-purple-50 border-purple-200 text-purple-700",
      description: "Active treatments",
      link: "/services"
    },
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: "shopping_bag",
      gradient: "from-emerald-600/10 to-teal-600/10",
      bgLight: "bg-emerald-50 border-emerald-250 text-emerald-700",
      description: "In-store products",
      link: "/products"
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: "calendar_month",
      gradient: "from-amber-600/10 to-orange-600/10",
      bgLight: "bg-amber-50 border-amber-200 text-amber-700",
      description: "Appointments placed"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((card, idx) => {
          const CardContent = (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-900/35 transition-all duration-300 group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bgLight} border`}>
                  <span className="material-symbols-outlined text-lg">{card.icon}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </span>
                <span className="block text-[10px] text-slate-400 font-semibold mt-1">{card.description}</span>
              </div>
            </div>
          );

          return card.link ? (
            <Link key={idx} to={card.link} className="block cursor-pointer">
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>

      {/* Two Column Layout for Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table (2 cols width) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col h-[400px] shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-900 text-lg">event_note</span>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Recent Appointments</h3>
            </div>
          </div>

          <div className="flex-grow overflow-auto min-w-0 hide-scrollbar">
            {(!stats?.recentBookings || stats.recentBookings.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                <span className="material-symbols-outlined text-3xl mb-1">hourglass_empty</span>
                <span className="text-xs font-semibold">No recent appointments recorded</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Customer</th>
                    <th className="pb-3">Salon</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Schedule</th>
                    <th className="pb-3 text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {stats.recentBookings.map((booking) => {
                    const userName = booking.userId?.name || "Guest User";
                    const userEmail = booking.userId?.email || "";
                    const salonName = booking.sellerId?.salonName || "Salon Outlet";
                    const serviceName = booking.serviceId?.name || "Beauty treatment";
                    const price = booking.serviceId?.price;
                    const date = booking.bookingDate;
                    const slot = booking.timeSlot;

                    let statusBg = "bg-amber-50 border-amber-200 text-amber-700";
                    if (booking.bookingStatus === "CONFIRMED") {
                      statusBg = "bg-emerald-50 border-emerald-250 text-emerald-700";
                    } else if (booking.bookingStatus === "CANCELLED") {
                      statusBg = "bg-red-50 border-red-200 text-red-650";
                    }

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 pl-2">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{userName}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{userEmail}</span>
                          </div>
                        </td>
                        <td className="py-3.5 max-w-[140px] truncate">
                          <span className="font-semibold text-slate-700">{salonName}</span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{serviceName}</span>
                            {price !== undefined && (
                              <span className="text-[10px] text-blue-900 font-bold">₹{price}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{date}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{slot}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${statusBg}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recently Joined Salons (1 col width) */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col h-[400px] shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-900 text-lg">storefront</span>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">New Salons</h3>
            </div>
            <Link to="/sellers" className="text-[10px] font-bold text-blue-900 hover:text-blue-800 transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>

          <div className="flex-grow overflow-auto hide-scrollbar space-y-3">
            {(!stats?.recentSellers || stats.recentSellers.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                <span className="material-symbols-outlined text-3xl mb-1">storefront</span>
                <span className="text-xs font-semibold">No salons registered yet</span>
              </div>
            ) : (
              stats.recentSellers.map((seller) => {
                const logo = seller.shopImage || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=150";
                return (
                  <div key={seller._id} className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-200 transition-all">
                    <img
                      src={logo}
                      alt={seller.salonName}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 border border-slate-200"
                      onError={(e) => {
                        (e.target as any).src = "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=150";
                      }}
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{seller.salonName}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{seller.ownerName}</p>
                      <span className="text-[9px] text-slate-400 font-semibold">{seller.city}, {seller.state || ""}</span>
                    </div>
                    <div>
                      {seller.isApproved ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 block" title="Approved" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse block" title="Pending Approval" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
