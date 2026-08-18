import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';

export default function EventsPage() {
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
          <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Events
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Gather around the work.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Talks, workshops, and conversations for the local Python and data community.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/80 shadow-md overflow-hidden w-full"
        >
          {/* Image Art Placeholder */}
          <div className="lg:col-span-6 bg-slate-100 min-h-[300px] sm:min-h-[380px] flex flex-col items-center justify-center p-8 text-slate-400 border-b lg:border-b-0 lg:border-r border-slate-200">
            <Calendar className="w-20 h-20 mb-4 stroke-1 text-slate-400" />
            <span className="font-mono text-xs text-slate-500 font-medium">Event image placeholder</span>
          </div>

          {/* Copy & CTA */}
          <div className="lg:col-span-6 p-8 lg:p-14 flex flex-col justify-center space-y-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold w-fit">
              Coming soon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Next PyData Prayagraj event
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Event title, date, venue, description, and a real event image will be published here once the programme is confirmed.
            </p>
            <div className="pt-4">
              <a
                href="https://chat.whatsapp.com/EIaEqgTDw5d3zGT04Jsw1E"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md transition-all active:scale-95"
              >
                <span>Stay informed</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
