import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch, FaShoppingCart, FaUser, FaHeart,
  FaAngleDown, FaBars, FaTimes, FaPhone, FaEnvelope,
  FaFacebookF, FaTwitter, FaInstagram, FaPinterestP,
  FaSignOutAlt
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'STORE', path: '/shop', hasDropdown: true },
    { name: 'CONTACT US', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <FaFacebookF size={13} />, label: 'facebook', href: '#' },
    { icon: <FaTwitter size={13} />, label: 'twitter', href: '#' },
    { icon: <FaInstagram size={13} />, label: 'instagram', href: '#' },
    { icon: <FaPinterestP size={13} />, label: 'pinterest', href: '#' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-md">

      {/* Top Bar */}
      <div className="hidden sm:block bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
        <div className="container-wide">
          <div className="flex justify-between items-center py-2 text-xs sm:text-sm">
            <div className="flex items-center gap-4 text-earth-600">
              <span className="flex items-center gap-2 hover:text-primary-600 transition-colors font-medium">
                <FaPhone size={12} className="text-primary-600" />
                <span>+321 453 68 739</span>
              </span>
              <span className="flex items-center gap-2 hover:text-primary-600 transition-colors font-medium">
                <FaEnvelope size={12} className="text-primary-600" />
                <span>organicstore@gmail.com</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-earth-600">
              {isLoggedIn ? (
                <>
                  <Link to="/account" className="flex items-center gap-1 hover:text-primary-600 transition-colors font-medium">
                    <FaUser size={12} />
                    <span>My Account</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-1 hover:text-primary-600 transition-colors font-medium">
                    <FaHeart size={12} />
                    <span>Wishlist</span>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1 hover:text-primary-600 transition-colors font-medium">
                  <FaUser size={12} />
                  <span>Account</span>
                </Link>
              )}
              <button className="flex items-center gap-1 hover:text-primary-600 transition-colors font-medium">
                <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-4 h-3" />
                <span>English</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden bg-white border-b border-earth-100">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm shadow">
              🌿
            </div>
            <div>
              <p className="font-playfair text-sm font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent leading-tight">
                Organic Store
              </p>
              <p className="text-[9px] text-earth-500 font-medium leading-tight">Fresh from Farm</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="w-8 h-8 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <FaSearch size={14} />
            </button>

            <Link to="/cart" className="relative w-8 h-8 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary-600 flex items-center justify-center bg-primary-50">
                <FaShoppingCart size={13} className="text-primary-600" />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link to="/account" className="w-8 h-8 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                <FaUser size={14} />
              </Link>
            ) : (
              <Link to="/login" className="w-8 h-8 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                <FaUser size={14} />
              </Link>
            )}

            <button
              className="w-8 h-8 flex items-center justify-center text-white bg-primary-600 rounded-full ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="px-3 pb-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="input-base w-full pl-4 pr-10 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-1.5 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <FaSearch size={12} />
                </button>
              </div>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="bg-primary-700 border-t border-primary-600">
            <div className="py-2 px-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-white hover:bg-primary-800 rounded-lg font-medium text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-white hover:bg-primary-800 rounded-lg font-medium text-sm">
                    MY ACCOUNT
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-white hover:bg-primary-800 rounded-lg font-medium text-sm">
                    SIGN OUT
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-white hover:bg-primary-800 rounded-lg font-medium text-sm">
                  SIGN IN / REGISTER
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:block bg-white border-b border-earth-100">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <Link to="/" className="flex items-center gap-3 group w-full md:w-auto justify-between md:justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg md:text-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                🌿
              </div>
              <div className="ml-3 md:ml-0 text-left">
                <p className="font-playfair text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent leading-tight">
                  Organic Store
                </p>
                <p className="text-xs text-earth-500 font-medium">Fresh from Farm</p>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="w-full md:w-96 order-3 md:order-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base pl-4 pr-12 py-2"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaSearch size={14} />
                </button>
              </div>
            </form>

            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 order-2 md:order-3">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-earth-500 uppercase tracking-wider">Welcome</p>
                      <p className="text-sm font-semibold text-primary-600">{user?.name || 'User'}</p>
                    </div>
                    <FaAngleDown size={12} className="text-primary-600" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-earth-100 overflow-hidden z-50">
                      <Link to="/account" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 text-sm font-semibold text-earth-700">
                        <FaUser size={14} className="text-primary-600" /> My Account
                      </Link>
                      <Link to="/wishlist" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 text-sm font-semibold text-earth-700">
                        <FaHeart size={14} className="text-red-500" /> Wishlist
                      </Link>
                      <div className="border-t border-earth-100"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm font-semibold text-red-600">
                        <FaSignOutAlt size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">
                  <FaUser size={16} className="text-primary-600" />
                  <div>
                    <p className="text-[10px] text-earth-500 uppercase tracking-[0.15em]">Welcome</p>
                    <p className="text-sm font-semibold text-primary-600">Sign In</p>
                  </div>
                </Link>
              )}

              <Link to="/cart" className="relative group">
                <div className="w-11 h-11 rounded-full border-2 border-primary-600 flex items-center justify-center bg-primary-50 group-hover:bg-primary-100 transition-all shadow-sm">
                  <FaShoppingCart size={16} className="text-primary-600" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden sm:block bg-gradient-to-r from-primary-600 to-primary-700 border-b-4 border-primary-500">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 px-6 py-5 text-white font-semibold text-sm hover:bg-primary-800 transition-all duration-200"
                  >
                    {link.name}
                    {link.hasDropdown && <FaAngleDown size={12} />}
                  </Link>
                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 bg-white shadow-2xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-56 z-50 overflow-hidden">
                      <Link to="/shop" className="block px-6 py-3 text-earth-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-sm border-l-4 border-transparent hover:border-primary-600 transition-all">
                        All Products
                      </Link>
                      <Link to="/shop?category=fruits" className="block px-6 py-3 text-earth-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-sm border-l-4 border-transparent hover:border-primary-600 transition-all">
                        Fresh Fruits
                      </Link>
                      <Link to="/shop?category=vegetables" className="block px-6 py-3 text-earth-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-sm border-l-4 border-transparent hover:border-primary-600 transition-all">
                        Vegetables
                      </Link>
                      <Link to="/shop?category=pantry" className="block px-6 py-3 text-earth-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-sm border-l-4 border-transparent hover:border-primary-600 transition-all">
                        Pantry Staples
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/80 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;