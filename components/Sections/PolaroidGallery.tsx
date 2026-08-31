'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import PolaroidCard from '../UI/PolaroidCard';

export default function PolaroidGallery() {
  const [polaroids, setPolaroids] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 12; 

  const [isAdding, setIsAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // CLOUDINARY CREDENTIALS
  const CLOUD_NAME = "o1doecyw"; 
  const UPLOAD_PRESET = "polaroid_uploads"; 

  useEffect(() => {
    fetchPolaroids();
  }, [page]);

  const fetchPolaroids = async () => {
    const { data } = await supabase
      .from('polaroids')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
    
    setPolaroids(data || []);
  };

  const handleDeletePhoto = (idToRemove: string) => {
    setPolaroids((prevPhotos) => prevPhotos.filter((photo) => photo.id !== idToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      const { data, error } = await supabase
        .from('polaroids')
        .insert([{ image_url: imageUrl, back_message: newMessage }])
        .select();

      if (error) throw error;

      if (data) {
        setPolaroids([data[0], ...polaroids]);
        setIsAdding(false);
        setSelectedFile(null);
        setNewMessage('');
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="gallery" className="relative w-full min-h-screen bg-transparent py-20 overflow-hidden">
      
      <h2 className="text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider z-10 drop-shadow-md mb-2 md:mb-8 transition-colors duration-500 text-center px-4">
        Memories worth looking back on
      </h2>

      {polaroids.length > 1 && (
        <div className="lg:hidden flex items-center justify-center gap-2 text-indigo-400 dark:text-purple-400/80 text-xs font-bold tracking-widest mt-2 mb-4 animate-pulse">
          <span>←</span>
          <span>SWIPE</span>
          <span>→</span>
        </div>
      )}

      <div className="relative w-full max-w-7xl mx-auto mt-2 md:mt-4">
        
        {/* --- DYNAMIC WIRES CONTAINER --- */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          
          {/* Wire 1 (Always Visible) */}
          <div className="absolute top-12 lg:top-10 left-1/2 -translate-x-1/2 w-[150vw] lg:w-[120vw] h-12">
            <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 1000 40">
              <path d="M0,10 Q500,35 1000,10" fill="transparent" stroke="#94a3b8" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Wire 2 (Visible on desktop if wrapping to Row 2) */}
          {polaroids.length > 3 && (
            <div className="absolute hidden lg:block top-[460px] left-1/2 -translate-x-1/2 w-[120vw] h-12">
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 1000 40">
                <path d="M0,10 Q500,35 1000,10" fill="transparent" stroke="#94a3b8" strokeWidth="2.5" />
              </svg>
            </div>
          )}

          {/* Wire 3 (Visible on desktop if wrapping to Row 3) */}
          {polaroids.length > 7 && (
            <div className="absolute hidden lg:block top-[880px] left-1/2 -translate-x-1/2 w-[120vw] h-12">
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 1000 40">
                <path d="M0,10 Q500,35 1000,10" fill="transparent" stroke="#94a3b8" strokeWidth="2.5" />
              </svg>
            </div>
          )}

          {/* Wire 4 (Visible on desktop if wrapping to Row 4) */}
          {polaroids.length > 11 && (
            <div className="absolute hidden lg:block top-[1300px] left-1/2 -translate-x-1/2 w-[120vw] h-12">
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 1000 40">
                <path d="M0,10 Q500,35 1000,10" fill="transparent" stroke="#94a3b8" strokeWidth="2.5" />
              </svg>
            </div>
          )}
        </div>

        {/* --- CAROUSEL TRACK --- */}
        {/* Switched to lg:flex-wrap so iPads get the smooth horizontal swipe carousel too! */}
        <div className="relative z-10 w-full flex flex-nowrap lg:flex-wrap justify-start lg:justify-center gap-4 md:gap-10 pt-12 pb-10 overflow-x-auto lg:overflow-visible snap-x snap-mandatory px-0 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="lg:hidden shrink-0 w-[10vw]"></div>

          {polaroids.map((photo) => (
            <div key={photo.id} className="snap-center shrink-0 w-[70vw] sm:w-[260px] md:w-auto md:shrink flex justify-center">
              <PolaroidCard 
                id={photo.id}
                imageUrl={photo.image_url}
                initialMessage={photo.back_message}
                onDelete={handleDeletePhoto} 
              />
            </div>
          ))}
          
          <div className="lg:hidden shrink-0 w-[10vw]"></div>

          {polaroids.length === 0 && (
            <div className="text-indigo-400 dark:text-purple-400 mt-10 transition-colors duration-500 w-full text-center">
              No photos yet! Add one to see it hang here.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsAdding(true)}
        className="absolute bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-400 text-white rounded-full shadow-lg text-3xl flex items-center justify-center transition-transform hover:scale-110 z-20"
      >
        +
      </button>

      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
          <form 
            onSubmit={handleUpload}
            className="bg-purple-100 dark:bg-indigo-900 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-purple-300 dark:border-purple-500/30 flex flex-col transition-colors duration-500"
          >
            <h3 className="text-indigo-900 dark:text-white text-xl mb-4 font-semibold transition-colors duration-500">Hang a new photo</h3>
            
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="mb-4 text-indigo-700 dark:text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-400 cursor-pointer w-full"
            />

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message for the back..."
              className="w-full h-24 p-3 mb-6 rounded-lg bg-white dark:bg-indigo-950 text-indigo-900 dark:text-purple-100 placeholder-indigo-300 dark:placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none transition-colors duration-500"
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {setIsAdding(false); setSelectedFile(null); setNewMessage('');}}
                className="px-4 py-2 text-indigo-700 dark:text-purple-300 hover:text-indigo-900 dark:hover:text-white transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white rounded-lg transition-colors font-medium shadow-md disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex justify-center space-x-6 mt-4 z-10 pb-10 w-full">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-6 py-2 bg-purple-200 dark:bg-purple-600/50 hover:bg-purple-300 dark:hover:bg-purple-500 text-indigo-900 dark:text-white rounded-full transition-all disabled:opacity-30 font-medium">
          &larr; Prev
        </button>
        <button onClick={() => setPage(page + 1)} disabled={polaroids.length < itemsPerPage} className="px-6 py-2 bg-blue-200 dark:bg-blue-600/50 hover:bg-blue-300 dark:hover:bg-blue-500 text-indigo-900 dark:text-white rounded-full transition-all disabled:opacity-30 font-medium">
          Next &rarr;
        </button>
      </div>
      
    </section>
  );
}