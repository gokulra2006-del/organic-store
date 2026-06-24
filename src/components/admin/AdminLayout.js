import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBasket,
  Zap,
  Truck,
  MessageSquareText,
  BookOpen,
  LineChart,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

const navigation = [
  { label: "Dashboard Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Product Management", path: "/admin/products", icon: ShoppingBasket },
  { label: "Live Order Queue", path: "/admin/orders", icon: Zap, badge: "12" },
  { label: "Delivery Dispatch", path: "/admin/delivery", icon: Truck },
  { label: "Customer Reviews", path: "/admin/reviews", icon: MessageSquareText, badge: "3" },
  { label: "Content Manager", path: "/admin/content", icon: BookOpen },
  { label: "Analytics Dashboard", path: "/admin/analytics", icon: LineChart },
  { label: "Activity Log", path: "/admin/activity", icon: Activity },
  { label: "Store Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children, user, logout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f6f7f3] font-sans text-stone-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#153d2b] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl shadow-inner">🌿</span>
            <div>
              <p className="text-sm font-extrabold tracking-tight">Organic Store</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/70">Admin Panel</p>
            </div>
          </div>
          <button
            aria-label="Close sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-white ring-1 ring-white/10"
                    : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-lime-300" : "text-emerald-200/50"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-lime-300 px-2 py-0.5 text-[10px] font-black text-emerald-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/10 hover:text-red-100 transition"
          >
            <LogOut size={18} className="text-red-300/60" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              aria-label="Open navigation menu"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-black text-stone-900 hidden sm:block">Store Management Dashboard</h1>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50"
            >
              <Bell size={18} className="text-stone-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="h-8 w-px bg-stone-200" />

            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold uppercase">
                {user?.fullName?.slice(0, 2) || "AD"}
              </span>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-stone-800 leading-none">{user?.fullName || "Administrator"}</p>
                <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">
                  {user?.role || "superadmin"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
