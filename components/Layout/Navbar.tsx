'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${
      scrolled 
        ? 'bg-white/90 dark:bg-[#0f0c29]/95 backdrop-blur-xl border-purple-200/50 dark:border-purple-800/50 shadow-md' 
        : 'bg-white/50 dark:bg-black/20 backdrop-blur-sm border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-y-3">
        
        <div className="flex items-center justify-between w-full md:w-auto">
          <a href="#hero" className="text-xl md:text-2xl font-bold text-pink-500 dark:text-pink-400 drop-shadow-sm">
            I Value You Jo! 💜
          </a>

          <div className="flex md:hidden items-center space-x-3">
            <button onClick={toggleDarkMode} className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform">
              {isDark ? '☀️' : '🌙'}
            </button>
            <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">v1.2</span>
          </div>
        </div>
        
        {/* Responsive Scrolling Tab Bar for Mobile & Desktop */}
        <div className="flex overflow-x-auto no-scrollbar space-x-2 md:space-x-6 w-full md:w-auto pb-1 md:pb-0 items-center justify-start md:justify-center">
          <a href="#hero" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Home</a>
          <a href="#bulletin-board" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Notes</a>
          <a href="#gallery" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Polaroids</a>
          <a href="#letters" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Letters</a>
          <a href="#fishbowl" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Messages</a>
          <a href="#albums" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Albums</a>
          <a href="#sarino" className="shrink-0 px-3 md:px-0 py-1 md:py-0 rounded-full text-sm font-medium text-indigo-900 dark:text-purple-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Sarino</a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform text-lg">
            {isDark ? '☀️' : '🌙'}
          </button>
          <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">v1.2</span>
        </div>

      </div>
    </nav>
  );
}