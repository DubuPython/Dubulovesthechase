'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

interface PolaroidProps {
  id: string;
  imageUrl: string;
  initialMessage: string;
  onDelete: (id: string) => void; 
}

export default function PolaroidCard({ id, imageUrl, initialMessage, onDelete }: PolaroidProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Save the message to Supabase
  const handleSaveMessage = async () => {
    setIsSaving(true);
    await supabase.from('polaroids').update({ back_message: message }).eq('id', id);
    setIsSaving(false);
  };

  // Delete from Supabase and the screen
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to take this photo down?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    await supabase.from('polaroids').delete().eq('id', id);
    onDelete(id); 
  };

  return (
    <>
      {/* 
        FIXED CSS:
        - Removed mx-4 so it doesn't break the carousel snap.
        - Added responsive width/height (w-[75vw] on mobile, up to w-[280px] on desktop).
        - Added shrink-0 so flexbox doesn't squish the cards.
      */}
      <div className="relative group perspective-1000 w-[75vw] sm:w-[260px] md:w-[280px] h-[350px] md:h-[380px] cursor-pointer shrink-0 mx-auto">
        
        {/* 
          THE CLIP FIX: 
          -top-5 pushes it exactly 20px above the card, which perfectly hits the wire! 
        */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-8 bg-slate-400 rounded-sm shadow-md z-20 border-b-2 border-slate-600"></div>
        
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }} 
        >
          {/* Front of Polaroid */}
          <div 
            className="absolute inset-0 bg-white p-3 pb-12 shadow-xl rounded-sm border border-gray-200 flex flex-col"
            onClick={() => setIsFullscreen(true)}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} 
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-gray-200" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
            />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
              className="absolute bottom-3 right-3 text-xs md:text-sm font-bold tracking-wider text-gray-400 hover:text-pink-500"
            >
              FLIP ↪
            </button>
          </div>

          {/* Back of Polaroid */}
          <div 
            className="absolute inset-0 bg-orange-50 p-4 shadow-xl rounded-sm border border-gray-200 flex flex-col"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a memory here..."
              className="w-full h-full bg-transparent text-gray-800 text-sm md:text-base resize-none focus:outline-none"
            />
            
            {/* Action Buttons (Back, Delete, Save) */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-orange-200">
              <button 
                onClick={() => setIsFlipped(false)}
                className="text-xs font-bold text-gray-500 hover:text-indigo-500"
              >
                ↩ BACK
              </button>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs font-bold bg-red-500/90 hover:bg-red-600 text-white px-3 py-1.5 rounded shadow transition-colors"
                >
                  {isDeleting ? '...' : 'Delete'}
                </button>
                <button 
                  onClick={handleSaveMessage}
                  disabled={isSaving}
                  className="text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded shadow transition-colors"
                >
                  {isSaving ? '...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Modal (Untouched, works perfectly!) */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          >
            <img src={imageUrl} alt="Memory" className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm" />
            {message && <p className="text-white mt-6 text-lg md:text-xl text-center max-w-2xl font-medium">{message}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}