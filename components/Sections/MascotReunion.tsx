'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MascotReunion() {
  const [isReunited, setIsReunited] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const handleReunite = () => {
    setIsReunited(true);
    setShowHearts(true);
    
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
          I'm just waiting for you 💜
        </h2>
        <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base mt-2">
          Sometimes the duck gets busy, but she always comes back.
        </p>
      </div>

      {/* The Stage */}
      <div className="relative w-full max-w-3xl h-72 md:h-80 rounded-[3rem] overflow-hidden border-4 border-purple-200 dark:border-purple-800 shadow-2xl flex flex-col items-center justify-end pb-8 z-10">
        
        {/* --- SCENERY BACKGROUND --- */}
        {/* Night Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-900 dark:from-black dark:via-[#130b29] dark:to-purple-950 z-0" />
        
        {/* Stars & Moon */}
        <div className="absolute top-6 right-10 w-14 h-14 bg-yellow-100 rounded-full shadow-[0_0_30px_rgba(253,224,71,0.6)] z-0" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-8 left-12 text-white text-xs z-0">✨</motion.div>
        <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute top-16 left-1/3 text-white text-sm z-0">✨</motion.div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute top-10 right-1/3 text-white text-xs z-0">✨</motion.div>
        
        {/* Grassy Ground */}
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-emerald-900 to-emerald-800/80 border-t border-emerald-700/50 z-0" />

        {/* --- THE HOUSE --- */}
        <div className="absolute right-4 md:right-16 bottom-16 flex flex-col items-center z-10">
          {/* Roof */}
          <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[70px] border-b-purple-950 drop-shadow-lg" />
          {/* Base */}
          <div className="w-[100px] h-[80px] bg-purple-900 relative flex justify-center items-center shadow-lg rounded-b-md">
            {/* Glowing Window */}
            <motion.div
              animate={{ 
                backgroundColor: isReunited ? "#fef08a" : "#4b5563", // Yellow when reunited, dark gray when waiting
                boxShadow: isReunited ? "0 0 20px rgba(253, 224, 71, 0.6)" : "none" 
              }}
              transition={{ duration: 0.8 }}
              className="absolute left-3 top-3 w-8 h-8 border-4 border-purple-950 rounded-sm flex flex-wrap"
            >
              <div className="w-1/2 h-1/2 border-r-2 border-b-2 border-purple-950" />
              <div className="w-1/2 h-1/2 border-b-2 border-purple-950" />
              <div className="w-1/2 h-1/2 border-r-2 border-purple-950" />
              <div className="w-1/2 h-1/2" />
            </motion.div>
            {/* Door */}
            <div className="absolute bottom-0 right-3 w-8 h-12 bg-purple-950 rounded-t-md" />
          </div>
        </div>

        {/* Floating Hearts Animation */}
        <AnimatePresence>
          {showHearts && (
            <div className="absolute bottom-24 flex justify-center items-center z-20">
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
                  {['💜', '💖', '✨', '💕', '🌷'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* --- THE MASCOTS --- */}
        <div className="relative flex items-end justify-center w-full max-w-md h-32 z-20">
          
          {/* Duck (Waddles in from left) */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ 
              x: isReunited ? -40 : -250, 
              opacity: isReunited ? 1 : 0,
              rotate: isReunited ? [0, -10, 10, 0] : 0
            }}
            transition={{ 
              x: { type: "spring", stiffness: 45, damping: 15 },
              rotate: { delay: 1, duration: 0.5, repeat: 2 } 
            }}
            className="absolute bottom-0 text-6xl md:text-7xl drop-shadow-lg"
          >
            🦆
          </motion.div>

          {/* Penguin (Waiting patiently in front of the house) */}
          <motion.div
            animate={{ 
              x: isReunited ? 40 : 80, // Moves slightly left to meet duck, otherwise waits near house
              y: isReunited ? [0, -15, 0] : [0, -5, 0],
            }}
            transition={{ 
              x: { type: "spring", stiffness: 45, damping: 15 },
              y: { duration: isReunited ? 0.4 : 2, repeat: isReunited ? 2 : Infinity, delay: isReunited ? 1 : 0 }
            }}
            className="absolute bottom-0 text-6xl md:text-7xl drop-shadow-lg"
          >
            🐧
          </motion.div>

        </div>
      </div>

      {/* The Button */}
      <div className="mt-10 z-10">
        {!isReunited ? (
          <button
            onClick={handleReunite}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 text-lg flex items-center gap-3"
          >
            <span className="text-2xl">🦆</span> Come Home
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