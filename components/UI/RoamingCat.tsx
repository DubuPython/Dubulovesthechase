'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoamingCat() {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState(20); 
  const [facingRight, setFacingRight] = useState(true); 
  const [status, setStatus] = useState<'walking' | 'sitting' | 'sleeping'>('walking');
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    // Force the cat to start near the middle/left so he escapes the corner immediately!
    setPosition(Math.min(window.innerWidth / 2, window.innerWidth - 300));

    const catBrain = setInterval(() => {
      const randomAction = Math.random();

      if (randomAction < 0.3) {
        setStatus('sitting');
      } else if (randomAction < 0.5) {
        setStatus('sleeping');
      } else {
        setStatus('walking');
        
        // THE FIX: Subtract 250px from the screen width to create an invisible wall 
        // right before your music player and corner companions!
        const rightBoundary = window.innerWidth - 250;
        const newX = Math.max(20, Math.random() * rightBoundary);
        
        setPosition((prevPosition) => {
          setFacingRight(newX > prevPosition);
          return newX;
        });
      }
    }, 4000); 

    return () => clearInterval(catBrain);
  }, []);

  const petCat = () => {
    setShowHeart(true);
    setStatus('sitting'); 
    setTimeout(() => setShowHeart(false), 2000);
  };

  if (!isMounted) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 z-[100] cursor-pointer flex flex-col items-center"
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
            className="absolute -top-8 text-3xl z-10 pointer-events-none"
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
           className="absolute -top-4 right-0 text-sm z-10 pointer-events-none"
         >
           💤
         </motion.div>
      )}

      {/* The Cat */}
      <motion.div
        animate={{ 
          scaleX: facingRight ? -1 : 1, 
          y: status === 'sleeping' ? 12 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="text-5xl drop-shadow-md pb-2 select-none"
      >
        🐈
      </motion.div>
    </motion.div>
  );
}