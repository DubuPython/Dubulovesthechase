'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin';

export default function PicturesForYou() {
  const { isAdmin } = useAdmin();
  const [pictures, setPictures] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  
  // Cloudinary Upload States
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Carousel Ref for desktop scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPictures();
  }, []);

  const fetchPictures = async () => {
    const { data } = await supabase
      .from('pictures_for_you')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPictures(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const CLOUDINARY_CLOUD_NAME = "o1doecyw"; 
    const CLOUDINARY_UPLOAD_PRESET = "for_you_pictures";

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.secure_url) {
        setNewImageUrl(data.secure_url); 
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePostPicture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newPic = {
      image_url: newImageUrl,
      caption: newCaption,
    };

    const optimisticPic = { ...newPic, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    setPictures(prev => [optimisticPic, ...prev]);
    
    setIsAdding(false);
    setNewImageUrl("");
    setNewCaption("");

    await supabase.from('pictures_for_you').insert([newPic]);
  };

  const handleDelete = async (id: string) => {
    setPictures(prev => prev.filter(p => p.id !== id));
    await supabase.from('pictures_for_you').delete().eq('id', id);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section id="pictures" className="relative w-full py-16 md:py-24 flex flex-col items-center border-t border-pink-200/30 dark:border-purple-500/10 overflow-hidden">
      
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-6 z-10 px-4 md:px-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md text-center sm:text-left mb-2">
            Pictures I wanted to send you
          </h2>
          <p className="text-indigo-500 dark:text-purple-300 text-center sm:text-left text-sm md:text-base">
            Little things I saw today that made me think of you.
          </p>
        </div>
        
        {/* ADMIN ONLY: Add Photo Button */}
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <span className="text-xl">📸</span> Add Photo
          </button>
        )}
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10 flex items-center group">
        
        {pictures.length > 0 && (
          <button 
            onClick={scrollLeft}
            className="hidden md:flex absolute left-4 z-20 w-12 h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full items-center justify-center text-pink-600 dark:text-pink-400 shadow-lg border border-pink-200 dark:border-pink-900/50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          </button>
        )}

        <div 
          ref={carouselRef}
          className="flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory px-4 md:px-16 py-8 scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {pictures.length === 0 && !isAdding && (
            <div className="w-full text-center text-gray-500 dark:text-gray-400 italic py-20">
              No pictures added yet...
            </div>
          )}

          {pictures.map((pic, index) => (
            <motion.div 
              key={pic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
              className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-[400px] flex flex-col bg-white/60 dark:bg-black/20 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/40 dark:border-white/5"
            >
              <div className="w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <img 
                  src={pic.image_url} 
                  alt="For you" 
                  className="w-full h-[300px] md:h-[400px] object-contain bg-white dark:bg-gray-900"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found' }}
                />
              </div>
              
              <div className="mt-4 px-2 flex justify-between items-start gap-4">
                <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {pic.caption}
                </p>
                
                <div className="flex flex-col items-end shrink-0 gap-2">
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                    {new Date(pic.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  
                  {/* ADMIN ONLY: Delete Picture Button */}
                  {isAdmin && (
                    <button onClick={() => handleDelete(pic.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete picture">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {pictures.length > 0 && (
          <button 
            onClick={scrollRight}
            className="hidden md:flex absolute right-4 z-20 w-12 h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full items-center justify-center text-pink-600 dark:text-pink-400 shadow-lg border border-pink-200 dark:border-pink-900/50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1a1a2e] w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl border border-pink-200 dark:border-purple-500/30 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-purple-200 mb-6">Add a Picture</h3>

              <form onSubmit={handlePostPicture} className="flex flex-col gap-4 flex-1">
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />

                {!newImageUrl ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 rounded-xl border-2 border-dashed border-pink-300 dark:border-purple-600/50 bg-pink-50/50 dark:bg-black/20 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-100 dark:hover:bg-black/40 transition-colors"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <span className="animate-spin text-3xl mb-2 text-pink-500">⏳</span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-2">📸</span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Tap to select a photo</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/5 border border-gray-200 dark:border-gray-800 flex items-center justify-center group">
                    <img src={newImageUrl} alt="Preview" className="h-full w-auto object-contain" />
                    
                    <div 
                      onClick={() => setNewImageUrl("")}
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                       <span className="text-white font-bold">Remove Picture</span>
                    </div>
                  </div>
                )}

                <textarea 
                  value={newCaption} onChange={e => setNewCaption(e.target.value)} 
                  placeholder="Why did this make you think of her? (Optional)" 
                  className="w-full min-h-[100px] p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 dark:text-white resize-none"
                />
                
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => { setIsAdding(false); setNewImageUrl(""); }} className="flex-1 py-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-xl hover:bg-gray-300 transition">Cancel</button>
                  <button type="submit" disabled={!newImageUrl || isUploading} className="flex-1 py-3 font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    Post Picture
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}