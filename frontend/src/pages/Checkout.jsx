import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, cartSummary, fetchCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'Online Payment'
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    // Redirect if cart is empty
    if (cartSummary.itemCount === 0) {
      navigate('/cart');
    }
  }, [cartSummary, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!formData.addressLine1.trim()) {
      toast.error('Please enter your address');
      return false;
    }

    if (!formData.city.trim()) {
      toast.error('Please enter your city');
      return false;
    }

    if (!formData.state.trim()) {
      toast.error('Please enter your state');
      return false;
    }

    if (!formData.pincode.trim()) {
      toast.error('Please enter your pincode');
      return false;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    if (!cartSummary.allInStock) {
      toast.error('Some items are out of stock. Please update your cart.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Combine address fields into a single delivery address
      const deliveryAddress = `${formData.fullName}\n${formData.phoneNumber}\n${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}${formData.landmark ? '\nNear: ' + formData.landmark : ''}\n${formData.city}, ${formData.state} - ${formData.pincode}`;

      const response = await ordersAPI.checkout(
        deliveryAddress,
        formData.paymentMethod
      );

      if (response.data.success) {
        setOrderDetails(response.data);
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error('Checkout error:', error);

      if (error.response?.data?.issues) {
        const issues = error.response.data.issues;
        toast.error(`Issues with your order:\n${issues.join('\n')}`, { duration: 6000 });
      } else if (error.response?.data?.outOfStockItems) {
        toast.error(`Out of stock: ${error.response.data.outOfStockItems.join(', ')}`);
      } else {
        toast.error(error.response?.data?.error || 'Failed to place order');
      }

      // Refresh cart to show current stock status
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const cartItems = cart.items ? Object.values(cart.items) : [];

  if (orderPlaced && orderDetails) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>

        <div className="card text-left mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Order ID:</span> {orderDetails.orderId}</p>
            <p><span className="font-medium">Tracking ID:</span> {orderDetails.trackingId}</p>
            <p><span className="font-medium">Total Amount:</span> ₹{orderDetails.totalAmount}</p>
            <p><span className="font-medium">Payment Method:</span> {formData.paymentMethod}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary ml-4"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Address */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="House/Flat No., Building Name, Street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Area, Colony, Sector"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Landmark */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near famous place, building, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* Pincode */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={formData.paymentMethod === 'Online Payment'}
                    onChange={handleChange}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span>Online Payment (UPI/Card/Net Banking)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !cartSummary.allInStock}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : `Place Order - ₹${(
                cartSummary.totalAmount +
                (cartSummary.totalAmount >= 100 ? 0 : 30) +
                5 +
                ((cartSummary.totalAmount + (cartSummary.totalAmount >= 100 ? 0 : 30) + 5) * 0.05)
              ).toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Items Review */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.itemId} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-600 text-xs">
                      ₹{item.price}/{item.unit} × {item.quantity}
                    </p>
                    {!item.inStock && (
                      <p className="text-red-600 text-xs">Out of Stock</p>
                    )}
                  </div>
                  <span className="font-medium">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Bill Details</h2>
            <div className="space-y-4">
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
                    <span className="text-xs text-gray-500">Standard delivery charges</span>
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
            </div>

            {!cartSummary.allInStock && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">
                  Some items are out of stock. Please update your cart before placing the order.
                </p>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {currentUser?.displayName}</p>
              <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;