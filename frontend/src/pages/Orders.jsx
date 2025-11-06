import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { auth } from '../config/firebase';
import { Package, Clock, CheckCircle, Truck, Calendar, Eye } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrderHistory();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };



  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PREPARING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
        return <Package className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50';
      case 'PREPARING':
        return 'text-yellow-600 bg-yellow-50';
      case 'OUT_FOR_DELIVERY':
        return 'text-blue-600 bg-blue-50';
      case 'DELIVERED':
        return 'text-green-700 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
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

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>
        <EmptyState 
          type="orders"
          onAction={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div 
            key={order.orderId} 
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Status Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div 
                className={`h-full transition-all duration-1000 ${
                  order.status === 'CONFIRMED' ? 'w-1/4 bg-green-500' :
                  order.status === 'PREPARING' ? 'w-2/4 bg-yellow-500' :
                  order.status === 'OUT_FOR_DELIVERY' ? 'w-3/4 bg-blue-500' :
                  order.status === 'DELIVERED' ? 'w-full bg-green-600' :
                  'w-1/4 bg-gray-400'
                }`}
              ></div>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      {getStatusIcon(order.status)}
                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <div className="absolute -inset-1 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200">
                        Order #{order.trackingId}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        ID: {order.orderId.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)} shadow-md`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Order Date</p>
                          <p className="font-bold text-gray-900">{formatDate(order.orderDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <span className="text-green-600 font-bold text-lg">₹</span>
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-medium">Total Amount</p>
                          <p className="font-bold text-xl text-gray-900">₹{order.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Items</p>
                          <p className="font-bold text-gray-900">{order.items?.length || 0} items</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  {order.deliveryDate && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Successfully Delivered!</p>
                          <p className="text-sm text-green-600">Delivered on {formatDate(order.deliveryDate)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Status Timeline */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Progress</h4>
                    <div className="flex items-center space-x-2">
                      {['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status, idx) => (
                        <div key={status} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].indexOf(order.status) >= idx
                              ? 'bg-green-500 scale-110' : 'bg-gray-300'
                          }`}></div>
                          {idx < 3 && (
                            <div className={`w-8 h-0.5 transition-all duration-300 ${
                              ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].indexOf(order.status) > idx
                                ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Confirmed</span>
                      <span>Preparing</span>
                      <span>Shipping</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-600" />
                        Order Items
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div 
                            key={index} 
                            className="group bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-16 object-cover rounded-md mb-2 group-hover:scale-110 transition-transform duration-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-xs font-medium text-sky-600">₹{item.totalPrice}</p>
                          </div>
                        ))}
                      </div>
                      {order.items.length > 4 && (
                        <div className="mt-3 text-center">
                          <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            +{order.items.length - 4} more items
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <Link
                    to={`/orders/${order.orderId}`}
                    className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Link>

                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Track Order</span>
                    </button>
                  )}

                  {order.status === 'DELIVERED' && (
                    <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;