'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReachOutButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handlePing = async () => {
    if (status !== 'idle') return;
    setStatus('loading');

    try {
      const response = await fetch('/api/ping', { method: 'POST' });
      if (response.ok) {
        setStatus('sent');
      } else {
        setStatus('idle');
      }
    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-12 w-full z-10">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center"
          >
            <p className="text-indigo-500 dark:text-purple-300 text-sm mb-4 max-w-sm px-4">
              If you still want to give me a chance and let me do it right this time.
            </p>
            <button 
              onClick={handlePing}
              className="bg-white/50 dark:bg-black/30 backdrop-blur-md border border-pink-200 dark:border-purple-700/50 text-pink-600 dark:text-pink-400 font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>👋</span> When you're ready.
            </button>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-3 px-8 text-indigo-400 font-medium flex items-center gap-2"
          >
            <span className="animate-spin text-xl">⏳</span> Sending...
          </motion.div>
        )}

        {status === 'sent' && (
          <motion.div 
            key="sent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">
              💜
            </div>
            <p className="text-pink-600 dark:text-pink-400 font-bold">Sent.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}