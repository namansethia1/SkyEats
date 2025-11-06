export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const PAYMENT_METHODS = {
  ONLINE: 'Online Payment',
  COD: 'Cash on Delivery'
};

export const CATEGORIES = {
  ALL: 'all',
  FRUITS: 'Fruits',
  VEGETABLES: 'Vegetables',
  SNACKS: 'Snacks',
  BEVERAGES: 'Beverages',
  DAIRY: 'Dairy',
  BAKERY: 'Bakery',
  FROZEN: 'Frozen',
  GRAINS: 'Grains'
};

export const API_ENDPOINTS = {
  INVENTORY: {
    ITEMS: '/inventory/items',
    CATEGORIES: '/inventory/categories',
    ITEMS_BY_CATEGORY: '/inventory/items/category',
    SEARCH: '/inventory/search'
  },
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
    SUMMARY: '/cart/summary'
  },
  ORDERS: {
    CHECKOUT: '/orders/checkout',
    HISTORY: '/orders/history',
    DETAILS: '/orders',
    TRACK: '/orders/track'
  }
};

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Logged in successfully',
    REGISTER: 'Account created successfully',
    LOGOUT: 'Logged out successfully',
    ITEM_ADDED: 'Item added to cart',
    ITEM_REMOVED: 'Item removed from cart',
    CART_CLEARED: 'Cart cleared',
    ORDER_PLACED: 'Order placed successfully!'
  },
  ERROR: {
    LOGIN_REQUIRED: 'Please login to continue',
    INVALID_CREDENTIALS: 'Invalid email or password',
    NETWORK_ERROR: 'Network error. Please try again',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    EMPTY_CART: 'Your cart is empty',
    ORDER_FAILED: 'Failed to place order',
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCT_NOT_AVAILABLE: 'Product is not available',
    OUT_OF_STOCK: 'Product is out of stock',
    INVALID_QUANTITY: 'Invalid quantity specified',
    STOCK_LIMIT_EXCEEDED: 'Requested quantity exceeds available stock'
  }
};