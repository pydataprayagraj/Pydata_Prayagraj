import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Clock, Video, Play, User, Tag, Sparkles, Film, X } from 'lucide-react';
import { fetchJournals, formatDate } from '../services/api';

function getYouTubeThumbnail(url) {
  if (!url) return null;
  const str = String(url).trim();
  if (str.includes('youtube.com/watch')) {
    try {
      const videoId = new URL(str).searchParams.get('v');
      if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch (e) {}
  }
  if (str.includes('youtu.be/')) {
    const videoId = str.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  if (str.includes('youtube.com/shorts/')) {
    const videoId = str.split('youtube.com/shorts/')[1]?.split('?')[0];
    if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let str = String(url).trim();
  if (str.includes('youtube.com/watch')) {
    try {
      const videoId = new URL(str).searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch (e) {}
  }
  if (str.includes('youtu.be/')) {
    const videoId = str.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (str.includes('youtube.com/shorts/')) {
    const videoId = str.split('youtube.com/shorts/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return str;
}

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideoPost, setSelectedVideoPost] = useState(null);

  useEffect(() => {
    async function loadJournals() {
      setLoading(true);
      const data = await fetchJournals();
      setJournals(data || []);
      setLoading(false);
    }
    loadJournals();
  }, []);

  const categories = ['All', 'Video', 'Talk', 'Tutorial', 'Recap', 'Announcement'];

  const filteredPosts = activeCategory === 'All'
    ? journals
    : journals.filter(j => (j.tag || '').toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-light pb-20 pt-20">
      {/* Page Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-slate-200/80 py-12 sm:py-16 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-xs">
              <Film className="w-3.5 h-3.5 text-blue-600" /> PyData Journal & Video Hub
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight font-heading">
            Technical Talks & Community Video Posts
          </h1>

          <p className="text-slate-600 text-base sm:text-xl max-w-3xl leading-relaxed">
            Watch tech talks, recorded workshops, community announcements, and articles from PyData Prayagraj.
          </p>
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
      <section className="py-8 px-6 sm:px-12 lg:px-16 xl:px-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Journal Cards Grid */}
      <section className="px-6 sm:px-12 lg:px-16 xl:px-20 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-amber-500 animate-spin mx-auto"></div>
            <p className="text-sm font-mono text-slate-500">Loading Cloudinary video journal entries...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="p-4 rounded-full bg-blue-50 text-blue-600 w-16 h-16 mx-auto flex items-center justify-center">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">No Journal Entries Found</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {activeCategory === 'All'
                ? 'No journal video posts have been published yet. Check back soon for community talks, tutorials, and recorded sessions!'
                : `No posts found under the '${activeCategory}' category.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post, idx) => {
                const ytThumb = getYouTubeThumbnail(post.videoUrl);
                const displayThumb = ytThumb || post.coverImage || '/pydata-community-hero.jpg';

                return (
                  <motion.article
                    key={post.id || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    onClick={() => post.videoUrl && setSelectedVideoPost(post)}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                  >
                    {/* Media / Video Thumbnail Header with Play Button */}
                    <div className="relative h-56 overflow-hidden bg-slate-950 flex items-center justify-center group">
                      <img
                        src={displayThumb}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />

                      {/* Dark Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>

                      {/* Interactive Play Button Overlay */}
                      {post.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-2 border-white">
                            <Play className="w-6 h-6 fill-white translate-x-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content Body - Centered Title & Description */}
                    <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-5 text-center">
                      <div className="space-y-3">
                        {/* Meta Category Tag */}
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider border border-blue-200/60">
                            <Tag className="w-3 h-3 text-blue-600" />
                            {post.tag || 'Video'}
                          </span>
                        </div>

                        {/* Centered Post Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors text-center">
                          {post.title}
                        </h3>

                        {/* Centered Description */}
                        <p className="text-sm text-slate-600 leading-relaxed text-center line-clamp-3">
                          {post.description}
                        </p>
                      </div>

                      {/* Card Footer Metadata */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{post.author || 'PyData Team'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* LARGE THEATER VIDEO POPUP MODAL */}
      <AnimatePresence>
        {selectedVideoPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 select-none">
            
            {/* Dark Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideoPost(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Theater Video Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl z-10 space-y-4"
            >
              {/* Top Modal Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {selectedVideoPost.tag || 'Video Post'}
                  </span>
                  <h2 className="text-base sm:text-xl font-bold text-white font-heading line-clamp-1">
                    {selectedVideoPost.title}
                  </h2>
                </div>
                
                <button
                  onClick={() => setSelectedVideoPost(null)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-lg"
                  title="Close Video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theater Video Player Window */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                {selectedVideoPost.videoUrl?.includes('youtube.com') || selectedVideoPost.videoUrl?.includes('youtu.be') ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideoPost.videoUrl)}
                    title={selectedVideoPost.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={selectedVideoPost.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    poster={selectedVideoPost.coverImage || undefined}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Bottom Video Info & Description */}
              <div className="p-5 sm:p-6 space-y-2 bg-slate-950 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedVideoPost.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Presenter: <strong className="text-slate-300">{selectedVideoPost.author || 'PyData Team'}</strong></span>
                  <span>Published: {formatDate(selectedVideoPost.date)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
