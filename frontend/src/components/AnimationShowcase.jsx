import React from 'react';
import { Sparkles, Zap, Heart, Star } from 'lucide-react';

/**
 * AnimationShowcase - A component demonstrating various beautiful animations
 * You can use these animation classes throughout your app for aesthetic appeal
 */
const AnimationShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {/* Fade In Up */}
      <div className="card animate-fadeInUp hover-lift">
        <Sparkles className="h-8 w-8 text-sky-500 dark:text-sky-400 mb-3" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Fade In Up</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Smooth entrance animation</p>
      </div>

      {/* Scale In with Glow */}
      <div className="card animate-scaleIn hover-glow" style={{ animationDelay: '0.1s' }}>
        <Zap className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mb-3" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Scale & Glow</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Hover for glow effect</p>
      </div>

      {/* Bounce In */}
      <div className="card animate-bounceIn" style={{ animationDelay: '0.2s' }}>
        <Heart className="h-8 w-8 text-red-500 dark:text-red-400 mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Bounce In</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Playful entrance</p>
      </div>

      {/* Float Animation */}
      <div className="card animate-slideInRight" style={{ animationDelay: '0.3s' }}>
        <Star className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-3 animate-float" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Float Effect</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Continuous floating</p>
      </div>
    </div>
  );
};

export default AnimationShowcase;
