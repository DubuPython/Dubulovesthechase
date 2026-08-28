'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 🎵 YOUR PLAYLISTS
const ALBUMS = [
  {
    id: 1,
    title: "Late Night Drives",
    artist: "Our Roadtrip Mix",
    coverUrl: "/your-image-name.jpg", 
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", 
  },
  {
    id: 2,
    title: "Sunday Mornings",
    artist: "Acoustic & Coffee",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DXcxvFzl58uP7",
  },
  {
    id: 3,
    title: "Songs That Remind Me Of You",
    artist: "For You 💜",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop",
    spotifyLink: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
  }
];

// 🌟 THE SPOTLIGHT SONG
const SPOTLIGHT_SONG = {
  title: "Perfect",
  artist: "Ed Sheeran",
  coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=500&auto=format&fit=crop",
  spotifyLink: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
};

export default function RecordHolder() {
  const [albumStack, setAlbumStack] = useState<any[]>(ALBUMS);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [isSpotlightFlipped, setIsSpotlightFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 75 || offset < -75 || velocity > 400 || velocity < -400) {
      setFlippedId(null); 
      
      setAlbumStack(prev => {
        if (prev.length === 0) return prev;
        const newStack = [...prev];
        const first = newStack.shift();
        
        if (first) {
          newStack.push({ ...first, instanceKey: Math.random() });
        }
        return newStack;
      });
    }
  };

  return (
   <section id="albums" className="relative w-full min-h-screen bg-transparent transition-colors duration-500 py-20 px-6 flex flex-col items-center overflow-hidden">
      <h2 className="text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider z-10 drop-shadow-md mb-16 transition-colors duration-500">
        Our Playlists
      </h2>

      <div className="relative flex flex-col items-center w-full max-w-4xl z-10 mb-20 mt-10">
        
        <div className="relative w-[340px] h-[300px] flex items-end justify-center perspective-1000">
          <div className="absolute bottom-0 w-full h-[260px] bg-[#4a3123] rounded-t-xl border-t-8 border-[#3a2519] shadow-[inset_0_-20px_50px_rgba(0,0,0,0.5)] z-0"></div>

          <div className="absolute bottom-0 left-0 w-6 h-[260px] bg-[#5c3e2c] [clip-path:polygon(0%_40%,100%_25%,100%_100%,0%_100%)] z-20 border-r border-black/20"></div>
          <div className="absolute bottom-0 right-0 w-6 h-[260px] bg-[#3a2519] [clip-path:polygon(0%_25%,100%_40%,100%_100%,0%_100%)] z-20 border-l border-black/20"></div>

          <div className="absolute bottom-8 w-[260px] h-[260px] z-10">
            <AnimatePresence>
              {albumStack.map((album, index) => {
                const isFront = index === 0;
                const isFlipped = flippedId === album.id;
                const uniqueKey = album.instanceKey || album.id; 

                return (
                  <motion.div
                    key={uniqueKey}
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: -20, x: 0 }}
                    animate={{
                      scale: isFlipped ? 1.1 : 1 - index * 0.05,
                      y: isFlipped ? -150 : -index * 15,
                      x: 0, 
                      zIndex: isFlipped ? 50 : ALBUMS.length - index,
                      opacity: 1, 
                    }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    
                    drag={isFront && !isFlipped ? "x" : false}
                    dragElastic={0.8}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(e, info) => {
                      setTimeout(() => setIsDragging(false), 100);
                      handleDragEnd(e, info);
                    }}
                    className={`absolute inset-0 w-full h-full ${isFront && !isFlipped ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (!isDragging && isFront) {
                        setFlippedId(isFlipped ? null : album.id);
                      }
                    }}
                  >
                    <div 
                      className="w-full h-full relative shadow-2xl rounded-lg"
                      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.6s' }}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center rounded-lg border-2 border-white/20"
                        style={{ backgroundImage: `url(${album.coverUrl})`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                      >
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white">Tap to view</div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                           <p className="text-white font-bold truncate">{album.title}</p>
                        </div>
                      </div>

                      <div 
                        className="absolute inset-0 bg-zinc-900 rounded-lg border-4 border-[#1DB954]/50 flex flex-col items-center justify-center p-4 text-center"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(album.spotifyLink)}&bgcolor=24,24,27&color=255,255,255`} 
                          alt="Spotify QR" 
                          className="w-24 h-24 mb-3 rounded-lg shadow-lg pointer-events-none"
                        />
                        <h3 className="text-white font-bold text-sm mb-1 px-2 leading-tight">{album.title}</h3>
                        
                        <a 
                          href={album.spotifyLink} 
                          target="_blank" 
                          rel="noreferrer"
                          onPointerDown={(e) => e.stopPropagation()} 
                          className="mt-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-1.5 px-5 text-sm rounded-full transition-colors flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.42.3.6.84.3 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.2-1.26 11.28-1.02 15.781 1.62.54.3.72 1.02.42 1.56-.24.48-.96.66-1.5.42z"/></svg>
                          <span>Listen</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 w-full h-24 bg-zinc-900/90 border-t-4 border-zinc-950 rounded-b-xl z-30 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
            <div className="w-20 h-6 bg-zinc-950/80 rounded-full shadow-inner border border-white/10 z-10"></div>
          </div>
        </div>

        <p className="mt-8 text-indigo-500 dark:text-purple-300 text-sm italic z-10 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          Swipe to skip • Tap to view
        </p>
      </div>

      <div className="w-full max-w-3xl h-px bg-purple-300 dark:bg-purple-700/50 mt-10 mb-28"></div>

      <div className="flex flex-col items-center w-full relative z-10">
        
        <h3 className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400 mb-20 z-30 text-center drop-shadow-md">
          A song you should listen to...
        </h3>

        {/* --- THE PHYSICAL SPOTLIGHT FIXTURE --- */}
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none">
          <div className="w-1 h-12 bg-gray-400 dark:bg-zinc-600"></div>
          <div className="w-8 h-2 bg-zinc-700 dark:bg-zinc-800 rounded-t-md"></div>
          <div className="w-24 h-10 bg-zinc-800 dark:bg-zinc-950" style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0% 100%)' }}></div>
          <div className="w-20 h-4 bg-yellow-200 rounded-b-full shadow-[0_10px_30px_15px_rgba(253,224,71,0.8)] z-10 relative"></div>
        </div>

        {/* The Animated Spotlight Beam (Height increased to reach the lower easel) */}
        <motion.div 
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[135px] left-1/2 -translate-x-1/2 w-[350px] md:w-[450px] h-[600px] bg-gradient-to-b from-yellow-300/60 via-yellow-200/20 to-transparent dark:from-yellow-200/20 dark:via-yellow-400/5 dark:to-transparent [clip-path:polygon(42%_0,58%_0,100%_100%,0%_100%)] pointer-events-none z-20"
        />

        {/* THE FIX: Changed mt-10 to mt-48 to drop the easel significantly lower! */}
        <div className="relative flex justify-center items-end w-64 h-64 z-10 mt-48">
            <div className="absolute top-4 w-3 h-64 bg-[#4a3123] rounded-t-full shadow-lg"></div>
            <div className="absolute top-8 w-3 h-72 bg-[#5c3e2c] rounded-t-full rotate-12 -translate-x-16 origin-top"></div>
            <div className="absolute top-8 w-3 h-72 bg-[#5c3e2c] rounded-t-full -rotate-12 translate-x-16 origin-top"></div>
            <div className="absolute bottom-6 w-56 h-4 bg-[#3a2519] rounded-sm z-30 shadow-2xl border-b border-black/50"></div>

            <div className="absolute bottom-8 z-20">
                <div className="relative group perspective-1000 w-48 h-48 md:w-56 md:h-56 cursor-pointer">
                    <motion.div
                        animate={{ rotateY: isSpotlightFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring' }}
                        className="w-full h-full relative shadow-[0_10px_40px_rgba(255,255,255,0.4)] rounded-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        onClick={() => setIsSpotlightFlipped(!isSpotlightFlipped)}
                    >
                        <div
                          className="absolute inset-0 bg-cover bg-center rounded-full border-4 border-yellow-200/60"
                          style={{ backgroundImage: `url(${SPOTLIGHT_SONG.coverUrl})`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-full flex items-center justify-center">
                              <p className="text-white text-xs bg-black/60 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                Reveal Song
                              </p>
                          </div>
                        </div>

                        <div
                          className="absolute inset-0 bg-zinc-900 rounded-full border-4 border-[#1DB954] flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(SPOTLIGHT_SONG.spotifyLink)}&bgcolor=24,24,27&color=255,255,255`}
                            alt="Spotify QR"
                            className="w-16 h-16 mb-2 rounded shadow-lg pointer-events-none"
                          />
                          <h4 className="text-white font-bold text-xs leading-tight px-2">{SPOTLIGHT_SONG.title}</h4>
                          <p className="text-zinc-400 text-[10px] mb-2">{SPOTLIGHT_SONG.artist}</p>

                          <a
                            href={SPOTLIGHT_SONG.spotifyLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-1 px-3 text-[10px] rounded-full transition-colors flex items-center gap-1"
                          >
                             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.42.3.6.84.3 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.2-1.26 11.28-1.02 15.781 1.62.54.3.72 1.02.42 1.56-.24.48-.96.66-1.5.42z"/></svg>
                            <span>Listen</span>
                          </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}