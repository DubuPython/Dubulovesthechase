'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MascotReunion() {
  const [isReunited, setIsReunited] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const handleReunite = () => {
    setIsReunited(true);
    setShowHearts(true);
    
    // Hearts fade away after 4 seconds
    setTimeout(() => {
      setShowHearts(false);
    }, 4000);
  };

  const handleReset = () => {
    setIsReunited(false);
  };

  return (
    <section className="relative w-full py-16 md:py-24 px-4 flex flex-col items-center border-t border-purple-500/10">
      
      <div className="text-center mb-8 z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md">
          Come Back Home
        </h2>
        <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base mt-2">
          Sometimes the duck gets busy, but she always comes back.
        </p>
      </div>

      {/* The Stage */}
      <div className="relative w-full max-w-3xl h-64 md:h-80 bg-gradient-to-b from-blue-50 to-pink-50 dark:from-indigo-950/30 dark:to-purple-900/10 rounded-[3rem] overflow-hidden border border-purple-200 dark:border-purple-800 shadow-xl flex flex-col items-center justify-end pb-12 md:pb-16 z-10">
        
        {/* Floating Hearts Animation */}
        <AnimatePresence>
          {showHearts && (
            <div className="absolute bottom-24 flex justify-center items-center z-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    y: -150 - (Math.random() * 100), 
                    x: (Math.random() - 0.5) * 150,
                    scale: 1 + Math.random() 
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 1.5, 
                    ease: "easeOut",
                    delay: Math.random() * 0.3
                  }}
                  className="absolute text-2xl md:text-3xl drop-shadow-md"
                >
                  {/* Randomly picks between hearts, sparkles, and her favorite tulips! */}
                  {['💜', '💖', '✨', '💕', '🌷'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* The Mascots */}
        <div className="relative flex items-center justify-center w-full max-w-md h-24">
          
          {/* Duck (Starts off-screen left, waddles in) */}
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ 
              x: isReunited ? -35 : -200, 
              opacity: isReunited ? 1 : 0,
              rotate: isReunited ? [0, -10, 10, 0] : 0
            }}
            transition={{ 
              x: { type: "spring", stiffness: 50, damping: 14 },
              rotate: { delay: 1, duration: 0.5, repeat: 2 } // Happy wiggle when reunited
            }}
            className="absolute text-6xl md:text-7xl z-20 drop-shadow-lg"
          >
            🦆
          </motion.div>

          {/* Penguin (Waiting patiently on the right) */}
          <motion.div
            animate={{ 
              x: isReunited ? 35 : 0,
              y: isReunited ? [0, -15, 0] : [0, -5, 0],
            }}
            transition={{ 
              x: { type: "spring", stiffness: 50, damping: 14 },
              y: { duration: isReunited ? 0.4 : 2, repeat: isReunited ? 2 : Infinity, delay: isReunited ? 1 : 0 }
            }}
            className="absolute text-6xl md:text-7xl z-20 drop-shadow-lg"
          >
            🐧
          </motion.div>

        </div>
      </div>

      {/* The Button */}
      <div className="mt-8 z-10">
        {!isReunited ? (
          <button
            onClick={handleReunite}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-lg flex items-center gap-2"
          >
            <span>🦆</span> Come Home.
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-white dark:bg-black/40 text-purple-600 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-700 font-bold py-3 px-8 rounded-full shadow-sm transition-transform hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
          >
            She wandered off again...
          </button>
        )}
      </div>

    </section>
  );
}