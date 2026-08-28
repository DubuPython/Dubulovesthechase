'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check what mode the website ACTUALLY loaded in to set the correct icon
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
    <nav className={`fixed top-0 w-full z-100 transition-all duration-500 border-b ${
      scrolled 
        ? 'bg-white/60 dark:bg-[#0f0c29]/60 backdrop-blur-md border-purple-200/50 dark:border-purple-800/50 shadow-lg' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <a href="#hero" className="text-xl font-bold text-pink-500 dark:text-pink-400 drop-shadow-sm">
          I'm Sorry, Joana Alexandra Sanchez.
        </a>
        
        <div className="hidden md:flex space-x-8 text-sm font-medium text-indigo-900 dark:text-purple-200">
          <a href="#hero" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Home</a>
          <a href="#bulletin-board" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Our Notes</a>
          <a href="#gallery" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Polaroids</a>
          <a href="#fishbowl" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Messages</a>
          <a href="#albums" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Albums</a>
          <a href="#sarino" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">Sarino</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          
        </div>

      </div>
    </nav>
  );
}