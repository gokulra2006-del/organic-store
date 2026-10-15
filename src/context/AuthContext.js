import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // On mount, restore session from localStorage and verify with backend
  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem('organic_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsLoggedIn(true);
          
          // Verify session is active
          try {
            const meRes = await authAPI.getMe();
            if (meRes?.data) {
              persistUser({ ...parsed, ...meRes.data });
            }
          } catch (err) {
            // Token expired or invalid
            console.warn('Session verification failed, signing out:', err);
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('organic_user');
          }
        }
      } catch (err) {
        console.error('Error parsing saved session:', err);
      }
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
    const res = await authAPI.register({ fullName, email, phone, password });
    return res.data; // { message, email, expiresIn }
  }, []);

  const verifyRegistrationOtp = useCallback(async ({ email, otp }) => {
    const res = await authAPI.verifyOTP({ email, otp });
    persistUser(res.data); // { _id, fullName, email, role }
    return res.data;
  }, []);

  // ── Login flow (password -> OTP) ───────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const res = await authAPI.login({ email, password });
    return res.data; // { message, email, expiresIn }
  }, []);

  const verifyLoginOtp = useCallback(async ({ email, otp, isAdminLogin }) => {
    const res = await authAPI.verifyLoginOTP({ email, otp, isAdminLogin });
    const userData = isAdminLogin ? { ...res.data, role: 'superadmin' } : res.data;
    persistUser(userData);
    return userData;
  }, []);

  const resendOtp = useCallback(async ({ email, purpose }) => {
    return await authAPI.resendOTP({ email, purpose });
  }, []);

  // ── Forgot password flow ───────────────────────────────────────
  const forgotPassword = useCallback(async (email) => {
    return await authAPI.forgotPassword(email);
  }, []);

  const verifyResetOtp = useCallback(async ({ email, otp }) => {
    const res = await authAPI.verifyResetOTP({ email, otp });
    return res.data.resetToken;
  }, []);

  const resetPassword = useCallback(async ({ resetToken, newPassword }) => {
    return await authAPI.resetPassword({ resetToken, newPassword });
  }, []);

  // ── Logout ──────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch { /* clear locally regardless */ }
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('organic_user');
  }, []);

  const loginAsAdmin = useCallback((adminEmail = 'admin@organicstore.com') => {
    const adminUser = {
      _id: 'admin_master_1',
      fullName: 'Store Admin',
      email: adminEmail,
      role: 'superadmin',
      token: 'jwt_mock_admin_token'
    };
    persistUser(adminUser);
    return adminUser;
  }, []);

  const loginAsCustomer = useCallback((customerEmail = 'customer@organicstore.com', name = 'Gokul R.') => {
    const custUser = {
      _id: 'cust_user_1',
      fullName: name,
      email: customerEmail,
      phone: '9876543210',
      role: 'customer',
      token: 'jwt_mock_customer_token'
    };
    persistUser(custUser);
    return custUser;
  }, []);

  const isAdmin = isLoggedIn && (user?.role === 'admin' || user?.role === 'superadmin');

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isAdmin, isAuthReady,
      register, verifyRegistrationOtp,
      login, verifyLoginOtp, resendOtp,
      forgotPassword, verifyResetOtp, resetPassword,
      logout, loginAsAdmin, loginAsCustomer,
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