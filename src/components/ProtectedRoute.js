import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  // Fallback check to localStorage to prevent state restoration latency on refresh
  let localIsLoggedIn = false;
  try {
    const saved = localStorage.getItem('organic_user');
    if (saved) {
      localIsLoggedIn = true;
    }
  } catch (e) {
    // ignore
  }

  const isAuthorized = isLoggedIn || localIsLoggedIn;

  return isAuthorized ? children : <Navigate to="/login" replace />;
}