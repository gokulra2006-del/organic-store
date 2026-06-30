import React, { useState, useEffect } from "react";
import { Save, Store, DollarSign, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("Organic Store");
  const [deliveryFee, setDeliveryFee] = useState("5.00");
  const [freeThreshold, setFreeThreshold] = useState("30.00");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  // Auto-hide success banner
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Title block centered */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-stone-900">Store settings</h2>
        <p className="text-xs font-semibold text-stone-500">Configure storefront operations, fees, and free delivery thresholds.</p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8 shadow-xl shadow-stone-900/5 relative overflow-hidden">
        
        {/* Decorative subtle background gradient */}
        <div className="absolute right-0 top-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Success Banner */}
        {success && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Store settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Storefront Name */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Storefront Name
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-stone-250/70 bg-white focus-within:border-emerald-600 transition duration-200">
              <Store size={16} className="absolute left-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-12 bg-transparent pl-11 pr-4 text-xs font-bold text-stone-850 outline-none placeholder:text-stone-400"
                required
              />
            </div>
          </div>

          {/* Grid for numerical parameters */}
          <div className="grid gap-5 sm:grid-cols-2">
            
            {/* Standard Delivery Fee */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Standard Delivery Fee
              </label>
              <div className="relative flex items-center rounded-2xl border-2 border-stone-250/70 bg-white focus-within:border-emerald-600 transition duration-200">
                <DollarSign size={16} className="absolute left-4 text-stone-400 shrink-0" />
                <input
                  type="number"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full h-12 bg-transparent pl-11 pr-4 text-xs font-bold text-stone-850 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

            {/* Free Delivery Threshold */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Free Delivery Threshold
              </label>
              <div className="relative flex items-center rounded-2xl border-2 border-stone-250/70 bg-white focus-within:border-emerald-600 transition duration-200">
                <ArrowUpRight size={16} className="absolute left-4 text-stone-400 shrink-0" />
                <input
                  type="number"
                  step="0.01"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(e.target.value)}
                  className="w-full h-12 bg-transparent pl-11 pr-4 text-xs font-bold text-stone-850 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

          </div>

          {/* Action Submit */}
          <div className="pt-6 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-xl px-5 py-3 text-xs font-black transition-all shadow-lg shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
