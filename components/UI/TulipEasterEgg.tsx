'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TulipEasterEgg() {
  const [tulips, setTulips] = useState<number[]>([]);

  const triggerEasterEgg = () => {
    const id = Date.now();
    setTulips(prev => [...prev, id]);
    
    // Clean up the tulip after it finishes falling (6 seconds)
    setTimeout(() => {
      setTulips(prev => prev.filter(t => t !== id));
    }, 6000);
  };

  return (
    <>
      {/* The nearly invisible trigger button */}
      <button 
        onClick={triggerEasterEgg}
        className="absolute top-6 right-6 md:top-12 md:right-12 text-xl opacity-0 hover:opacity-20 transition-opacity duration-1000 z-20 cursor-pointer grayscale sepia"
        title="A quiet memory"
      >
        🦆🐧
      </button>

      {/* The falling purple tulips */}
      <AnimatePresence>
        {tulips.map(id => (
          <motion.div
            key={id}
            initial={{ y: -50, x: '50vw', opacity: 0, rotate: 0 }}
            animate={{ 
              y: '100vh', 
              x: ['50vw', '45vw', '55vw', '48vw'],
              opacity: [0, 1, 1, 0],
              rotate: 360 
            }}
            transition={{ duration: 5, ease: "linear" }}
            className="fixed top-0 left-0 z-[999] text-3xl pointer-events-none drop-shadow-md"
            style={{ filter: "hue-rotate(240deg)" }} // Turns standard red tulip purple
          >
            🌷
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}