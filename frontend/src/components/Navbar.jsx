import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const cartItemCount = getCartItemCount();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Utensils className="h-8 w-8 text-sky-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent group-hover:from-sky-700 group-hover:to-blue-700 transition-all duration-300">
              SkyEats
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
                >
                  Orders
                </Link>
                
                <Link 
                  to="/cart" 
                  className="relative text-gray-700 hover:text-sky-600 transition-all duration-300 transform hover:scale-110 group"
                >
                  <ShoppingCart className="h-6 w-6 group-hover:animate-bounce" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-bold shadow-lg">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-sky-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {currentUser ? (
                <>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-sky-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-sky-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart ({cartItemCount})</span>
                  </Link>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-sky-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;