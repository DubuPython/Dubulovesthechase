'use client';

import { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface StickyNoteProps {
  id: string;
  message: string;
  color: string;
  date: string;
  xPos: number;
  yPos: number;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, newX: number, newY: number) => void;
  
  // FIXED: Added " | null" to satisfy TypeScript
  boundaryRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyNote({ id, message, color, date, xPos, yPos, onDelete, onPositionChange, boundaryRef }: StickyNoteProps) {
  const controls = useAnimation();
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = () => {
    if (!boundaryRef.current || !nodeRef.current) return;
    
    const parentRect = boundaryRef.current.getBoundingClientRect();
    const noteRect = nodeRef.current.getBoundingClientRect();

    // Calculate the new absolute percentages based on where it was dropped
    const newX = ((noteRect.left - parentRect.left) / parentRect.width) * 100;
    const newY = ((noteRect.top - parentRect.top) / parentRect.height) * 100;

    // Clamp coordinates so the note can't be dragged entirely off the board
    const clampedX = Math.max(2, Math.min(newX, 80));
    const clampedY = Math.max(2, Math.min(newY, 75));

    // Send the new coordinates to the database
    onPositionChange(id, clampedX, clampedY);

    // Instantly reset the framer-motion drag offset so it doesn't double-jump
    controls.set({ x: 0, y: 0 });
  };

  // Format the date to look like "Aug 28, 2026"
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      ref={nodeRef}
      drag
      dragConstraints={boundaryRef}
      dragElastic={0}
      dragMomentum={false}
      animate={controls}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 50 }}
      className={`absolute w-44 md:w-52 h-44 md:h-52 p-4 md:p-5 shadow-[2px_4px_10px_rgba(0,0,0,0.2)] flex flex-col justify-between ${color}`}
      style={{ left: `${xPos}%`, top: `${yPos}%`, cursor: 'grab' }}
    >
      {/* The semi-transparent tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 bg-white/40 backdrop-blur-sm shadow-sm" />
      
      <p className="text-gray-900 font-medium text-sm md:text-base overflow-hidden break-words line-clamp-5 mt-2">
        {message}
      </p>
      
      <div className="flex justify-between items-end mt-2 border-t border-black/10 pt-2">
        <span className="text-[10px] text-gray-700 font-bold opacity-70">{formattedDate}</span>
        <button 
          onClick={() => onDelete(id)} 
          onPointerDown={(e) => e.stopPropagation()} // Prevents dragging when clicking delete
          className="text-red-500 hover:text-red-700 transition-colors p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </motion.div>
  );
}