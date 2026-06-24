import React from "react";
import { Truck, MapPin } from "lucide-react";

export default function AdminDelivery() {
  const riders = [
    { id: "RIDER-01", name: "David Miller", status: "delivering", order: "#1024", location: "5th Avenue, NYC" },
    { id: "RIDER-02", name: "James Wilson", status: "idle", order: "-", location: "Store Hub" },
    { id: "RIDER-03", name: "Michael Chang", status: "delivering", order: "#1022", location: "Broadway, NYC" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-stone-900">Delivery Dispatch</h2>
        <p className="text-xs font-medium text-stone-500 mt-1">Track active riders and manage delivery zones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {riders.map((rider) => (
          <div key={rider.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-stone-900">{rider.name}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-0.5">{rider.id}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                rider.status === "delivering" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
              }`}>
                {rider.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-stone-400" />
                <span>Active Order: {rider.order}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-stone-400" />
                <span>Current Spot: {rider.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => alert(`Tracking details for: ${rider.name}`)}
                className="w-full h-9 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-[#153d2b] text-[10px] font-black transition cursor-pointer"
              >
                Track Live GPS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
