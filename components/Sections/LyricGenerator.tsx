'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add as many short snippets here as you want!
const SONG_LYRICS = [
  {
    quote: "Because I'm your home, a place you can come to.",
    song: "Home",
    artist: "Seventeen"
  },
  {
    quote: "Aking sinta, ikaw na ang tahanan at mundo.",
    song: "Mundo",
    artist: "IV of Spades"
  },
  {
    quote: "I can make it right.",
    song: "Make It Right",
    artist: "BTS & Lauv"
  },
  {
    quote: "Kahit saan man dalahin ng hangin, ikaw ang aking pupuntahan.",
    song: "Ikot",
    artist: "Over October"
  }
];

export default function LyricGenerator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  // Set a random initial lyric on load
  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * SONG_LYRICS.length));
  }, []);

  const drawNewLyric = () => {
    if (isChanging) return;
    setIsChanging(true);
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * SONG_LYRICS.length);
    } while (newIndex === currentIndex && SONG_LYRICS.length > 1);
    
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsChanging(false);
    }, 600);
  };

  const currentLyric = SONG_LYRICS[currentIndex];

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Aesthetic Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-300/30 dark:bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-300/30 dark:bg-pink-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="mb-6 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 shadow-inner">
          {/* Swapped the diamond for a music note so it fits all artists! */}
          <span className="text-2xl drop-shadow-sm">🎶</span>
        </div>

        <div className="min-h-[120px] flex items-center justify-center z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed max-w-lg italic">
                "{currentLyric.quote}"
              </h3>
              <p className="mt-4 text-sm font-bold tracking-widest text-purple-500 uppercase">
                — {currentLyric.song} by {currentLyric.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={drawNewLyric}
          disabled={isChanging}
          className="mt-8 z-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Shuffle Lyric
        </button>
      </div>
    </section>
  );
}