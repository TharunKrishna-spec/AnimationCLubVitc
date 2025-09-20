import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { departments } from '../services/mockData';
import type { Project, Department } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';
import SocialShareButtons from '../components/SocialShareButtons';
import ImageWithShimmer from '../components/ImageWithShimmer';

const ProjectModal: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-3xl font-bold z-10">&times;</button>
          {project.mediaType === 'image' ? (
            <ImageWithShimmer
              src={project.mediaUrl}
              alt={project.title}
              className="w-full h-auto max-h-[60vh] object-contain rounded-t-lg"
              wrapperClassName="w-full max-h-[60vh] flex justify-center items-center bg-gray-800 rounded-t-lg"
            />
          ) : (
            <div className="aspect-w-16 aspect-h-9">
              {/* Video embed would go here */}
              <iframe src={project.mediaUrl} title={project.title} className="w-full h-full rounded-t-lg" allowFullScreen></iframe>
            </div>
          )}
          <div className="p-6">
            <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-400">{project.description}</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

const DepartmentDetailShimmer: React.FC = () => (
  <div className="bg-gray-100 dark:bg-transparent">
    <div className="h-96 shimmer-placeholder" />
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-1/2 rounded-md shimmer-placeholder mb-6" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded shimmer-placeholder" />
            <div className="h-4 w-full rounded shimmer-placeholder" />
            <div className="h-4 w-5/6 rounded shimmer-placeholder" />
          </div>
        </div>
        <div className="mt-12 md:mt-20">
          <div className="h-8 w-1/3 rounded-md shimmer-placeholder mx-auto mb-12" />
          <div className="max-w-4xl mx-auto aspect-video rounded-lg shimmer-placeholder" />
        </div>
        <div className="mt-12 md:mt-20">
          <div className="h-8 w-1/3 rounded-md shimmer-placeholder mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="aspect-square rounded-lg shimmer-placeholder" />
            <div className="aspect-square rounded-lg shimmer-placeholder" />
            <div className="aspect-square rounded-lg shimmer-placeholder" />
          </div>
        </div>
      </div>
    </div>
  </div>
);


