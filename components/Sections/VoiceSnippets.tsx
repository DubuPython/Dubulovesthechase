'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface Snippet {
  id: string;
  title: string;
  audio_url: string;
  duration?: string;
  created_at: string;
}

export default function VoiceSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  
  // Recording & Upload States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrlPreview, setAudioUrlPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Playback state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CLOUDINARY CONFIG
  const CLOUD_NAME = "o1doecyw";
  const UPLOAD_PRESET = "polaroid_uploads"; // Uses your unsigned upload preset

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    const { data } = await supabase
      .from('voice_snippets')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSnippets(data);
  };

  // --- RECORDING CONTROLS ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(recordedBlob);
        setAudioUrlPreview(URL.createObjectURL(recordedBlob));
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone. Please grant mic permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAudioBlob(null);
      setAudioUrlPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileToUpload = selectedFile || audioBlob;
    if (!fileToUpload) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload, selectedFile ? selectedFile.name : 'voice-note.webm');
      formData.append('upload_preset', UPLOAD_PRESET);

      // Cloudinary video/auto endpoint handles audio files (.mp3, .webm, .m4a)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error("Cloudinary upload failed");

      const newSnippet = {
        title: title.trim() || `Voice Note on ${new Date().toLocaleDateString()}`,
        audio_url: data.secure_url,
        duration: formatTime(recordingTime || Math.round(data.duration || 0)),
      };

      const { data: dbData, error } = await supabase
        .from('voice_snippets')
        .insert([newSnippet])
        .select();

      if (error) throw error;

      if (dbData) {
        setSnippets((prev) => [dbData[0], ...prev]);
        closeModal();
      }
    } catch (err) {
      console.error("Save audio failed:", err);
      alert("Failed to save audio snippet. Please check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this audio note?")) return;
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    if (currentlyPlaying === id && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setCurrentlyPlaying(null);
    }
    await supabase.from('voice_snippets').delete().eq('id', id);
  };

  // --- AUDIO PLAYBACK ---
  const togglePlay = (id: string, url: string) => {
    if (currentlyPlaying === id) {
      audioPlayerRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(url);
      audioPlayerRef.current = audio;
      setCurrentlyPlaying(id);
      audio.play();
      audio.onended = () => setCurrentlyPlaying(null);
    }
  };

  const closeModal = () => {
    if (isRecording) stopRecording();
    setIsModalOpen(false);
    setTitle('');
    setAudioBlob(null);
    setSelectedFile(null);
    setAudioUrlPreview(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section id="audio-snippets" className="relative w-full py-16 md:py-24 px-4 md:px-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-10 gap-6 z-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider text-center sm:text-left drop-shadow-md">
            Voice Snippets 🎙️
          </h2>
          <p className="text-indigo-600 dark:text-purple-300 text-sm md:text-base text-center sm:text-left mt-1">
            Little voice notes and thoughts spoken aloud.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <span className="text-xl">🎙️</span> Record / Upload
        </button>
      </div>

      {/* Snippet Grid / Carousel */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 z-10">
        {snippets.length === 0 && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 italic py-16">
            No audio snippets yet. Record one to get started!
          </div>
        )}

        {snippets.map((item) => {
          const isPlaying = currentlyPlaying === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-5 rounded-3xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-purple-200/60 dark:border-purple-800/40 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlay(item.id, item.audio_url)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 shadow-md ${
                      isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-purple-100 line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete snippet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center gap-1 mt-4 h-6 px-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-pink-500 dark:bg-pink-400 animate-pulse'
                        : 'bg-purple-300 dark:bg-purple-900/60'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(20, (Math.sin(i + Date.now() / 200) + 1) * 50)}%` : `${((i % 5) + 2) * 15}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Record / Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#1a1a2e] w-full max-w-md p-6 md:p-8 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 flex flex-col gap-5"
            >
              <h3 className="text-xl font-bold text-indigo-900 dark:text-purple-200">
                Add Voice Snippet
              </h3>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a title (e.g. Late night thoughts)"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {/* Mic Recording Section */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-110"
                  >
                    🎤
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-500 animate-pulse text-white flex items-center justify-center text-xl shadow-lg"
                  >
                    ⏹ Stop
                  </button>
                )}

                <span className="mt-3 text-sm font-semibold text-gray-700 dark:text-purple-300 font-mono">
                  {isRecording ? `Recording... ${formatTime(recordingTime)}` : audioUrlPreview ? 'Recorded successfully!' : 'Tap mic to record'}
                </span>
              </div>

              {/* Or File Upload */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                <span className="text-xs text-gray-500 uppercase font-semibold">Or upload file</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              </div>

              <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 rounded-xl border border-dashed border-purple-400 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
              >
                {selectedFile ? `Selected: ${selectedFile.name}` : '📁 Choose audio file from device'}
              </button>

              {/* Preview Audio player */}
              {audioUrlPreview && (
                <audio controls src={audioUrlPreview} className="w-full mt-1" />
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSnippet}
                  disabled={(!audioBlob && !selectedFile) || isUploading}
                  className="flex-1 py-3 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Save Snippet'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}