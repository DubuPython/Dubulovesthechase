'use client';

export default function CornerCompanions() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 group flex flex-col items-center">
      {/* Gentle Tooltip */}
      <div className="mb-2 px-4 py-2 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl text-xs font-medium text-purple-600 dark:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-sm border border-purple-100 dark:border-purple-800 pointer-events-none translate-y-2 group-hover:translate-y-0">
        Always in your corner.
      </div>
      
      {/* Silhouettes created via CSS filters */}
      <div className="flex gap-1 opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-default">
        <span className="text-2xl drop-shadow-sm grayscale contrast-200">🦆</span>
        <span className="text-2xl drop-shadow-sm grayscale contrast-200 mt-1">🐧</span>
      </div>
    </div>
  );
}