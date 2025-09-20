import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import Spinner from '../components/Spinner';

const RecruitmentClosedContent: React.FC = () => (
  <div className="text-center max-w-md mx-auto">
    <div className="text-cyan-400 mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-gray-900/50 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold mb-4 text-white">Recruitment is Currently Closed</h2>
    <p className="text-gray-400 mb-8">
      We are not accepting new members at this time. Please follow our social channels for announcements on the next recruitment drive. Stay tuned!
    </p>
    <Link
      to="/departments"
      className="btn-shimmer inline-block bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
    >
      Explore Our Departments
    </Link>
  </div>
);

const MembersAreaPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { ref: contentRef } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate loading for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 md:pb-20 bg-gray-100 dark:bg-transparent min-h-screen flex items-center justify-center">
      <div ref={contentRef} className="scroll-animate zoom-in container mx-auto px-6">
        <div className="bg-gray-800/40 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-3xl mx-auto">
          <RecruitmentClosedContent />
        </div>
      </div>
    </div>
  );
};

export default MembersAreaPage;