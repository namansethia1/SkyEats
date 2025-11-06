import React from 'react';
import { Clock, ShoppingCart, Zap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const FeaturedProducts = ({ onAddToCart, currentUser, inventoryItems, onCategorySelect }) => {
  // Create featured products from actual inventory items with discounts
  const createFeaturedProducts = () => {
    if (!inventoryItems || inventoryItems.length === 0) return [];
    
    // Select some items from inventory and add discount information
    const selectedItems = [
      inventoryItems.find(item => item.category === 'Fruits'),
      inventoryItems.find(item => item.category === 'Grains'),
      inventoryItems.find(item => item.category === 'Dairy'),
      inventoryItems.find(item => item.category === 'Bakery')
    ].filter(Boolean); // Remove any undefined items
    
    return selectedItems.map((item, index) => {
      const discounts = [20, 15, 25, 18]; // Different discount percentages
      const badges = ['Today Only', 'Flash Sale', 'Limited Time', 'Hot Deal'];
      const timeLeft = ['2h 30m', '5h 15m', '1h 45m', '3h 20m'];
      
      const discount = discounts[index] || 20;
      const originalPrice = parseFloat(item.price);
      const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
      
      return {
        ...item,
        id: item.id,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        discount: discount,
        timeLeft: timeLeft[index] || '2h 30m',
        badge: badges[index] || 'Special Deal',
        stockQuantity: item.stockQuantity
      };
    });
  };
  
  const featuredProducts = createFeaturedProducts();

  const handleAddToCart = (product) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }
    // Pass the actual inventory item to the parent component
    onAddToCart(product);
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      console.log('Category clicked in FeaturedProducts:', category); // Debug log
      onCategorySelect(category);
    }
  };

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-yellow-500 mr-3" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Today's Special Deals
            </h2>
            <p className="text-gray-600">Limited time offers - Grab them before they're gone!</p>
          </div>
        </div>
        <button className="text-sky-600 hover:text-sky-700 font-medium flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            {/* Discount Badge */}
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              {product.discount}% OFF
            </div>

            {/* Time Badge */}
            <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {product.timeLeft}
            </div>

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Quick Add Button */}
              {currentUser && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full font-medium transform scale-90 group-hover:scale-100 transition-transform duration-200 flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Quick Add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Category */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => handleCategoryClick(product.category)}
                  className="text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-full transition-colors duration-200 cursor-pointer"
                  title={`View all ${product.category} products`}
                >
                  {product.category}
                </button>
              </div>

              {/* Product Name */}
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200 mb-2">
                {product.name}
              </h3>

              {/* Price Section */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-sky-600">
                    ₹{product.discountedPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{Math.round(product.originalPrice)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">per {product.unit}</span>
              </div>

              {/* Stock Info */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  product.stockQuantity <= 10 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {product.stockQuantity <= 10 ? 'Limited Stock!' : 'In Stock'}
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  {product.badge}
                </span>
              </div>

              {/* Stock Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    product.stockQuantity <= 10 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min((product.stockQuantity / 30) * 100, 100)}%` 
                  }}
                ></div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!currentUser}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{currentUser ? 'Add to Cart' : 'Login to Add'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;