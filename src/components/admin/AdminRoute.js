import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  // Fallback check to localStorage to prevent React state update batching race conditions
  let localIsAdmin = false;
  try {
    const saved = localStorage.getItem('organic_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      localIsAdmin = parsed && (parsed.role === 'admin' || parsed.role === 'superadmin');
    }
  } catch (e) {
    // ignore
  }

  const isAuthorized = (isLoggedIn && isAdmin) || localIsAdmin;

  return isAuthorized ? children : <Navigate to="/admin/login" replace />;
}
