'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLOWER_OPTIONS = [
  { id: 'purple-tulip', name: 'Purple Tulip' },
  { id: 'sunflower', name: 'Sunflower' },
  { id: 'blossom', name: 'Blossom' },
  { id: 'rose', name: 'Rose' },
  { id: 'daisy', name: 'Daisy' },
  { id: 'hibiscus', name: 'Hibiscus' }
];

// --- CUSTOM SVG FLOWER HEADS ---
// These are infinitely crisp, lightweight, and look like premium vector illustrations.
const FlowerGraphic = ({ id, className }: { id: string, className?: string }) => {
  switch (id) {
    case 'purple-tulip':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Back petal */}
          <path d="M30 40 Q50 15 70 40 L60 85 Q50 95 40 85 Z" fill="#c084fc" />
          {/* Side petals */}
          <path d="M15 50 Q30 20 45 60 L45 85 Q30 85 15 50 Z" fill="#a855f7" />
          <path d="M85 50 Q70 20 55 60 L55 85 Q70 85 85 50 Z" fill="#a855f7" />
          {/* Front central petal */}
          <path d="M35 55 Q50 25 65 55 L55 90 Q50 95 45 90 Z" fill="#9333ea" />
        </svg>
      );
    case 'sunflower':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Ray petals generated in a circle */}
          {[0, 30, 60, 90, 120, 150].map((deg, i) => (
            <ellipse key={i} cx="50" cy="50" rx="12" ry="45" transform={`rotate(${deg} 50 50)`} fill="#fbbf24" />
          ))}
          {[15, 45, 75, 105, 135, 165].map((deg, i) => (
            <ellipse key={`offset-${i}`} cx="50" cy="50" rx="12" ry="40" transform={`rotate(${deg} 50 50)`} fill="#f59e0b" />
          ))}
          {/* Seed center */}
          <circle cx="50" cy="50" r="22" fill="#78350f" />
          <circle cx="50" cy="50" r="18" fill="#451a03" stroke="#92400e" strokeWidth="2" strokeDasharray="2,2" />
        </svg>
      );
    case 'blossom':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <path key={i} d="M50 50 Q65 10 50 5 Q35 10 50 50 Z" transform={`rotate(${deg} 50 50)`} fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
          ))}
          <circle cx="50" cy="50" r="8" fill="#f472b6" />
          <circle cx="50" cy="50" r="4" fill="#fb7185" />
        </svg>
      );
    case 'rose':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="42" fill="#e11d48" />
          <path d="M30 30 Q70 10 80 50 Q90 80 50 85 Q10 90 15 50 Q20 20 50 25 Q75 30 70 60 Q65 80 45 70 Q30 60 40 45 Q50 35 60 50" fill="none" stroke="#be123c" strokeWidth="8" strokeLinecap="round" />
          <circle cx="50" cy="50" r="15" fill="#9f1239" />
        </svg>
      );
    case 'daisy':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {[0, 30, 60, 90, 120, 150].map((deg, i) => (
            <ellipse key={i} cx="50" cy="50" rx="8" ry="44" transform={`rotate(${deg} 50 50)`} fill="#ffffff" stroke="#f3f4f6" strokeWidth="1" />
          ))}
          {[15, 45, 75, 105, 135, 165].map((deg, i) => (
            <ellipse key={`offset-${i}`} cx="50" cy="50" rx="8" ry="44" transform={`rotate(${deg} 50 50)`} fill="#f9fafb" />
          ))}
          <circle cx="50" cy="50" r="16" fill="#eab308" />
          <circle cx="50" cy="50" r="12" fill="#ca8a04" stroke="#eab308" strokeDasharray="1,2" strokeWidth="3" />
        </svg>
      );
    case 'hibiscus':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <path key={i} d="M50 50 C80 10 100 40 50 50 Z" transform={`rotate(${deg} 50 50)`} fill="#ec4899" opacity="0.9" />
          ))}
          {[36, 108, 180, 252, 324].map((deg, i) => (
            <path key={`inner-${i}`} d="M50 50 C70 20 85 40 50 50 Z" transform={`rotate(${deg} 50 50)`} fill="#db2777" />
          ))}
          {/* Stamen */}
          <path d="M50 50 Q45 20 30 15" stroke="#fbcfe8" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="30" cy="15" r="5" fill="#f59e0b" />
        </svg>
      );
    default:
      return null;
  }
};

type ArrangedFlower = {
  uniqueId: number;
  flowerId: string;
  height: number;
  baseRotation: number;
  scale: number;
  hue: number;
  swaySpeed: number; // Added for unique wind breeze animation
};

export default function BouquetStand() {
  const [bouquet, setBouquet] = useState<ArrangedFlower[]>([]);
  const [showNote, setShowNote] = useState(false);

  const addFlower = (flowerId: string) => {
    if (bouquet.length >= 20) return;

    const newFlower: ArrangedFlower = {
      uniqueId: Date.now() + Math.random(),
      flowerId: flowerId,
      height: 150 + Math.random() * 80, 
      baseRotation: (Math.random() - 0.5) * 65, 
      scale: 0.85 + Math.random() * 0.3,
      hue: 0,
      swaySpeed: 3 + Math.random() * 3 // Gives each flower a slightly different breeze timing
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
                  initial={{ opacity: 0, scale: 0, rotate: flower.baseRotation }}
                  animate={{ 
                    opacity: 1, 
                    scale: flower.scale, 
                    // The Breeze Animation: Rocks back and forth slightly from its base position
                    rotate: [flower.baseRotation, flower.baseRotation + 4, flower.baseRotation - 4, flower.baseRotation]
                  }}
                  exit={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    scale: { type: "spring", stiffness: 150, damping: 15 },
                    rotate: { repeat: Infinity, duration: flower.swaySpeed, ease: "easeInOut" } // Infinite sway loop
                  }}
                  className="absolute bottom-0 flex flex-col items-center pointer-events-auto origin-bottom"
                  style={{ height: `${flower.height}px` }} 
                >
                  <div 
                    className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 z-20 w-16 h-16 drop-shadow-lg"
                    onClick={(e) => changeFlowerColor(e, flower.uniqueId)}
                    style={{ filter: `hue-rotate(${flower.hue}deg)` }}
                    title="Tap to change color!"
                  >
                    <FlowerGraphic id={flower.flowerId} className="w-full h-full" />
                  </div>
                  {/* The Green Stem connects the crisp SVG head down into the vase */}
                  <div className="w-1.5 flex-grow bg-gradient-to-t from-green-700/60 to-green-400/90 rounded-full -mt-2 z-10"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sleek Glass Vase UI */}
          <div className="w-32 h-36 bg-gradient-to-br from-white/30 to-white/5 dark:from-white/10 dark:to-transparent backdrop-blur-md border border-white/60 dark:border-white/20 rounded-b-[2.5rem] rounded-t-lg relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex justify-center items-center z-20 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-2 w-4 h-full bg-gradient-to-b from-white/70 to-transparent rounded-full blur-[2px] opacity-60 skew-x-3"></div>
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
                onClick={() => addFlower(flower.id)}
                disabled={bouquet.length >= 20}
                className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-purple-100 dark:border-white/10 flex items-center justify-center transition-colors hover:border-purple-400 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                title={`Add ${flower.name}`}
              >
                {/* Renders the crisp SVGs directly onto the buttons */}
                <FlowerGraphic id={flower.id} className="w-full h-full drop-shadow-sm pointer-events-none" />
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