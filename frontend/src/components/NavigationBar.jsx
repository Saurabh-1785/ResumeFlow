import React from 'react';

const NavigationBar = ({
  navItems,
  currentStep,
  onNavigate,
  onDownloadPDF,
  onDownloadLatex,
  onBackToHome,
  isMobile,
  mobileMenuOpen,
  setMobileMenuOpen,
  darkMode,
  toggleTheme
}) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Home */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-yellow-800 dark:bg-yellow-600 flex items-center justify-center text-white font-bold font-abril text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                R
              </div>
              <span className="font-abril text-xl text-gray-900 dark:text-white group-hover:text-yellow-800 dark:group-hover:text-yellow-500 transition-colors">
                ResumeFlow
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                {navItems.map((item) => (
                  <button
                    key={item.step}
                    onClick={() => onNavigate(item.step)}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${currentStep === item.step
                        ? 'text-yellow-800 dark:text-yellow-500 bg-white dark:bg-gray-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {item.label}
                    {currentStep === item.step && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-800 dark:bg-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

            <button
              onClick={onDownloadPDF}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-800 dark:bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-900 dark:hover:bg-yellow-500 transition-colors shadow-md shadow-yellow-900/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out transform origin-top
          ${mobileMenuOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'}
        `}
      >
        <div className="p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.step}
              onClick={() => {
                onNavigate(item.step);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors
                ${currentStep === item.step
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              {item.label}
              {currentStep === item.step && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onDownloadPDF();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-yellow-800 dark:bg-yellow-600 text-white font-medium active:scale-95 transition-transform"
            >
              PDF
            </button>
            <button
              onClick={() => {
                onDownloadLatex();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium active:scale-95 transition-transform"
            >
              LaTeX
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;