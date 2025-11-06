import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Truck 
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrderDetails(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle },
      { key: 'PREPARING', label: 'Preparing', icon: Clock },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
      { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
    ];

    const statusOrder = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
        <Link to="/orders" className="btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link 
          to="/orders" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order #{order.trackingId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Order Status</h2>
            
            <div className="relative">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center mb-6 last:mb-0">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.active 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <p className={`font-medium ${
                        step.completed || step.active ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      {step.active && (
                        <p className="text-sm text-sky-600">Current status</p>
                      )}
                    </div>
                    
                    {index < statusSteps.length - 1 && (
                      <div className={`absolute left-5 w-0.5 h-6 mt-10 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`} style={{ top: `${(index * 6) + 2.5}rem` }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                    }}
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.category}</p>
                    <p className="text-gray-600 text-sm">
                      ₹{item.price}/{item.unit} × {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Delivery Address</p>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Order Date</p>
                  <p className="text-gray-600">{formatDate(order.orderDate)}</p>
                </div>
              </div>
              
              {order.deliveryDate && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Delivered On</p>
                    <p className="text-gray-600">{formatDate(order.deliveryDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-sm">{order.orderId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking ID</span>
                <span className="font-medium">{order.trackingId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({order.items?.length || 0})</span>
                <span className="font-medium">₹{order.totalAmount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-sky-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Payment Method</p>
                <p className="text-gray-600">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <button className="w-full btn-primary">
                Track Order
              </button>
            )}
            
            <Link to="/orders" className="block">
              <button className="w-full btn-secondary">
                Back to Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;