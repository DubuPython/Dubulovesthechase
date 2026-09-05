'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// UPDATE THIS PATH to match your actual supabase client file!
import { supabase } from '../../lib/supabaseClient';

type Lyric = {
  id: number;
  quote: string;
  song: string;
  artist: string;
};

export default function LyricGenerator() {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  const [newSong, setNewSong] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLyrics();
  }, []);

  const fetchLyrics = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('lyrics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lyrics:', error);
    } else if (data) {
      setLyrics(data);
      if (data.length > 0) {
        setCurrentIndex(Math.floor(Math.random() * data.length));
      }
    }
    setIsLoading(false);
  };

  const drawNewLyric = () => {
    if (isChanging || lyrics.length <= 1) return;
    setIsChanging(true);
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * lyrics.length);
    } while (newIndex === currentIndex);
    
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsChanging(false), 600);
  };

  const handleAddLyric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote || !newSong || !newArtist) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('lyrics')
      .insert([{ quote: newQuote, song: newSong, artist: newArtist }]);

    if (!error) {
      setNewQuote('');
      setNewSong('');
      setNewArtist('');
      setShowAddForm(false);
      fetchLyrics();
    }
    setIsSubmitting(false);
  };

  // --- NEW DELETE FUNCTION ---
  const handleDeleteLyric = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this lyric?")) return;

    // Immediately remove it from the screen
    const updatedLyrics = lyrics.filter(lyric => lyric.id !== id);
    setLyrics(updatedLyrics);
    
    // Pick a new random lyric to show if there are any left
    if (updatedLyrics.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * updatedLyrics.length));
    }

    // Delete it permanently from Supabase
    const { error } = await supabase
      .from('lyrics')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Failed to delete lyric", error);
      fetchLyrics(); // Refresh if it failed
    }
  };

  const currentLyric = lyrics[currentIndex];

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/40 dark:bg-[#1a1a2e]/60 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center transition-all duration-500">
        
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-300/30 dark:bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-300/30 dark:bg-pink-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="mb-6 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 shadow-inner">
          <span className="text-2xl drop-shadow-sm">🎶</span>
        </div>

        <AnimatePresence mode="wait">
          {!showAddForm ? (
            <motion.div 
              key="display"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center w-full z-10"
            >
              <div className="min-h-[120px] flex items-center justify-center w-full">
                {isLoading ? (
                  <p className="text-purple-500 animate-pulse">Finding the perfect words...</p>
                ) : lyrics.length === 0 ? (
                  <p className="text-gray-500 italic">No lyrics added yet. Be the first!</p>
                ) : (
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
                        "{currentLyric?.quote}"
                      </h3>
                      <p className="mt-4 text-sm font-bold tracking-widest text-purple-500 uppercase">
                        — {currentLyric?.song} by {currentLyric?.artist}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={drawNewLyric}
                  disabled={isChanging || lyrics.length <= 1}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Shuffle Lyric
                </button>
                
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-bold w-12 h-12 rounded-full shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center text-xl"
                  title="Add new lyric"
                >
                  +
                </button>

                {/* --- THE DELETE BUTTON --- */}
                {lyrics.length > 0 && (
                  <button 
                    onClick={() => handleDeleteLyric(currentLyric.id)}
                    className="bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-400 font-bold w-12 h-12 rounded-full shadow-sm transition-transform hover:scale-105 hover:bg-red-100 hover:text-red-500 active:scale-95 flex items-center justify-center border border-red-100 dark:border-red-900/30"
                    title="Delete this lyric"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleAddLyric}
              className="flex flex-col w-full max-w-md z-10 space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Add to Playlist</h3>
              
              <textarea 
                placeholder="Type the lyric here..."
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-purple-200 dark:border-purple-500/30 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-28"
              />
              
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Song Title"
                  value={newSong}
                  onChange={(e) => setNewSong(e.target.value)}
                  required
                  className="w-1/2 p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-purple-200 dark:border-purple-500/30 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input 
                  type="text" 
                  placeholder="Artist"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  required
                  className="w-1/2 p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-purple-200 dark:border-purple-500/30 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 px-6 rounded-full font-bold text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Lyric'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}