import React, { useState } from "react";
import { Zap, Clock, Package, Check, ArrowRight } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    { id: "#1027", customer: "Anita S.", item: "Wellness bundle", total: "$28.40", time: "1 min ago", status: "incoming" },
    { id: "#1026", customer: "Jordan K.", item: "Bananas x2, Milk", total: "$17.20", time: "2 min ago", status: "incoming" },
    { id: "#1025", customer: "Sarah M.", item: "Pantry essentials", total: "$42.15", time: "4 min ago", status: "packing" },
    { id: "#1023", customer: "David L.", item: "Fresh produce x6", total: "$31.80", time: "6 min ago", status: "packing" },
    { id: "#1024", customer: "Gokul R.", item: "Apples x3", total: "$20.97", time: "ETA 4 mins", status: "delivering" },
  ]);

  const updateStatus = (id, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  const columns = [
    { title: "Incoming / New", key: "incoming", icon: Zap, tone: "amber" },
    { title: "Packing in Progress", key: "packing", icon: Package, tone: "blue" },
    { title: "Out for Delivery", key: "delivering", icon: Clock, tone: "green" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-stone-900">Advance order</h2>
        <p className="text-xs font-medium text-stone-500 mt-1">Live 10-minute order management and dispatch queue.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {columns.map((col) => {
          const ColIcon = col.icon;
          const colOrders = orders.filter((o) => o.status === col.key);

          return (
            <div key={col.key} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    col.tone === "amber" ? "bg-amber-50 text-amber-700" :
                    col.tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    <ColIcon size={16} />
                  </span>
                  <h3 className="text-sm font-black text-stone-900">{col.title}</h3>
                </div>
                <span className="bg-stone-100 rounded-full px-2.5 py-0.5 text-[10px] font-black text-stone-600">
                  {colOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {colOrders.length === 0 ? (
                  <p className="text-stone-400 text-xs font-medium text-center py-6">No orders in this phase.</p>
                ) : (
                  colOrders.map((order) => (
                    <div key={order.id} className="bg-stone-50 border border-stone-100 rounded-xl p-4 space-y-3 hover:border-emerald-200 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-stone-900">{order.id}</span>
                        <span className="text-xs font-black text-stone-950">{order.total}</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-stone-800">{order.customer}</p>
                        <p className="text-[10px] text-stone-400 font-bold mt-0.5">{order.item}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/50">
                        <span className="text-[10px] font-bold text-stone-400">{order.time}</span>
                        {col.key === "incoming" && (
                          <button
                            onClick={() => updateStatus(order.id, "packing")}
                            className="inline-flex items-center gap-1 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-black transition cursor-pointer"
                          >
                            <span>Accept</span> <ArrowRight size={10} />
                          </button>
                        )}
                        {col.key === "packing" && (
                          <button
                            onClick={() => updateStatus(order.id, "delivering")}
                            className="inline-flex items-center gap-1 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-black transition cursor-pointer"
                          >
                            <span>Dispatch</span> <ArrowRight size={10} />
                          </button>
                        )}
                        {col.key === "delivering" && (
                          <button
                            onClick={() => updateStatus(order.id, "completed")}
                            className="inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-[#153d2b] rounded-lg px-2.5 py-1.5 text-[10px] font-black transition cursor-pointer"
                          >
                            <Check size={10} /> <span>Complete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
