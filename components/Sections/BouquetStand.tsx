'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLOWER_OPTIONS = [
  { id: 'purple-tulip', emoji: '🌷', name: 'Tulip' },
  { id: 'sunflower', emoji: '🌻', name: 'Sunflower' },
  { id: 'cherry', emoji: '🌸', name: 'Blossom' },
  { id: 'rose', emoji: '🌹', name: 'Rose' },
  { id: 'daisy', emoji: '🌼', name: 'Daisy' },
  { id: 'hibiscus', emoji: '🌺', name: 'Hibiscus' }
];

type ArrangedFlower = {
  uniqueId: number;
  emoji: string;
  height: number;
  rotate: number;
  scale: number;
  hue: number;
};

export default function BouquetStand() {
  const [bouquet, setBouquet] = useState<ArrangedFlower[]>([]);
  const [showNote, setShowNote] = useState(false);

  const addFlower = (emoji: string) => {
    if (bouquet.length >= 20) return;

    const newFlower: ArrangedFlower = {
      uniqueId: Date.now() + Math.random(),
      emoji: emoji,
      // Generates varied stem heights so they stack nicely above the vase
      height: 150 + Math.random() * 80, 
      // Fans them out to the left and right naturally
      rotate: (Math.random() - 0.5) * 65, 
      scale: 0.85 + Math.random() * 0.3,
      hue: 0 
    };

    setBouquet([...bouquet, newFlower]);
  };

  const changeFlowerColor = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    setBouquet(bouquet.map(flower => 
      flower.uniqueId === id 
        ? { ...flower, hue: flower.hue + 45 } 
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

        <div className="text-center mb-16 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md">
            Flower Stand
          </h2>
          <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base mt-2">
            Build a bouquet. Take as many as you need today.
          </p>
        </div>

        {/* --- THE VASE & BOUQUET --- */}
        <div 
          className="relative w-48 h-64 flex flex-col items-center justify-end z-10 mb-12 cursor-pointer transition-transform hover:scale-[1.02]"
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
                className="absolute -top-16 z-40 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-pink-200 dark:border-purple-500/50 w-56 text-center cursor-default"
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

          {/* Anchor Point for Flowers */}
          <div className="absolute bottom-6 left-1/2 w-0 h-0 flex justify-center z-10 pointer-events-none">
            <AnimatePresence>
              {bouquet.map((flower) => (
                <motion.div
                  key={flower.uniqueId}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: flower.scale, 
                    rotate: flower.rotate 
                  }}
                  exit={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  // origin-bottom ensures they fan out from the exact same base point
                  className="absolute bottom-0 flex flex-col items-center pointer-events-auto origin-bottom"
                  style={{ height: `${flower.height}px` }} 
                >
                  <span 
                    className="text-5xl cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-md z-20"
                    onClick={(e) => changeFlowerColor(e, flower.uniqueId)}
                    style={{ filter: `hue-rotate(${flower.hue}deg)` }}
                    title="Tap to change color!"
                  >
                    {flower.emoji}
                  </span>
                  {/* The Green Stem */}
                  <div className="w-1.5 flex-grow bg-gradient-to-t from-green-700/40 to-green-400/70 rounded-full -mt-2 z-10"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sleek Glass Vase UI */}
          <div className="w-32 h-36 bg-gradient-to-br from-white/30 to-white/5 dark:from-white/10 dark:to-transparent backdrop-blur-md border border-white/60 dark:border-white/20 rounded-b-[2.5rem] rounded-t-lg relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex justify-center items-center z-20 pointer-events-none overflow-hidden">
            
            {/* 3D Glass Light Reflection */}
            <div className="absolute top-0 left-2 w-4 h-full bg-gradient-to-b from-white/70 to-transparent rounded-full blur-[2px] opacity-60 skew-x-3"></div>
            
            {/* Water Level */}
            <div className="absolute bottom-0 w-full h-16 bg-cyan-400/15 dark:bg-cyan-500/10 border-t border-cyan-300/40 rounded-b-[2.5rem]">
              <div className="w-full h-[2px] bg-white/50 blur-[1px]"></div>
            </div>
          </div>
          
          {/* Empty State Text */}
          {bouquet.length === 0 && !showNote && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute bottom-16 text-xs font-bold text-gray-500/60 dark:text-gray-400/60 uppercase tracking-widest text-center w-full pointer-events-none z-30"
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