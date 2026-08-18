import React, { useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';


const pydataVideos = [
  {
    id: 'J8cVPXnafos',
    title: 'What is PyData?',
    channel: 'NumFOCUS & PyData',
    duration: '3:45',
    url: 'https://youtu.be/J8cVPXnafos',
    thumbnail: 'https://img.youtube.com/vi/J8cVPXnafos/maxresdefault.jpg',
    description: 'An introduction to PyData global open-source community for developers, researchers, and data tools.'
  },
  {
    id: 'v4xO9bW_wQ0',
    title: 'Python Data Science Ecosystem',
    channel: 'PyData Conference',
    duration: '14:20',
    url: 'https://youtu.be/v4xO9bW_wQ0',
    thumbnail: 'https://img.youtube.com/vi/v4xO9bW_wQ0/maxresdefault.jpg',
    description: 'Keynote on NumPy, Pandas, Scikit-Learn, and the future of scientific computing in Python.'
  },
  {
    id: 'hDKi8gT5Fk0',
    title: 'Building Open Source Data Tools',
    channel: 'PyData Global',
    duration: '25:10',
    url: 'https://youtu.be/hDKi8gT5Fk0',
    thumbnail: 'https://img.youtube.com/vi/hDKi8gT5Fk0/maxresdefault.jpg',
    description: 'How community contributions power modern machine learning and AI infrastructure.'
  },
  {
    id: 'rfscVS0vtbw',
    title: 'Machine Learning with Python',
    channel: 'PyData Talks',
    duration: '18:40',
    url: 'https://youtu.be/rfscVS0vtbw',
    thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
    description: 'Practical guide to data modeling, evaluation, and scalable machine learning workflows.'
  },
  {
    id: 'G9b4pvh5X18',
    title: 'PyData Community & Open Science',
    channel: 'NumFOCUS',
    duration: '12:15',
    url: 'https://youtu.be/G9b4pvh5X18',
    thumbnail: 'https://img.youtube.com/vi/G9b4pvh5X18/maxresdefault.jpg',
    description: 'Fostering inclusive, collaborative data science ecosystems across local chapters worldwide.'
  }
];

export default function VideoCarousel() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 w-full">

      {/* Section Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center gap-1.5">
            <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> PyData Video Showcase
          </span>

          <h2 className="text-3xl font-bold text-slate-900 font-heading">
            Learn from global PyData talks.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl">
            Explore curated talks, tutorials, and community spotlights from PyData conferences around the world.
          </p>
        </div>

        {/* Scroll Controls Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 shadow-2xs flex items-center justify-center transition-all active:scale-95"
            aria-label="Scroll videos left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 shadow-2xs flex items-center justify-center transition-all active:scale-95"
            aria-label="Scroll videos right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {pydataVideos.map((video) => (
          <article
            key={video.id}
            className="snap-start shrink-0 w-[260px] sm:w-[350px] bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >

            {/* Video Thumbnail Box */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
                aria-label={`Watch ${video.title} on YouTube`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium">
                  {video.duration}
                </div>
              </a>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold block">
                  {video.channel}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {video.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>Watch talk</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
