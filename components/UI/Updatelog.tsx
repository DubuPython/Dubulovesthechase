'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpdateLog() {
  const [isOpen, setIsOpen] = useState(false);
  const [hideForWeek, setHideForWeek] = useState(false);

  useEffect(() => {
    const hiddenUntil = localStorage.getItem('hideUpdateLogUntil_v2_0');
    
    if (hiddenUntil && new Date() < new Date(hiddenUntil)) {
      setIsOpen(false); 
    } else {
      setIsOpen(true);  
    }
  }, []);

  const handleClose = () => {
    if (hideForWeek) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      localStorage.setItem('hideUpdateLogUntil_v2_0', nextWeek.toISOString());
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#1a1a2e] w-full max-w-md p-8 rounded-3xl shadow-2xl border-2 border-pink-300 dark:border-purple-500/50 relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/50 dark:bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="text-4xl">✨</span>
            <div>
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-purple-200 leading-tight">What's New</h3>
              <p className="text-pink-500 font-bold text-sm">Version 2.0 Features</p>
            </div>
          </div>

          <div className="space-y-4 mb-6 relative z-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            
            <div className="flex items-start gap-3 bg-pink-50 dark:bg-black/20 p-3 rounded-xl border border-pink-100 dark:border-white/5">
              <span className="text-xl">💌</span>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Affection Kiosk</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">A brand new space for when things get heavy. Tap to send a hug, kiss, or embrace, and watch the counters grow!</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-pink-50 dark:bg-black/20 p-3 rounded-xl border border-pink-100 dark:border-white/5">
              <span className="text-xl">💐</span>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Bouquet Stand Overhaul</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">The wrapper has been completely redesigned! Flowers are now massive and lush, the controls are neatly organized, and you can now easily delete old bouquets from your collection.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-pink-50 dark:bg-black/20 p-3 rounded-xl border border-pink-100 dark:border-white/5">
              <span className="text-xl">🎶</span>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Lyric Manager</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Added a safety delete button to the Lyric Generator so you can easily remove any typos or quotes you no longer want in the rotation.</p>
              </div>
            </div>
            
          </div>

          <div className="flex items-center gap-2 mb-6 relative z-10 px-2 cursor-pointer" onClick={() => setHideForWeek(!hideForWeek)}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${hideForWeek ? 'bg-pink-500 border-pink-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-black/50'}`}>
               {hideForWeek && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 select-none">Don't show this again for a week</span>
          </div>

          <button 
            onClick={handleClose} 
            className="w-full py-3.5 font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition shadow-[0_10px_20px_rgba(99,102,241,0.3)] relative z-10 mt-auto"
          >
            Enter 💜
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}