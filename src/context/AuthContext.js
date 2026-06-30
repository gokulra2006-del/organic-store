import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Central fetch wrapper — sends httpOnly cookies, parses your ApiResponse shape
async function apiCall(endpoint, options = {}) {
  // Attach bearer token if stored locally (for routes that need it)
  const stored = localStorage.getItem('organic_user');
  let token = null;
  try { token = stored ? JSON.parse(stored).token : null; } catch {}

  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = body.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.statusCode = res.status;
    throw error;
  }

  return body; // { statusCode, data, message, success }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // On mount, try to restore session via refresh token cookie
  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem('organic_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsLoggedIn(true);
        }
      } catch { /* ignore */ }
      setIsAuthReady(true);
    })();
  }, []);

  const persistUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('organic_user', JSON.stringify(userData));
  };

  // ── Registration flow ──────────────────────────────────────────
  const register = useCallback(async ({ fullName, email, phone, password }) => {
    const res = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone, password }),
    });
    return res.data; // { message, email, expiresIn }
  }, []);

  const verifyRegistrationOtp = useCallback(async ({ email, otp }) => {
    const res = await apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    persistUser(res.data); // { _id, fullName, email, role }
    return res.data;
  }, []);

  // ── Login flow (password -> OTP) ───────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.data; // { message, email, expiresIn }
  }, []);

  const verifyLoginOtp = useCallback(async ({ email, otp }) => {
    const res = await apiCall('/auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    persistUser(res.data);
    return res.data;
  }, []);

  const resendOtp = useCallback(async ({ email, purpose }) => {
    return apiCall('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
  }, []);

  // ── Forgot password flow ───────────────────────────────────────
  const forgotPassword = useCallback(async (email) => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }, []);

  const verifyResetOtp = useCallback(async ({ email, otp }) => {
    const res = await apiCall('/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    return res.data.resetToken;
  }, []);

  const resetPassword = useCallback(async ({ resetToken, newPassword }) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }, []);

  // ── Update Profile ──────────────────────────────────────────────
  const updateProfile = useCallback(async ({ name, phone }) => {
    const res = await apiCall('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone }),
    });
    // Merge updated fields into persisted user
    const updatedUser = { ...user, name: res.data?.name || name, phone: res.data?.phone || phone };
    setUser(updatedUser);
    localStorage.setItem('organic_user', JSON.stringify(updatedUser));
    return res.data;
  }, [user]);

  // ── Logout ──────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch { /* clear locally regardless */ }
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('organic_user');
  }, []);

  const isAdmin = isLoggedIn && (user?.role === 'admin' || user?.role === 'superadmin');

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isAdmin, isAuthReady,
      register, verifyRegistrationOtp,
      login, verifyLoginOtp, resendOtp,
      forgotPassword, verifyResetOtp, resetPassword,
      updateProfile,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};