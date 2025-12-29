import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "cart_items";

export const CartProvider = ({ children }) => {
  /* Load initial cart from localStorage */
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* Persist cart to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = product => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id);

      if (existing) {
        if (existing.quantity + 1 > product.quantity) return prev;
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      if (product.quantity === 0) return prev;
      return [...prev, { productId: product.id, quantity: 1 }];
    });
  };

  const updateQuantity = (product, qty) => {
    if (qty < 1 || qty > product.quantity) return;
    setCartItems(prev =>
      prev.map(i =>
        i.productId === product.id ? { ...i, quantity: qty } : i
      )
    );
  };

  const removeFromCart = productId => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
