import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Camera, Filter } from 'lucide-react';

export default function AlbumsPage() {
  const [filter, setFilter] = useState('all');

  const albums = [
    {
      id: 1,
      category: 'meetup',
      title: 'Future community meetup',
      subtitle: 'Date and venue to be added after confirmation.',
      tag: 'Meetup'
    },
    {
      id: 2,
      category: 'workshop',
      title: 'Future hands-on workshop',
      subtitle: 'Replace with a real album after the event.',
      tag: 'Workshop'
    },
    {
      id: 3,
      category: 'meetup',
      title: 'Future speaker session',
      subtitle: 'Photographer credit and accessibility alt text pending.',
      tag: 'Meetup'
    }
  ];

  const filteredAlbums = filter === 'all' ? albums : albums.filter(a => a.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-light pb-16 pt-20">
      {/* Page Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-slate-200/80 py-12 sm:py-16 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="w-full space-y-3">
          <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-semibold">Archive</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Moments in the room.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Event photography will be collected here after official chapter gatherings. Each block is a replaceable image area—not a fabricated event record.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-8">
        {/* Notice Card */}
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-sm flex items-start gap-3 shadow-xs">
          <span className="font-bold text-amber-700 whitespace-nowrap font-mono uppercase text-xs bg-amber-200 px-2 py-0.5 rounded">No albums published yet</span>
          <span>Replace each placeholder with a real image URL and the corresponding verified date, event name, and photographer credit.</span>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          {['all', 'meetup', 'workshop'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-mono font-semibold rounded-xl capitalize transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {f === 'all' ? 'All' : f === 'meetup' ? 'Meetups' : 'Workshops'}
            </button>
          ))}
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredAlbums.map((album, idx) => (
            <motion.article 
              key={album.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Art Placeholder */}
              <div className="h-56 bg-slate-100 border-b border-slate-100 flex flex-col items-center justify-center text-slate-400 group-hover:bg-blue-50/50 transition-colors">
                <Camera className="w-12 h-12 mb-3 stroke-1 group-hover:text-blue-500 transition-colors" />
                <span className="font-mono text-xs text-slate-500 font-medium">Image placeholder</span>
              </div>

              {/* Copy */}
              <div className="p-8 space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono uppercase tracking-wider font-semibold">
                  {album.tag}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 font-heading">{album.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{album.subtitle}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
