import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem("shena_admin_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        bodyData: { email, password },
      });

      const { user, tokens } = res.data;

      if (user.role !== "ADMIN") {
        setError("Access Denied: Only administrators can access this panel.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("shena_admin_token", tokens.accessToken);
      localStorage.setItem("shena_admin_user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-xl relative z-10">
        {/* Title / Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-900/10">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shena Admin</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Salon Hub management portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2.5 leading-relaxed">
            <span className="material-symbols-outlined text-red-500 text-lg shrink-0">error</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-slate-950 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                mail
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-slate-950 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                lock
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-950 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md shadow-blue-950/10 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined text-base">login</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-[11px] font-semibold tracking-wide uppercase">
            Demo Credentials
          </p>
          <p className="text-slate-600 text-xs mt-2 font-medium">
            admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
