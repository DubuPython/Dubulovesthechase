'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Increased to 50 hearts since they are spreading out over the entire website height
    const newHearts = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5, 
      size: Math.random() * 40 + 25, 
      // Stagger them over a much longer time so they keep appearing
      delay: Math.random() * 60, 
      // Massive duration (80 to 140 seconds) so they float slowly across the massive page
      duration: Math.random() * 60 + 80, 
      color: ['text-blue-300', 'text-cyan-300', 'text-indigo-300', 'text-sky-300', 'text-purple-300'][Math.floor(Math.random() * 5)]
    }));
    
    setHearts(newHearts);
  }, []);

  if (!isMounted) return null; 

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          // Start exactly at the bottom of the absolute container (bottom of the website)
          initial={{ top: '105%', x: 0, opacity: 0 }}
          animate={{ 
            top: '-5%', // End above the hero section
            x: [0, 40, -40, 0], 
            opacity: [0, 0.8, 0.8, 0] 
          }}
          transition={{
            top: { duration: heart.duration, repeat: Infinity, ease: 'linear', delay: heart.delay },
            x: { duration: heart.duration / 4, repeat: Infinity, ease: 'easeInOut', delay: heart.delay },
            opacity: { 
              duration: heart.duration, 
              repeat: Infinity, 
              ease: 'linear', 
              delay: heart.delay,
              // Fades in quickly, stays visible for the whole trip, fades out at the very top
              times: [0, 0.05, 0.95, 1] 
            }
          }}
          className={`absolute drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] ${heart.color}`}
          style={{ left: `${heart.left}%` }}
        >
          <svg 
            width={heart.size} 
            height={heart.size} 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}