import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, MapPin, Sparkles, X, ZoomIn, ArrowUpRight, Clock } from 'lucide-react';
import { fetchEvents, formatDate } from '../services/api';

const DEFAULT_EVENT_BANNER = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      const data = await fetchEvents();
      setEvents(data || []);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const featuredEvent = events.length > 0 ? events[0] : null;
  const smallEvents = events.length > 1 ? events.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-light pb-16 pt-20">
      {/* Page Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-slate-200/80 py-10 sm:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="w-full space-y-2">
          <span className="text-[#f26522] font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> PyData Gatherings & Events
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Gather around open source.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Keynotes, technical workshops, and community recorded meetups in Prayagraj.
          </p>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <section className="py-10 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-12">
        
        {/* NO EVENTS EMPTY STATE */}
        {!loading && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-md">
              <Calendar className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
                More Events Happening Soon!
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans max-w-lg mx-auto">
                There will be more events happening soon, please be connected with us!
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://www.meetup.com/pydata-prayagraj/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 group"
              >
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>Join Us on Meetup</span>
                <ExternalLink className="w-5 h-5 opacity-80" />
              </a>
            </div>
          </motion.div>
        )}

        {/* 1. CURRENT / UPCOMING FEATURED EVENT (TOP SECTION) */}
        {featuredEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">Current / Featured Event</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl overflow-hidden w-full group hover:shadow-2xl transition-all duration-300"
            >
              {/* Left Side: Large Featured Image Banner */}
              <div
                onClick={() => setFullScreenImage({ url: featuredEvent.imageUrl || DEFAULT_EVENT_BANNER, title: featuredEvent.title })}
                className="lg:col-span-6 bg-slate-950 min-h-[320px] sm:min-h-[400px] relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 cursor-pointer group/banner"
              >
                <img
                  src={featuredEvent.imageUrl || DEFAULT_EVENT_BANNER}
                  alt={featuredEvent.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-mono font-bold z-10 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{featuredEvent.category || 'Featured Event'}</span>
                </div>

                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-950 font-mono font-bold text-xs shadow-2xl flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-amber-600" />
                    <span>Click for Full View</span>
                  </span>
                </div>
              </div>

              {/* Right Side: Full Featured Details */}
              <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-mono font-bold">
                      {featuredEvent.status || 'Current'}
                    </span>
                    {featuredEvent.date && (
                      <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {formatDate(featuredEvent.date)}
                      </span>
                    )}
                    <span className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {featuredEvent.location}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
                    {featuredEvent.title}
                  </h2>

                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    {featuredEvent.description}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={featuredEvent.rsvpUrl || "https://www.meetup.com/pydata-prayagraj/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-[#f26522] text-white font-extrabold text-base shadow-lg transition-all active:scale-95 group"
                  >
                    <span>{featuredEvent.rsvpUrl ? 'RSVP via Google Form' : 'RSVP & Event Details'}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. COMPACT 5-PER-ROW GRID SECTION FOR ALL OTHER EVENTS */}
        {smallEvents.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Earlier & Upcoming Gatherings
              </h3>
              <span className="text-xs font-mono text-slate-500">Total: {smallEvents.length} events</span>
            </div>

            {/* 5 COLUMNS GRID (1 column mobile, 2 tablet, 3 desktop, 5 widescreen) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {smallEvents.map((evt, idx) => {
                const imgUrl = evt.imageUrl || DEFAULT_EVENT_BANNER;
                return (
                  <motion.div
                    key={evt.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3 group"
                  >
                    {/* Top Compact Thumbnail */}
                    <div 
                      onClick={() => setFullScreenImage({ url: imgUrl, title: evt.title })}
                      className="relative h-36 rounded-xl overflow-hidden bg-slate-950 cursor-pointer group/thumb"
                    >
                      <img
                        src={imgUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                        {evt.category || 'Event'}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        {evt.date && (
                          <span className="text-[11px] font-mono text-[#f26522] font-bold flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" /> {formatDate(evt.date)}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#f26522] transition-colors">
                          {evt.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 pt-1 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="pt-2">
                        <a
                          href={evt.rsvpUrl || "https://www.meetup.com/pydata-prayagraj/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-mono font-bold transition-all shadow-xs"
                        >
                          <span>RSVP Event</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </section>

      {/* FULL WINDOW IMAGE LIGHTBOX POPUP MODAL */}
      <AnimatePresence>
        {fullScreenImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setFullScreenImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
                <span className="text-sm font-mono font-bold text-amber-400 truncate">
                  {fullScreenImage.title || 'PyData Event Banner'}
                </span>
                <button
                  onClick={() => setFullScreenImage(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto flex-1 max-h-[80vh]">
                <img
                  src={fullScreenImage.url}
                  alt={fullScreenImage.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
