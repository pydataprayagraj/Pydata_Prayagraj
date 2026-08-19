import React, { useState } from 'react';
import { Play, Sparkles, ExternalLink, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoCarousel() {
  const [isPlaying, setIsPlaying] = useState(false);

  const officialVideo = {
    id: 'J8cVPXnafos',
    title: 'What is PyData?',
    channel: 'NumFOCUS & PyData Global',
    embedUrl: 'https://www.youtube-nocookie.com/embed/J8cVPXnafos?autoplay=1&rel=0',
    url: 'https://youtu.be/J8cVPXnafos',
    thumbnail: 'https://img.youtube.com/vi/J8cVPXnafos/maxresdefault.jpg',
    description: 'An official introduction to the global PyData community—where developers, scientists, researchers, and practitioners come together to share, build, and innovate with open-source data science tools.'
  };

  return (
    <div className="space-y-6 w-full">
      {/* Section Header */}
      <div className="space-y-2 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-mono text-xs font-bold uppercase tracking-widest">
          <Film className="w-4 h-4 text-amber-600" />
          <span>Official PyData Video</span>
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
          What is PyData?
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Watch the official introduction to the global PyData ecosystem and open-source data science movement.
        </p>
      </div>

      {/* Featured Video Showcase Card - Light Theme */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-xl overflow-hidden max-w-5xl mx-auto relative group"
      >
        {/* Subtle Light Glow Accent */}
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-amber-500/5 blur-3xl pointer-events-none rounded-full"></div>

        {/* Video Player Box */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
          {isPlaying ? (
            <iframe
              src={officialVideo.embedUrl}
              title="What is PyData? Official Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="relative w-full h-full group/thumb cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img
                src={officialVideo.thumbnail}
                alt="What is PyData? Official Video"
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700 opacity-95 group-hover/thumb:opacity-100"
              />
              <div className="absolute inset-0 bg-slate-950/30 group-hover/thumb:bg-slate-950/15 transition-colors flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-2xl border-2 border-white/60 backdrop-blur-md"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1 text-slate-950" />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Video Metadata Below */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold block">
              {officialVideo.channel}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              {officialVideo.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {officialVideo.description}
            </p>
          </div>

          <a
            href={officialVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 shrink-0 group"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
