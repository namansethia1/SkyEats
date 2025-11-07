import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 group"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="w-3 h-3 text-yellow-500 animate-spin-slow" />
        ) : (
          <Moon className="w-3 h-3 text-blue-400 animate-pulse" />
        )}
      </div>
      
      {/* Background icons */}
      <div className="flex justify-between items-center h-full px-1.5">
        <Sun className={`w-3 h-3 transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-50 text-yellow-400'}`} />
        <Moon className={`w-3 h-3 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-50 text-gray-500'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
