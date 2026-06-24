import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, verifyLoginOtp } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("creds"); // creds -> otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    
    setLoading(true);
    try {
      // Perform AuthContext login
      await login({ email, password });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      await verifyLoginOtp({ email, otp });
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#153d2b] to-emerald-950 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 p-8 sm:p-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#153d2b] mb-4">
            <Leaf size={28} />
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">Admin authentication</h2>
          <p className="text-xs font-bold text-stone-400 mt-2">Access admin dashboard</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-bold text-red-600">
            {error}
          </div>
        )}

        {step === "creds" ? (
          <form onSubmit={handleCredsSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative flex items-center rounded-xl border-2 border-stone-200 bg-stone-50 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition">
                <Mail size={18} className="absolute left-4 text-stone-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organicstore.com"
                  className="w-full h-12 bg-transparent pl-12 pr-4 text-xs font-bold text-stone-800 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
                Secret Passkey
              </label>
              <div className="relative flex items-center rounded-xl border-2 border-stone-200 bg-stone-50 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition">
                <Lock size={18} className="absolute left-4 text-stone-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 bg-transparent pl-12 pr-4 text-xs font-bold text-stone-800 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#153d2b] text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-emerald-800 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <p className="text-xs text-stone-500 font-bold text-center leading-relaxed">
              We sent a security authorization code to <br />
              <strong className="text-stone-700">{email}</strong>. Enter it below to unlock access.
            </p>
            
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                className="w-full h-14 text-center text-2xl font-black rounded-xl border-2 border-stone-200 bg-stone-50 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#153d2b] text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-emerald-800 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Verify code & enter <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
