'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if she has already seen the loading screen this session
    const hasSeen = sessionStorage.getItem('hasSeenLoading');
    if (hasSeen) {
      setShow(false);
    } else {
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('hasSeenLoading', 'true');
      }, 3500); // Fades out after 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-pink-50 dark:bg-[#0f0c29]"
        >
          <div className="relative w-64 h-32 flex items-center justify-center">
            {/* Duck waddling in */}
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: -25, opacity: 1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
              className="absolute text-5xl"
            >
              🦆
            </motion.div>

            {/* Penguin sliding in */}
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 25, opacity: 1, rotate: -15 }}
              transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
              className="absolute text-5xl"
            >
              🐧
            </motion.div>

            {/* Purple heart rising */}
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: -45 }}
              transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
              className="absolute text-3xl"
            >
              💜
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}   