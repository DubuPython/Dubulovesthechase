'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FishbowlMessages() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const messages = [
    "I'm so proud of you, whether it's small wins or big wins.",
    "You are seen and heard always. If not, I see you and I hear you.",
    "You are loved, more than you know.",
    "When the world turns its back on you, remember you have me in your corner.",
    "When you feel alone, remember that I am always here for you.",
    "I'm here for you always, now and forever.",
    "When your heart feels tight, remember that I am here to hold it with you.",
    "When no one believes you, I do. I always will.",
    "Chase your dreams, and I will be here to cheer you on every step of the way.",
    "Kung sa tigin mo wala kang kakampi, andito ako para sa'yo. Lagi.",
    "You are worth it and you are enough, just as you are.",
    "Kung wala kang makausap, andito ako para makinig sa'yo",
    "Kung wala kang matakbuhan, sakin ka pumunta. Lagi akong nandito para sa'yo.",
    "If you have no shoulder to cry on, mine is always here for you.",
    "You are appreciated, more than you can imagine.",
    "You are beautiful, inside and out. Never forget that.",
    "You are strong, even when you feel weak.",
    "You are brave, even when you feel scared.",
    "You are capable of amazing things, never forget that.",
    "You are a light in this world, never let anyone say you are not.",
    "You are a somebody, not a nobody.",
    "You exist for a reason, and that reason is important.",
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const drawRandomMessage = () => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setActiveMessage(randomMsg);
  };

  return (
    <section id="fishbowl" className="relative w-full min-h-[80vh] bg-transparent transition-colors duration-500 py-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="text-center z-10 mb-12">
        <h2 className="text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md mb-2">
          Things you might want to hear right now 💜
        </h2>
        <p className="text-indigo-500 dark:text-purple-300 max-w-md mx-auto">
          Tap the glass heart to pull out a random message to remind you that you are seen and loved always.
        </p>
      </div>

      <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center z-10">
        
        {isMounted && (
          <AnimatePresence mode="wait">
            {!activeMessage ? (
              
              <motion.div
                key="heart-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                onClick={drawRandomMessage}
                className="cursor-pointer relative flex flex-col items-center justify-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center justify-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    // High-opacity pink color specifically calibrated to show up in light mode
                    className="w-[300px] h-[300px] text-pink-400/60 dark:text-purple-500/20 drop-shadow-[0_15px_25px_rgba(236,72,153,0.3)] dark:drop-shadow-2xl backdrop-blur-md transition-colors group-hover:text-pink-500/70" 
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  
                  {/* Glowing orb behind the heart */}
                  <div className="absolute w-[220px] h-[220px] bg-pink-300/50 dark:bg-purple-400/20 blur-[50px] rounded-full pointer-events-none"></div>
                  
                  <div className="absolute text-indigo-900 dark:text-white font-bold text-lg drop-shadow-md animate-pulse pointer-events-none flex flex-col items-center">
                    <span className="text-3xl mb-2">💌</span>
                    Tap to draw
                  </div>
                </div>
              </motion.div>

            ) : (

              <motion.div
                key="revealed-message"
                initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="relative bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border-2 border-pink-200 dark:border-purple-500/30 max-w-md text-center flex flex-col items-center"
              >
                <div className="text-5xl mb-6 drop-shadow-sm">💌</div>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-8 leading-relaxed">
                  "{activeMessage}"
                </p>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  Put Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
      </div>
    </section>
  );
}