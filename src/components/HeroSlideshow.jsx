import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchHeroImages } from '../services/api';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function HeroSlideshow() {
  const [heroImages, setHeroImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadHero() {
      const imgs = await fetchHeroImages();
      if (Array.isArray(imgs) && imgs.length > 0) {
        setHeroImages(imgs);
      }
    }
    loadHero();

    const pollInterval = setInterval(loadHero, 4000);
    return () => clearInterval(pollInterval);
  }, []);

  const defaultImages = [
    { id: 'default-1', imageUrl: '/pydata-community-hero.jpg', title: 'PyData Community Showcase' }
  ];

  const displayImages = heroImages.length > 0 ? heroImages : defaultImages;
  const currentImage = displayImages[activeIndex % displayImages.length];

  useEffect(() => {
    const total = displayImages.length;
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayImages.length]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

        {/* LEFT COLUMN: Clean, Professional Photo Frame with Subtle Shadow */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <div className="relative w-full max-w-[620px] select-none">
            
            {/* Elegant Background Accent Layer */}
            <div className="absolute -inset-1.5 bg-slate-200/60 rounded-[32px] blur-sm transform -rotate-1 scale-[0.99] pointer-events-none"></div>

            {/* Main Showcase Card matching 16:9 landscape aspect ratio */}
            <div className="relative w-full aspect-[16/9] rounded-3xl p-2.5 sm:p-3 bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] z-10 flex flex-col">
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage.id || activeIndex}
                    src={currentImage.imageUrl}
                    alt={currentImage.title || "PyData Community"}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Subtle Image Title Caption Overlay */}
                {currentImage.title && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-10 text-white pointer-events-none">
                    <p className="text-xs font-medium text-white/90 truncate">{currentImage.title}</p>
                  </div>
                )}
              </div>

              {/* Minimal Pagination Dots */}
              {displayImages.length > 1 && (
                <div className="pt-3 pb-1 flex items-center justify-center gap-1.5">
                  {displayImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeIndex % displayImages.length 
                          ? 'w-6 bg-[#f26522]' 
                          : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Professional Headline & Actions */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#f26522]" /> PyData Prayagraj Chapter
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-heading">
              A community for developers and users of open source data tools
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            An emerging local chapter for developers, researchers, students, and practitioners in Prayagraj who build, learn, and innovate with Python and open-source data tools.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="https://www.meetup.com/pydata-prayagraj/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 group"
            >
              <span>Join the chapter</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/team"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-sm transition-all active:scale-95 shadow-xs"
            >
              <span>Meet the team</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
