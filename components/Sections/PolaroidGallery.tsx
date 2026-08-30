'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import PolaroidCard from '../UI/PolaroidCard';

export default function PolaroidGallery() {
  const [polaroids, setPolaroids] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  // Upload States
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // CLOUDINARY CREDENTIALS - UPDATE THESE!
  const CLOUD_NAME = "o1doecyw"; // e.g., "dpx12345"
  const UPLOAD_PRESET = "polaroid_uploads"; // e.g., "polaroid_uploads"

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

  // This removes the deleted photo from the screen instantly
  const handleDeletePhoto = (idToRemove: string) => {
    setPolaroids((prevPhotos) => prevPhotos.filter((photo) => photo.id !== idToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // 1. Send the file to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      // 2. Save the new Cloudinary URL AND the message to Supabase
      const { data, error } = await supabase
        .from('polaroids')
        .insert([{ image_url: imageUrl, back_message: newMessage }])
        .select();

      if (error) throw error;

      // 3. Update the UI instantly
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
    <section id="gallery" className="relative w-full min-h-screen bg-transparent py-20 flex flex-col items-center overflow-hidden">
      <h2 className="text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider z-10 drop-shadow-md mb-12 md:mb-20 transition-colors duration-500 text-center px-4">
        Memories worth looking back on
      </h2>

      {/* The Hanging Wire Container */}
      <div className="relative w-full max-w-6xl flex justify-center items-start pt-4">
        
        {/* Hiding the wire on mobile because it looks strange behind a horizontal scrolling list */}
        <svg className="hidden md:block absolute top-0 left-0 w-full h-10 drop-shadow-sm pointer-events-none" preserveAspectRatio="none">
          <path d="M0,10 Q500,40 1000,10" fill="transparent" stroke="#94a3b8" strokeWidth="2" />
        </svg>

        {/* 
          MOBILE: flex-row, overflow-x-auto, snap-x (Swipe Carousel)
          DESKTOP: flex-wrap, justify-center (Standard Grid)
        */}
        <div className="relative w-full flex flex-row md:flex-wrap justify-start md:justify-center items-center gap-6 md:gap-8 z-10 mt-6 min-h-[300px] overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {polaroids.map((photo) => (
            /* We wrap PolaroidCard in this div so it sizes properly in the mobile flex row */
            <div key={photo.id} className="snap-center shrink-0 w-[80vw] sm:w-[280px] md:w-auto md:shrink flex justify-center">
              <PolaroidCard 
                id={photo.id}
                imageUrl={photo.image_url}
                initialMessage={photo.back_message}
                onDelete={handleDeletePhoto} 
              />
            </div>
          ))}
          
          {polaroids.length === 0 && (
            <div className="text-indigo-400 dark:text-purple-400 mt-10 transition-colors duration-500 w-full text-center">
              No photos yet! Add one to see it hang here.
            </div>
          )}
        </div>
      </div>

      {/* Add Photo Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="absolute bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-400 text-white rounded-full shadow-lg text-3xl flex items-center justify-center transition-transform hover:scale-110 z-20"
      >
        +
      </button>

      {/* Upload Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
          <form 
            onSubmit={handleUpload}
            className="bg-purple-100 dark:bg-indigo-900 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-purple-300 dark:border-purple-500/30 flex flex-col transition-colors duration-500"
          >
            <h3 className="text-indigo-900 dark:text-white text-xl mb-4 font-semibold transition-colors duration-500">Hang a new photo</h3>
            
            {/* File Input */}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="mb-4 text-indigo-700 dark:text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-400 cursor-pointer w-full"
            />

            {/* Message Input */}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message for the back..."
              className="w-full h-24 p-3 mb-6 rounded-lg bg-white dark:bg-indigo-950 text-indigo-900 dark:text-purple-100 placeholder-indigo-300 dark:placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none transition-colors duration-500"
            />

            {/* Form Controls */}
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

      {/* Pagination Controls */}
      <div className="flex space-x-6 mt-12 z-10 pb-10">
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