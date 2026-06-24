import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Download,
  AlertTriangle,
} from "lucide-react";

export default function AdminOverview({ user }) {
  const stats = [
    { label: "Total Revenue", value: "$18,245.80", change: "+12.4%", desc: "vs last month", icon: TrendingUp, tone: "green" },
    { label: "Active Customers", value: "1,248", change: "+8.2%", desc: "vs last week", icon: Users, tone: "blue" },
    { label: "Low Stock Items", value: "4 Products", change: "Action required", desc: "Critical level", icon: AlertTriangle, tone: "amber" },
    { label: "Pending Deliveries", value: "15 Orders", change: "Within 10 mins", desc: "Live queue", icon: Clock, tone: "emerald" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#153d2b] to-emerald-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10" />
        <h2 className="text-xl sm:text-2xl font-black">Welcome back, {user?.fullName || "Admin"}!</h2>
        <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mt-1">
          Here is a summary of what's happening at Organic Store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-black text-stone-900">{stat.value}</p>
                <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded-md font-black text-[9px] ${
                    stat.tone === "green" ? "bg-emerald-50 text-emerald-700" :
                    stat.tone === "blue" ? "bg-blue-50 text-blue-700" :
                    stat.tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {stat.change}
                  </span>
                  <span>{stat.desc}</span>
                </p>
              </div>
              <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                stat.tone === "green" ? "bg-emerald-50 text-emerald-700" :
                stat.tone === "blue" ? "bg-blue-50 text-blue-700" :
                stat.tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
              }`}>
                <Icon size={20} />
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="text-sm font-extrabold text-stone-500 uppercase tracking-wider mb-4">Quick Workspaces</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Product management */}
          <Link to="/admin/products" className="group bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Catalog</p>
              <h4 className="text-sm font-black text-stone-800 mt-2">Product management</h4>
              <p className="text-xs text-stone-500 font-medium mt-1">Control pricing, descriptions, and stock counts.</p>
            </div>
            <span className="text-xs font-bold text-[#153d2b] flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open inventory <ArrowRight size={14} />
            </span>
          </Link>

          {/* Card 2: Advance order */}
          <Link to="/admin/orders" className="group bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Dispatch</p>
              <h4 className="text-sm font-black text-stone-800 mt-2">Advance order</h4>
              <p className="text-xs text-stone-500 font-medium mt-1">Review the live queue and assign riders.</p>
            </div>
            <span className="text-xs font-bold text-[#153d2b] flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open live queue <ArrowRight size={14} />
            </span>
          </Link>

          {/* Card 3: Content manager */}
          <Link to="/admin/content" className="group bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Storefront</p>
              <h4 className="text-sm font-black text-stone-800 mt-2">Content manager</h4>
              <p className="text-xs text-stone-500 font-medium mt-1">Update promotional banners and blog articles.</p>
            </div>
            <span className="text-xs font-bold text-[#153d2b] flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open editor <ArrowRight size={14} />
            </span>
          </Link>

          {/* Card 4: Store settings */}
          <Link to="/admin/settings" className="group bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Operations</p>
              <h4 className="text-sm font-black text-stone-800 mt-2">Store settings</h4>
              <p className="text-xs text-stone-500 font-medium mt-1">Configure opening hours and delivery fees.</p>
            </div>
            <span className="text-xs font-bold text-[#153d2b] flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open settings <ArrowRight size={14} />
            </span>
          </Link>

        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-black text-stone-800">Export Report Data</h4>
          <p className="text-xs text-stone-500 font-medium mt-1">Download raw spreadsheet reports for sales, products, and customer lists.</p>
        </div>
        <button
          onClick={() => alert("Downloading spreadsheet...")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-stone-700 hover:text-[#153d2b] text-xs font-extrabold transition shrink-0 cursor-pointer"
        >
          <Download size={14} />
          <span>Export store data</span>
        </button>
      </div>
    </div>
  );
}
