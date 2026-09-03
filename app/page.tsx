import Navbar from "../components/Layout/Navbar";
import BulletinBoard from "../components/Sections/BulletinBoard";
import HeroVideo from "../components/Sections/HeroVideo";
import PolaroidGallery from "../components/Sections/PolaroidGallery";
import FishbowlMessages from "../components/Sections/FishbowlMessages"; 
import RecordHolder from "../components/Sections/RecordHolder";
import VirtualPet from "../components/Sections/VirtualPet"; 

// 1. Added your two new section imports here
import VoiceSnippets from "../components/Sections/VoiceSnippets";
import MovieReviews from "../components/Sections/MovieReviews";

import FloatingHearts from "../components/UI/FloatingHearts"; 
import FloatingMusicPlayer from "../components/UI/FloatingMusicPlayer";
import LoveLetters from '@/components/Sections/LoveLetters';
import Comeback from '@/components/UI/ComebackButton';
import Updates from '@/components/UI/Updatelog';
import PicturesForYou from '@/components/Sections/foryoupics';
import LoadingScreen from '@/components/UI/LoadingScreen';
import CornerCompanions from '@/components/UI/CornerCompanions';
import TulipEasterEgg from '@/components/UI/TulipEasterEgg';
import MascotReunion from '../components/Sections/MascotReunion';

export default function Home() {
  return (
    <main className="relative min-h-screen font-sans overflow-x-hidden no-scrollbar">
      
      {/* 1. The Waddle-and-Slide Loading Screen */}
      <LoadingScreen />
      
      <div className="fixed inset-0 z-[1] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] transition-colors duration-700" />

      <div className="absolute top-0 left-0 w-full h-full z-[2] pointer-events-none overflow-hidden">
        <FloatingHearts />
      </div>

      <div className="relative z-[10] w-full flex flex-col items-center">
        <Navbar />
        <FloatingMusicPlayer />
        
        <HeroVideo />
        <div className="w-full">
          <BulletinBoard />
        </div>
        <LoveLetters />
        
        {/* 2. Wrapped the Gallery to position the hidden Tulip Easter Egg */}
        <div className="relative w-full">
          <TulipEasterEgg />
          <PolaroidGallery />
        </div>

        {/* 2. Slotted Midnight Matinees and Voice Snippets right here */}
        <MascotReunion />
        <VoiceSnippets />
        <MovieReviews />
        
        <PicturesForYou />
        <FishbowlMessages />
        <RecordHolder />
        <VirtualPet />
        <Comeback />
        <Updates />
        
        {/* 3. The Quiet Corner Companions */}
        <CornerCompanions />
      </div>
      
    </main>
  );
}