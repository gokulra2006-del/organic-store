import React, { useState } from "react";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("Organic Store");
  const [deliveryFee, setDeliveryFee] = useState("5.00");
  const [freeThreshold, setFreeThreshold] = useState("30.00");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Configurations saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-stone-900">Store settings</h2>
        <p className="text-xs font-medium text-stone-500 mt-1">Configure general operations, fees, and thresholds.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm max-w-xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
              Storefront Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border-2 border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
                Standard Delivery Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
                Free Delivery Threshold ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-xl px-5 py-3 text-xs font-bold transition cursor-pointer"
            >
              <Save size={16} />
              <span>Save settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
