import React, { useState, useEffect, useRef } from 'react';
import { pastEvents, upcomingEvents } from '../services/mockData';
import type { PastEvent, UpcomingEvent } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';
import SocialShareButtons from '../components/SocialShareButtons';
import ImageWithShimmer from '../components/ImageWithShimmer';

const ModalLoader: React.FC = () => (
  <div className="p-6 md:p-8">
    <div className="flex justify-between items-start mb-4">
      <div className="h-10 w-3/4 rounded-md shimmer-placeholder" />
      <div className="h-8 w-8 rounded-full shimmer-placeholder flex-shrink-0 ml-4" />
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-4 w-full rounded shimmer-placeholder" />
      <div className="h-4 w-5/6 rounded shimmer-placeholder" />
    </div>
    <div className="my-6">
      <div className="h-6 w-1/3 rounded-md shimmer-placeholder mb-3" />
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full shimmer-placeholder" />
        <div className="w-10 h-10 rounded-full shimmer-placeholder" />
        <div className="w-10 h-10 rounded-full shimmer-placeholder" />
      </div>
    </div>
    <div className="w-full aspect-video rounded-lg shimmer-placeholder" />
    <div className="flex justify-center space-x-2 mt-4">
      <div className="w-3 h-3 rounded-full shimmer-placeholder" />
      <div className="w-3 h-3 rounded-full shimmer-placeholder" />
      <div className="w-3 h-3 rounded-full shimmer-placeholder" />
    </div>
  </div>
);


