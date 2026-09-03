'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoamingCat() {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState(0);
  const [facingRight, setFacingRight] = useState(false); 
  const [status, setStatus] = useState<'walking' | 'sitting' | 'sleeping'>('sitting');
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    // Start the cat roughly in the middle of the screen
    setPosition(window.innerWidth / 2);

    // The "Cat Brain" - decides what to do every 4 seconds
    const catBrain = setInterval(() => {
      const randomAction = Math.random();

      if (randomAction < 0.3) {
        setStatus('sitting');
      } else if (randomAction < 0.5) {
        setStatus('sleeping');
      } else {
        setStatus('walking');
        // Pick a new random X coordinate along the bottom
        const newX = Math.random() * (window.innerWidth - 100);
        
        // Face the correct direction before walking
        setFacingRight(newX > position);
        setPosition(newX);
      }
    }, 4000); 

    return () => clearInterval(catBrain);
  }, [position]);

  const petCat = () => {
    setShowHeart(true);
    setStatus('sitting'); // Wakes the cat up if it was sleeping!
    setTimeout(() => setShowHeart(false), 2000);
  };

  // Prevents Next.js hydration mismatch errors
  if (!isMounted) return null;

  return (
    <motion.div
      className="fixed bottom-0 z-[100] cursor-pointer flex flex-col items-center"
      animate={{ x: position }}
      transition={{ type: "tween", duration: status === 'walking' ? 3.5 : 0.5, ease: "easeInOut" }}
      onClick={petCat}
    >
      {/* Floating Heart when petted */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            className="absolute -top-8 text-3xl z-10"
          >
            💖
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zzz's when sleeping */}
      {status === 'sleeping' && (
         <motion.div 
           animate={{ opacity: [0, 1, 0], y: [-5, -15] }} 
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute -top-4 right-0 text-sm z-10"
         >
           💤
         </motion.div>
      )}

      {/* The Cat Emoji */}
      <motion.div
        animate={{ 
          scaleX: facingRight ? -1 : 1, // Flips the cat horizontally
          y: status === 'sleeping' ? 12 : 0 // Sinks down a bit into the bottom of the screen when resting
        }}
        transition={{ duration: 0.3 }}
        className="text-5xl drop-shadow-md pb-2 select-none"
      >
        🐈
      </motion.div>
    </motion.div>
  );
}