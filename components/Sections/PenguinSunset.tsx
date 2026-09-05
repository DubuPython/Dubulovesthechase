'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin';
import { supabase } from '../../lib/supabaseClient';

export default function PenguinSunset() {
  const { isAdmin } = useAdmin();
  const [daysWaiting, setDaysWaiting] = useState(0);
  const [startDate, setStartDate] = useState('2024-01-01'); // Default fallback
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState('');

  // We will store this single date in your existing affection_counters table 
  // to avoid making you create a whole new database table just for one string!
  useEffect(() => {
    fetchDate();
  }, []);

  useEffect(() => {
    // Calculate the days between the start date and today
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    setDaysWaiting(Math.max(0, days)); // Prevents negative numbers
  }, [startDate]);

  const fetchDate = async () => {
    const { data } = await supabase.from('affection_counters').select('*').eq('action_type', 'penguin_date').single();
    if (data && data.count) {
      // We are hacking the "count" integer column to store a timestamp by converting it, 
      // but to keep it simple and foolproof, let's just use localStorage for her device,
      // OR better yet, let's just create a quick Supabase fetch if it exists. 
      // Actually, hardcoding it or saving it to Supabase as a text requires a new column. 
      // Let's use a simpler approach: We will just save the timestamp (number) in the count column!
      const dateString = new Date(data.count).toISOString().split('T')[0];
      setStartDate(dateString);
    }
  };

  const handleSaveDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartDate(tempDate);
    setIsEditing(false);
    
    // Save the date as a timestamp number in your existing table
    const timestamp = new Date(tempDate).getTime();
    await supabase
      .from('affection_counters')
      .upsert({ action_type: 'penguin_date', count: timestamp });
  };

  return (
    <section className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col items-center border border-purple-500/30 group">
        
        {/* --- THE SKY (Purple Sunset Gradient) --- */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#4a195c] to-[#9d3b76] z-0"></div>

        {/* Twinkling Stars */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-24 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-80" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-32 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>

        {/* --- THE SUN --- */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-t from-orange-400 to-pink-300 rounded-full blur-[2px] shadow-[0_0_60px_rgba(244,114,182,0.6)] z-10"
        />

        {/* --- THE OCEAN / ICE GROUND --- */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#0a0514] to-[#2a1142] z-20 border-t border-pink-500/30 shadow-[0_-10px_30px_rgba(157,59,118,0.4)]"></div>

        {/* --- SUN REFLECTION ON WATER --- */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-orange-400/40 to-transparent blur-md z-20"></div>

        {/* --- TEXT COUNTER --- */}
        <div className="relative z-30 flex flex-col items-center text-center pt-16 pb-48 px-6">
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter"
          >
            {daysWaiting}
          </motion.h3>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-pink-100/90 text-lg md:text-xl font-medium tracking-widest uppercase mt-2 drop-shadow-md"
          >
            Days waiting for you to comeback
          </motion.p>
        </div>

        {/* --- PENGUIN SVG --- */}
        {/* Silhouette of a cute penguin sitting on the ice, looking at the sunset */}
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        >
          <svg viewBox="0 0 100 100" className="w-28 h-28">
            {/* Sunset Highlight Glow on the edges */}
            <defs>
              <linearGradient id="penguinGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="80%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* Beak (looking slightly right) */}
            <path d="M 55 35 L 68 38 L 55 42 Z" fill="#0f172a" />
            
            {/* Head */}
            <circle cx="50" cy="35" r="16" fill="url(#penguinGlow)" />
            
            {/* Body */}
            <path d="M 35 90 C 35 45, 45 45, 50 45 C 55 45, 65 45, 65 90 Z" fill="url(#penguinGlow)" />
            
            {/* Left Flipper */}
            <path d="M 36 55 Q 20 70 28 85 Q 40 70 36 55" fill="#0f172a" />
            
            {/* Right Flipper */}
            <path d="M 64 55 Q 80 70 72 85 Q 60 70 64 55" fill="#0f172a" />
          </svg>
        </motion.div>

        {/* --- ADMIN ONLY: EDIT DATE BUTTON --- */}
        {isAdmin && (
          <button 
            onClick={() => { setTempDate(startDate); setIsEditing(true); }}
            className="absolute top-6 right-6 z-40 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg transition-all"
            title="Edit Target Date"
          >
            ✏️
          </button>
        )}

        {/* --- EDIT DATE MODAL --- */}
        {isEditing && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl w-full max-w-sm">
              <h4 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">When did you start waiting?</h4>
              <form onSubmit={handleSaveDate} className="flex flex-col gap-4">
                <input 
                  type="date" 
                  required 
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-black/50 text-gray-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-pink-500 text-white rounded-xl font-bold">Save Date</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}