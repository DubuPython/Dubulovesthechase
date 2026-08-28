'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StickyNote from '../UI/StickyNote';

export default function BulletinBoard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const boardRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // FIXED: Now pointing to 'sticky_notes'
    const { data, error } = await supabase.from('sticky_notes').select('*');
    if (data) setNotes(data);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    // FIXED: Ensure deletion happens on the right table too (if not handled inside StickyNote.tsx)
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

    setNotes((prev) => [...prev, newNote]);
    setNewNoteText('');
    setIsAdding(false);

    // FIXED: Now inserting into 'sticky_notes'
    await supabase.from('sticky_notes').insert([{
      content: newNote.content,
      theme_color: newNote.theme_color,
      x_position: newNote.x_position,
      y_position: newNote.y_position
    }]);
  };

  return (
    <section id="bulletin-board" className="relative w-full min-h-screen bg-transparent py-20 px-6 flex flex-col items-center overflow-hidden">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center md:items-end mb-6 z-10 gap-4">
        <h2 className="text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md">
          Things i want to say to you
        </h2>
        
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Write a Note
          </button>
        ) : (
          <form 
            onSubmit={handleAddNote} 
            className="flex items-center space-x-3 bg-white/20 dark:bg-black/20 p-2 rounded-full backdrop-blur-md border border-white/30 dark:border-white/10 shadow-xl"
          >
            <input 
              type="text" 
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Type your message here..." 
              className="px-6 py-3 w-64 md:w-80 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner"
              autoFocus
            />
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform hover:scale-105">
              Post
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-400/80 hover:bg-gray-500/80 text-white font-bold py-3 px-6 rounded-full shadow-md transition-transform hover:scale-105">
              Cancel
            </button>
          </form>
        )}
      </div>
      
      <div 
        ref={boardRef}
        className="relative w-full max-w-5xl h-[600px] bg-[#8B5A2B] dark:bg-[#5C3A21] rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] border-8 border-[#5C3A21] dark:border-[#3A2210] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        
        {notes.map((note) => (
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
    </section>
  );
}