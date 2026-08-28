'use client';

import { motion } from 'framer-motion';

export default function HeroVideo() {
  return (
    // Updated background and added transition
    <section id="hero" className="relative w-full bg-purple-50 dark:bg-indigo-950 flex flex-col pt-16 transition-colors duration-500"> 
      
      <div className="relative w-full h-[60vh] md:h-[75vh] bg-black flex items-center justify-center overflow-hidden border-b border-purple-300 dark:border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-purple-900/40 z-10 pointer-events-none" />
        <video 
          src="/opening video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </div>

      {/* Updated Gradient and Text Colors for Light/Dark Mode */}
      <div className="relative w-full py-20 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-purple-100 to-purple-50 dark:from-indigo-950 dark:to-purple-900 transition-colors duration-500">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-indigo-900 dark:text-pink-300 mb-6 max-w-4xl leading-tight transition-colors duration-500"
        >
          Tayo man o hindi, andito ako para sa'yo. 💜
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-indigo-700 dark:text-purple-200 max-w-2xl leading-relaxed transition-colors duration-500"
        >
           I made this for you, to show that i am trying and to show that whatever happens is that you were my other half and i value you more than anyone else. 
        </motion.p>
      </div>
      
    </section>
  );
}