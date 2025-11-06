import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Inventory API
export const inventoryAPI = {
  getAllItems: () => api.get('/inventory/items'),
  getItemsByCategory: (category) => api.get(`/inventory/items/category/${category}`),
  getCategories: () => api.get('/inventory/categories'),
  getItemById: (id) => api.get(`/inventory/items/${id}`),
  searchItems: (query) => api.get(`/inventory/search?q=${query}`),
  checkStock: (id, quantity) => api.get(`/inventory/items/${id}/stock-check?quantity=${quantity}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (itemId, quantity) => api.post('/cart/add', { itemId, quantity }),
  updateCart: (itemId, quantity) => api.put('/cart/update', { itemId, quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  getCartSummary: () => api.get('/cart/summary'),
};

// Orders API
export const ordersAPI = {
  checkout: (deliveryAddress, paymentMethod = 'Online Payment') => 
    api.post('/orders/checkout', { deliveryAddress, paymentMethod }),
  getOrderHistory: () => api.get('/orders/history'),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
  trackOrder: (trackingId) => api.get(`/orders/track/${trackingId}`),
};

export default api;