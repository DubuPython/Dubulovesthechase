import Navbar from '../components/Layout/Navbar';
import HeroVideo from '../components/Sections/HeroVideo';
import BulletinBoard from '../components/Sections/BulletinBoard';
import PolaroidGallery from '../components/Sections/PolaroidGallery';
import VoiceSnippets from '../components/Sections/VoiceSnippets';
import MovieReviews from '../components/Sections/MovieReviews';
import LoveLetters from '../components/Sections/LoveLetters';
import FishbowlMessages from '../components/Sections/FishbowlMessages';

import UpdateLog from '../components/UI/Updatelog';
import FloatingMusicPlayer from '../components/UI/FloatingMusicPlayer';
import CornerCompanions from '../components/UI/CornerCompanions';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-slate-50 dark:bg-[#0f0f1b] overflow-x-hidden selection:bg-pink-300 selection:text-pink-900">
      
      {/* Popups and UI Overlays */}
      <UpdateLog />
      <Navbar />
      
      {/* Page Sections */}
      <div className="flex flex-col w-full">
        <HeroVideo />
        <BulletinBoard />
        <PolaroidGallery />
        <VoiceSnippets />
        
        {/* NEW MOVIE SECTION */}
        <MovieReviews />
        
        <LoveLetters />
        <FishbowlMessages />
      </div>

      {/* Persistent UI Elements */}
      <FloatingMusicPlayer />
      <CornerCompanions />
      
    </main>
  );
}