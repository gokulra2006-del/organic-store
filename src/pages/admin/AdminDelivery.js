import React, { useState, useEffect } from "react";
import { Truck, MapPin, X, Navigation, Phone, CheckCircle2, Clock } from "lucide-react";

export default function AdminDelivery() {
  const [trackingRider, setTrackingRider] = useState(null);
  const [simulatedTime, setSimulatedTime] = useState(8);

  const riders = [
    { id: "RIDER-01", name: "David Miller", status: "delivering", order: "#1024", location: "5th Avenue, NYC", phone: "+1 555-0101" },
    { id: "RIDER-02", name: "James Wilson", status: "idle", order: "-", location: "Store Hub", phone: "+1 555-0102" },
    { id: "RIDER-03", name: "Michael Chang", status: "delivering", order: "#1022", location: "Broadway, NYC", phone: "+1 555-0103" },
  ];

  // Simulate ETA reduction
  useEffect(() => {
    if (!trackingRider) return;
    setSimulatedTime(Math.floor(Math.random() * 10) + 5); // random 5-15 mins
    const interval = setInterval(() => {
      setSimulatedTime((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000); // Reduce 1 minute every 15s for the demo
    return () => clearInterval(interval);
  }, [trackingRider]);

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
                onClick={() => setTrackingRider(rider)}
                className={`w-full h-9 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-[10px] font-black transition cursor-pointer ${rider.status === "delivering" ? "text-[#153d2b]" : "text-stone-400 cursor-not-allowed"}`}
                disabled={rider.status !== "delivering"}
              >
                Track Live GPS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GPS Tracking Modal */}
      {trackingRider && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                  <Navigation size={18} />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">Live GPS Tracking</h3>
                  <p className="text-xs font-bold text-stone-500">
                    Order {trackingRider.order} • {trackingRider.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrackingRider(null)}
                className="h-9 w-9 rounded-xl bg-stone-50 flex items-center justify-center hover:bg-stone-100 text-stone-500 transition cursor-pointer border border-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Map Area */}
            <div className="h-[400px] w-full relative bg-[#f1f3f4] overflow-hidden">
              {/* CSS Grid Pattern Mock Map */}
              <div 
                className="absolute inset-0" 
                style={{ 
                  backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', 
                  backgroundSize: '30px 30px',
                  backgroundPosition: '0 0'
                }}
              />
              
              {/* Fake Route Line */}
              <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.2))' }}>
                <path 
                  d="M 150 300 Q 300 300 350 200 T 500 150" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeDasharray="10 10" 
                  className="animate-pulse"
                />
              </svg>

              {/* Destination Pin */}
              <div className="absolute top-[130px] left-[490px] flex flex-col items-center">
                <div className="bg-white px-2 py-1 rounded-lg shadow-sm border border-stone-200 mb-1">
                  <p className="text-[9px] font-black text-stone-600 uppercase">Dropoff</p>
                </div>
                <div className="text-rose-500 animate-bounce">
                  <MapPin size={24} fill="currentColor" />
                </div>
              </div>

              {/* Moving Rider Dot */}
              <div 
                className="absolute" 
                style={{
                  top: '190px',
                  left: '340px',
                  transition: 'all 1s ease-in-out'
                }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping effect */}
                  <div className="w-16 h-16 bg-emerald-500/30 rounded-full animate-ping absolute" />
                  {/* Vehicle icon */}
                  <div className="w-10 h-10 bg-[#153d2b] border-4 border-white rounded-full shadow-lg relative z-10 flex items-center justify-center">
                    <Truck size={14} className="text-emerald-400" />
                  </div>
                </div>
              </div>
              
              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-stone-400">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${trackingRider.name}&backgroundColor=e5e7eb`} alt={trackingRider.name} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900">{trackingRider.name}</p>
                      <p className="text-[10px] font-bold text-stone-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={10} className="text-emerald-500" /> Verified Delivery Partner
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-stone-100 pt-3 sm:pt-0 sm:pl-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-stone-400 flex items-center gap-1">
                        <Clock size={10} /> Est. Arrival
                      </p>
                      <p className="text-lg font-black text-emerald-600">{simulatedTime} mins</p>
                    </div>
                    <button className="h-10 w-10 sm:w-auto sm:px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-stone-900/20">
                      <Phone size={14} /> <span className="hidden sm:block text-xs font-bold">Contact Rider</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
