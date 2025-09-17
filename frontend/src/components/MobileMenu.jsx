// frontend/src/components/MobileMenu.jsx

import { useState } from 'react';

function MobileMenu({ tabs, currentStep, onNavigate, showMenu, setShowMenu }) {
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden sticky top-4 z-50 mb-6">
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-2 border-yellow-600">
          <span className="font-inknut text-yellow-600 font-semibold">
            {tabs[currentStep]} Section
          </span>
          <button
            onClick={toggleMenu}
            className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${showMenu ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-yellow-600 overflow-hidden z-40">
            {tabs.map((label, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-full text-left px-6 py-4 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                  currentStep === index
                    ? 'bg-yellow-600 text-white dark:text-black font-semibold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-gray-700 hover:text-yellow-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">
                    {index === 0 && '👤'}
                    {index === 1 && '🎓'}
                    {index === 2 && '💼'}
                    {index === 3 && '🚀'}
                    {index === 4 && '🛠️'}
                    {index === 5 && '📝'}
                    {index === 6 && '↕️'}
                  </span>
                  {label === "Custom" ? "Custom Sections" : label}
                </div>
              </button>
            ))}
            
            {/* Preview Button in Mobile Menu */}
            <button
              onClick={() => {
                onNavigate(7); // Corrected Step for Preview
                setShowMenu(false);
              }}
              className="w-full text-left px-6 py-4 transition-colors bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800"
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">👀</span>
                Preview Resume
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {showMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
}

export default MobileMenu;