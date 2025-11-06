import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { calculateOrderTotals } from '../utils/helpers';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    cart, 
    cartSummary, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    fetchCart 
  } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await updateCartItem(itemId, newQuantity);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (!cartSummary.allInStock) {
      toast.error('Some items in your cart are out of stock. Please remove them before checkout.');
      return;
    }
    
    if (cartSummary.itemCount === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const cartItems = cart.items ? Object.values(cart.items) : [];
  const orderTotals = calculateOrderTotals(cartSummary.totalAmount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState 
          type="cart"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div 
              key={item.itemId} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInLeft 0.6s ease-out forwards'
              }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                      }}
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">N/A</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-sky-600 font-bold text-lg">
                        ₹{item.price}/{item.unit}
                      </span>
                      {!item.inStock ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                          ❌ Not Available
                        </span>
                      ) : item.quantity > 10 ? (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          ⚠️ High quantity
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          ✅ Available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                        disabled={updating[item.itemId]}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium px-3 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                        disabled={updating[item.itemId] || !item.inStock}
                        className="p-1 rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-[5rem]">
                      <p className="font-bold text-lg">₹{item.totalPrice}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.itemId)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bill Details</h2>
            
            <div className="space-y-4 mb-6">
              {/* Items Total */}
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">Item Total</span>
                  <span className="text-xs text-gray-500">{cartSummary.totalItems} items</span>
                </div>
                <span className="font-semibold text-gray-900">₹{cartSummary.totalAmount.toFixed(2)}</span>
              </div>
              
              {/* Delivery Charges */}
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">Delivery Fee</span>
                  {cartSummary.totalAmount >= 100 ? (
                    <span className="text-xs text-green-600 font-medium">🎉 Free delivery applied</span>
                  ) : (
                    <span className="text-xs text-gray-500">Add ₹{(100 - cartSummary.totalAmount).toFixed(2)} for free delivery</span>
                  )}
                </div>
                <div className="text-right">
                  {cartSummary.totalAmount >= 100 ? (
                    <div className="flex flex-col items-end">
                      <span className="line-through text-gray-400 text-sm">₹30.00</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900">₹30.00</span>
                  )}
                </div>
              </div>

              {/* Platform Fee */}
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">Platform Fee</span>
                  <span className="text-xs text-gray-500">Service & handling charges</span>
                </div>
                <span className="font-semibold text-gray-900">₹5.00</span>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{(cartSummary.totalAmount + (cartSummary.totalAmount >= 100 ? 0 : 30) + 5).toFixed(2)}
                </span>
              </div>

              {/* GST */}
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">GST & Other Taxes</span>
                  <span className="text-xs text-gray-500">@ 5% on subtotal</span>
                </div>
                <span className="font-semibold text-gray-900">₹{((cartSummary.totalAmount + (cartSummary.totalAmount >= 100 ? 0 : 30) + 5) * 0.05).toFixed(2)}</span>
              </div>
              
              <hr className="border-gray-300 my-3" />
              
              {/* Grand Total */}
              <div className="flex justify-between items-center py-3 bg-sky-50 rounded-lg px-4 -mx-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">Grand Total</span>
                  <span className="text-xs text-gray-600">Inclusive of all taxes</span>
                </div>
                <span className="text-xl font-bold text-sky-600">
                  ₹{(
                    cartSummary.totalAmount + 
                    (cartSummary.totalAmount >= 100 ? 0 : 30) + 
                    5 + 
                    ((cartSummary.totalAmount + (cartSummary.totalAmount >= 100 ? 0 : 30) + 5) * 0.05)
                  ).toFixed(2)}
                </span>
              </div>

              {/* Savings Display */}
              {cartSummary.totalAmount >= 100 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <span className="text-green-700 font-semibold text-sm block">Congratulations!</span>
                        <span className="text-green-600 text-xs">You saved ₹30 on delivery charges</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      SAVED ₹30
                    </div>
                  </div>
                </div>
              )}

              {/* Minimum Order Message */}
              {cartSummary.totalAmount < 100 && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mt-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🚚</span>
                      <div>
                        <span className="text-orange-700 font-semibold text-sm block">Almost there!</span>
                        <span className="text-orange-600 text-xs">Add ₹{(100 - cartSummary.totalAmount).toFixed(2)} more for free delivery</span>
                      </div>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                      SAVE ₹30
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((cartSummary.totalAmount / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-orange-600 mt-1">
                    <span>₹{cartSummary.totalAmount.toFixed(0)}</span>
                    <span>₹100 (Free Delivery)</span>
                  </div>
                </div>
              )}
            </div>

            {!cartSummary.allInStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm font-medium mb-2">
                  ⚠️ Stock Issues Detected
                </p>
                <p className="text-red-600 text-sm">
                  Some items in your cart are out of stock or have limited availability. 
                  Please update quantities or remove unavailable items before checkout.
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!cartSummary.allInStock || cartSummary.itemCount === 0}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>

            <Link 
              to="/" 
              className="block text-center text-sky-600 hover:text-sky-700 font-medium mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;