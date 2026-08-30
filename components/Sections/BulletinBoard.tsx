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

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data } = await supabase.from('sticky_notes').select('*').order('created_at', { ascending: false });
    if (data) {
      setNotes(data);
      checkAndPostDailyNote(data);
    }
  };

  // --- NEW FEATURE: Auto Post "I miss you" once per day ---
  const checkAndPostDailyNote = async (currentNotes: any[]) => {
    const todayStr = new Date().toDateString();
    
    // Scan all notes to see if today's daily message has already been posted
    const hasDailyNote = currentNotes.some(note => {
      const noteDate = new Date(note.created_at).toDateString();
      return noteDate === todayStr && note.content === DAILY_MESSAGE;
    });

    if (!hasDailyNote) {
      // Find a safe spot on Page 1 for the auto-note
      const safePos = getSafePosition(currentNotes.slice(0, NOTES_PER_PAGE));
      
      const newDailyNote = {
        id: crypto.randomUUID(), 
        content: DAILY_MESSAGE,
        theme_color: 'bg-pink-200', // Making sure the daily note is always pink!
        x_position: safePos.x,
        y_position: safePos.y,
        created_at: new Date().toISOString(),
      };

      // Optimistically add it so you see it immediately
      setNotes(prev => [newDailyNote, ...prev]);

      // Quietly save it to the database
      await supabase.from('sticky_notes').insert([{
        content: newDailyNote.content,
        theme_color: newDailyNote.theme_color,
        x_position: newDailyNote.x_position,
        y_position: newDailyNote.y_position
      }]);
    }
  };

  // FIXED: Adjusted to proper pixel dimensions so notes don't stack
  const getSafePosition = (pageNotes: any[]) => {
    const cells = Array(12).fill(0);
    
    pageNotes.forEach(note => {
      // Check which grid cell the note is mostly in based on absolute pixels
      const c = Math.floor(Math.max(0, (note.x_position - 40) / 220)); 
      const r = Math.floor(Math.max(0, (note.y_position - 30) / 180)); 
      const index = Math.min(2, r) * 4 + Math.min(3, c);
      if(index >= 0 && index < 12) cells[index]++;
    });

    const emptyCellIndex = cells.findIndex(count => count === 0);
    const targetCell = emptyCellIndex !== -1 ? emptyCellIndex : Math.floor(Math.random() * 12);
    
    const targetCol = targetCell % 4;
    const targetRow = Math.floor(targetCell / 4);
    
    // Convert column/row back into pixel coordinates for the board
    return {
      x: 40 + (targetCol * 220) + (Math.random() * 20 - 10),
      y: 30 + (targetRow * 180) + (Math.random() * 20 - 10)
    };
  };

  const handlePositionChange = async (id: string, newX: number, newY: number) => {
    setNotes((prevNotes) => prevNotes.map((note) => note.id === id ? { ...note, x_position: newX, y_position: newY } : note));
    await supabase.from('sticky_notes').update({ x_position: newX, y_position: newY }).eq('id', id);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((note) => note.id !== id);
      const newTotalPages = Math.ceil(updatedNotes.length / NOTES_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
      return updatedNotes;
    });
    await supabase.from('sticky_notes').delete().eq('id', id);
  };

  const organizeBoard = async () => {
    const updatedNotes = [...notes];
    const pageNotes = currentNotes;
    
    const promises = pageNotes.map((note, index) => {
      const col = index % 4; 
      const row = Math.floor(index / 4); 
      
      // FIXED: Proper pixel spacing (220px apart horizontally, 180px vertically)
      const newX = 40 + (col * 220) + (Math.random() * 15 - 7);
      const newY = 30 + (row * 180) + (Math.random() * 15 - 7);
      
      const noteIndex = updatedNotes.findIndex(n => n.id === note.id);
      updatedNotes[noteIndex].x_position = newX;
      updatedNotes[noteIndex].y_position = newY;
      
      return supabase.from('sticky_notes').update({ x_position: newX, y_position: newY }).eq('id', note.id);
    });
    
    setNotes(updatedNotes);
    await Promise.all(promises);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const currentNotesOnPage = notes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE);
    const safePos = getSafePosition(currentNotesOnPage);

    const newNote = {
      id: crypto.randomUUID(), 
      content: newNoteText,
      theme_color: ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200'][Math.floor(Math.random() * 4)],
      x_position: safePos.x,
      y_position: safePos.y,
      created_at: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setNewNoteText('');
    setIsAdding(false);
    setCurrentPage(1);

    await supabase.from('sticky_notes').insert([{
      content: newNote.content,
      theme_color: newNote.theme_color,
      x_position: newNote.x_position,
      y_position: newNote.y_position
    }]);
  };

  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const currentNotes = notes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE);

  return (
    <section id="bulletin-board" className="relative w-full min-h-screen bg-transparent py-12 md:py-20 px-4 md:px-6 flex flex-col items-center overflow-hidden">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center md:items-end mb-6 md:mb-8 z-10 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md text-center md:text-left">
          Things i want to tell you
        </h2>
        
        {!isAdding ? (
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={organizeBoard} className="flex-1 md:flex-none bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 md:py-4 px-6 rounded-full shadow-lg transition-transform hover:scale-105">
              ✨ Organize
            </button>
            <button onClick={() => setIsAdding(true)} className="flex-1 md:flex-none bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 md:py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
              <span className="text-xl">+</span> Write a Note
            </button>
          </div>
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
      
      <div ref={boardRef} className="relative w-full max-w-5xl h-[600px] md:h-[600px] bg-[#8B5A2B] dark:bg-[#5C3A21] rounded-2xl md:rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] border-8 border-[#5C3A21] dark:border-[#3A2210] overflow-hidden mb-8">
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