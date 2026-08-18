import React from 'react';
import { motion } from 'framer-motion';
import { Feather, Clock } from 'lucide-react';

export default function JournalPage() {
  const posts = [
    {
      id: 1,
      tag: 'Coming soon',
      title: 'A community launch note',
      description: 'A space reserved for an official introduction from the organizers.',
      meta: 'Author · date pending'
    },
    {
      id: 2,
      tag: 'Coming soon',
      title: 'What we want to learn together',
      description: 'A future editorial piece about the chapter’s initial programme.',
      meta: 'Author · date pending'
    },
    {
      id: 3,
      tag: 'Coming soon',
      title: 'From curiosity to contribution',
      description: 'Reserved for a community member’s real story or technical write-up.',
      meta: 'Author · date pending'
    }
  ];

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
          <span className="text-blue-600 font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5" /> Journal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Notes from a learning community.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Event recaps, useful explanations, and voices from the local data ecosystem will live here.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-8">
        {/* Notice */}
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-sm flex items-start gap-3 shadow-xs">
          <span className="font-bold text-amber-800 shrink-0 font-mono uppercase tracking-wider text-xs bg-amber-200 px-2 py-0.5 rounded">Editorial queue empty</span>
          <span>These are layout placeholders only; publish authored, reviewed posts with real authors and dates here.</span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.article 
              key={post.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider">
                  {post.tag}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading leading-snug">{post.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{post.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Clock className="w-4 h-4" />
                <span>{post.meta}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
