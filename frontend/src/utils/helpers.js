/**
 * Format currency to Indian Rupees
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date to Indian locale
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date with time
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Capitalize first letter of string
 * @param {string} str 
 * @returns {string}
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate random tracking ID
 * @returns {string}
 */
export const generateTrackingId = () => {
  return 'SKY' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {object}
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength,
    strength: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

/**
 * Debounce function for search
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate cart total
 * @param {Array} items 
 * @returns {number}
 */
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Calculate order totals with all charges
 * @param {number} itemsTotal 
 * @returns {object}
 */
export const calculateOrderTotals = (itemsTotal) => {
  const deliveryCharges = itemsTotal >= 100 ? 0 : 30;
  const platformFee = 5;
  const subtotal = itemsTotal + deliveryCharges + platformFee;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;
  
  return {
    itemsTotal: itemsTotal,
    deliveryCharges: deliveryCharges,
    platformFee: platformFee,
    gst: gst,
    grandTotal: grandTotal,
    savings: itemsTotal >= 100 ? 30 : 0,
    freeDelivery: itemsTotal >= 100
  };
};

/**
 * Check if item is in stock
 * @param {object} item 
 * @param {number} requestedQuantity 
 * @returns {boolean}
 */
export const isItemInStock = (item, requestedQuantity = 1) => {
  return item.stockQuantity >= requestedQuantity && item.isActive;
};

/**
 * Get order status color
 * @param {string} status 
 * @returns {string}
 */
export const getOrderStatusColor = (status) => {
  const colors = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    CONFIRMED: 'text-green-600 bg-green-50',
    PREPARING: 'text-blue-600 bg-blue-50',
    OUT_FOR_DELIVERY: 'text-purple-600 bg-purple-50',
    DELIVERED: 'text-green-700 bg-green-100',
    CANCELLED: 'text-red-600 bg-red-50'
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
};

/**
 * Handle image load error
 * @param {Event} event 
 */
export const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};