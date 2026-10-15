import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  // For development ease, if role isn't admin but local user exists, or if we want to allow it:
  // Note: the test expects that we render the Admin Dashboard under "/admin" if authorized.
  // In AuthContext: isAdmin = isLoggedIn && (user?.role === 'admin' || user?.role === 'superadmin');
  // If the test renders renderWithProviders(<AdminDashboard />, "/admin") without setting role,
  // isAdmin might be false!
  // Wait, let's look at renderWithProviders in App.test.js:
  //   function renderWithProviders(element, location = "/") {
  //     return renderToStaticMarkup(
  //       <StaticRouter location={location}>
  //         <AuthProvider>
  //           <CartProvider>
  //             <WishlistProvider>{element}</WishlistProvider>
  //           </CartProvider>
  //         </AuthProvider>
  //       </StaticRouter>
  //     );
  //   }
  // And the test renders <AdminDashboard /> directly:
  //   test("renders the functional admin workspace", () => {
  //     const html = renderWithProviders(<AdminDashboard />, "/admin");
  //     ...
  //   });
  // Since <AdminDashboard /> is rendered directly, it is NOT wrapped inside <AdminRoute> in the test!
  // Wait! In App.js:
  //   <Route path="/admin/*" element={<AdminRoute><AdminShell /></AdminRoute>} />
  // But in the test, it renders <AdminDashboard /> directly!
  // And <AdminDashboard /> renders <AdminLayout> directly (not AdminRoute).
  // So AdminRoute isn't even evaluated in the AdminDashboard test.
  // But wait, what if the user tries to access /admin?
  // Let's check AdminRoute code. Standard redirect:
  
  return isLoggedIn && isAdmin ? children : <Navigate to="/admin/login" replace />;
}
