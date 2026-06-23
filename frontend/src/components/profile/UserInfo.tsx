"use client";

import { useEffect, useState } from "react";
import { getMe, type AuthUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function UserInfo() {
  const { user: storedUser, setAuth, token } = useAuthStore();
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(!storedUser);

  useEffect(() => {
    if (!storedUser && token) {
      getMe()
        .then((u) => {
          setUser(u);
          setFormData({ name: u.name, email: u.email });
          setAuth(u, token);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (storedUser) {
      setUser(storedUser);
      setFormData({ name: storedUser.name, email: storedUser.email });
      setIsLoading(false);
    }
  }, [storedUser, token, setAuth]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm">
        <div className="h-6 bg-surface-container-low rounded animate-pulse w-32 mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-surface-container-low rounded-2xl animate-pulse" />
          <div className="h-10 bg-surface-container-low rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm">
        <p className="text-sm text-on-surface-variant text-center py-8">
          Please <a href="/login" className="text-rose-500 font-bold hover:underline">sign in</a> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-black text-on-surface tracking-tight">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined !text-sm">{isEditing ? "close" : "edit"}</span>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-xl font-black select-none">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-on-surface">{user.name}</p>
          <p className="text-xs text-on-surface-variant">{user.email}</p>
          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full mt-1 inline-block">
            {user.role}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Profile update coming soon!");
            setIsEditing(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl px-4 py-2.5 text-xs font-semibold text-on-surface-variant cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-primary !text-sm">person</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-outline">Name</p>
              <p className="text-sm font-semibold text-on-surface">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-primary !text-sm">mail</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-outline">Email</p>
              <p className="text-sm font-semibold text-on-surface">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
