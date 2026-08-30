'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StickyNote from '../UI/StickyNote';

const NOTES_PER_PAGE = 10;
const DAILY_MESSAGE = "I miss you! 💜";

export default function BulletinBoard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const boardRef = useRef<HTMLDivElement>(null);

  // --- 1. THE RESPONSIVE BRAIN ---
  // Listens for window resizing or phone rotating and re-organizes instantly
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setNotes(prev => autoOrganizeLocally(prev));
      }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  const getGridConfig = () => {
    if (typeof window === 'undefined') return { cols: 4, xSpace: 220, ySpace: 180, xOffset: 40 };
    const w = window.innerWidth;
    if (w < 640) return { cols: 2, xSpace: 165, ySpace: 160, xOffset: 15 };
    if (w < 1024) return { cols: 3, xSpace: 200, ySpace: 170, xOffset: 30 };
    return { cols: 4, xSpace: 220, ySpace: 180, xOffset: 40 };
  };

  // A tiny helper to make them look organic, but stable (so they don't jitter when re-rendering)
  const pseudoRandom = (index: number) => {
    const vals = [4, -6, 8, -3, 5, -7, 2, -5, 6, -4];
    return vals[index % vals.length];
  };

  // --- 2. THE AUTO-ORGANIZER ---
  // Calculates perfect X/Y pixel coordinates for every note based on the device
  const autoOrganizeLocally = (rawNotes: any[]) => {
    const config = getGridConfig();
    
    return rawNotes.map((note, index) => {
      const pageIndex = index % NOTES_PER_PAGE;
      const col = pageIndex % config.cols;
      const row = Math.floor(pageIndex / config.cols);
      
      return {
        ...note,
        x_position: config.xOffset + (col * config.xSpace) + pseudoRandom(index),
        y_position: 30 + (row * config.ySpace) + pseudoRandom(index + 5)
      };
    });
  };

  const fetchNotes = async () => {
    const { data } = await supabase.from('sticky_notes').select('*').order('created_at', { ascending: false });
    if (data) {
      // Instantly organize the raw data before it ever hits the screen
      const organizedData = autoOrganizeLocally(data);
      setNotes(organizedData);
      checkAndPostDailyNote(organizedData);
    }
  };

  const checkAndPostDailyNote = async (currentNotes: any[]) => {
    const todayStr = new Date().toDateString();
    
    const hasDailyNote = currentNotes.some(note => {
      const noteDate = new Date(note.created_at).toDateString();
      return noteDate === todayStr && note.content === DAILY_MESSAGE;
    });

    if (!hasDailyNote) {
      const newDailyNote = {
        id: crypto.randomUUID(), 
        content: DAILY_MESSAGE,
        theme_color: 'bg-pink-200',
        x_position: 0, 
        y_position: 0, 
        created_at: new Date().toISOString(),
      };

      // Add to front of list and instantly re-organize everything
      setNotes(prev => autoOrganizeLocally([newDailyNote, ...prev]));

      await supabase.from('sticky_notes').insert([{
        content: newDailyNote.content,
        theme_color: newDailyNote.theme_color,
        x_position: 0,
        y_position: 0
      }]);
    }
  };

  const handlePositionChange = async (id: string, newX: number, newY: number) => {
    // Allows the user to still drag and drop freely if they want to override the grid manually
    setNotes((prevNotes) => prevNotes.map((note) => note.id === id ? { ...note, x_position: newX, y_position: newY } : note));
    await supabase.from('sticky_notes').update({ x_position: newX, y_position: newY }).eq('id', id);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((note) => note.id !== id);
      const newTotalPages = Math.ceil(updatedNotes.length / NOTES_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
      
      // Auto-slide all remaining notes to fill the empty gap!
      return autoOrganizeLocally(updatedNotes); 
    });
    await supabase.from('sticky_notes').delete().eq('id', id);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: crypto.randomUUID(), 
      content: newNoteText,
      theme_color: ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200'][Math.floor(Math.random() * 4)],
      x_position: 0,
      y_position: 0,
      created_at: new Date().toISOString(),
    };

    // Add to front of list and instantly re-organize everything down one slot
    setNotes((prev) => autoOrganizeLocally([newNote, ...prev]));
    setNewNoteText('');
    setIsAdding(false);
    setCurrentPage(1);

    await supabase.from('sticky_notes').insert([{
      content: newNote.content,
      theme_color: newNote.theme_color,
      x_position: 0,
      y_position: 0
    }]);
  };

  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const currentNotes = notes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE);

  return (
    <section id="bulletin-board" className="relative w-full bg-transparent py-12 md:py-20 px-4 md:px-6 flex flex-col items-center overflow-hidden">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center md:items-end mb-6 md:mb-8 z-10 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md text-center md:text-left">
          Things i want to tell you
        </h2>
        
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 md:py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
            <span className="text-xl">+</span> Write a Note
          </button>
        ) : (
          <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-3 bg-white/20 dark:bg-black/20 p-4 sm:p-2 rounded-3xl sm:rounded-full backdrop-blur-md border border-white/30 dark:border-white/10 shadow-xl">
            <input type="text" value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Type your message here..." className="px-6 py-3 w-full sm:w-64 md:w-80 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner" autoFocus />
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="submit" className="flex-1 sm:flex-none bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform hover:scale-105">Post</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 sm:flex-none bg-gray-400/80 hover:bg-gray-500/80 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform hover:scale-105">Cancel</button>
            </div>
          </form>
        )}
      </div>
      
      {/* Mobile Optimized Height */}
      <div 
        ref={boardRef} 
        className="relative w-full max-w-5xl h-[850px] sm:h-[700px] md:h-[600px] bg-[#8B5A2B] dark:bg-[#5C3A21] rounded-2xl md:rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] border-8 border-[#5C3A21] dark:border-[#3A2210] overflow-hidden mb-8"
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        
        {currentNotes.map((note) => (
          <StickyNote key={note.id} id={note.id} message={note.content} color={note.theme_color} date={note.created_at} xPos={note.x_position} yPos={note.y_position} onDelete={handleDeleteNote} onPositionChange={handlePositionChange} boundaryRef={boardRef} />
        ))}
      </div>

      <div className="flex items-center justify-between w-full max-w-sm bg-white/50 dark:bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200 dark:border-purple-700 shadow-sm z-10">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-pink-600 dark:text-pink-400 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform font-bold text-sm md:text-base flex items-center gap-1"><span>←</span> Prev</button>
        <span className="text-indigo-900 dark:text-purple-200 font-medium text-sm md:text-base">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="text-pink-600 dark:text-pink-400 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform font-bold text-sm md:text-base flex items-center gap-1">Next <span>→</span></button>
      </div>

    </section>
  );
}