const PastEventModal: React.FC<{ event: PastEvent | null; onClose: () => void; isLoading: boolean }> = ({ event, onClose, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (event) setCurrentIndex(0);
  }, [event]);

  if (!event && !isLoading) return null;

  const totalImages = event?.images.length || 0;

  const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? totalImages - 1 : prev - 1));
  const goToNext = () => setCurrentIndex(prev => (prev === totalImages - 1 ? 0 : prev + 1));
  const goToIndex = (index: number) => setCurrentIndex(index);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const touchDiff = touchStart - touchEnd;
    if (touchDiff > 50) goToNext();
    else if (touchDiff < -50) goToPrevious();
    setTouchStart(null);
  };

  const shareUrl = window.location.href;
  const shareTitle = event ? `Check out this event from Animation Club VITC: ${event.title}` : 'Check out events from Animation Club VITC';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {isLoading || !event ? <ModalLoader /> : (
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold z-10">&times;</button>
              </div>
              <p className="text-gray-400">{event.description}</p>
              <SocialShareButtons shareUrl={shareUrl} title={shareTitle} />
              {totalImages > 0 && (
                  <div className="relative">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                      <ImageWithShimmer key={currentIndex} src={event.images[currentIndex]} alt={`${event.title} - ${currentIndex + 1}`} className="w-full h-full object-contain carousel-image" wrapperClassName="w-full h-full" />
                      <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">{currentIndex + 1} / {totalImages}</div>
                    </div>
                    {totalImages > 1 && ( <>
                      <button onClick={goToPrevious} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all active:scale-90 z-10"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                      <button onClick={goToNext} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all active:scale-90 z-10"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    </>)}
                    {totalImages > 1 && (
                      <div className="flex justify-center space-x-2 mt-4">
                        {event.images.map((_, index) => <button key={index} onClick={() => goToIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-cyan-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`} aria-label={`Go to image ${index + 1}`}></button>)}
                      </div>
                    )}
                  </div>
              )}
            </div>
        )}
      </div>
       <style>{`@keyframes fade-in-up{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}.animate-fade-in-up{animation:fade-in-up .3s ease-out forwards}.carousel-image{animation:fade-in .4s ease-in-out}@keyframes fade-in{from{opacity:.7}to{opacity:1}}`}</style>
    </div>
  );
};

const UpcomingEventCardShimmer: React.FC = () => (
  <div className="w-96 h-80 flex-shrink-0 bg-gray-900/50 rounded-lg p-6 flex flex-col justify-between">
    <div>
      <div className="h-4 w-1/3 rounded-md shimmer-placeholder mb-3" />
      <div className="h-8 w-3/4 rounded-md shimmer-placeholder" />
    </div>
    <div className="h-4 w-1/4 rounded-md shimmer-placeholder self-end" />
  </div>
);

const EventsPageShimmer: React.FC = () => (
  <div className="pt-24 pb-16 md:pb-20 bg-gray-100 dark:bg-transparent min-h-screen">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="h-12 w-3/5 rounded-md shimmer-placeholder mx-auto" />
        <div className="h-6 w-2/5 rounded-md shimmer-placeholder mx-auto mt-4" />
      </div>
      <div className="mb-20">
        <div className="h-10 w-1/3 rounded-md shimmer-placeholder mb-8" />
        <div className="flex gap-8 py-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 h-96 rounded-lg shimmer-placeholder" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-10 w-1/3 rounded-md shimmer-placeholder mb-8" />
        <div className="flex gap-8 py-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <UpcomingEventCardShimmer key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);


const EventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  const { ref: titleRef } = useScrollAnimation<HTMLDivElement>();
  const { ref: pastEventsRef } = useScrollAnimation<HTMLElement>();
  const { ref: upcomingEventsRef } = useScrollAnimation<HTMLElement>();

  const pastEventsContainerRef = useRef<HTMLDivElement>(null);
  const upcomingEventsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
        const scrollAmount = ref.current.clientWidth * 0.8;
        ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleEventClick = (event: PastEvent) => {
    setSelectedEvent(event);
    setIsModalLoading(true);
    // Simulate loading modal content
    setTimeout(() => setIsModalLoading(false), 500);
  };

  const handleCloseModal = () => setSelectedEvent(null);
  
  useEffect(() => {
    const container = pastEventsContainerRef.current;
    if (!container || loading) return;
    let scrollInterval: number;
    const startScrolling = () => {
      scrollInterval = window.setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth / 2) container.scrollLeft = 0;
        else container.scrollLeft += 1;
      }, 25);
    };
    const stopScrolling = () => clearInterval(scrollInterval);
    container.addEventListener('mouseenter', stopScrolling);
    container.addEventListener('mouseleave', startScrolling);
    startScrolling();
    return () => {
      stopScrolling();
      if (container) {
        container.removeEventListener('mouseenter', stopScrolling);
        container.removeEventListener('mouseleave', startScrolling);
      }
    };
  }, [loading]);

  if (loading) {
    return <EventsPageShimmer />;
  }

  return (
    <div className="pt-24 pb-16 md:pb-20 bg-gray-100 dark:bg-transparent min-h-screen overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div ref={titleRef} className="scroll-animate zoom-in text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold font-orbitron text-gray-900 dark:text-white">Club Events</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Moments we've created and what's next.</p>
        </div>

        <>
          <section ref={pastEventsRef} className="scroll-animate slide-up mb-20">
            <h2 className="text-4xl font-bold font-orbitron mb-8 dark:text-white text-gray-900">Past Events</h2>
            <div className="relative group -mx-6 px-6">
               <button onClick={() => scrollCarousel(pastEventsContainerRef, 'left')} aria-label="Scroll left" className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/50 text-white rounded-full p-3 hover:bg-gray-800/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <div ref={pastEventsContainerRef} className="flex gap-8 py-4 overflow-x-auto scroll-smooth hide-scrollbar">
                {[...pastEvents, ...pastEvents].map((event, index) => (
                  <div key={`${event.id}-${index}`} className="group flex-shrink-0 w-80 perspective-1000 cursor-pointer" onClick={() => handleEventClick(event)}>
                    <div className="relative w-full h-96 rounded-lg shadow-xl overflow-hidden transform-style-3d transition-all duration-500 group-hover:rotate-y-3 group-hover:scale-105 active:scale-100 group-hover:shadow-2xl group-hover:shadow-cyan-500/40">
                      <ImageWithShimmer src={event.images[0]} alt={event.title} className="absolute inset-0 w-full h-full object-cover" wrapperClassName="w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                        <p className="text-gray-300 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
               <button onClick={() => scrollCarousel(pastEventsContainerRef, 'right')} aria-label="Scroll right" className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/50 text-white rounded-full p-3 hover:bg-gray-800/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </section>

          <section ref={upcomingEventsRef} className="scroll-animate slide-up">
            <h2 className="text-4xl font-bold font-orbitron mb-8 dark:text-white text-gray-900">Upcoming Events</h2>
            <div className="relative group -mx-6 px-6">
              <button onClick={() => scrollCarousel(upcomingEventsContainerRef, 'left')} aria-label="Scroll left" className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/50 text-white rounded-full p-3 hover:bg-gray-800/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <div ref={upcomingEventsContainerRef} className="flex gap-8 py-4 overflow-x-auto scroll-smooth hide-scrollbar">
                {upcomingEvents.map((event, index) => {
                  const isFlipped = flippedCardId === event.id;
                  return (
                    <div 
                      key={event.id} 
                      className="group perspective-1000 transition-transform active:scale-[0.98] w-96 flex-shrink-0 cursor-pointer" 
                      style={{transitionDelay: `${index * 150}ms`}}
                      onClick={() => setFlippedCardId(isFlipped ? null : event.id)}
                    >
                      <div className={`relative w-full h-80 rounded-lg shadow-xl transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-blue-900 rounded-lg backface-hidden flex flex-col justify-between p-6">
                            <div><span className="text-sm font-bold text-cyan-300">{event.date}</span><h3 className="text-3xl font-bold text-white mt-2">{event.title}</h3></div>
                            <span className="self-end text-white/70">Click to see details</span>
                        </div>
                        <div className="absolute inset-0 w-full h-full bg-gray-800 rounded-lg backface-hidden rotate-y-180 p-6 flex flex-col justify-center">
                            <h4 className="text-xl font-bold text-white mb-4">Event Highlights</h4>
                            <ul className="space-y-3">{event.details.map((detail, i) => (<li key={i} className="flex items-center text-gray-300"><span className="mr-3 text-lg">{detail.icon}</span><span>{detail.text}</span></li>))}</ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => scrollCarousel(upcomingEventsContainerRef, 'right')} aria-label="Scroll right" className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/50 text-white rounded-full p-3 hover:bg-gray-800/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </section>
        </>
      </div>
       <PastEventModal event={selectedEvent} onClose={handleCloseModal} isLoading={isModalLoading} />
       <style>{`.perspective-1000{perspective:1000px}.transform-style-3d{transform-style:preserve-3d}.backface-hidden{-webkit-backface-visibility:hidden;backface-visibility:hidden}.rotate-y-180{transform:rotateY(180deg)}.group-hover\\:rotate-y-180:hover{transform:rotateY(180deg)}.group-hover\\:rotate-y-3:hover{transform:rotateY(3deg)}.line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}`}</style>
    </div>
  );
};

export default EventsPage;