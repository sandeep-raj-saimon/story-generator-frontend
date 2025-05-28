import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Gradient background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl transform rotate-3"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 rounded-xl transform -rotate-3"></div>
        
        {/* Logo text */}
        <div className="relative z-10">
          <span className="text-white font-extrabold text-xl tracking-tight">
            WT
          </span>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full"></div>
      </div>
      
      {/* Brand name */}
      <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent font-bold text-lg tracking-tight">
        WhisprTales
      </span>
    </Link>
  );
};

export default Logo; 