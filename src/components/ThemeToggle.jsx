import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Respect system default on first load (unless user already chose)
  useEffect(() => {
    const ls = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = ls ? (ls === 'dark') : systemDark;
    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color mode"
      className="fixed top-4 right-4 z-50 p-2 rounded-full border border-current
                 bg-white text-black dark:bg-black dark:text-white
                 shadow-md transition"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun/Moon SVG – flips with theme */}
      {isDark ? (
        // Sun (for dark mode showing "switch to light")
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        // Moon (for light mode showing "switch to dark")
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3
                   a7 7 0 0 0 9.79 9.79Z"
                stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )}
    </button>
  );
}
