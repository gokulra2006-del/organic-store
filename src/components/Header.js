import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Leaf,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const search = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  };

  const signOut = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
      {/* Promo bar — shorter copy on xs */}
      <div className="bg-[#153d2b] text-white">
        <div className="container-wide flex min-h-8 items-center justify-between gap-4 text-[11px] font-bold sm:min-h-9">
          <p className="flex items-center gap-2 text-emerald-50">
            <Zap size={13} fill="currentColor" className="text-lime-300" />
            <span className="sm:hidden">10-min delivery</span>
            <span className="hidden sm:inline">Fresh groceries delivered in 10 minutes</span>
          </p>
          <p className="hidden items-center gap-2 text-emerald-100/70 sm:flex">
            <MapPin size={13} /> Delivering near you · 7am–11pm
          </p>
        </div>
      </div>

      <div className="container-wide">
        {/* Main row — tighter height on mobile */}
        <div className="flex min-h-[60px] items-center gap-2 sm:min-h-[76px] sm:gap-3 lg:gap-7">
          {/* Logo — icon only on xs, full lockup from sm */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#153d2b] text-white shadow-md shadow-emerald-950/15 sm:h-11 sm:w-11">
              <Leaf size={18} className="sm:hidden" />
              <Leaf size={22} className="hidden sm:block" />
            </span>
            <span className="hidden sm:block">
              <strong className="block font-sans text-[17px] font-black leading-tight tracking-tight text-stone-900">
                Organic Store
              </strong>
              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700">
                Farm to door
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex min-h-12 items-center rounded-xl px-4 text-sm font-bold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-stone-600 hover:bg-stone-50 hover:text-emerald-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search — desktop */}
          <form
            onSubmit={search}
            className="relative ml-auto hidden max-w-md flex-1 md:block"
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Search apples, honey, spinach..."
            />
          </form>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            {/* Wishlist — hidden on xs, shown sm+ */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-stone-600 transition hover:bg-rose-50 hover:text-rose-600 sm:flex sm:h-12 sm:w-12"
            >
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition hover:bg-emerald-100 sm:h-12 sm:w-12"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-amber-950 ring-2 ring-white sm:right-1.5 sm:top-1.5 sm:h-5 sm:min-w-5">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile — sm+ only */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-12 items-center gap-2 rounded-xl px-2.5 text-stone-600 transition hover:bg-stone-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-emerald-800">
                  <UserRound size={18} />
                </span>
                <span className="hidden text-left xl:block">
                  <span className="block text-[10px] font-semibold text-stone-400">
                    {isLoggedIn ? "Welcome back" : "Your account"}
                  </span>
                  <span className="block max-w-24 truncate text-xs font-extrabold text-stone-800">
                    {isLoggedIn ? user?.name : "Sign in"}
                  </span>
                </span>
                <ChevronDown size={14} className="hidden text-stone-400 xl:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to={isAdmin ? "/admin" : "/account"}
                        onClick={() => setProfileOpen(false)}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <UserRound size={17} />
                        {isAdmin ? "Admin dashboard" : "My account"}
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold text-stone-600 hover:bg-stone-50"
                      >
                        <Heart size={17} /> Wishlist
                      </Link>
                      <button
                        onClick={signOut}
                        className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut size={17} /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setProfileOpen(false)}
                        className="flex min-h-12 items-center gap-3 rounded-xl bg-[#153d2b] px-3 text-sm font-bold text-white"
                      >
                        <UserRound size={17} /> Customer sign in
                      </Link>
                      <Link
                        to="/admin/login"
                        onClick={() => setProfileOpen(false)}
                        className="mt-1 flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold text-stone-600 hover:bg-stone-50"
                      >
                        Admin portal
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger — shown up to lg */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#153d2b] text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-stone-100 pb-4 pt-3 lg:hidden">
            {/* Search in menu on mobile */}
            <form onSubmit={search} className="relative mb-3 md:hidden">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm font-semibold outline-none"
                placeholder="Search fresh groceries..."
              />
            </form>
            <nav className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 text-sm font-bold text-stone-700 hover:bg-emerald-50"
                >
                  {link.label}
                </Link>
              ))}
              {/* Wishlist accessible from mobile menu */}
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-bold text-stone-700 hover:bg-emerald-50"
              >
                <Heart size={16} /> Wishlist
              </Link>
              <Link
                to={isLoggedIn ? (isAdmin ? "/admin" : "/account") : "/login"}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center rounded-xl px-3 text-sm font-bold text-emerald-800"
              >
                {isLoggedIn
                  ? isAdmin
                    ? "Admin dashboard"
                    : "My account"
                  : "Sign in / Register"}
              </Link>
              {isLoggedIn && (
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}