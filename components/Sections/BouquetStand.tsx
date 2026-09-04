'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLOWER_OPTIONS = [
  { id: 'purple-tulip', emoji: '🌷', name: 'Tulip' },
  { id: 'sunflower', emoji: '🌻', name: 'Sunflower' },
  { id: 'cherry', emoji: '🌸', name: 'Blossom' },
  { id: 'rose', emoji: '🌹', name: 'Rose' },
  { id: 'daisy', emoji: '🌼', name: 'Daisy' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkle' }
];

type ArrangedFlower = {
  uniqueId: number;
  emoji: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  hue: number; // Added to track color changes
};

export default function BouquetStand() {
  const [bouquet, setBouquet] = useState<ArrangedFlower[]>([]);
  const [showNote, setShowNote] = useState(false);

  const addFlower = (emoji: string) => {
    if (bouquet.length >= 20) return;

    const newFlower: ArrangedFlower = {
      uniqueId: Date.now() + Math.random(),
      emoji: emoji,
      x: (Math.random() - 0.5) * 80, 
      y: (Math.random() - 0.5) * 60 - 20, 
      rotate: (Math.random() - 0.5) * 50,
      scale: 0.8 + Math.random() * 0.4,
      hue: 0 // Starts at default color
    };

    setBouquet([...bouquet, newFlower]);
  };

  const changeFlowerColor = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevents the vase note from opening/closing
    setBouquet(bouquet.map(flower => 
      flower.uniqueId === id 
        ? { ...flower, hue: flower.hue + 45 } // Shifts the color wheel by 45 degrees
        : flower
    ));
  };

  const clearVase = () => {
    setBouquet([]);
    setShowNote(false); 
  };

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center">
        
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 dark:bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/20 dark:bg-pink-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="text-center mb-10 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md">
            Flower Stand
          </h2>
          <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base mt-2">
            Build a bouquet. Take as many as you need today.
          </p>
        </div>

        {/* --- THE VASE --- */}
        <div 
          className="relative w-48 h-56 flex flex-col items-center justify-end z-10 mb-12 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setShowNote(!showNote)}
          title="Tap the vase!"
        >
          
          {/* The Hidden Note Popup */}
          <AnimatePresence>
            {showNote && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="absolute -top-14 z-40 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-pink-200 dark:border-purple-500/50 w-56 text-center cursor-default"
                onClick={(e) => e.stopPropagation()} 
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {bouquet.length > 0 
                    ? "Just a little bouquet to remind you how much you are loved! 💜" 
                    : "Pick some flowers to fill up the vase first! 🌷"}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 dark:bg-[#1a1a2e]/95 border-b border-r border-pink-200 dark:border-purple-500/50 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Flowers */}
          <div className="absolute bottom-24 w-full h-full flex items-end justify-center pointer-events-none">
            <AnimatePresence>
              {bouquet.map((flower) => (
                <motion.div
                  key={flower.uniqueId}
                  initial={{ opacity: 0, y: 50, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: flower.y, 
                    x: flower.x, 
                    rotate: flower.rotate, 
                    scale: flower.scale 
                  }}
                  exit={{ opacity: 0, y: -50, scale: 0, filter: "blur(4px)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  // 'pointer-events-auto' allows the flowers to be clicked independently of the vase
                  className="absolute text-5xl drop-shadow-lg pointer-events-auto" 
                >
                  <span 
                    className="block cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                    onClick={(e) => changeFlowerColor(e, flower.uniqueId)}
                    style={{ filter: `hue-rotate(${flower.hue}deg)` }}
                    title="Tap to change color!"
                  >
                    {flower.emoji}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Glass Vase UI */}
          <div className="w-32 h-40 bg-white/20 dark:bg-white/5 backdrop-blur-md border-x-2 border-b-2 border-white/50 dark:border-white/10 rounded-b-3xl rounded-t-lg relative shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex justify-center items-center pointer-events-none">
            <div className="absolute bottom-2 w-[90%] h-24 bg-blue-400/10 dark:bg-blue-400/5 rounded-b-2xl border-t border-blue-300/30" />
            <div className="absolute top-12 w-[110%] h-4 bg-purple-400/80 rounded-sm shadow-md" />
            <div className="absolute top-12 w-6 h-8 bg-purple-500/90 rounded-full blur-[1px] shadow-lg" />
          </div>
          
          {/* Empty State Text */}
          {bouquet.length === 0 && !showNote && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute bottom-16 text-xs font-bold text-gray-500/50 uppercase tracking-widest text-center w-full pointer-events-none"
            >
              Empty
            </motion.p>
          )}
        </div>

        {/* --- THE FLOWER SELECTION STAND --- */}
        <div className="w-full bg-white/50 dark:bg-black/20 rounded-3xl p-6 border border-purple-200 dark:border-purple-500/30 z-10 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {FLOWER_OPTIONS.map((flower) => (
              <motion.button
                key={flower.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addFlower(flower.emoji)}
                disabled={bouquet.length >= 20}
                className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-purple-100 dark:border-white/10 flex items-center justify-center text-3xl transition-colors hover:border-purple-400 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Add ${flower.name}`}
              >
                {flower.emoji}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-between w-full px-4">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {bouquet.length} / 20 Selected
            </span>
            <button
              onClick={clearVase}
              disabled={bouquet.length === 0}
              className="text-sm font-bold text-purple-500 hover:text-pink-500 disabled:opacity-30 transition-colors uppercase tracking-widest"
            >
              Empty Vase
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}