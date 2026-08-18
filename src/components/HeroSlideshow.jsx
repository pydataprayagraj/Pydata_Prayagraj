import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const slides = [
  {
    src: '/glance/University.png',
    title: 'University of Allahabad',
    subtitle: 'Center of learning & research in Prayagraj'
  },
  {
    src: '/glance/sangam.jpg',
    title: 'Triveni Sangam',
    subtitle: 'Confluence of sacred rivers'
  },
  {
    src: '/glance/naini_bridge.jpg',
    title: 'New Naini Bridge',
    subtitle: 'Iconic cable-stayed bridge spanning Yamuna'
  },
  {
    src: '/glance/mandapam.png',
    title: 'Mandapam & Heritage',
    subtitle: 'Architectural beauty of Prayagraj'
  },
  {
    src: '/glance/High_Court.png',
    title: 'High Court',
    subtitle: 'Global gathering of culture & community'
  }
];

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden group z-0">
      {/* Slides images */}
      {slides.map((slide, idx) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <img
            src={slide.src}
            alt={slide.title}
            className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          {/* Subtle light vignette & shadow gradient overlay for bright, light-opaque readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/20 to-slate-900/30"></div>


          {/* Caption Overlay Badge at bottom left */}
          <div className="absolute bottom-3 sm:bottom-6 left-4 sm:left-12 max-w-[calc(100%-80px)] sm:max-w-md z-20 text-white pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-mono font-semibold text-white shadow-md mb-1">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-300 shrink-0" />
              <span className="truncate">{slide.title}</span>
            </div>
            <p className="text-[11px] sm:text-sm font-medium text-slate-300 drop-shadow-sm truncate">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Manual Slide Controls */}
      <button
        onClick={goToPrev}
        className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-3 sm:bottom-6 right-4 sm:right-12 z-20 flex items-center gap-1.5 sm:gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 sm:w-8 bg-white shadow-md' : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>



    </div>
  );

}
