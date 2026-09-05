'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin'; // 1. Import the hook!

export default function LoveLetters() {
  const { isAdmin } = useAdmin(); // 2. Call the hook!
  const [letters, setLetters] = useState<any[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [openedLetter, setOpenedLetter] = useState<any>(null);
  
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    const { data } = await supabase.from('love_letters').select('*').order('created_at', { ascending: false });
    if (data) setLetters(data);
  };

  const handlePostLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newLetter = {
      title: newTitle,
      content: newContent,
    };

    // Optimistic Update
    const optimisticLetter = { ...newLetter, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    setLetters(prev => [optimisticLetter, ...prev]);
    setIsWriting(false);
    setNewTitle("");
    setNewContent("");

    // Save to DB
    await supabase.from('love_letters').insert([newLetter]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this letter?")) return;
    setLetters(prev => prev.filter(l => l.id !== id));
    setOpenedLetter(null);
    await supabase.from('love_letters').delete().eq('id', id);
  };

  return (
    <section id="letters" className="relative w-full py-16 md:py-24 px-4 md:px-6 flex flex-col items-center border-t border-pink-200/30 dark:border-purple-500/10">
      
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 z-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md text-center sm:text-left mb-2">
            Letters for You
          </h2>
          <p className="text-indigo-500 dark:text-purple-300 text-center sm:text-left">Longer thoughts safely tucked away in envelopes.</p>
        </div>
        
        {/* ADMIN ONLY: Write a Letter Button */}
        {isAdmin && (
          <button 
            onClick={() => setIsWriting(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl">✍️</span> Write a Letter
          </button>
        )}
      </div>

      {/* Grid of Envelopes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-5xl z-10">
        {letters.map((letter) => (
          <motion.div 
            key={letter.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenedLetter(letter)}
            className="w-full aspect-[4/3] bg-[#fdf2f8] dark:bg-pink-900/40 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.1)] relative border border-pink-200 dark:border-pink-800 flex flex-col justify-end p-4 cursor-pointer"
          >
            {/* Top Envelope Flap */}
            <div className="absolute top-0 left-0 w-full h-[60%] bg-[#fce7f3] dark:bg-pink-800/60 drop-shadow-sm rounded-t-md z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
            {/* Bottom Flap overlay for depth */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-[#fbcfe8]/20 dark:bg-black/10 z-0" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}></div>
            
            {/* Heart Seal */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-3xl drop-shadow-md">
              💖
            </div>
            
            {/* Letter Title */}
            <div className="relative z-30 text-center bg-white/70 dark:bg-black/50 backdrop-blur-sm py-1.5 px-3 rounded text-pink-900 dark:text-pink-200 font-bold text-xs sm:text-sm truncate border border-pink-100 dark:border-pink-800">
              {letter.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {isWriting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1a1a2e] w-full max-w-2xl p-6 md:p-8 rounded-3xl shadow-2xl border border-pink-200 dark:border-purple-500/30 flex flex-col max-h-[90vh]"
            >
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-purple-200 mb-6">Write a Love Letter</h3>
              <form onSubmit={handlePostLetter} className="flex flex-col gap-4 flex-1 overflow-hidden">
                <input 
                  type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title of your letter..." 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 dark:text-white font-bold"
                />
                <textarea 
                  required value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Write everything you want to say here..." 
                  className="w-full flex-1 min-h-[200px] p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 dark:text-white resize-none"
                />
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsWriting(false)} className="flex-1 py-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-xl hover:bg-gray-300 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3 font-bold text-white bg-pink-500 rounded-xl hover:bg-pink-600 transition shadow-lg">Seal Envelope 💌</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Read Letter Modal */}
      <AnimatePresence>
        {openedLetter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpenedLetter(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 100, rotate: -5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              // Lined paper styling for the letter
              className="w-full max-w-lg bg-[#fdfbf7] dark:bg-[#2a2a3c] min-h-[400px] max-h-[85vh] p-8 md:p-10 rounded-sm shadow-2xl overflow-y-auto relative"
              style={{ 
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.1) 31px, rgba(0,0,0,0.1) 32px)', 
                lineHeight: '32px',
                backgroundAttachment: 'local'
              }}
            >
              <div className="absolute top-0 left-6 bottom-0 w-[2px] bg-red-400/40 z-0"></div>
              
              <div className="relative z-10 pl-4">
                <h3 className="text-3xl font-bold font-serif mb-6 text-pink-700 dark:text-pink-400 pt-2">{openedLetter.title}</h3>
                <p className="font-serif text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-lg">{openedLetter.content}</p>
                
                <div className="mt-16 flex justify-between items-center border-t border-gray-300/50 pt-4">
                   <p className="text-xs text-gray-500 font-sans">
                     {new Date(openedLetter.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                   </p>
                   
                   {/* ADMIN ONLY: Delete Letter Button inside the open modal */}
                   {isAdmin && (
                     <button onClick={() => handleDelete(openedLetter.id)} className="text-red-400 hover:text-red-600 text-sm font-sans font-bold flex items-center gap-1">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       Delete
                     </button>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}