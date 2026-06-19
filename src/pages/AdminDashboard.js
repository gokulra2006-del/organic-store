import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminReviews from "./admin/AdminReviews";
import AdminContent from "./admin/AdminContent";
import AdminSettings from "./admin/AdminSettings";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminActivity from "./admin/AdminActivity";
import AdminDelivery from "./admin/AdminDelivery";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <AdminLayout user={user} logout={logout}>
      <Routes>
        <Route index element={<AdminOverview user={user} />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="delivery" element={<AdminDelivery />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}