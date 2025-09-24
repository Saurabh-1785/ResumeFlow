import { useState, useEffect, useRef } from 'react';
import DownloadButtons from './DownloadButtons';


function NavigationBar({ 
  navItems, 
  currentStep, 
  onNavigate, 
  onDownloadPDF, 
  onDownloadWord, 
  onDownloadLatex, 
  onBackToHome,
  isMobile,
  mobileMenuOpen,
  setMobileMenuOpen,
  darkMode,
  toggleTheme,
}) {
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const downloadRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setDownloadDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDownloadOption = (downloadType) => {
    setDownloadDropdownOpen(false);
    switch (downloadType) {
      case 'pdf':
        onDownloadPDF();
        break;
      case 'word':
        onDownloadWord();
        break;
      case 'latex':
        onDownloadLatex();
        break;
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-stone-50 dark:bg-gray-800 border-b-2 border-yellow-800 dark:border-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <button 
                onClick={onBackToHome}
                className="text-2xl font-abril font-bold text-yellow-800 dark:text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400 transition-colors cursor-pointer"
              >
                ResumeFlow
              </button>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate(item.step)}
                      className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                        currentStep === item.step
                          ? 'bg-yellow-800 dark:bg-yellow-600 text-stone-50 dark:text-black'
                          : 'text-gray-700 dark:text-gray-200 transition-all ease-in duration-200 dark:hover:text-gray-50 hover:bg-yellow-800 hover:text-gray-50 dark:hover:bg-yellow-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Download Dropdown */}
            {!isMobile && (
              <div className="hidden lg:block relative" ref={downloadRef}>
                <button
                  onClick={() => {
                    setTimeout(() => setDownloadDropdownOpen(!downloadDropdownOpen), 100);
                  }}
                  className="bg-blue-800 cursor-pointer ease-in duration-200 hover:bg-blue-700 text-stone-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md flex items-center gap-2"
                >
                  Download
                  <svg className={`w-4 h-4 transition-transform ${downloadDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {downloadDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-stone-50 dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleDownloadOption('pdf')}
                        className="w-full text-left px-4 py-2 text-sm cursor-pointer text-gray-700 dark:text-gray-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download as PDF
                      </button>
                      <button
                        onClick={() => handleDownloadOption('latex')}
                        className="w-full text-left px-4 py-2 text-sm cursor-pointer text-gray-700 dark:text-gray-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Download LaTeX Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <div className="lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 ease-in-out"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}
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
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobile && mobileMenuOpen && (
          <div className="lg:hidden border-t border-yellow-800 dark:border-yellow-600 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-stone-50 dark:bg-gray-800">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.step)}
                  className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentStep === item.step
                      ? 'bg-yellow-800 dark:bg-yellow-600 text-stone-50 dark:text-black'
                      : 'text-gray-700 dark:text-gray-200 hover:text-yellow-800 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-700'
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
                    {item.label}
                  </div>
                </button>
              ))}
              
              {/* Mobile Theme Toggle in Menu */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-gray-700 hover:text-yellow-600 transition-colors flex items-center"
                >
                  <span className="mr-3 text-lg">
                    {darkMode ? '☀️' : '🌙'}
                  </span>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <DownloadButtons generatePdf={onDownloadPDF} generateLatex={onDownloadLatex} />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Theme Toggle - Below Nav Bar for Desktop */}
      {!isMobile && (
        <div className="flex justify-center py-2 bg-stone-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full cursor-pointer bg-stone-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-stone-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              // Sun icon for light mode
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-white dark:bg-gray-800 bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default NavigationBar;