import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: "grid_view" },
  { name: "Salons & Studios", path: "/sellers", icon: "storefront" },
  { name: "Users / Customers", path: "/users", icon: "group" },
  { name: "Services", path: "/services", icon: "content_cut" },
  { name: "Products", path: "/products", icon: "shopping_bag" },
  { name: "Locations", path: "/locations", icon: "location_on" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("shena_admin_token");
    const userStr = localStorage.getItem("shena_admin_user");
    if (!token || !userStr) {
      localStorage.removeItem("shena_admin_token");
      localStorage.removeItem("shena_admin_user");
      navigate("/login");
      return;
    }
    setAdminUser(JSON.parse(userStr));
  }, [navigate]);

  useEffect(() => {
    // Automatically close mobile sidebar and header dropdown on route transition
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("shena_admin_token");
    localStorage.removeItem("shena_admin_user");
    navigate("/login");
  };

  const getPageTitle = () => {
    const activeItem = navItems.find((item) => item.path === location.pathname);
    return activeItem ? activeItem.name : "Admin Panel";
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex select-none text-slate-800">
      {/* Sidebar Backdrop Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between gap-3 px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Shena Admin
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border border-blue-100 text-blue-900"
                    : "text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={`material-symbols-outlined !text-lg ${isActive ? "text-blue-900" : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom User & Logout block */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-3 rounded-2xl bg-white border border-slate-200 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-extrabold text-sm uppercase">
              {adminUser.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">{adminUser.name}</span>
              <span className="text-[10px] text-slate-500 font-medium truncate">{adminUser.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between fixed top-0 right-0 left-0 lg:left-64 z-10 select-none">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors mr-2 cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* User Profile Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-200 cursor-pointer text-left focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  {adminUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate leading-none mb-0.5">{adminUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-semibold truncate leading-none">Administrator</span>
                </div>
                <span className="material-symbols-outlined text-slate-500 text-sm select-none">
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Click backdrop to close */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2.5 z-20 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-150 mb-1">
                      <span className="block text-xs font-bold text-slate-800">{adminUser.name}</span>
                      <span className="block text-[10px] text-slate-500 font-medium truncate mt-0.5">{adminUser.email}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        alert("Settings module coming soon!");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold transition-all text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">settings</span>
                      Settings
                    </button>
                    
                    <div className="h-px bg-slate-150 my-1" />
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-bold transition-all text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-grow pt-24 px-4 md:px-8 pb-12 bg-slate-50 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
