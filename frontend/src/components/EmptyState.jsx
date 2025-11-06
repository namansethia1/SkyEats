import React from 'react';
import { ShoppingBag, Search, Package } from 'lucide-react';

const EmptyState = ({ 
  type = 'products', 
  title, 
  description, 
  actionText, 
  onAction,
  icon: CustomIcon 
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'cart':
        return {
          icon: ShoppingBag,
          title: 'Your cart is empty',
          description: 'Looks like you haven\'t added any items to your cart yet.',
          actionText: 'Start Shopping'
        };
      case 'orders':
        return {
          icon: Package,
          title: 'No orders yet',
          description: 'You haven\'t placed any orders yet. Start shopping to see your orders here.',
          actionText: 'Start Shopping'
        };
      case 'search':
        return {
          icon: Search,
          title: 'No items found',
          description: 'Try adjusting your search or browse our categories.',
          actionText: 'Clear Search'
        };
      default:
        return {
          icon: Package,
          title: 'No items found',
          description: 'There are no items to display at the moment.',
          actionText: 'Refresh'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const Icon = CustomIcon || defaultContent.icon;
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;
  const displayActionText = actionText || defaultContent.actionText;

  return (
    <div className="max-w-md mx-auto text-center py-16 animate-fadeInUp">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center animate-pulse">
          <Icon className="h-16 w-16 text-sky-400" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-8 w-4 h-4 bg-sky-200 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-8 right-6 w-3 h-3 bg-blue-200 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-6 left-12 w-2 h-2 bg-purple-200 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Content */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-slideInUp">
        {displayTitle}
      </h2>
      <p className="text-gray-600 mb-8 leading-relaxed animate-slideInUp" style={{animationDelay: '0.2s'}}>
        {displayDescription}
      </p>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-slideInUp"
          style={{animationDelay: '0.4s'}}
        >
          {displayActionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;