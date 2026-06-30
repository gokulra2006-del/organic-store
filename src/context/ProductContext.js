import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('organic_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(p => ({
          ...p,
          stock: p.stock !== undefined && p.stock !== null ? p.stock : 25,
          isHidden: p.isHidden || false
        }));
      }
    } catch (e) {
      console.error('Error reading organic_products from localStorage:', e);
    }
    // Fallback/Initial seed: default products
    const seeded = defaultProducts.map(p => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : 25, // default stock if missing
      isHidden: p.isHidden || false // default visibility
    }));
    localStorage.setItem('organic_products', JSON.stringify(seeded));
    return seeded;
  });

  useEffect(() => {
    localStorage.setItem('organic_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    setProducts((prev) => [
      {
        ...newProduct,
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
        stock: newProduct.stock !== undefined ? newProduct.stock : 25,
        isHidden: false
      },
      ...prev
    ]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductVisibility = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isHidden: !p.isHidden } : p))
    );
  };

  const visibleProducts = products.filter(p => !p.isHidden);

  return (
    <ProductContext.Provider
      value={{
        products,
        visibleProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductVisibility
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
