'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPRITE_SIZE = 64; 

// Restored to the absolute original animations you liked best!
// (Kept frames at 4 for roaming/running so it doesn't jiggle)
const ANIMATIONS = {
  sleeping: { row: 45, frames: 2, speed: 600 }, 
  roaming:  { row: 4,  frames: 4, speed: 150 }, 
  walking:  { row: 4,  frames: 4, speed: 150 }, 
  running:  { row: 4,  frames: 4, speed: 70 },  
  eating:   { row: 12, frames: 8, speed: 180 }, 
  happy:    { row: 14, frames: 3, speed: 200 }, 
};

const PET_MESSAGES = [
  "I love you so so so much Mommy/Daddy!💜",
  "I miss you Mommy/Daddy.",
  "*Happy meow noises*",
  "Take care Always.",
  "I'm Watching you, Mommy/Daddy.",
];

export default function VirtualPet() {
  const [position, setPosition] = useState({ x: 23, y: 58 });
  const [isFacingLeft, setIsFacingLeft] = useState(true); 
  const [action, setAction] = useState<'sleeping' | 'roaming' | 'walking' | 'running' | 'eating' | 'happy' | 'playing'>('sleeping');
  const [message, setMessage] = useState("Zzz... (Tap 'Wake Up' to play)");
  const [frame, setFrame] = useState(0);
  
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  const mousePosRef = useRef({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isCatchingRef = useRef(false);

  const currentAnim = action === 'playing' ? ANIMATIONS['running'] : ANIMATIONS[action];

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const addTimer = (timer: NodeJS.Timeout) => {
    timersRef.current.push(timer);
  };

  const stopMoving = () => {
    if (catRef.current && containerRef.current) {
      const style = window.getComputedStyle(catRef.current);
      const leftPx = parseFloat(style.left);
      const topPx = parseFloat(style.top);
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width && height && !isNaN(leftPx) && !isNaN(topPx)) {
          setPosition({ x: (leftPx / width) * 100, y: (topPx / height) * 100 });
      }
    }
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  useEffect(() => {
    setFrame(0); 
    const frameTicker = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % currentAnim.frames);
    }, currentAnim.speed);
    return () => clearInterval(frameTicker);
  }, [action, currentAnim.frames, currentAnim.speed]);

  useEffect(() => {
    if (action !== 'roaming') return;
    setMessage("Sarino is exploring the room...");
    const roamInterval = setInterval(() => {
      const newX = Math.floor(Math.random() * 60) + 10; 
      const newY = Math.floor(Math.random() * 20) + 60; 
      setPosition((prev) => {
        setIsFacingLeft(newX < prev.x);
        return { x: newX, y: newY };
      });
    }, 4000);
    return () => clearInterval(roamInterval);
  }, [action]);

  // Restored Chase Logic (No Jumping)
  useEffect(() => {
    if (action !== 'playing') return;
    
    const chaseInterval = setInterval(() => {
      setPosition((prev) => {
        const dx = mousePosRef.current.x - prev.x;
        const dy = mousePosRef.current.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5 && !isCatchingRef.current) {
          isCatchingRef.current = true;
          clearAllTimers(); 
          
          setAction('happy');
          setMessage("Got it! Sarino caught the toy!");
          setShowConfetti(true); 
          
          addTimer(setTimeout(() => {
            setShowConfetti(false);
            setAction('roaming');
            isCatchingRef.current = false;
          }, 4000));
          return prev; 
        }

        const speed = 2.0; // Steady chase speed
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        setIsFacingLeft(moveX < 0);
        return { x: prev.x + moveX, y: prev.y + moveY };
      });
    }, 100);

    return () => clearInterval(chaseInterval);
  }, [action]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (action !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - rect.top) / rect.height) * 100;
    mousePosRef.current = { x: newX, y: newY };
    setMousePos({ x: newX, y: newY });
  };

  const startPlaying = () => {
    if (action === 'playing' || action === 'running' || action === 'eating') return; 
    clearAllTimers();
    setAction('playing');
    setMessage("Wiggle your mouse in the room to play!");
    
    const safeX = position.x > 50 ? 15 : 85;
    const safeY = position.y > 60 ? 40 : 80;
    mousePosRef.current = { x: safeX, y: safeY };
    setMousePos({ x: safeX, y: safeY });
  };

  const cancelPlaying = () => {
    if (action === 'playing') {
      clearAllTimers();
      isCatchingRef.current = false;
      setAction('roaming');
      setMessage("Sarino got tired of playing.");
    }
  };

  const handleWake = () => {
    clearAllTimers();
    stopMoving();
    setAction('roaming');
    setMessage("I'm awake and ready to play!");
  };

  const handleSleep = () => {
    if (action === 'sleeping' || action === 'playing') return; 
    clearAllTimers();
    
    setAction('walking'); 
    setMessage("I am getting sleepy...");
    setIsFacingLeft(true);
    setPosition({ x: 23, y: 58 }); 
    
    addTimer(setTimeout(() => {
      setAction('sleeping');
      setMessage("Zzz... (Tap 'Wake Up' to play)");
    }, 2000));
  };

  const handleFeed = () => {
    if (action === 'eating' || action === 'running' || action === 'playing') return; 
    clearAllTimers();
    
    setAction('walking');
    setMessage("Sarino heard the treat bag!");
    setIsFacingLeft(false);
    setPosition({ x: 68, y: 65 }); 
    
    addTimer(setTimeout(() => {
      setAction('eating');
      setMessage("Nom nom nom... i love treats! Thank you Mommy/Daddy!💜");
    }, 1500));
    
    addTimer(setTimeout(() => {
      setAction('roaming');
    }, 6000));
  };

  const handlePet = () => {
    if (action === 'playing' || action === 'happy') return; 
    clearAllTimers();
    stopMoving(); 
    
    setAction('happy');
    const randomMessage = PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)];
    setMessage(randomMessage);
    addTimer(setTimeout(() => setAction('roaming'), 3000));
  };

  const bgPosX = -(frame * SPRITE_SIZE);
  const bgPosY = -(currentAnim.row * SPRITE_SIZE);

  const getDuration = () => {
    if (action === 'roaming') return 4;
    if (action === 'walking') return 2; 
    if (action === 'playing') return 0.2; 
    return 0; 
  };

  return (
    <section id="sarino" className="relative w-full min-h-[80vh] bg-transparent transition-colors duration-500 py-20 px-6 flex flex-col items-center justify-center overflow-hidden border-t border-purple-300/30 dark:border-purple-500/10">
      <h2 className="text-4xl font-bold text-indigo-900 dark:text-purple-200 tracking-wider z-10 drop-shadow-md mb-4 transition-colors duration-500">
        Sarino's Safe Space
      </h2>
      <p className="text-indigo-500 dark:text-purple-300 mb-10 text-center max-w-md z-10">
        A cozy little space for our baby where we can still care of him.
      </p>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={cancelPlaying}
        className={`relative w-full max-w-4xl h-[450px] rounded-3xl overflow-hidden shadow-2xl border-8 border-indigo-200 dark:border-indigo-900 transition-colors duration-500 ${action === 'playing' ? 'cursor-none' : ''}`}
      >
        <div className="absolute top-0 w-full h-[60%] bg-blue-50 dark:bg-indigo-950 z-0">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(100,100,255,0.1) 20px, rgba(100,100,255,0.1) 40px)' }}></div>
        </div>
        <div className="absolute top-[60%] bottom-0 w-full bg-amber-700 dark:bg-amber-900 z-0">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(0,0,0,0.2) 15px, rgba(0,0,0,0.2) 16px)' }}></div>
        </div>
        <div className="absolute top-[60%] w-full h-3 bg-white dark:bg-indigo-800 shadow-sm z-0"></div>

        <div className="absolute top-10 left-12 w-32 h-40 bg-sky-900 rounded-t-full border-4 border-white dark:border-indigo-700 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] z-0 overflow-hidden flex flex-col items-center">
            <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-100 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-white/80 dark:bg-indigo-700 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/80 dark:bg-indigo-700 -translate-y-1/2"></div>
        </div>

        <div className="absolute bottom-[20%] left-[20%] w-36 h-16 bg-purple-500 rounded-full shadow-xl border-b-8 border-purple-700 z-10 flex items-center justify-center">
            <div className="w-28 h-8 bg-purple-400 rounded-full shadow-inner"></div>
        </div>

        <div className="absolute bottom-[10%] right-[35%] w-24 h-48 z-10">
            <div className="absolute bottom-0 w-full h-4 bg-slate-200 dark:bg-slate-600 rounded-lg shadow-md"></div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-32 bg-[#d4a373]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 6px)' }}></div>
            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-200 dark:bg-slate-600 rounded-full shadow-md"></div>
        </div>

        <div className="absolute flex space-x-2 z-10" style={{ left: '75%', top: '75%' }}>
           <div className="w-12 h-6 bg-pink-400 rounded-full shadow-lg flex items-center justify-center border-b-4 border-pink-600">
               <div className="w-8 h-3 bg-yellow-600/80 rounded-full"></div>
           </div>
           <div className="w-12 h-6 bg-blue-400 rounded-full shadow-lg flex items-center justify-center border-b-4 border-blue-600">
               <div className="w-8 h-3 bg-cyan-200/80 rounded-full"></div>
           </div>
        </div>

        <AnimatePresence>
          {action === 'playing' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute text-5xl pointer-events-none z-50 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
              style={{ left: `calc(${mousePos.x}% - 24px)`, top: `calc(${mousePos.y}% - 24px)` }}
            >
              🎣
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfetti && (
            <div 
              className="absolute pointer-events-none z-40"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ 
                    opacity: 0,
                    x: (Math.random() - 0.5) * 200, 
                    y: (Math.random() - 0.5) * 200 - 50,
                    scale: Math.random() * 1.5 + 0.5,
                    rotate: Math.random() * 360 
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute w-3 h-3 rounded-sm ${['bg-pink-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400'][Math.floor(Math.random() * 4)]}`}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div
          ref={catRef}
          animate={{ 
            left: `${position.x}%`, 
            top: `${position.y}%` 
          }}
          transition={{
            left: { duration: getDuration(), ease: "linear" },
            top: { duration: getDuration(), ease: "linear" }
          }}
          className="absolute z-30 cursor-pointer drop-shadow-xl flex flex-col items-center justify-end"
          onClick={handlePet}
        >
          <AnimatePresence>
            {action === 'sleeping' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0 }} className="absolute -top-6 text-xl font-bold text-blue-300 pointer-events-none drop-shadow-sm bg-transparent">Zzz</motion.div>
            )}
            {action === 'happy' && (
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1.4, y: -10 }} exit={{ opacity: 0 }} className="absolute -top-6 text-2xl pointer-events-none drop-shadow-sm bg-transparent">💜</motion.div>
            )}
          </AnimatePresence>

          <div 
            style={{
              width: `${SPRITE_SIZE}px`,
              height: `${SPRITE_SIZE}px`,
              backgroundImage: `url('/sarino.png')`,
              backgroundPosition: `${bgPosX}px ${bgPosY}px`,
              backgroundRepeat: 'no-repeat',
              // Reverted to original facing logic
              transform: `scale(2) ${isFacingLeft ? 'scaleX(1)' : 'scaleX(-1)'}`,
              imageRendering: 'pixelated',
            }}
          />
        </motion.div>
      </div>

      <div className="mt-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm py-2 px-6 rounded-full border border-purple-200 dark:border-purple-700 shadow-sm transition-colors duration-500">
        <p className="text-indigo-900 dark:text-purple-200 font-medium">{message}</p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 z-10">
        {action === 'sleeping' ? (
          <button onClick={handleWake} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
            Wake Up Sarino
          </button>
        ) : (
          <>
            <button onClick={startPlaying} disabled={action === 'playing' || action === 'running' || action === 'eating'} className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer">
              Playtime 🎣
            </button>
            <button onClick={handleFeed} disabled={action === 'playing' || action === 'running' || action === 'eating'} className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer">
              Give Treat 🐟
            </button>
            <button onClick={handlePet} disabled={action === 'playing' || action === 'happy'} className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer">
              Pet Sarino 🖐️
            </button>
            <button onClick={handleSleep} disabled={action === 'playing' || action === 'walking'} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer">
              Sleep time🛏️
            </button>
          </>
        )}
      </div>
    </section>
  );
}