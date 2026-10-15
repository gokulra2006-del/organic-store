import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function CustomerBottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();

  // Don't show bottom nav inside admin panel routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Shop", icon: Search, path: "/shop" },
    { label: "Cart", icon: ShoppingBag, path: "/cart", badge: totalItems },
    { label: "Wishlist", icon: Heart, path: "/wishlist", badge: wishlistCount },
    { label: "Account", icon: User, path: isLoggedIn ? "/account" : "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-white/95 pb-safe pt-2 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.06)] backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {items.map(({ label, icon: Icon, path, badge }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);

          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 active:scale-95 ${
                isActive ? "text-[#153d2b]" : "text-stone-400"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-amber-950 ring-1 ring-white">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight font-extrabold ${isActive ? "font-black" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
