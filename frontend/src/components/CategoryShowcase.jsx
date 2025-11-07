import React, { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

const CategoryShowcase = ({ onCategorySelect, categories = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Category metadata for display purposes
  const categoryMetadata = {
    'fruits': {
      icon: '🍎',
      description: 'Fresh & Juicy',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
      subcategories: ['Fresh Fruits', 'Exotic Fruits', 'Seasonal Fruits', 'Organic Fruits'],
      color: 'from-red-400 to-pink-500'
    },
    'vegetables': {
      icon: '🥕',
      description: 'Farm Fresh',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      subcategories: ['Leafy Greens', 'Root Vegetables', 'Exotic Vegetables', 'Organic Vegetables'],
      color: 'from-green-400 to-emerald-500'
    },
    'dairy': {
      icon: '🥛',
      description: 'Pure & Fresh',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop',
      subcategories: ['Milk & Cream', 'Cheese & Butter', 'Yogurt & Lassi', 'Ice Cream'],
      color: 'from-blue-400 to-cyan-500'
    },
    'bakery': {
      icon: '🍞',
      description: 'Freshly Baked',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
      subcategories: ['Breads & Buns', 'Cakes & Pastries', 'Cookies & Biscuits', 'Fresh Bakery'],
      color: 'from-yellow-400 to-orange-500'
    },
    'snacks': {
      icon: '🍿',
      description: 'Tasty Treats',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop',
      subcategories: ['Chips & Crisps', 'Nuts & Seeds', 'Chocolates', 'Traditional Snacks'],
      color: 'from-purple-400 to-pink-500'
    },
    'beverages': {
      icon: '🥤',
      description: 'Refreshing Drinks',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
      subcategories: ['Soft Drinks', 'Juices', 'Tea & Coffee', 'Energy Drinks'],
      color: 'from-indigo-400 to-purple-500'
    },
    'frozen': {
      icon: '🧊',
      description: 'Frozen Fresh',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      subcategories: ['Frozen Vegetables', 'Frozen Snacks', 'Ice Cream', 'Frozen Ready Meals'],
      color: 'from-cyan-400 to-blue-500'
    },
    'grains': {
      icon: '🌾',
      description: 'Healthy Grains',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
      subcategories: ['Rice & Wheat', 'Pulses & Lentils', 'Cereals', 'Organic Grains'],
      color: 'from-amber-400 to-yellow-500'
    },
    'meat': {
      icon: '🥩',
      description: 'Fresh Meat',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=200&fit=crop',
      subcategories: ['Chicken', 'Mutton', 'Fish', 'Seafood'],
      color: 'from-red-500 to-orange-500'
    },
    'spices': {
      icon: '🌶️',
      description: 'Aromatic Spices',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop',
      subcategories: ['Whole Spices', 'Ground Spices', 'Herbs', 'Masalas'],
      color: 'from-orange-400 to-red-500'
    }
  };

  // Create display categories from actual database categories
  const displayCategories = categories
    .filter(cat => cat !== 'all') // Exclude 'all' category
    .map(categoryName => {
      const lowerCaseName = categoryName.toLowerCase();
      const metadata = categoryMetadata[lowerCaseName] || {
        icon: '🛒',
        description: 'Quality Products',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
        subcategories: ['Premium Quality', 'Fresh Products', 'Best Prices', 'Fast Delivery'],
        color: 'from-gray-400 to-gray-500'
      };

      return {
        id: categoryName, // Use actual category name from database
        name: categoryName,
        ...metadata
      };
    });

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category.id); // Debug log
    onCategorySelect(category.id);
  };

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-sky-600 dark:text-sky-400 mr-3" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Shop by Category
          </h2>
          <Sparkles className="h-8 w-8 text-sky-600 dark:text-sky-400 ml-3" />
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover fresh products organized by categories for easy shopping
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayCategories.map((category, index) => (
          <div
            key={category.id}
            className="group relative cursor-pointer"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick(category)}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Main Category Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Category Image */}
              <div className="relative h-32 md:h-40 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                
                {/* Category Icon */}
                <div className="absolute top-3 right-3 text-3xl bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                    Available
                  </span>
                  <span className="text-xs text-gray-500">
                    Tap to explore
                  </span>
                </div>
              </div>

              {/* Hover Effect - Subcategories */}
              {hoveredCategory === category.id && (
                <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex flex-col justify-center items-center p-4 animate-fadeIn">
                  <h4 className="font-bold text-gray-900 mb-3 text-center">Subcategories</h4>
                  <div className="space-y-1 text-center">
                    {category.subcategories.slice(0, 3).map((sub, idx) => (
                      <div key={idx} className="text-sm text-gray-700 hover:text-sky-600 transition-colors">
                        {sub}
                      </div>
                    ))}
                    {category.subcategories.length > 3 && (
                      <div className="text-xs text-sky-600 font-medium">
                        +{category.subcategories.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Categories Button */}
      <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          View All Categories
        </button>
      </div>
    </div>
  );
};

export default CategoryShowcase;