const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | undefined | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTeamCarouselPaused, setIsTeamCarouselPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [isProjectCarouselPaused, setIsProjectCarouselPaused] = useState(false);

  const { ref: aboutRef } = useScrollAnimation<HTMLDivElement>();
  const { ref: teamRef } = useScrollAnimation<HTMLDivElement>();
  const { ref: projectsRef } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    setLoading(true);
    const foundDepartment = departments.find(dept => dept.id === id);
    // Use a small timeout to simulate loading from a local source
    setTimeout(() => {
      setDepartment(foundDepartment);
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <DepartmentDetailShimmer />;
  }

  if (!department) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-transparent">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-orbitron text-red-500">404 - Not Found</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">The department you are looking for does not exist.</p>
          <Link to="/departments" className="mt-8 inline-block bg-cyan-500 text-white font-bold py-3 px-6 rounded-full hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 active:scale-100">
            Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  const totalSlides = department?.teamPhotos?.length || 0;

  const nextSlide = () => {
      setCurrentSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
      setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (slideIndex: number) => {
      setCurrentSlide(slideIndex);
  };
  
  useEffect(() => {
    if (isTeamCarouselPaused || totalSlides <= 1) return;
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, [currentSlide, isTeamCarouselPaused, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
      if (totalSlides <= 1) return;
      setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (touchStart === null || totalSlides <= 1) return;
      const touchEnd = e.changedTouches[0].clientX;
      const touchDiff = touchStart - touchEnd;
      if (touchDiff > 50) nextSlide();
      else if (touchDiff < -50) prevSlide();
      setTouchStart(null);
  };

  const projectsPerPage = 3;
  const projectSlides: Project[][] = [];
  if (department?.projects) {
    for (let i = 0; i < department.projects.length; i += projectsPerPage) {
      projectSlides.push(department.projects.slice(i, i + projectsPerPage));
    }
  }
  const totalProjectSlides = projectSlides.length;

  const nextProjectSlide = () => setCurrentProjectSlide(prev => (prev === totalProjectSlides - 1 ? 0 : prev + 1));
  const prevProjectSlide = () => setCurrentProjectSlide(prev => (prev === 0 ? totalProjectSlides - 1 : prev - 1));
  const goToProjectSlide = (slideIndex: number) => setCurrentProjectSlide(slideIndex);

  useEffect(() => {
    if (isProjectCarouselPaused || totalProjectSlides <= 1) return;
    const intervalId = setInterval(nextProjectSlide, 5000);
    return () => clearInterval(intervalId);
  }, [currentProjectSlide, isProjectCarouselPaused, totalProjectSlides]);
  
  const shareUrl = window.location.href;
  const shareTitle = `Check out the ${department.name} Department at Animation Club VITC!`;

  return (
    <div className="bg-gray-100 dark:bg-transparent text-gray-900 dark:text-white">
      <div className="relative h-96 overflow-hidden bg-gray-900">
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
              style={{
                backgroundImage: `url(${department.bannerImage})`,
                transform: `translateY(${parallaxOffset * 0.4}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        <div className="relative h-full flex items-end z-10">
          <div className="container mx-auto px-6 pb-12">
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-orbitron drop-shadow-lg transition-transform duration-100 ease-out"
                style={{ transform: `translateY(-${parallaxOffset * 0.2}px)` }}
              >
                {department.name}
              </h1>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div ref={aboutRef} className="scroll-animate slide-up max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">About the Department</h2>
                <>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    {department.longDescription}
                  </p>
                  <SocialShareButtons shareUrl={shareUrl} title={shareTitle} />
                </>
          </div>
          
          {department.teamPhotos.length > 0 && (
              <div ref={teamRef} className="scroll-animate zoom-in mt-12 md:mt-20">
                <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
                <div className="relative max-w-4xl mx-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseEnter={() => setIsTeamCarouselPaused(true)} onMouseLeave={() => setIsTeamCarouselPaused(false)}>
                  <div className="overflow-hidden rounded-lg shadow-2xl">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                      {department.teamPhotos.map((photo, index) => (
                        <div key={index} className="flex-shrink-0 w-full">
                          <ImageWithShimmer src={photo} alt={`Team photo ${index + 1}`} className="w-full h-auto aspect-video object-cover" wrapperClassName="w-full aspect-video" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {totalSlides > 1 && ( <>
                    <button onClick={prevSlide} aria-label="Previous slide" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all active:scale-90 z-10"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <button onClick={nextSlide} aria-label="Next slide" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all active:scale-90 z-10"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    <div className="flex justify-center space-x-2 mt-4">
                      {department.teamPhotos.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-cyan-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`} aria-label={`Go to slide ${index + 1}`}></button>
                      ))}
                    </div>
                  </>)}
                </div>
              </div>
          )}

          <div ref={projectsRef} className="scroll-animate zoom-in mt-12 md:mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Our Projects</h2>
            {department.projects.length > 0 ? (
              <div className="relative group" onMouseEnter={() => setIsProjectCarouselPaused(true)} onMouseLeave={() => setIsProjectCarouselPaused(false)}>
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentProjectSlide * 100}%)` }}>
                    {projectSlides.map((slide, slideIndex) => (
                      <div key={slideIndex} className="flex-shrink-0 w-full px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {slide.map((project) => (
                            <div key={project.id} className="group/card relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2 active:scale-95" onClick={() => setSelectedProject(project)}>
                              <ImageWithShimmer src={project.mediaUrl} alt={project.title} className="w-full h-64 object-cover transform group-hover/card:scale-110 transition-transform duration-500" wrapperClassName="w-full h-64" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-4"><h3 className="text-xl font-bold text-white transform transition-transform duration-300 group-hover/card:translate-x-2">{project.title}</h3></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {totalProjectSlides > 1 && ( <>
                  <button onClick={prevProjectSlide} aria-label="Previous project slide" className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all active:scale-90 z-10 opacity-0 group-hover:opacity-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                  <button onClick={nextProjectSlide} aria-label="Next project slide" className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all active:scale-90 z-10 opacity-0 group-hover:opacity-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </>)}
                {totalProjectSlides > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    {projectSlides.map((_, index) => <button key={index} onClick={() => goToProjectSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentProjectSlide === index ? 'bg-cyan-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`} aria-label={`Go to project slide ${index + 1}`}></button>)}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No projects to display for this department yet.</p>
            )}
          </div>
        </div>
      </div>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
};

export default DepartmentDetailPage;