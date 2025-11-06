import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 shimmer"></div>
      
      <div className="p-4 space-y-3">
        {/* Category Badge Skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-16 h-5 bg-gray-200 rounded-full shimmer"></div>
          <div className="w-12 h-5 bg-gray-200 rounded-full shimmer"></div>
        </div>

        {/* Title Skeleton */}
        <div className="w-3/4 h-6 bg-gray-200 rounded shimmer"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded shimmer"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded shimmer"></div>
        </div>
        
        {/* Price and Stock Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="w-16 h-6 bg-gray-200 rounded shimmer"></div>
            <div className="w-12 h-3 bg-gray-200 rounded shimmer"></div>
          </div>
          <div className="text-right space-y-1">
            <div className="w-20 h-4 bg-gray-200 rounded shimmer"></div>
            <div className="w-16 h-3 bg-gray-200 rounded shimmer"></div>
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="w-full h-2 bg-gray-200 rounded-full shimmer"></div>

        {/* Button Skeleton */}
        <div className="w-full h-12 bg-gray-200 rounded-lg shimmer"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;