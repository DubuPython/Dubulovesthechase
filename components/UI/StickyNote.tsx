'use client';

import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useState } from 'react';

interface StickyNoteProps {
  id: string;
  message: string;
  color: string;
  date?: string; 
  boundaryRef: any; // Added boundary requirement
  onDelete: (id: string) => void;
}

export default function StickyNote({ id, message, color, date, boundaryRef, onDelete }: StickyNoteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    await supabase.from('bulletin_notes').delete().eq('id', id);
    onDelete(id);
  };

  const formattedDate = date 
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <motion.div
      drag
      dragConstraints={boundaryRef} // Locks the note inside the corkboard!
      dragMomentum={false}
      whileDrag={{ scale: 1.05, rotate: 0, zIndex: 50, cursor: 'grabbing' }}
      whileHover={{ scale: 1.02 }}
      className={`relative w-48 h-48 p-4 shadow-lg flex flex-col cursor-grab group ${color}`}
      style={{ rotate: Math.random() * 6 - 3, transformOrigin: 'top center' }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm pointer-events-none"></div>
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 w-6 h-6 bg-black/10 hover:bg-red-500 text-black hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <span className="text-xs font-bold font-sans">×</span>
      </button>

      <div className="flex-grow overflow-hidden mt-4 pointer-events-none">
        <p className="text-gray-800 font-medium text-sm break-words">{message || "No message provided"}</p>
      </div>
      
      <div className="mt-auto pt-2 border-t border-black/10 pointer-events-none flex justify-end items-end">
        <p className="text-[10px] text-gray-600 font-medium">{formattedDate}</p>
      </div>
    </motion.div>
  );
}