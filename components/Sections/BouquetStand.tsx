'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// UPDATE THIS PATH to match your actual supabase client file!
import { supabase } from '../../lib/supabaseClient';

const FLOWER_OPTIONS = [
  { id: 'purple-tulip', name: 'Purple Tulip' },
  { id: 'sunflower', name: 'Sunflower' },
  { id: 'blossom', name: 'Blossom' },
  { id: 'rose', name: 'Rose' },
  { id: 'daisy', name: 'Daisy' },
  { id: 'hibiscus', name: 'Hibiscus' }
];

const FlowerGraphic = ({ id, className }: { id: string, className?: string }) => {
  switch (id) {
    case 'purple-tulip':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M30 40 Q50 15 70 40 L60 85 Q50 95 40 85 Z" fill="#c084fc" />
          <path d="M15 50 Q30 20 45 60 L45 85 Q30 85 15 50 Z" fill="#a855f7" />
          <path d="M85 50 Q70 20 55 60 L55 85 Q70 85 85 50 Z" fill="#a855f7" />
          <path d="M35 55 Q50 25 65 55 L55 90 Q50 95 45 90 Z" fill="#9333ea" />
        </svg>
      );
    case 'sunflower':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {[0, 30, 60, 90, 120, 150].map((deg, i) => (
            <ellipse key={i} cx="50" cy="50" rx="12" ry="45" transform={`rotate(${deg} 50 50)`} fill="#fbbf24" />
          ))}
          {[15, 45, 75, 105, 135, 165].map((deg, i) => (
            <ellipse key={`offset-${i}`} cx="50" cy="50" rx="12" ry="40" transform={`rotate(${deg} 50 50)`} fill="#f59e0b" />
          ))}
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
  swaySpeed: number;
};

type SavedBouquet = {
  id: number;
  flowers: ArrangedFlower[];
  note: string;
  created_at: string;
};

