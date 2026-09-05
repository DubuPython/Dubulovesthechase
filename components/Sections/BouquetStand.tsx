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
};

type SavedBouquet = {
  id: number;
  flowers: ArrangedFlower[];
  note: string;
  created_at: string;
};

export default function BouquetStand() {
  const [activeTab, setActiveTab] = useState<'create' | 'collection'>('create');
  
  const [bouquet, setBouquet] = useState<ArrangedFlower[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    if (bouquet.length >= 15) return;

    const count = bouquet.length;
    let tierHeight, angle;

    if (count < 5) {
      const step = 60 / 4; 
      angle = -30 + (count * step) + (Math.random() * 4 - 2); 
      tierHeight = 220 + Math.random() * 10;
    } else if (count < 11) {
      const step = 70 / 5; 
      angle = -35 + ((count - 5) * step) + (Math.random() * 4 - 2);
      tierHeight = 175 + Math.random() * 10;
    } else {
      const step = 40 / 3; 
      angle = -20 + ((count - 11) * step) + (Math.random() * 4 - 2);
      tierHeight = 135 + Math.random() * 10;
    }

    const newFlower: ArrangedFlower = {
      uniqueId: Date.now() + Math.random(),
      flowerId: flowerId,
      height: tierHeight,
      baseRotation: angle,
      scale: 1.1 + Math.random() * 0.2,
      hue: 0
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

  // --- NEW DELETE FUNCTION ---
  const deleteBouquet = async (id: number) => {
    // Instantly remove it from the screen for a snappy UI feel
    setSavedBouquets(prev => prev.filter(b => b.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
    
    // Delete it permanently from Supabase
    const { error } = await supabase
      .from('jo_bouquets')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Failed to delete", error);
      fetchBouquets(); // Refresh if something went wrong
    }
  };

  const WrappedBouquet = ({ 
    flowers, 
    interactive = false, 
    onColorChange 
  }: { 
    flowers: ArrangedFlower[], 
    interactive?: boolean,
    onColorChange?: (e: React.MouseEvent, id: number) => void 
  }) => (
    // Increased parent container height to h-[26rem] so the new massive paper wrapper never clips!
    <div className="relative w-48 h-[26rem] flex flex-col items-center justify-end z-10">
      
      {/* LAYER 1: New Massive Back Wrapping Paper */}
      {/* Extended Y coordinates (-60) and width to elegantly frame the massive blooms */}
      <svg viewBox="0 -60 200 260" className="w-[18rem] h-[22rem] absolute bottom-12 z-0 pointer-events-none drop-shadow-lg overflow-visible left-1/2 -translate-x-1/2">
        <path d="M-20 -10 Q100 60 220 -10 L150 180 Q100 200 50 180 Z" className="fill-[#e5e5e5] dark:fill-[#d4d4d4]" />
        <path d="M-10 -50 L40 10 L100 -30 L160 10 L210 -50 L150 180 Q100 200 50 180 Z" className="fill-[#f5f5f5] dark:fill-[#e5e5e5]" />
      </svg>

      {/* LAYER 2: New Extended Greenery Bed */}
      <svg viewBox="0 -30 200 230" className="w-[17rem] h-[19rem] absolute bottom-10 z-10 pointer-events-none drop-shadow-sm overflow-visible left-1/2 -translate-x-1/2">
        <path d="M10 20 Q100 -40 190 20 L140 150 L60 150 Z" className="fill-[#14532d]" />
        <path d="M0 40 Q60 -10 100 40 Z" className="fill-[#166534]" />
        <path d="M200 40 Q140 -10 100 40 Z" className="fill-[#166534]" />
        <path d="M30 30 Q100 -20 170 30 Z" className="fill-[#15803d]" />
        <path d="M60 80 Q100 10 140 80 Z" className="fill-[#16a34a]" />
      </svg>

      {/* LAYER 3: Dynamic Tiered Flowers */}
      <div className="absolute bottom-16 left-1/2 w-0 h-0 flex justify-center z-20 pointer-events-none">
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.uniqueId}
              initial={interactive ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: flower.scale, rotate: flower.baseRotation }}
              transition={interactive ? { type: "spring", stiffness: 200, damping: 20 } : { duration: 0 }}
              className="absolute bottom-0 flex flex-col items-center pointer-events-auto origin-bottom"
              style={{ height: `${flower.height}px` }} 
            >
              <div 
                className={`z-20 w-24 h-24 drop-shadow-xl ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}`}
                onClick={(e) => interactive && onColorChange && onColorChange(e, flower.uniqueId)}
                style={{ filter: `hue-rotate(${flower.hue}deg)` }}
              >
                <FlowerGraphic id={flower.flowerId} className="w-full h-full" />
              </div>
              
              {/* INVISIBLE STEM */}
              <div className="w-2 flex-grow pointer-events-none opacity-0"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LAYER 4: Front Cone Wrapper & Handle */}
      <svg viewBox="0 0 200 200" className="w-64 h-64 absolute -bottom-4 z-30 pointer-events-none drop-shadow-2xl overflow-visible">
        <path d="M85 180 L75 230 L125 230 L115 180 Z" className="fill-[#166534]" />
        <path d="M90 180 L85 240 L105 240 L100 180 Z" className="fill-[#15803d]" />
        <path d="M110 180 L115 235 L95 235 L100 180 Z" className="fill-[#16a34a]" />
        <path d="M10 30 Q100 70 190 30 L130 190 Q100 210 70 190 Z" className="fill-[#f5f5f5] dark:fill-[#e5e5e5]" />
        <path d="M10 30 Q50 120 100 150 L70 190 Q20 120 10 30" className="fill-[#e5e5e5] dark:fill-[#d4d4d4]" />
        <path d="M190 30 Q150 120 100 150 L130 190 Q180 120 190 30" className="fill-[#e5e5e5] dark:fill-[#d4d4d4]" />
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
      <div className="w-full max-w-3xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center min-h-[750px]">
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-12 z-20 bg-white/50 dark:bg-black/20 p-1.5 rounded-full border border-purple-100 dark:border-purple-500/30">
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

        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div 
              key="create"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center w-full z-10"
            >
              <div className="mb-16 mt-2 relative">
                <WrappedBouquet flowers={bouquet} interactive={true} onColorChange={changeFlowerColor} />
                {bouquet.length === 0 && (
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 uppercase tracking-widest pointer-events-none z-20">
                    Empty Wrapper
                  </p>
                )}
              </div>

              {/* UNIFIED WORKSHOP PANEL */}
              <div className="w-full max-w-lg bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-[2.5rem] p-8 border border-purple-200 dark:border-purple-500/30 flex flex-col items-center shadow-lg relative z-20">
                
                {/* Flower Selection Palette */}
                <div className="w-full flex flex-col items-center mb-8">
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-5">
                    {FLOWER_OPTIONS.map((flower) => (
                      <button
                        key={flower.id}
                        onClick={() => addFlower(flower.id)}
                        disabled={bouquet.length >= 15}
                        className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-purple-100 dark:border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:border-purple-400 disabled:opacity-50 p-2"
                        title={flower.name}
                      >
                        <FlowerGraphic id={flower.id} className="w-full h-full drop-shadow-sm pointer-events-none" />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between w-full px-2 max-w-sm">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{bouquet.length} / 15 Selected</span>
                    <button onClick={() => setBouquet([])} disabled={bouquet.length === 0} className="text-sm font-bold text-purple-500 hover:text-pink-500 disabled:opacity-30 uppercase tracking-widest transition-colors">
                      Clear Vase
                    </button>
                  </div>
                </div>

                {/* Aesthetic Divider */}
                <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-500/40 to-transparent mb-8"></div>

                {/* Wrapping Controls */}
                <div className="w-full max-w-sm flex flex-col gap-4">
                  <input 
                    type="text"
                    maxLength={60}
                    placeholder="Attach a sweet note to the ribbon... (Max 60 chars)"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-black/50 border border-purple-100 dark:border-purple-500/30 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-medium shadow-inner transition-all"
                  />
                  <button
                    onClick={saveBouquet}
                    disabled={bouquet.length === 0 || !noteInput.trim() || isSaving}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? 'Wrapping...' : 'Wrap & Send to Collection 💜'}
                  </button>
                </div>

              </div>
            </motion.div>

          ) : (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 w-full max-w-3xl overflow-y-auto pr-2 custom-scrollbar pb-12 pt-8">
                  {savedBouquets.map((saved) => (
                    <div key={saved.id} className="flex flex-col items-center relative w-full">
                      
                      {/* --- THE NEW DELETE BUTTON --- */}
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to discard this beautiful bouquet?")) {
                            deleteBouquet(saved.id);
                          }
                        }}
                        className="absolute -top-6 right-8 z-50 w-10 h-10 bg-white/90 dark:bg-black/50 hover:bg-red-500 hover:text-white text-red-400 dark:text-red-400 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm border border-red-100 dark:border-red-900/30 group"
                        title="Delete Bouquet"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>

                      <div className="scale-75 origin-bottom relative pointer-events-none">
                        <WrappedBouquet flowers={saved.flowers} />
                        
                        <div 
                          className="absolute bottom-20 right-10 z-40 pointer-events-auto cursor-pointer group"
                          onClick={() => setActiveNoteId(activeNoteId === saved.id ? null : saved.id)}
                        >
                           <div className="w-12 h-14 bg-amber-50 dark:bg-amber-100 rounded shadow-md border border-amber-200 rotate-[15deg] transition-transform group-hover:scale-110 flex items-center justify-center relative">
                              <div className="absolute top-2 w-2 h-2 rounded-full bg-white border border-gray-300"></div>
                              <span className="text-xl mt-2 drop-shadow-sm">💌</span>
                           </div>
                        </div>
                      </div>

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