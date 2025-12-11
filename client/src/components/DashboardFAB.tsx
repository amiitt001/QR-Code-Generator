import React, { useState } from 'react';
import { BarChart3, X } from 'lucide-react';

export const DashboardFAB: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Open Dashboard"
    >
      <div className="relative">
        {/* Main Button */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <BarChart3 
            size={24} 
            className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
          />
          <span className={`font-semibold transition-all duration-300 overflow-hidden ${
            isHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
          }`}>
            View Dashboard
          </span>
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20" />
      </div>
    </button>
  );
};
