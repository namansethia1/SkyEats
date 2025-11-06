import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: {} });
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalAmount: 0,
    allInStock: true,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const fetchCart = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
      await fetchCartSummary();
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchCartSummary = async () => {
    if (!currentUser) return;
    
    try {
      const response = await cartAPI.getCartSummary();
      setCartSummary(response.data);
    } catch (error) {
      console.error('Error fetching cart summary:', error);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await cartAPI.addToCart(itemId, quantity);
      await fetchCart();
      
      if (response.data.success) {
        toast.success(response.data.message || '🛒 Item added to cart successfully!');
      } else {
        toast.success('🛒 Item added to cart successfully!');
      }
      return true;
    } catch (error) {
      const message = error.response?.data || 'Failed to add item to cart';
      toast.error(message);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!currentUser) return false;

    try {
      const response = await cartAPI.updateCart(itemId, quantity);
      await fetchCart();
      
      if (quantity === 0) {
        toast.success('🗑️ Item removed from cart');
      } else if (response.data.success) {
        toast.success(response.data.message || '✅ Cart updated successfully');
      }
      return true;
    } catch (error) {
      const message = error.response?.data || 'Failed to update cart';
      toast.error(message);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!currentUser) return false;

    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
      toast.success('🗑️ Item removed from cart');
      return true;
    } catch (error) {
      toast.error('Failed to remove item from cart');
      return false;
    }
  };

  const clearCart = async () => {
    if (!currentUser) return false;

    try {
      await cartAPI.clearCart();
      await fetchCart();
      toast.success('🧹 Cart cleared successfully');
      return true;
    } catch (error) {
      toast.error('Failed to clear cart');
      return false;
    }
  };

  const getCartItemCount = () => {
    return cartSummary.totalItems;
  };

  const getCartTotal = () => {
    return cartSummary.totalAmount;
  };

  const isItemInCart = (itemId) => {
    return cart.items && cart.items[itemId];
  };

  const getItemQuantity = (itemId) => {
    return cart.items && cart.items[itemId] ? cart.items[itemId].quantity : 0;
  };

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCart({ items: {} });
      setCartSummary({
        totalItems: 0,
        totalAmount: 0,
        allInStock: true,
        itemCount: 0
      });
    }
  }, [currentUser]);

  const value = {
    cart,
    cartSummary,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemCount,
    getCartTotal,
    isItemInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};