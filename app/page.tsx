import Navbar from '../components/Layout/Navbar';
import HeroVideo from '../components/Sections/HeroVideo';
import RecordHolder from '../components/Sections/RecordHolder';
import Foryoupics from '../components/Sections/Foryoupics';
import BulletinBoard from '../components/Sections/BulletinBoard';
import PolaroidGallery from '../components/Sections/PolaroidGallery';
import VoiceSnippets from '../components/Sections/VoiceSnippets';
import MovieReviews from '../components/Sections/MovieReviews';
import LoveLetters from '../components/Sections/LoveLetters';
import FishbowlMessages from '../components/Sections/FishbowlMessages';
import VirtualPet from '../components/Sections/VirtualPet';

import UpdateLog from '../components/UI/Updatelog';
import FloatingMusicPlayer from '../components/UI/FloatingMusicPlayer';
import CornerCompanions from '../components/UI/CornerCompanions';
import FloatingHearts from '../components/UI/FloatingHearts';
import LoadingScreen from '../components/UI/LoadingScreen';
import TulipEasterEgg from '../components/UI/TulipEasterEgg';
import ComebackButton from '../components/UI/ComebackButton';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-slate-50 dark:bg-[#0f0f1b] overflow-x-hidden selection:bg-pink-300 selection:text-pink-900">
      
      {/* Loaders and Full-Screen Effects */}
      <LoadingScreen />
      <UpdateLog />
      <FloatingHearts />
      <TulipEasterEgg />
      
      <Navbar />
      
      {/* Main Content Sections */}
      <div className="flex flex-col w-full">
        <HeroVideo />
        <RecordHolder />
        <Foryoupics />
        <BulletinBoard />
        <PolaroidGallery />
        <VoiceSnippets />
        
        {/* New Midnight Matinees Section */}
        <MovieReviews />
        
        <LoveLetters />
        <FishbowlMessages />
        <VirtualPet />
      </div>

      {/* Persistent UI Elements */}
      <FloatingMusicPlayer />
      <CornerCompanions />
      <ComebackButton />
      
    </main>
  );
}