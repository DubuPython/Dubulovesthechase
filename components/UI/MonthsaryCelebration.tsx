'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MonthsaryCelebration() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const isFirstOfMonth = today.getDate() === 1;
    
    const storageKey = `monthsary_${today.getFullYear()}_${today.getMonth()}`;
    const hasSeenThisMonth = sessionStorage.getItem(storageKey);

    // Set to true to test right now, change to false before deploying!
    const forceShowForTesting = true; 

    if ((isFirstOfMonth && !hasSeenThisMonth) || forceShowForTesting) {
      setIsVisible(true);
      
      // Bumped up to 100 particles for a fuller effect across the whole screen
      const newParticles = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        isTulip: i % 5 === 0, 
        left: Math.random() * 100, 
        delay: Math.random() * 2, 
        duration: 3 + Math.random() * 4, 
        color: ['bg-pink-400', 'bg-purple-500', 'bg-yellow-300', 'bg-indigo-400', 'bg-fuchsia-400'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 6
      }));
      setParticles(newParticles);
    }
  }, []);

  const handleClose = () => {
    const today = new Date();
    sessionStorage.setItem(`monthsary_${today.getFullYear()}_${today.getMonth()}`, 'true');
    setIsVisible(false);
  };

  const PartyHat = () => (
    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-pink-500 z-10 transform rotate-12">
      <div className="absolute -top-2 -left-1.5 w-3 h-3 bg-yellow-300 rounded-full drop-shadow-md" />
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden"
        >
          {/* Falling Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -100, x: `${p.left}vw`, rotate: 0 }}
              animate={{ y: '120vh', rotate: 360 }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
              // ADDED left-0 FIX HERE: This forces 0vw to start at the actual left edge of the screen!
              className="absolute top-0 left-0 pointer-events-none" 
            >
              {p.isTulip ? (
                <span className="text-3xl drop-shadow-lg" style={{ filter: 'hue-rotate(250deg)' }}>🌷</span>
              ) : (
                <div 
                  className={`${p.color} rounded-sm opacity-80`}
                  style={{ width: `${p.size}px`, height: `${p.size * 1.5}px` }}
                />
              )}
            </motion.div>
          ))}

          {/* Center Celebration Box */}
          <motion.div 
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.2 }}
            className="relative bg-white dark:bg-[#1a1a2e] p-8 md:p-12 rounded-[3rem] shadow-[0_0_60px_rgba(219,39,119,0.4)] border-4 border-purple-200 dark:border-purple-500/50 flex flex-col items-center max-w-lg mx-4 z-50 text-center"
          >
            
            {/* Dancing Mascots */}
            <div className="flex gap-6 mb-6">
              <motion.div
                animate={{ y: [0, -25, 0], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="relative text-6xl md:text-7xl"
              >
                <PartyHat />
                🦆
              </motion.div>

              <motion.div
                animate={{ y: [0, -25, 0], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="relative text-6xl md:text-7xl"
              >
                <PartyHat />
                🐧
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4 tracking-tight drop-shadow-sm">
              Happy monthsary, Baby!
            </h1>
            
            <p className="text-gray-600 dark:text-purple-200 font-medium text-lg mb-8">
              I love you more than yesterday, but less than tomorrow. 💜
            </p>

            <button 
              onClick={handleClose}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3.5 px-10 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 text-lg"
            >
              I hope you'll love me again too.
            </button>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}