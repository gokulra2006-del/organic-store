import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Download,
  AlertTriangle,
  ShoppingBag,
  ChevronRight,
  TrendingDown,
  Sparkles
} from "lucide-react";

export default function AdminOverview({ user }) {
  const stats = [
    { label: "Total Revenue", value: "₹18,245.80", change: "+12.4%", trend: "up", desc: "vs last month", icon: TrendingUp, tone: "emerald" },
    { label: "Active Customers", value: "1,248", change: "+8.2%", trend: "up", desc: "vs last week", icon: Users, tone: "teal" },
    { label: "Low Stock Items", value: "4 Products", change: "-1.5%", trend: "down", desc: "Critical level", icon: AlertTriangle, tone: "amber" },
    { label: "Pending Deliveries", value: "15 Orders", change: "Live", trend: "up", desc: "10m delivery limit", icon: Clock, tone: "rose" },
  ];



  // Dynamic state for hover chart node details
  const [activeDataNode, setActiveDataNode] = useState(null);

  // SVG Chart Mock Data Points (X: 0 to 600, Y: 0 to 180)
  const chartPoints = [
    { x: 30, y: 150, val: "₹1.2k", day: "Mon" },
    { x: 120, y: 110, val: "₹2.8k", day: "Tue" },
    { x: 210, y: 130, val: "₹2.1k", day: "Wed" },
    { x: 300, y: 70, val: "₹4.9k", day: "Thu" },
    { x: 390, y: 90, val: "₹3.8k", day: "Fri" },
    { x: 480, y: 40, val: "₹6.2k", day: "Sat" },
    { x: 570, y: 20, val: "₹7.5k", day: "Sun" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0b2216] via-[#103b22] to-[#1a5b3a] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl shadow-emerald-950/10 border border-emerald-800/20">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-lime-400/20 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black text-lime-300 uppercase tracking-widest border border-white/10">
              <Sparkles size={11} /> Live Dashboard
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mt-1">
              Welcome back, {user?.fullName || "Admin"}!
            </h2>
            <p className="text-emerald-100/70 text-xs sm:text-sm font-medium">
              Here is a summary of what's happening at Organic Store today.
            </p>
          </div>
          <button
            onClick={() => alert("Generating live PDF report...")}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 rounded-xl px-4 py-2.5 text-xs font-black transition-all shadow-lg shadow-lime-400/20 cursor-pointer"
          >
            <Download size={14} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200/50 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow duration-200">
              <div className="space-y-1.5">
                <p className="text-stone-400 text-[10px] font-extrabold uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-stone-900 leading-none">{stat.value}</p>
                <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5 pt-0.5">
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-black text-[9px] ${
                    stat.tone === "emerald" ? "bg-emerald-50 text-emerald-700" :
                    stat.tone === "teal" ? "bg-teal-50 text-teal-700" :
                    stat.tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {stat.change}
                  </span>
                  <span className="text-stone-400 font-medium">{stat.desc}</span>
                </div>
              </div>
              <span className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-inner ${
                stat.tone === "emerald" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                stat.tone === "teal" ? "bg-teal-50 text-teal-700 border border-teal-100" :
                stat.tone === "amber" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-red-50 text-red-700 border border-red-100"
              }`}>
                <Icon size={20} />
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Table section */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Sales & Traffic Trends Chart (SVG) */}
        <div className="bg-white rounded-3xl border border-stone-200/50 p-6 lg:col-span-2 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Weekly Revenue Analytics</h3>
              <p className="text-[11px] text-stone-400 font-bold mt-0.5">Interactive visual breakdown of revenue trends.</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-stone-700 bg-stone-50 border border-stone-200/60 rounded-lg px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Revenue
              </span>
            </div>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="relative pt-4">
            <svg viewBox="0 0 600 200" className="w-full h-auto overflow-visible">
              {/* Background grids */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#f4f4f5" strokeWidth="1" />

              {/* Area gradient under path */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 30 170 L 30 150 L 120 110 L 210 130 L 300 70 L 390 90 L 480 40 L 570 20 L 570 170 Z"
                fill="url(#chartGrad)"
              />

              {/* Curve Line */}
              <path
                d="M 30 150 C 75 130, 75 120, 120 110 C 165 100, 165 140, 210 130 C 255 120, 255 80, 300 70 C 345 60, 345 100, 390 90 C 435 80, 435 50, 480 40 C 525 30, 525 20, 570 20"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive nodes */}
              {chartPoints.map((pt, idx) => (
                <g key={idx} className="cursor-pointer group" onMouseEnter={() => setActiveDataNode(pt)} onMouseLeave={() => setActiveDataNode(null)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-white stroke-emerald-600 stroke-[3.5] transition-all group-hover:r-7"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    className="fill-emerald-500/25 opacity-0 group-hover:opacity-100 transition-all"
                  />
                  {/* Axis Label */}
                  <text x={pt.x} y="192" textAnchor="middle" className="text-[10px] fill-stone-400 font-extrabold uppercase">
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover tooltip widget */}
            {activeDataNode && (
              <div
                className="absolute bg-stone-900 text-white rounded-xl px-3 py-1.5 text-[10px] font-black pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full flex flex-col items-center gap-0.5"
                style={{
                  left: `${(activeDataNode.x / 600) * 100}%`,
                  top: `${(activeDataNode.y / 200) * 100}%`,
                }}
              >
                <span>{activeDataNode.day}</span>
                <span className="text-emerald-400 text-xs">{activeDataNode.val}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Live Activity Log</h3>
              <p className="text-[11px] text-stone-400 font-bold mt-0.5">Real-time system operational feeds.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-ping" />
                <div>
                  <p className="text-xs font-black text-stone-800">Order ORD-9843 dispatched</p>
                  <p className="text-[10px] font-medium text-stone-400">Rider Amit K. assigned to route</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-black text-stone-800">Low stock warning: Bananas</p>
                  <p className="text-[10px] font-medium text-stone-400">Bananas stock is below 10 items</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-black text-stone-800">New customer signup</p>
                  <p className="text-[10px] font-medium text-stone-400">gokul_test_999@example.com verified</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-black text-stone-800">New review approved</p>
                  <p className="text-[10px] font-medium text-stone-400">Organic apples (5 stars by Priya)</p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/admin/activity" className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:text-emerald-950 transition-colors pt-4 border-t border-stone-100 mt-4">
            View full log <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="text-sm font-extrabold text-stone-500 uppercase tracking-wider mb-4">Quick Workspaces</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Product management */}
          <Link to="/admin/products" className="group bg-white rounded-2xl border border-stone-200/50 p-5 shadow-sm hover:shadow-md hover:border-emerald-600/30 transition-all flex flex-col justify-between min-h-[140px]">
            <div>
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center mb-4">
                <ShoppingBag size={18} />
              </div>
              <h4 className="text-sm font-black text-stone-800">Product management</h4>
              <p className="text-[11px] text-stone-500 font-medium mt-1 leading-normal">Control pricing, descriptions, and stock counts.</p>
            </div>
            <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open inventory <ArrowRight size={13} />
            </span>
          </Link>

          {/* Card 2: Advance order */}
          <Link to="/admin/orders" className="group bg-white rounded-2xl border border-stone-200/50 p-5 shadow-sm hover:shadow-md hover:border-emerald-600/30 transition-all flex flex-col justify-between min-h-[140px]">
            <div>
              <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center mb-4">
                <Clock size={18} />
              </div>
              <h4 className="text-sm font-black text-stone-800">Advance order</h4>
              <p className="text-[11px] text-stone-500 font-medium mt-1 leading-normal">Review the live queue and assign riders.</p>
            </div>
            <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open live queue <ArrowRight size={13} />
            </span>
          </Link>

          {/* Card 3: Content manager */}
          <Link to="/admin/content" className="group bg-white rounded-2xl border border-stone-200/50 p-5 shadow-sm hover:shadow-md hover:border-emerald-600/30 transition-all flex flex-col justify-between min-h-[140px]">
            <div>
              <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center mb-4">
                <Sparkles size={18} />
              </div>
              <h4 className="text-sm font-black text-stone-800">Content manager</h4>
              <p className="text-[11px] text-stone-500 font-medium mt-1 leading-normal">Update promotional banners and blog articles.</p>
            </div>
            <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open editor <ArrowRight size={13} />
            </span>
          </Link>

          {/* Card 4: Store settings */}
          <Link to="/admin/settings" className="group bg-white rounded-2xl border border-stone-200/50 p-5 shadow-sm hover:shadow-md hover:border-emerald-600/30 transition-all flex flex-col justify-between min-h-[140px]">
            <div>
              <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-800 border border-rose-100 flex items-center justify-center mb-4">
                <TrendingUp size={18} />
              </div>
              <h4 className="text-sm font-black text-stone-800">Store settings</h4>
              <p className="text-[11px] text-stone-500 font-medium mt-1 leading-normal">Configure opening hours and delivery fees.</p>
            </div>
            <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
              Open settings <ArrowRight size={13} />
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
