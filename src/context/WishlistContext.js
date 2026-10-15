import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to normalize backend product data to frontend structure
  const normalizeProduct = useCallback((p) => {
    if (!p) return null;
    const image = p.image || (p.images?.[0]?.filename 
      ? (p.images[0].filename.startsWith('http') ? p.images[0].filename : `http://localhost:5000/uploads/${p.images[0].filename}`)
      : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop');

    return {
      id: p._id || p.id,
      _id: p._id || p.id,
      name: p.name,
      price: p.price,
      image,
      description: p.description || '',
    };
  }, []);

  // Fetch wishlist from backend
  const fetchBackendWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wishlistAPI.getWishlist();
      if (res?.data) {
        // MERN wishlist schema might contain an array of populated products
        const productsList = res.data.products || res.data;
        if (Array.isArray(productsList)) {
          const mapped = productsList.map(normalizeProduct).filter(Boolean);
          setItems(mapped);
        }
      }
    } catch (err) {
      console.error('Error fetching wishlist from backend:', err);
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  // Load initial wishlist
  useEffect(() => {
    if (isLoggedIn) {
      fetchBackendWishlist();
    } else {
      try {
        const saved = localStorage.getItem('organic_wishlist');
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading guest wishlist:', err);
      }
    }
  }, [isLoggedIn, fetchBackendWishlist]);

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('organic_wishlist', JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    const prodId = product._id || product.id;
    const exists = items.some((item) => item.id === prodId);

    if (isLoggedIn) {
      try {
        if (exists) {
          const res = await wishlistAPI.removeItem(prodId);
          if (res?.data?.products) {
            setItems(res.data.products.map(normalizeProduct).filter(Boolean));
          } else {
            // Re-fetch to be safe
            fetchBackendWishlist();
          }
        } else {
          const res = await wishlistAPI.addItem(prodId);
          if (res?.data?.products) {
            setItems(res.data.products.map(normalizeProduct).filter(Boolean));
          } else {
            // Re-fetch to be safe
            fetchBackendWishlist();
          }
        }
      } catch (err) {
        console.error('Error toggling wishlist in backend:', err);
      }
    } else {
      if (exists) {
        setItems((prev) => prev.filter((item) => item.id !== prodId));
      } else {
        const img = product.image || (product.images?.[0]?.filename ? product.images[0].filename : '');
        setItems((prev) => [
          ...prev,
          {
            id: prodId,
            _id: prodId,
            name: product.name,
            price: product.price,
            image: img,
            description: product.description || '',
          },
        ]);
      }
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    if (isLoggedIn) {
      try {
        const res = await wishlistAPI.removeItem(productId);
        if (res?.data?.products) {
          setItems(res.data.products.map(normalizeProduct).filter(Boolean));
        } else {
          fetchBackendWishlist();
        }
      } catch (err) {
        console.error('Error removing wishlist in backend:', err);
      }
    } else {
      setItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  // Is Wishlisted check
  const isWishlisted = (productId) => {
    return items.some((item) => item.id === productId);
  };

  // Clear Wishlist
  const clearWishlist = () => {
    setItems([]);
    // Backend clear wishlists route can just delete or set empty
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: items,
        items,
        wishlistCount: items.length,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};