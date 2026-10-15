import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to normalize backend product data to frontend structure
  const normalizeCartItem = useCallback((item) => {
    if (!item || !item.product) return null;
    const p = item.product;
    const image = p.image || (p.images?.[0]?.filename 
      ? (p.images[0].filename.startsWith('http') ? p.images[0].filename : `http://localhost:5000/uploads/${p.images[0].filename}`)
      : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop');

    return {
      id: p._id || p.id,
      _id: p._id || p.id,
      name: p.name,
      price: item.price || p.price,
      image,
      quantity: item.quantity,
      weight: p.weight || '1 unit',
    };
  }, []);

  // Fetch cart from backend
  const fetchBackendCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cartAPI.getCart();
      if (res?.data?.items) {
        const mapped = res.data.items.map(normalizeCartItem).filter(Boolean);
        setItems(mapped);
      }
    } catch (err) {
      console.error('Error fetching cart from backend:', err);
    } finally {
      setLoading(false);
    }
  }, [normalizeCartItem]);

  // Load initial cart
  useEffect(() => {
    if (isLoggedIn) {
      fetchBackendCart();
    } else {
      try {
        const saved = localStorage.getItem('organic_cart');
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading guest cart:', err);
      }
    }
  }, [isLoggedIn, fetchBackendCart]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('organic_cart', JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  // Add Item to Cart
  const addToCart = async (product, quantity = 1) => {
    const prodId = product._id || product.id;
    const img = product.image || (product.images?.[0]?.filename ? product.images[0].filename : '');

    // Optimistically update local cart state immediately so UI always updates
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id || item._id) === String(prodId));
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, {
        id: prodId,
        _id: prodId,
        name: product.name,
        price: product.price,
        image: img,
        quantity,
        weight: product.weight || '1 unit',
      }];
    });

    // Also sync with backend if logged in
    if (isLoggedIn) {
      try {
        const res = await cartAPI.addItem(prodId, quantity);
        if (res?.data?.items) {
          setItems(res.data.items.map(normalizeCartItem).filter(Boolean));
        }
      } catch (err) {
        console.warn('Backend cart sync notice (retained local cart):', err.message);
      }
    }
  };

  // Update Quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    // Optimistically update local state
    setItems((prev) =>
      prev.map((item) => (String(item.id || item._id) === String(productId) ? { ...item, quantity } : item))
    );

    if (isLoggedIn) {
      try {
        const res = await cartAPI.updateQuantity(productId, quantity);
        if (res?.data?.items) {
          setItems(res.data.items.map(normalizeCartItem).filter(Boolean));
        }
      } catch (err) {
        console.warn('Backend quantity sync notice:', err.message);
      }
    }
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    setItems((prev) => prev.filter((item) => String(item.id || item._id) !== String(productId)));

    if (isLoggedIn) {
      try {
        const res = await cartAPI.removeItem(productId);
        if (res?.data?.items) {
          setItems(res.data.items.map(normalizeCartItem).filter(Boolean));
        }
      } catch (err) {
        console.warn('Backend cart item remove notice:', err.message);
      }
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await cartAPI.clearCart();
        setItems([]);
      } catch (err) {
        console.error('Error clearing backend cart:', err);
      }
    } else {
      setItems([]);
    }
  };

  // Local calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 499 ? 0 : 25) : 0; // free delivery above ₹499
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart: items,
        items,
        addToCart,
        addItem: addToCart,
        removeFromCart,
        removeItem: removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice: subtotal,
        subtotal,
        shipping,
        total,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};