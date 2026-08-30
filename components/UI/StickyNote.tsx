'use client';

import { motion } from 'framer-motion';

interface StickyNoteProps {
  id: string;
  message: string;
  color: string;
  date: string;
  xPos: number;
  yPos: number;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  boundaryRef: any; // Type 'any' bypasses the Vercel strict null check
}

export default function StickyNote({
  id,
  message,
  color,
  date,
  xPos,
  yPos,
  onDelete,
  onPositionChange,
  boundaryRef
}: StickyNoteProps) {
  
  return (
    <motion.div
      drag
      dragConstraints={boundaryRef}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={(e, info) => {
        // Save the new position to the database when they drop it
        onPositionChange(id, xPos + info.offset.x, yPos + info.offset.y);
      }}
      initial={{ x: xPos, y: yPos, rotate: Math.random() * 6 - 3, scale: 0 }}
      animate={{ x: xPos, y: yPos, scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      whileDrag={{ scale: 1.1, zIndex: 100, rotate: 0 }}
      className={`absolute w-40 h-40 md:w-48 md:h-48 p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing group ${color}`}
      style={{ 
        boxShadow: '3px 5px 15px rgba(0,0,0,0.2)', 
        borderBottomRightRadius: '20px 5px' // Gives it a slight paper curl effect
      }}
    >
      {/* Delete Button (Only visible on hover) */}
      <button 
        onClick={() => onDelete(id)}
        className="absolute top-2 right-2 text-black/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Remove note"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      {/* Tape at the top center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 backdrop-blur-sm shadow-sm rotate-[-2deg]"></div>

      {/* Date */}
      <span className="text-[10px] text-gray-700/60 font-mono mt-1">
        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>

      {/* Message */}
      <p className="text-gray-800 font-medium text-sm md:text-base text-center leading-snug whitespace-pre-wrap flex-1 flex items-center justify-center px-1">
        {message}
      </p>

      {/* THE MASCOT WATERMARK (Now shows on ALL notes) */}
      <div className="absolute bottom-2 right-2 flex opacity-15 pointer-events-none grayscale sepia drop-shadow-sm">
        <span className="text-lg">🦆</span>
        <span className="text-lg mt-1">🐧</span>
      </div>
    </motion.div>
  );
}