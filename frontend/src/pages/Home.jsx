import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Plus, Minus, ShoppingCart, ChevronRight } from 'lucide-react';
import ProductSkeleton from '../components/ProductSkeleton';
import EmptyState from '../components/EmptyState';
import HeroSlideshow from '../components/HeroSlideshow';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import toast from 'react-hot-toast';

const Home = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const { addToCart, updateCartItem, getItemQuantity } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    console.log('Selected category changed to:', selectedCategory); // Debug log
    if (selectedCategory === 'all') {
      fetchItems();
    } else {
      fetchItemsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await inventoryAPI.getCategories();
      setCategories(['all', ...response.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByCategory = async (category) => {
    console.log('Fetching items for category:', category); // Debug log
    try {
      setLoading(true);
      const response = await inventoryAPI.getItemsByCategory(category);
      console.log('Items fetched for category:', category, response.data.length, 'items'); // Debug log
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items by category:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }

    try {
      setLoading(true);
      const response = await inventoryAPI.searchItems(searchTerm);
      setItems(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
      toast.error('Failed to search items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }

    // Check if item is in stock
    if (item.stockQuantity <= 0) {
      toast.error('This item is out of stock');
      return;
    }

    const currentQuantity = getItemQuantity(item.id);
    
    // Check if adding one more would exceed stock
    if (currentQuantity + 1 > item.stockQuantity) {
      toast.error(`Only ${item.stockQuantity} items available. You already have ${currentQuantity} in cart.`);
      return;
    }

    if (currentQuantity > 0) {
      await updateCartItem(item.id, currentQuantity + 1);
    } else {
      await addToCart(item.id, 1);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (!currentUser) {
      toast.error('Please login to modify cart');
      return;
    }

    if (newQuantity <= 0) {
      await updateCartItem(item.id, 0);
    } else if (newQuantity > item.stockQuantity) {
      toast.error(`Only ${item.stockQuantity} items available`);
      return;
    } else {
      await updateCartItem(item.id, newQuantity);
    }
  };

  const handleCategorySelect = (categoryId) => {
    console.log('Category selected in Home:', categoryId); // Debug log
    console.log('Available categories:', categories); // Debug log
    setSelectedCategory(categoryId);
    setShowProducts(true);
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleFeaturedProductAdd = async (product) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    // Since the featured product is now based on actual inventory items,
    // we can directly add it to cart using its ID
    if (product && product.id) {
      await addToCart(product.id, 1);
    } else {
      toast.error('This item is currently not available');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <div className="w-3/4 h-16 bg-gray-200 rounded-lg mx-auto mb-6 shimmer"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded-lg mx-auto mb-8 shimmer"></div>
        </div>

        {/* Search and Filter Skeleton */}
        <div className="mb-8">
          <div className="w-full h-12 bg-gray-200 rounded-lg mb-6 shimmer"></div>
          <div className="flex gap-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="w-20 h-8 bg-gray-200 rounded-full shimmer"></div>
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-sky-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 dark:from-sky-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-pulse">
              SkyEats
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            🚀 Fresh groceries delivered to your doorstep with{' '}
            <span className="font-semibold text-sky-600 dark:text-sky-400">lightning speed</span>
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['🍎 Fresh Products', '⚡ Fast Delivery', '💰 Best Prices', '🛡️ Secure Payment'].map((feature, index) => (
              <span 
                key={feature}
                className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  animationDelay: `${index * 200 + 500}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Featured Products Section */}
      <FeaturedProducts 
        onAddToCart={handleFeaturedProductAdd}
        currentUser={currentUser}
        inventoryItems={items}
        onCategorySelect={handleCategorySelect}
      />

      {/* Category Showcase */}
      <CategoryShowcase onCategorySelect={handleCategorySelect} categories={categories} />

      {/* Products Section - Only show when category is selected */}
      {showProducts && (
        <div id="products-section" className="mt-16">
          {/* Back to Categories Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowProducts(false)}
              className="flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium mb-4"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              Back to Categories
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Discover fresh {selectedCategory.toLowerCase()} products</p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Category Info */}
            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
              <h3 className="font-semibold text-sky-800 dark:text-sky-300 mb-2">
                Browsing: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h3>
              <p className="text-sky-600 dark:text-sky-400 text-sm">
                Showing all products in this category. Use search to find specific items.
              </p>
            </div>
          </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const quantity = getItemQuantity(item.id);
          const isOutOfStock = item.stockQuantity === 0;
          const isLowStock = item.stockQuantity <= 5 && item.stockQuantity > 0;

          return (
            <div 
              key={item.id} 
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Stock Badge */}
              {isLowStock && (
                <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  Limited Stock!
                </div>
              )}
              
              {/* Discount Badge (Random for demo) */}
              {index % 4 === 0 && !isOutOfStock && (
                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold transform rotate-12">
                  Fresh!
                </div>
              )}

              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <span className="text-white font-bold text-lg block">Out of Stock</span>
                      <span className="text-gray-300 text-sm">Coming Soon</span>
                    </div>
                  </div>
                )}
                
                {/* Quick Add Button Overlay */}
                {!isOutOfStock && currentUser && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full font-medium transform scale-90 group-hover:scale-100 transition-transform duration-200 flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                  {quantity > 0 && (
                    <span className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                      {quantity} in cart
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                
                {/* Price and Stock */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sky-600 dark:text-sky-400 font-bold text-xl">
                      ₹{item.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">per {item.unit}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      isLowStock ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {isLowStock ? 'Limited Stock' : 'In Stock'}
                    </div>
                    {isLowStock && (
                      <div className="text-xs text-orange-500 dark:text-orange-400 animate-pulse">
                        Hurry up!
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isLowStock ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((item.stockQuantity / 20) * 100, 100)}%` 
                    }}
                  ></div>
                </div>

                {!isOutOfStock && (
                  <div className="pt-2">
                    {quantity > 0 ? (
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                        <button
                          onClick={() => handleUpdateQuantity(item, quantity - 1)}
                          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 transform hover:scale-110"
                        >
                          <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{quantity}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">in cart</span>
                        </div>
                        <button
                          onClick={() => handleUpdateQuantity(item, quantity + 1)}
                          className="p-2 rounded-full bg-sky-600 dark:bg-sky-500 text-white shadow-md hover:shadow-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-all duration-200 transform hover:scale-110"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center space-x-2 w-full justify-center bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

          {filteredItems.length === 0 && !loading && (
            <EmptyState 
              type="search"
              title="No items found"
              description={searchTerm ? `No results for "${searchTerm}". Try different keywords or browse our categories.` : "No items available in this category."}
              actionText="Clear Filters"
              onAction={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;