'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
   { id: 1, title: "Mundo", artist: "IV of Mundo", file: "/Mundo.mp3", color: "bg-pink-400" },
   { id: 2, title: "Panaginip", artist: "Nicole", file: "/Panaginip.mp3", color: "bg-pink-400" },
   { id: 3, title: "Bad Omens", artist: "5SOS", file: "/badomens.mp3", color: "bg-indigo-400" },
   { id: 4, title: "Ikot", artist: "Over October", file: "/ikot.mp3", color: "bg-purple-400" },
   { id: 5, title: "Make It Right", artist: "BTS & Lauv", file: "/Make it right.mp3", color: "bg-blue-400" },
   { id: 6, title: "Home", artist: "Seventeen", file: "/Home.mp3", color: "bg-pink-400" },
   { id: 7, title: "Million Ways", artist: "HRVY", file: "/Million ways.mp3", color: "bg-indigo-400" },
   { id: 8, title: "Pag-Ibig ay Kanibalismo II", artist: "Fitterkarma", file: "/Pag-Ibig ay Kanibalismo II .mp3", color: "bg-purple-400" },
   { id: 9, title: "Tibok", artist: "Earl Agustin", file: "/Tibok.mp3", color: "bg-blue-400" },
   { id: 10, title: "Start Over", artist: "5SOS", file: "/Start Over.mp3", color: "bg-pink-400" },
];

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Ref to track if the initial autoplay has already happened
  const hasInteracted = useRef(false);

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    const playOnFirstInteraction = () => {
      // Only attempt to play if it's the true first interaction
      if (!hasInteracted.current && audioRef.current) {
        hasInteracted.current = true;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => console.log("Autoplay prevented by browser."));
      }
      
      // Instantly strip the listeners from the document so they never fire again
      document.removeEventListener('click', playOnFirstInteraction);
      document.removeEventListener('touchstart', playOnFirstInteraction);
    };

    document.addEventListener('click', playOnFirstInteraction);
    document.addEventListener('touchstart', playOnFirstInteraction);
    
    return () => {
      document.removeEventListener('click', playOnFirstInteraction);
      document.removeEventListener('touchstart', playOnFirstInteraction);
    };
  }, []); // Empty dependency array so this effect only runs once on load

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const prevSong = () => {
    const prevIndex = currentSongIndex === 0 ? PLAYLIST.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
  };

  const playSpecificSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end">
      
      <audio ref={audioRef} src={currentSong.file} onEnded={nextSong} />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            // MOBILE FIX: Uses a max-width calculation so it never bleeds off tiny screens
            className="mb-4 w-[calc(100vw-2rem)] sm:w-72 bg-white/30 dark:bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 p-5 rounded-3xl shadow-2xl flex flex-col items-center"
          >
            <div className="relative w-24 h-24 mb-4">
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-gray-900 rounded-full border-4 border-gray-800 shadow-xl flex items-center justify-center"
              >
                <div className="absolute w-20 h-20 rounded-full border border-gray-700/50"></div>
                <div className="absolute w-16 h-16 rounded-full border border-gray-700/50"></div>
                
                <div className={`w-8 h-8 rounded-full ${currentSong.color} flex items-center justify-center shadow-inner`}>
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                </div>
              </motion.div>
            </div>

            <div className="text-center w-full px-2 mb-4">
              <h3 className="text-gray-900 dark:text-white font-bold truncate">
                {currentSong.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {currentSong.artist}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-6 w-full mb-2">
              <button onClick={prevSong} className="text-gray-800 dark:text-white hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              
              <button onClick={togglePlay} className="w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              <button onClick={nextSong} className="text-gray-800 dark:text-white hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
            </div>

            <button onClick={() => setShowPlaylist(!showPlaylist)} className="mt-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-pink-500 uppercase tracking-widest transition-colors">
              {showPlaylist ? "Hide Playlist" : "See Playlist"}
            </button>

            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full mt-3 flex flex-col space-y-1 max-h-40 overflow-y-auto pr-1 no-scrollbar"
                >
                  {PLAYLIST.map((song, index) => (
                    <button
                      key={song.id}
                      onClick={() => playSpecificSong(index)}
                      className={`flex items-center text-left w-full p-2 rounded-xl transition-all ${
                        currentSongIndex === index 
                          ? 'bg-white/40 dark:bg-white/10 shadow-sm' 
                          : 'hover:bg-white/20 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${song.color} mr-3 shrink-0 flex items-center justify-center shadow-inner`}>
                         {currentSongIndex === index && isPlaying && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                         )}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-sm font-bold truncate ${currentSongIndex === index ? 'text-pink-600 dark:text-pink-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 md:w-16 md:h-16 bg-white/30 dark:bg-black/50 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-full shadow-2xl flex items-center justify-center relative"
      >
        {isPlaying && !isExpanded && (
          <div className="absolute -top-2 -right-2 flex space-x-1">
            <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-lg drop-shadow-md">🎵</motion.span>
          </div>
        )}
        
        <motion.div 
          animate={{ rotate: isPlaying && !isExpanded ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full border-2 border-gray-800 shadow-md flex items-center justify-center relative"
        >
          <div className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-700/50"></div>
          <div className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-700/50"></div>
          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${currentSong.color} flex items-center justify-center shadow-inner transition-colors duration-500`}>
            <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}