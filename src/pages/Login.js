import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight,
  Leaf, ShieldCheck, User, Phone, Loader2, CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* ── OTP Input — 6 auto-advancing boxes ──────────────────────── */
function OtpInput({ value, onChange, length = 6, autoFocus = true }) {
  const refs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = digits.slice();
    next[i] = val.slice(-1);
    const joined = next.join("").replace(/\s/g, "");
    onChange(joined);
    if (val && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          autoFocus={autoFocus && i === 0}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 border-stone-200 bg-stone-50 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />
      ))}
    </div>
  );
}

/* ── Resend timer ─────────────────────────────────────────────── */
function useResendTimer(seconds = 60) {
  const [left, setLeft] = useState(seconds);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active || left <= 0) return;
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, active]);

  const reset = useCallback(() => { setLeft(seconds); setActive(true); }, [seconds]);
  return { left, canResend: left <= 0, reset };
}

/* ── Shared field components ──────────────────────────────────── */
function Field({ icon: Icon, error, children }) {
  return (
    <div>
      <div className={`relative flex items-center rounded-xl border-2 bg-stone-50 transition-all
        ${error ? "border-red-300" : "border-stone-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100"}`}>
        <Icon size={18} className="ml-4 text-stone-400 shrink-0" />
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-red-500 px-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full bg-transparent h-13 sm:h-14 px-3 text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400 placeholder:font-medium";

/* ── Main Component ───────────────────────────────────────────── */
const STEPS = {
  CHOOSE: "choose",          // login vs register
  LOGIN_CREDS: "login_creds",
  LOGIN_OTP: "login_otp",
  REGISTER_FORM: "register_form",
  REGISTER_OTP: "register_otp",
  FORGOT_EMAIL: "forgot_email",
  FORGOT_OTP: "forgot_otp",
  FORGOT_RESET: "forgot_reset",
  SUCCESS: "success",
};

export default function Login() {
  const navigate = useNavigate();
  const { login, verifyLoginOtp, register, verifyRegistrationOtp, resendOtp,
          forgotPassword, verifyResetOtp, resetPassword } = useAuth();

  const [step, setStep] = useState(STEPS.LOGIN_CREDS);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: 'error'|'success', text }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [resetToken, setResetToken] = useState("");

  const resendTimer = useResendTimer(60);

  const clearMessages = () => { setErrors({}); setBanner(null); };

  /* ── LOGIN: email+password → sends OTP ── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const errs = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await login({ email, password });
      resendTimer.reset();
      setStep(STEPS.LOGIN_OTP);
    } catch (err) {
      if (err.statusCode === 403 && err.message.toLowerCase().includes("verify")) {
        setBanner({ type: "error", text: "Please verify your email first. Check your inbox for a code." });
      } else {
        setBanner({ type: "error", text: err.message || "Invalid email or password" });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── LOGIN: verify OTP ── */
  const handleLoginOtpSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (otp.length !== 6) return setErrors({ otp: "Enter the 6-digit code" });

    setLoading(true);
    try {
      await verifyLoginOtp({ email, otp });
      setStep(STEPS.SUCCESS);
      setTimeout(() => navigate("/"), 1100);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Invalid or expired code" });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER: form → sends OTP ── */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!password || password.length < 6) errs.password = "Min 6 characters";
    if (password !== confirmPwd) errs.confirmPwd = "Passwords don't match";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await register({ fullName, email, phone, password });
      resendTimer.reset();
      setStep(STEPS.REGISTER_OTP);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER: verify OTP ── */
  const handleRegisterOtpSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (otp.length !== 6) return setErrors({ otp: "Enter the 6-digit code" });

    setLoading(true);
    try {
      await verifyRegistrationOtp({ email, otp });
      setStep(STEPS.SUCCESS);
      setTimeout(() => navigate("/"), 1100);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Invalid or expired code" });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP (shared) ── */
  const handleResend = async (purpose) => {
    if (!resendTimer.canResend) return;
    clearMessages();
    try {
      await resendOtp({ email, purpose });
      resendTimer.reset();
      setBanner({ type: "success", text: "New code sent! Check your email." });
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Couldn't resend. Try again shortly." });
    }
  };

  /* ── FORGOT PASSWORD: email → OTP → reset ── */
  const handleForgotEmail = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setErrors({ email: "Enter a valid email" });
    setLoading(true);
    try {
      await forgotPassword(email);
      resendTimer.reset();
      setStep(STEPS.FORGOT_OTP);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Couldn't send reset code" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (otp.length !== 6) return setErrors({ otp: "Enter the 6-digit code" });
    setLoading(true);
    try {
      const token = await verifyResetOtp({ email, otp });
      setResetToken(token);
      setStep(STEPS.FORGOT_RESET);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Invalid or expired code" });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    clearMessages();
    if (newPwd.length < 6) return setErrors({ newPwd: "Min 6 characters" });
    setLoading(true);
    try {
      await resetPassword({ resetToken, newPassword: newPwd });
      setBanner({ type: "success", text: "Password updated! Please sign in." });
      setStep(STEPS.LOGIN_CREDS);
      setPassword(""); setOtp(""); setNewPwd("");
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Reset failed" });
    } finally {
      setLoading(false);
    }
  };

  const goTo = (s) => { clearMessages(); setOtp(""); setStep(s); };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-[#f4f6ef] via-white to-emerald-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#153d2b] text-white shadow-lg shadow-emerald-950/15 mb-3">
            <Leaf size={26} />
          </span>
          <h1 className="text-xl font-black text-stone-900">Organic Store</h1>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-0.5">Farm to door · 10-min delivery</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-900/5 p-6 sm:p-8">

          {/* Banner */}
          {banner && (
            <div className={`mb-5 rounded-xl px-4 py-3 text-sm font-bold flex items-start gap-2
              ${banner.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {banner.type === "success" && <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
              <span>{banner.text}</span>
            </div>
          )}

          {/* ── STEP: LOGIN CREDENTIALS ── */}
          {step === STEPS.LOGIN_CREDS && (
            <>
              <h2 className="text-lg font-black text-stone-900 mb-1">Welcome back</h2>
              <p className="text-sm text-stone-500 font-medium mb-6">Sign in to continue shopping fresh.</p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Field icon={Mail} error={errors.email}>
                  <input type="email" placeholder="you@example.com" className={inputCls}
                    value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field icon={Lock} error={errors.password}>
                  <input type={showPwd ? "text" : "password"} placeholder="Password" className={inputCls}
                    value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="mr-4 text-stone-400 hover:text-stone-600">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </Field>

                <div className="flex justify-end">
                  <button type="button" onClick={() => goTo(STEPS.FORGOT_EMAIL)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full h-13 rounded-xl bg-[#153d2b] text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-800 transition disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Continue <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="text-center text-sm text-stone-500 font-medium mt-6">
                New here?{" "}
                <button onClick={() => goTo(STEPS.REGISTER_FORM)} className="font-black text-emerald-700 hover:text-emerald-900">
                  Create an account
                </button>
              </p>
            </>
          )}

          {/* ── STEP: LOGIN OTP ── */}
          {step === STEPS.LOGIN_OTP && (
            <OtpStep
              title="Verify it's you"
              subtitle={<>We sent a 6-digit code to <strong className="text-stone-700">{email}</strong></>}
              otp={otp} setOtp={setOtp} error={errors.otp}
              onSubmit={handleLoginOtpSubmit} loading={loading}
              resendTimer={resendTimer} onResend={() => handleResend("login")}
              onBack={() => goTo(STEPS.LOGIN_CREDS)}
            />
          )}

          {/* ── STEP: REGISTER FORM ── */}
          {step === STEPS.REGISTER_FORM && (
            <>
              <button onClick={() => goTo(STEPS.LOGIN_CREDS)} className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 mb-4">
                <ArrowLeft size={14} /> Back to sign in
              </button>
              <h2 className="text-lg font-black text-stone-900 mb-1">Create your account</h2>
              <p className="text-sm text-stone-500 font-medium mb-6">Fresh groceries, delivered in 10 minutes.</p>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <Field icon={User} error={errors.fullName}>
                  <input placeholder="Full name" className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} />
                </Field>
                <Field icon={Mail} error={errors.email}>
                  <input type="email" placeholder="you@example.com" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field icon={Phone} error={errors.phone}>
                  <input placeholder="10-digit phone number" className={inputCls} value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
                </Field>
                <Field icon={Lock} error={errors.password}>
                  <input type={showPwd ? "text" : "password"} placeholder="Password (min 6 chars)" className={inputCls}
                    value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="mr-4 text-stone-400 hover:text-stone-600">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </Field>
                <Field icon={ShieldCheck} error={errors.confirmPwd}>
                  <input type={showPwd ? "text" : "password"} placeholder="Confirm password" className={inputCls}
                    value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
                </Field>

                <button type="submit" disabled={loading}
                  className="w-full h-13 rounded-xl bg-[#153d2b] text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-800 transition disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* ── STEP: REGISTER OTP ── */}
          {step === STEPS.REGISTER_OTP && (
            <OtpStep
              title="Verify your email"
              subtitle={<>Enter the 6-digit code sent to <strong className="text-stone-700">{email}</strong></>}
              otp={otp} setOtp={setOtp} error={errors.otp}
              onSubmit={handleRegisterOtpSubmit} loading={loading}
              resendTimer={resendTimer} onResend={() => handleResend("registration")}
              onBack={() => goTo(STEPS.REGISTER_FORM)}
            />
          )}

          {/* ── STEP: FORGOT — EMAIL ── */}
          {step === STEPS.FORGOT_EMAIL && (
            <>
              <button onClick={() => goTo(STEPS.LOGIN_CREDS)} className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 mb-4">
                <ArrowLeft size={14} /> Back to sign in
              </button>
              <h2 className="text-lg font-black text-stone-900 mb-1">Reset your password</h2>
              <p className="text-sm text-stone-500 font-medium mb-6">Enter your email and we'll send a reset code.</p>
              <form onSubmit={handleForgotEmail} className="space-y-4">
                <Field icon={Mail} error={errors.email}>
                  <input type="email" placeholder="you@example.com" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <button type="submit" disabled={loading}
                  className="w-full h-13 rounded-xl bg-[#153d2b] text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-800 transition disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send reset code <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* ── STEP: FORGOT — OTP ── */}
          {step === STEPS.FORGOT_OTP && (
            <OtpStep
              title="Enter reset code"
              subtitle={<>We sent a 6-digit code to <strong className="text-stone-700">{email}</strong></>}
              otp={otp} setOtp={setOtp} error={errors.otp}
              onSubmit={handleForgotOtp} loading={loading}
              resendTimer={resendTimer} onResend={() => handleResend("password_reset")}
              onBack={() => goTo(STEPS.FORGOT_EMAIL)}
            />
          )}

          {/* ── STEP: FORGOT — NEW PASSWORD ── */}
          {step === STEPS.FORGOT_RESET && (
            <>
              <h2 className="text-lg font-black text-stone-900 mb-1">Set a new password</h2>
              <p className="text-sm text-stone-500 font-medium mb-6">Choose a strong password for your account.</p>
              <form onSubmit={handleForgotReset} className="space-y-4">
                <Field icon={Lock} error={errors.newPwd}>
                  <input type={showPwd ? "text" : "password"} placeholder="New password (min 6 chars)" className={inputCls}
                    value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="mr-4 text-stone-400 hover:text-stone-600">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </Field>
                <button type="submit" disabled={loading}
                  className="w-full h-13 rounded-xl bg-[#153d2b] text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-800 transition disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Update password <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === STEPS.SUCCESS && (
            <div className="text-center py-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto mb-4">
                <CheckCircle2 size={32} />
              </span>
              <h2 className="text-lg font-black text-stone-900">You're all set!</h2>
              <p className="text-sm text-stone-500 font-medium mt-1">Redirecting you to the store...</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-stone-400 font-semibold mt-6">
          <Link to="/" className="hover:text-stone-600">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

/* ── Reusable OTP step UI ─────────────────────────────────────── */
function OtpStep({ title, subtitle, otp, setOtp, error, onSubmit, loading, resendTimer, onResend, onBack }) {
  return (
    <>
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 mb-4">
        <ArrowLeft size={14} /> Back
      </button>
      <h2 className="text-lg font-black text-stone-900 mb-1 text-center">{title}</h2>
      <p className="text-sm text-stone-500 font-medium mb-6 text-center">{subtitle}</p>

      <form onSubmit={onSubmit} className="space-y-5">
        <OtpInput value={otp} onChange={setOtp} />
        {error && <p className="text-center text-xs font-bold text-red-500">{error}</p>}

        <button type="submit" disabled={loading || otp.length !== 6}
          className="w-full h-13 rounded-xl bg-[#153d2b] text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-800 transition disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify code <ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 font-medium mt-5">
        {resendTimer.canResend ? (
          <button onClick={onResend} className="font-black text-emerald-700 hover:text-emerald-900">
            Resend code
          </button>
        ) : (
          <>Resend code in <span className="font-black text-stone-700">{resendTimer.left}s</span></>
        )}
      </p>
    </>
  );
}