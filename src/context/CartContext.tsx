'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, warranty?: { type: string; price: number; months: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  appliedCoupon: { code: string; discount: number; description: string } | null;
  applyCoupon: (coupon: { code: string; discount: number; description: string } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('iphonehub_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('iphonehub_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('iphonehub_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cart, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        if (appliedCoupon) {
          localStorage.setItem('iphonehub_coupon', JSON.stringify(appliedCoupon));
        } else {
          localStorage.removeItem('iphonehub_coupon');
        }
      } catch (e) {
        console.error('Failed to save coupon to localStorage:', e);
      }
    }
  }, [appliedCoupon, isInitialized]);

  const addToCart = (product: Product, warranty?: { type: string; price: number; months: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1, selectedWarranty: warranty || item.selectedWarranty }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedWarranty: warranty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product._id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.product.price * item.quantity;
    const warrantyTotal = item.selectedWarranty ? item.selectedWarranty.price * item.quantity : 0;
    return sum + itemTotal + warrantyTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        appliedCoupon,
        applyCoupon: setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

