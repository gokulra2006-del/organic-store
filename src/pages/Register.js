import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight,
  Leaf, ShieldCheck, User, Phone, Loader2, CheckCircle2,
  Sparkles, Star, Truck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* ─────────────────────────────────────────────────────────────────
   Field component - clean without focus-ring highlighting or hints
   ───────────────────────────────────────────────────────────────── */
function Field({ icon: Icon, error, children }) {
  return (
    <div>
      <div className={`relative flex items-center rounded-2xl border-2 bg-white transition-all duration-200
        ${error
          ? "border-red-300 bg-red-50/40"
          : "border-stone-200 focus-within:border-emerald-600"}`}>
        <Icon size={17} className="ml-4 text-stone-400 shrink-0" />
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-red-500 px-1 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

const inputCls = "w-full bg-transparent h-12 sm:h-13 px-3 text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400 placeholder:font-normal";

/* ─────────────────────────────────────────────────────────────────
   Left Brand Panel
   ───────────────────────────────────────────────────────────────── */
function BrandPanel() {
  const features = [
    { icon: <Truck size={15} />, text: "10-minute delivery" },
    { icon: <Leaf size={15} />, text: "100% organic & fresh" },
    { icon: <ShieldCheck size={15} />, text: "Secure OTP login" },
    { icon: <Star size={15} />, text: "4.9 ★ customer rating" },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Logo */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Leaf size={20} />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">Organic Store</div>
            <div className="text-xs text-emerald-200 font-semibold">Farm to Door</div>
          </div>
        </div>
      </div>

      {/* Main copy */}
      <div className="relative space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-bold mb-4">
            <Sparkles size={12} />
            Join 50,000+ happy customers
          </div>
          <h2 className="text-4xl font-black leading-tight mb-3">
            Fresh groceries at your doorstep
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Create your account and get your first order delivered in 10 minutes. No minimum order value.
          </p>
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2.5">
              <div className="text-emerald-300 flex-shrink-0">{f.icon}</div>
              <span className="text-xs font-semibold text-emerald-100">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="text-yellow-300" />)}
        </div>
        <p className="text-sm text-emerald-100 leading-relaxed mb-2">
          "The freshest veggies I've ever had, delivered in under 10 minutes. Absolutely love this service!"
        </p>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-xs font-black">P</div>
          <div>
            <div className="text-xs font-bold">Priya S.</div>
            <div className="text-xs text-emerald-300">Verified customer</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Register Component
   ───────────────────────────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const clearMessages = () => { setErrors({}); setBanner(null); };

  /* Password strength */
  const pwdStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = pwdStrength(password);
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-emerald-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = "Enter a valid 10-digit Indian phone number";
    if (!password || password.length < 6) errs.password = "Password must be at least 6 characters";
    if (password !== confirmPwd) errs.confirmPwd = "Passwords don't match";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await register({ fullName, email, phone, password });
      setBanner({ type: "success", text: "Account created successfully! Redirecting to sign in page..." });
      setTimeout(() => {
        navigate("/login", { state: { message: "Account created successfully! Please sign in below." } });
      }, 1500);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-emerald-50/50 to-stone-100 px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-stone-900/10 overflow-hidden border border-stone-200/60 flex min-h-[600px]">

        {/* Left brand panel */}
        <div className="lg:w-5/12 bg-gradient-to-br from-[#0f2d1e] via-[#153d2b] to-[#1a5c39] flex-shrink-0">
          <BrandPanel />
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-8 overflow-y-auto">

          {/* Mobile brand bar */}
          <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#153d2b] flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-black text-stone-900">Organic Store</span>
            </div>
            <Link to="/" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">← Home</Link>
          </div>

          <div className="mb-7">
            <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors mb-4">
              <ArrowLeft size={14} /> Back to sign in
            </Link>
            <h1 className="text-2xl font-black text-stone-900 mb-1">Create your account ✨</h1>
            <p className="text-sm text-stone-500">Fresh groceries delivered in 10 minutes.</p>
          </div>

          {/* Banner */}
          {banner && (
            <div className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold flex items-start gap-2 border
              ${banner.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
              {banner.type === "success"
                ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                : <span className="mt-0.5 shrink-0">⚠</span>}
              <span>{banner.text}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <Field icon={User} error={errors.fullName}>
              <input id="reg-name" placeholder="Full name" className={inputCls}
                value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
            </Field>

            <Field icon={Mail} error={errors.email}>
              <input id="reg-email" type="email" placeholder="you@example.com" className={inputCls}
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </Field>

            <Field icon={Phone} error={errors.phone}>
              <input id="reg-phone" placeholder="Phone Number" className={inputCls} value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} autoComplete="tel" />
            </Field>

            <Field icon={Lock} error={errors.password}>
              <input id="reg-password" type={showPwd ? "text" : "password"} placeholder="Password (min 6 chars)" className={inputCls}
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="mr-4 text-stone-400 hover:text-stone-600 transition-colors">
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            {/* Password strength bar */}
            {password && (
              <div className="px-1">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${i < strength ? strengthColors[strength - 1] : "bg-stone-200"}`} />
                  ))}
                </div>
                <p className={`text-xs font-bold ${strength >= 4 ? "text-emerald-600" : strength >= 2 ? "text-yellow-600" : "text-red-500"}`}>
                  {strengthLabels[strength - 1] || "Too short"}
                </p>
              </div>
            )}

            <Field icon={ShieldCheck} error={errors.confirmPwd}>
              <input id="reg-confirm" type={showConfirmPwd ? "text" : "password"} placeholder="Confirm password" className={inputCls}
                value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} autoComplete="new-password" />
              <button type="button" onClick={() => setShowConfirmPwd(v => !v)}
                className="mr-4 text-stone-400 hover:text-stone-600 transition-colors">
                {showConfirmPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            <button id="reg-submit" type="submit" disabled={loading}
              className="w-full h-12 rounded-2xl bg-[#153d2b] text-white text-sm font-black flex items-center justify-center gap-2
                hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-emerald-900/20 disabled:opacity-60 mt-1">
              {loading
                ? <><Loader2 size={17} className="animate-spin" /> Creating account…</>
                : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-stone-500">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-emerald-700 hover:text-emerald-900 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-stone-400 font-semibold mt-6">
            <Link to="/" className="hover:text-stone-600 transition-colors">← Back to home</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
