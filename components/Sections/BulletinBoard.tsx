'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StickyNote from '../UI/StickyNote';

// Determine how many notes fit on the board before creating a new page
const NOTES_PER_PAGE = 10;

export default function BulletinBoard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const boardRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // Fetch and sort by newest first so your latest notes always appear on Page 1
    const { data, error } = await supabase
      .from('sticky_notes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setNotes(data);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((note) => note.id !== id);
      
      // If you delete the last note on the current page, automatically flip back a page
      const newTotalPages = Math.ceil(updatedNotes.length / NOTES_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      return updatedNotes;
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
      x_position: Math.floor(Math.random() * 60) + 10,
      y_position: Math.floor(Math.random() * 60) + 10,
      created_at: new Date().toISOString(),
    };

    // Add new note to the top of the list
    setNotes((prev) => [newNote, ...prev]);
    setNewNoteText('');
    setIsAdding(false);
    setCurrentPage(1); // Instantly jump to Page 1 so you can see your new note!

    await supabase.from('sticky_notes').insert([{
      content: newNote.content,
      theme_color: newNote.theme_color,
      x_position: newNote.x_position,
      y_position: newNote.y_position
    }]);
  };

  // --- PAGINATION MATH ---
  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const currentNotes = notes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE);

  return (
    <section id="bulletin-board" className="relative w-full min-h-screen bg-transparent py-10 md:py-20 px-4 md:px-6 flex flex-col items-center overflow-hidden">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center md:items-end mb-6 z-10 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md text-center md:text-left">
          Things i want to tell you
        </h2>
        
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Write a Note
          </button>
        ) : (
          <form 
            onSubmit={handleAddNote} 
            className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-3 bg-white/20 dark:bg-black/20 p-3 sm:p-2 rounded-3xl sm:rounded-full backdrop-blur-md border border-white/30 dark:border-white/10 shadow-xl"
          >
            <input 
              type="text" 
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Type your message here..." 
              className="px-6 py-3 w-full sm:w-64 md:w-80 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner"
              autoFocus
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="submit" className="flex-1 sm:flex-none bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform hover:scale-105">
                Post
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 sm:flex-none bg-gray-400/80 hover:bg-gray-500/80 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform hover:scale-105">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Corkboard */}
      <div 
        ref={boardRef}
        // Added margin-bottom to make room for pagination buttons
        className="relative w-full max-w-5xl h-[450px] md:h-[600px] bg-[#8B5A2B] dark:bg-[#5C3A21] rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] border-8 border-[#5C3A21] dark:border-[#3A2210] overflow-hidden mb-8"
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        
        {/* Only render the notes that belong on the current page */}
        {currentNotes.map((note) => (
          <div key={note.id} className="absolute" style={{ left: `${note.x_position}%`, top: `${note.y_position}%` }}>
            <StickyNote 
              id={note.id}
              message={note.content} 
              color={note.theme_color} 
              date={note.created_at} 
              onDelete={handleDeleteNote}
              boundaryRef={boardRef} 
            />
          </div>
        ))}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between w-full max-w-sm bg-white/50 dark:bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200 dark:border-purple-700 shadow-sm z-10">
          
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-pink-600 dark:text-pink-400 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform font-bold text-sm md:text-base flex items-center gap-1"
          >
            <span>←</span> Prev
          </button>
          
          <span className="text-indigo-900 dark:text-purple-200 font-medium text-sm md:text-base">
            Page {currentPage} of {totalPages}
          </span>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-pink-600 dark:text-pink-400 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform font-bold text-sm md:text-base flex items-center gap-1"
          >
            Next <span>→</span>
          </button>

        </div>
      )}

    </section>
  );
}