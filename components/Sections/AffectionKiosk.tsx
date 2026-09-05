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
    const newCount = counts[action] + 1;
    setCounts((prev) => ({ ...prev, [action]: newCount }));

    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji: emoji,
      xOffset: (Math.random() - 0.5) * 60, 
      source: action
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 1200);

    await supabase
      .from('affection_counters')
      .update({ count: newCount })
      .eq('action_type', action);
  };

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Aesthetic Background Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300/20 dark:bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-300/20 dark:bg-pink-600/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Breathing Header Icon */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-6 z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 shadow-inner border border-white/50 dark:border-white/10"
        >
          <span className="text-3xl drop-shadow-sm">💌</span>
        </motion.div>

        <div className="text-center mb-12 z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-300 dark:to-purple-300 tracking-wide drop-shadow-sm mb-3">
            Affection Kiosk
          </h2>
          <p className="text-indigo-900/60 dark:text-purple-300/80 text-sm md:text-base max-w-sm mx-auto font-medium leading-relaxed">
            For when capstone documents and SPICE duties get a little too heavy. Take what you need, anytime.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 z-10 w-full relative mt-2">
          
          {/* HUG BUTTON (Replaced broken emoji with Teddy Bear) */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('hug', '🧸')}
              className="w-28 h-28 md:w-32 md:h-32 bg-white/80 dark:bg-white/5 rounded-[2rem] shadow-sm hover:shadow-xl border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-500/50 flex flex-col items-center justify-center transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-purple-50 dark:hover:from-white/10 dark:hover:to-purple-900/20"
            >
              <span className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 mb-2">🧸</span>
              <span className="text-[10px] md:text-xs font-black text-purple-400 dark:text-purple-300 uppercase tracking-[0.2em]">Hug</span>
            </motion.button>
            
            {/* Cute Notification Badge */}
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 text-white text-sm font-bold rounded-full border-[3px] border-[#fdfdff] dark:border-[#1a1a2e] flex items-center justify-center shadow-md">
              {isLoading ? '...' : counts.hug}
            </div>
          </div>

          {/* KISS BUTTON */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('kiss', '💋')}
              className="w-28 h-28 md:w-32 md:h-32 bg-white/80 dark:bg-white/5 rounded-[2rem] shadow-sm hover:shadow-xl border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-500/50 flex flex-col items-center justify-center transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-pink-50 dark:hover:from-white/10 dark:hover:to-pink-900/20"
            >
              <span className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 mb-2">💋</span>
              <span className="text-[10px] md:text-xs font-black text-pink-400 dark:text-pink-300 uppercase tracking-[0.2em]">Kiss</span>
            </motion.button>
            
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 text-white text-sm font-bold rounded-full border-[3px] border-[#fdfdff] dark:border-[#1a1a2e] flex items-center justify-center shadow-md">
              {isLoading ? '...' : counts.kiss}
            </div>
          </div>

          {/* EMBRACE BUTTON (Swapped to Cherished Heart) */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('embrace', '💝')}
              className="w-28 h-28 md:w-32 md:h-32 bg-white/80 dark:bg-white/5 rounded-[2rem] shadow-sm hover:shadow-xl border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-500/50 flex flex-col items-center justify-center transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-rose-50 dark:hover:from-white/10 dark:hover:to-rose-900/20"
            >
              <span className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 mb-2">💝</span>
              <span className="text-[10px] md:text-xs font-black text-rose-400 dark:text-rose-300 uppercase tracking-[0.2em]">Embrace</span>
            </motion.button>
            
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 text-white text-sm font-bold rounded-full border-[3px] border-[#fdfdff] dark:border-[#1a1a2e] flex items-center justify-center shadow-md">
              {isLoading ? '...' : counts.embrace}
            </div>
          </div>

          {/* Floating Emoji Animations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            <AnimatePresence>
              {floatingEmojis.map((emoji) => (
                <motion.div
                  key={emoji.id}
                  initial={{ opacity: 0, y: 30, x: emoji.source === 'hug' ? -120 : emoji.source === 'kiss' ? 0 : 120, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    y: -120 - Math.random() * 60, 
                    x: (emoji.source === 'hug' ? -120 : emoji.source === 'kiss' ? 0 : 120) + emoji.xOffset,
                    scale: 1.8 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl drop-shadow-md z-50"
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