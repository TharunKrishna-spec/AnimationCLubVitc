import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import MusicToggleButton from './components/MusicToggleButton';
import AccessibilityMenu from './components/AccessibilityMenu';
import HomePage from './pages/HomePage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import EventsPage from './pages/EventsPage';
import LeadsPage from './pages/LeadsPage';
import MembersAreaPage from './pages/MembersAreaPage';
import Footer from './components/Footer';
import AnimatedParticles from './components/AnimatedParticles';
import InteractiveBackground from './components/InteractiveBackground';
import StarfieldBackground from './components/StarfieldBackground';
import ScrollToTopButton from './components/ScrollToTopButton';

const App: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const location = useLocation();

  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('loader-hidden');
      const onTransitionEnd = () => {
        loader.remove();
      };
      loader.addEventListener('transitionend', onTransitionEnd);
      // Fallback timeout
      const timeoutId = setTimeout(() => {
        loader.remove();
      }, 500); // Should match CSS transition duration

      return () => {
        clearTimeout(timeoutId);
        loader.removeEventListener('transitionend', onTransitionEnd);
      };
    }
  }, []);
  
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <div className="bg-gray-900 live-background text-gray-200 min-h-screen transition-colors duration-500">
      <StarfieldBackground />
      <AnimatedParticles count={30} />
      <InteractiveBackground />
      
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/members" element={<MembersAreaPage />} />
        </Routes>
      </main>

      <Footer />

      <audio ref={audioRef} src="https://www.chosic.com/wp-content/uploads/2021/07/The-Road-Home.mp3" loop />
      <ScrollToTopButton />
      <MusicToggleButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />
      <AccessibilityMenu 
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
    </div>
  );
};

export default App;