export default function BouquetStand() {
  const [activeTab, setActiveTab] = useState<'create' | 'collection'>('create');
  
  // Creator State
  const [bouquet, setBouquet] = useState<ArrangedFlower[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Gallery State
  const [savedBouquets, setSavedBouquets] = useState<SavedBouquet[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === 'collection') {
      fetchBouquets();
    }
  }, [activeTab]);

  const fetchBouquets = async () => {
    const { data } = await supabase
      .from('jo_bouquets')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSavedBouquets(data);
  };

  const addFlower = (flowerId: string) => {
    if (bouquet.length >= 20) return;
    const newFlower: ArrangedFlower = {
      uniqueId: Date.now() + Math.random(),
      flowerId: flowerId,
      height: 150 + Math.random() * 80, 
      baseRotation: (Math.random() - 0.5) * 65, 
      scale: 0.85 + Math.random() * 0.3,
      hue: 0,
      swaySpeed: 3 + Math.random() * 3 
    };
    setBouquet([...bouquet, newFlower]);
  };

  const changeFlowerColor = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    setBouquet(bouquet.map(flower => 
      flower.uniqueId === id ? { ...flower, hue: flower.hue + 45 } : flower
    ));
  };

  const saveBouquet = async () => {
    if (bouquet.length === 0 || !noteInput.trim()) return;
    setIsSaving(true);
    
    const { error } = await supabase
      .from('jo_bouquets')
      .insert([{ flowers: bouquet, note: noteInput }]);

    if (!error) {
      setBouquet([]);
      setNoteInput('');
      setActiveTab('collection');
    }
    setIsSaving(false);
  };

  // Reusable component to render the wrapped bouquet UI beautifully
  const WrappedBouquet = ({ 
    flowers, 
    interactive = false, 
    onColorChange 
  }: { 
    flowers: ArrangedFlower[], 
    interactive?: boolean,
    onColorChange?: (e: React.MouseEvent, id: number) => void 
  }) => (
    <div className="relative w-48 h-64 flex flex-col items-center justify-end z-10">
      {/* Back Wrapping Paper */}
      <svg viewBox="0 0 200 200" className="w-64 h-64 absolute bottom-12 z-0 pointer-events-none drop-shadow-lg">
        {/* Paper texture base */}
        <path d="M0 20 Q100 80 200 20 L150 180 Q100 200 50 180 Z" className="fill-[#e5e5e5] dark:fill-[#d4d4d4]" />
        {/* Layered folds behind flowers */}
        <path d="M20 0 L50 40 L100 10 L150 40 L180 0 L150 180 Q100 200 50 180 Z" className="fill-[#f5f5f5] dark:fill-[#e5e5e5]" />
      </svg>

      {/* The Flowers */}
      <div className="absolute bottom-16 left-1/2 w-0 h-0 flex justify-center z-10 pointer-events-none">
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.uniqueId}
              initial={interactive ? { opacity: 0, scale: 0, rotate: flower.baseRotation } : false}
              animate={{ 
                opacity: 1, scale: flower.scale, 
                rotate: interactive ? [flower.baseRotation, flower.baseRotation + 4, flower.baseRotation - 4, flower.baseRotation] : flower.baseRotation
              }}
              transition={interactive ? { rotate: { repeat: Infinity, duration: flower.swaySpeed, ease: "easeInOut" } } : {}}
              className="absolute bottom-0 flex flex-col items-center pointer-events-auto origin-bottom"
              style={{ height: `${flower.height}px` }} 
            >
              <div 
                className={`z-20 w-16 h-16 drop-shadow-lg ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}`}
                onClick={(e) => interactive && onColorChange && onColorChange(e, flower.uniqueId)}
                style={{ filter: `hue-rotate(${flower.hue}deg)` }}
              >
                <FlowerGraphic id={flower.flowerId} className="w-full h-full" />
              </div>
              {/* Stem */}
              <div className="w-1.5 flex-grow bg-gradient-to-t from-green-800/80 to-green-500/90 rounded-full -mt-2 z-10"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Front Cone Wrapper & Ribbon */}
      <svg viewBox="0 0 200 200" className="w-64 h-64 absolute -bottom-4 z-30 pointer-events-none drop-shadow-2xl">
        {/* Folded front flaps representing the paper wrap */}
        <path d="M10 30 Q100 70 190 30 L130 190 Q100 210 70 190 Z" className="fill-[#f5f5f5] dark:fill-[#e5e5e5]" />
        <path d="M10 30 Q50 120 100 150 L70 190 Q20 120 10 30" className="fill-[#e5e5e5] dark:fill-[#d4d4d4]" />
        <path d="M190 30 Q150 120 100 150 L130 190 Q180 120 190 30" className="fill-[#e5e5e5] dark:fill-[#d4d4d4]" />
        
        {/* Jo's Purple Ribbon */}
        <path d="M75 145 Q100 155 125 145 L120 160 Q100 170 80 160 Z" className="fill-purple-500" />
        <path d="M100 150 C80 130 60 140 85 155 Z" className="fill-purple-400" />
        <path d="M100 150 C120 130 140 140 115 155 Z" className="fill-purple-400" />
        <path d="M95 155 Q80 180 85 200 Q95 180 100 160 Z" className="fill-purple-500" />
        <path d="M105 155 Q120 180 115 200 Q105 180 100 160 Z" className="fill-purple-500" />
      </svg>
    </div>
  );

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center min-h-[700px]">
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-10 z-20 bg-white/50 dark:bg-black/20 p-1.5 rounded-full border border-purple-100 dark:border-purple-500/30">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-purple-500 text-white shadow-md' : 'text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
          >
            Wrap a Bouquet
          </button>
          <button 
            onClick={() => setActiveTab('collection')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'collection' ? 'bg-purple-500 text-white shadow-md' : 'text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
          >
            Jo's Collection
          </button>
        </div>

        {/* --- CREATOR MODE --- */}
        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div 
              key="create"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center w-full z-10"
            >
              <div className="mb-8">
                <WrappedBouquet flowers={bouquet} interactive={true} onColorChange={changeFlowerColor} />
                {bouquet.length === 0 && (
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 uppercase tracking-widest pointer-events-none z-20">
                    Empty Wrapper
                  </p>
                )}
              </div>

              {/* Note Input & Save */}
              <div className="w-full max-w-md flex flex-col gap-3 mb-8">
                <input 
                  type="text"
                  maxLength={60}
                  placeholder="Attach a sweet note to the ribbon... (Max 60 chars)"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/60 dark:bg-black/30 border border-purple-200 dark:border-purple-500/30 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-medium"
                />
                <button
                  onClick={saveBouquet}
                  disabled={bouquet.length === 0 || !noteInput.trim() || isSaving}
                  className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Wrapping...' : 'Wrap & Send to Collection 💜'}
                </button>
              </div>

              {/* Flower Selection Stand */}
              <div className="w-full bg-white/50 dark:bg-black/20 rounded-3xl p-6 border border-purple-200 dark:border-purple-500/30 flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  {FLOWER_OPTIONS.map((flower) => (
                    <button
                      key={flower.id}
                      onClick={() => addFlower(flower.id)}
                      disabled={bouquet.length >= 20}
                      className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-purple-100 dark:border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:border-purple-400 disabled:opacity-50 p-2"
                      title={flower.name}
                    >
                      <FlowerGraphic id={flower.id} className="w-full h-full drop-shadow-sm pointer-events-none" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between w-full px-4 max-w-sm">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{bouquet.length} / 20 Selected</span>
                  <button onClick={() => setBouquet([])} disabled={bouquet.length === 0} className="text-sm font-bold text-purple-500 hover:text-pink-500 disabled:opacity-30 uppercase tracking-widest">
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>

          ) : (
            // --- JO'S COLLECTION MODE ---
            <motion.div 
              key="collection"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center w-full h-full z-10 flex-grow"
            >
              {savedBouquets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-5xl mb-4 opacity-50">💐</span>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">The collection is empty</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Wrap a bouquet to leave a lasting note!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 w-full max-w-3xl overflow-y-auto pr-2 custom-scrollbar pb-12">
                  {savedBouquets.map((saved) => (
                    <div key={saved.id} className="flex flex-col items-center relative">
                      
                      {/* Scales down the identical bouquet code so it fits neatly in a gallery grid */}
                      <div className="scale-75 origin-bottom relative pointer-events-none">
                        <WrappedBouquet flowers={saved.flowers} />
                        
                        {/* The Attached Gift Tag - Positioned right on the purple ribbon */}
                        <div 
                          className="absolute bottom-20 right-10 z-40 pointer-events-auto cursor-pointer group"
                          onClick={() => setActiveNoteId(activeNoteId === saved.id ? null : saved.id)}
                        >
                           <div className="w-12 h-14 bg-amber-50 dark:bg-amber-100 rounded shadow-md border border-amber-200 rotate-[15deg] transition-transform group-hover:scale-110 flex items-center justify-center relative">
                              {/* Tag Hole & string */}
                              <div className="absolute top-2 w-2 h-2 rounded-full bg-white border border-gray-300"></div>
                              <span className="text-xl mt-2 drop-shadow-sm">💌</span>
                           </div>
                        </div>
                      </div>

                      {/* The Popup Note */}
                      <AnimatePresence>
                        {activeNoteId === saved.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute bottom-0 z-50 w-64 bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl shadow-xl border-2 border-purple-200 dark:border-purple-500/50 text-center"
                          >
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 italic">"{saved.note}"</p>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                              {new Date(saved.created_at).toLocaleDateString()}
                            </p>
                            <button 
                              onClick={() => setActiveNoteId(null)}
                              className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 text-white rounded-full font-bold shadow-md hover:bg-pink-600"
                            >
                              ×
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}