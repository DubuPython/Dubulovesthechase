'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin';

interface Movie {
  id: string;
  title: string;
  poster_url: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function MovieReviews() {
  const { isAdmin } = useAdmin();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // YOUR CLOUDINARY CREDENTIALS
  const CLOUD_NAME = "o1doecyw";
  const UPLOAD_PRESET = "polaroid_uploads";

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const { data } = await supabase
      .from('movie_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMovies(data);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title || !review) return;

    setIsUploading(true);

    try {
      // 1. Upload Poster to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await res.json();
      if (!cloudinaryData.secure_url) throw new Error("Upload failed");

      // 2. Save to Supabase
      const newMovie = {
        title: title.trim(),
        poster_url: cloudinaryData.secure_url,
        rating: rating,
        review_text: review.trim(),
      };

      const { data, error } = await supabase
        .from('movie_reviews')
        .insert([newMovie])
        .select();

      if (error) throw error;

      if (data) {
        setMovies((prev) => [data[0], ...prev]);
        closeModal();
      }
    } catch (err) {
      console.error("Save movie failed:", err);
      alert("Failed to save movie review.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    setMovies((prev) => prev.filter((m) => m.id !== id));
    await supabase.from('movie_reviews').delete().eq('id', id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setReview('');
    setRating(5);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <section id="movies" className="relative w-full py-16 md:py-24 px-4 md:px-8 flex flex-col items-center border-t border-purple-500/10">
      
      {/* Header Area */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-12 z-10 gap-6">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider drop-shadow-md">
            Midnight Matinees 🍿
          </h2>
          <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base mt-2">
            Movies we watched, and what they made me feel.
          </p>
        </div>

        {/* ADMIN ONLY: Add Review Button */}
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <span>🎬</span> Add Review
          </button>
        )}
      </div>

      {/* Movies Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        {movies.length === 0 && (
          <div className="col-span-full text-center text-indigo-400 dark:text-purple-400 italic py-16">
            No reviews yet! Add a movie to get started.
          </div>
        )}

        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white/70 dark:bg-black/30 backdrop-blur-md rounded-3xl overflow-hidden border border-purple-200/60 dark:border-purple-800/40 shadow-xl flex flex-col sm:flex-row"
          >
            {/* ADMIN ONLY: Delete Button */}
            {isAdmin && (
              <button
                onClick={() => handleDelete(movie.id)}
                className="absolute top-3 right-3 z-20 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
                title="Delete Review"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}

            {/* Poster Image */}
            <div className="w-full sm:w-2/5 h-64 sm:h-auto relative shrink-0">
              <img 
                src={movie.poster_url} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/20" />
            </div>

            {/* Content Area */}
            <div className="w-full sm:w-3/5 p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {movie.title}
              </h3>
              
              {/* Hearts Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < movie.rating ? 'text-pink-500' : 'text-gray-300 dark:text-gray-700'}`}>
                    {i < movie.rating ? '💜' : '🤍'}
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 dark:text-purple-100/90 text-sm md:text-base leading-relaxed italic whitespace-pre-wrap">
                "{movie.review_text}"
              </p>

              <span className="text-xs text-gray-400 dark:text-purple-400/50 mt-6 font-semibold uppercase tracking-wider">
                {new Date(movie.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1a1a2e] w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 flex flex-col gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-purple-200">
                Write a Review
              </h3>

              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Movie Title"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none font-bold"
              />

              {/* Poster Upload */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${
                  previewUrl ? 'border-purple-500' : 'border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-50" />
                    <span className="absolute font-bold text-white drop-shadow-md text-lg z-10">Change Poster</span>
                  </>
                ) : (
                  <span className="text-purple-600 dark:text-purple-400 font-medium flex flex-col items-center gap-2">
                    <span className="text-2xl">📸</span>
                    Upload Movie Poster
                  </span>
                )}
              </div>

              {/* Rating Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`text-2xl transition-transform hover:scale-110 ${num <= rating ? 'text-pink-500' : 'text-gray-300 dark:text-gray-700 opacity-50'}`}
                    >
                      {num <= rating ? '💜' : '🤍'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did this movie make you feel? What did you learn?"
                className="w-full h-32 px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              />

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMovie}
                  disabled={!selectedFile || !title || !review || isUploading}
                  className="flex-1 py-3 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Saving...' : 'Post Review'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}