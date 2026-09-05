'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// UPDATE THIS PATH to match your actual supabase client file!
import { supabase } from '../../lib/supabaseClient';

type Counters = {
  hug: number;
  kiss: number;
  embrace: number;
};

type FloatingEmoji = {
  id: number;
  emoji: string;
  xOffset: number;
  source: string;
};

export default function AffectionKiosk() {
  const [counts, setCounts] = useState<Counters>({ hug: 0, kiss: 0, embrace: 0 });
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current counts on load
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const { data, error } = await supabase.from('affection_counters').select('*');
    if (data && !error) {
      const newCounts = { hug: 0, kiss: 0, embrace: 0 };
      data.forEach((row) => {
        if (row.action_type in newCounts) {
          newCounts[row.action_type as keyof Counters] = row.count;
        }
      });
      setCounts(newCounts);
    }
    setIsLoading(false);
  };

  const handleAction = async (action: keyof Counters, emoji: string) => {
    // 1. Optimistically update the UI instantly so it feels snappy
    const newCount = counts[action] + 1;
    setCounts((prev) => ({ ...prev, [action]: newCount }));

    // 2. Trigger the cute floating emoji animation
    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji: emoji,
      xOffset: (Math.random() - 0.5) * 60, // Random drift left or right
      source: action
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    
    // Clean up the emoji from the DOM after it floats away
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 1200);

    // 3. Save the new count to Supabase silently in the background
    await supabase
      .from('affection_counters')
      .update({ count: newCount })
      .eq('action_type', action);
  };

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Aesthetic Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300/20 dark:bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300/20 dark:bg-pink-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="mb-4 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 dark:bg-pink-900/40 shadow-inner">
          <span className="text-2xl drop-shadow-sm">💌</span>
        </div>

        <div className="text-center mb-10 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md">
            Affection Kiosk
          </h2>
          <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base mt-3 max-w-md mx-auto">
            For when capstone documents and SPICE duties get a little too heavy. Take what you need, anytime.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 z-10 w-full relative">
          
          {/* HUG BUTTON */}
          <div className="flex flex-col items-center relative">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('hug', '🫂')}
              className="w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-white/5 rounded-3xl shadow-lg border border-purple-100 dark:border-white/10 flex flex-col items-center justify-center transition-colors hover:border-purple-400 dark:hover:border-purple-500 group"
            >
              <span className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">🫂</span>
              <span className="mt-2 text-xs font-bold text-purple-600 dark:text-purple-300 uppercase tracking-widest">Hug</span>
            </motion.button>
            <div className="mt-4 bg-purple-100 dark:bg-purple-900/50 px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-500/30">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {isLoading ? '...' : counts.hug}
              </span>
            </div>
          </div>

          {/* KISS BUTTON */}
          <div className="flex flex-col items-center relative">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('kiss', '💋')}
              className="w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-white/5 rounded-3xl shadow-lg border border-pink-100 dark:border-white/10 flex flex-col items-center justify-center transition-colors hover:border-pink-400 dark:hover:border-pink-500 group"
            >
              <span className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">💋</span>
              <span className="mt-2 text-xs font-bold text-pink-500 dark:text-pink-400 uppercase tracking-widest">Kiss</span>
            </motion.button>
            <div className="mt-4 bg-pink-100 dark:bg-pink-900/50 px-4 py-1.5 rounded-full border border-pink-200 dark:border-pink-500/30">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {isLoading ? '...' : counts.kiss}
              </span>
            </div>
          </div>

          {/* EMBRACE BUTTON */}
          <div className="flex flex-col items-center relative">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('embrace', '🤗')}
              className="w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-white/5 rounded-3xl shadow-lg border border-indigo-100 dark:border-white/10 flex flex-col items-center justify-center transition-colors hover:border-indigo-400 dark:hover:border-indigo-500 group"
            >
              <span className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">🤗</span>
              <span className="mt-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Embrace</span>
            </motion.button>
            <div className="mt-4 bg-indigo-100 dark:bg-indigo-900/50 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {isLoading ? '...' : counts.embrace}
              </span>
            </div>
          </div>

          {/* Floating Emoji Animations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            <AnimatePresence>
              {floatingEmojis.map((emoji) => (
                <motion.div
                  key={emoji.id}
                  initial={{ opacity: 0, y: 50, x: emoji.source === 'hug' ? -100 : emoji.source === 'kiss' ? 0 : 100, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    y: -100 - Math.random() * 50, 
                    x: (emoji.source === 'hug' ? -100 : emoji.source === 'kiss' ? 0 : 100) + emoji.xOffset,
                    scale: 1.5 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 text-4xl drop-shadow-md z-50"
                >
                  {emoji.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}