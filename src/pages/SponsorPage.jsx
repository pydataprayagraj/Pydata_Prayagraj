import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, ExternalLink } from 'lucide-react';

export default function SponsorPage() {
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
            <Handshake className="w-3.5 h-3.5" /> Partnerships
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Back the people building with data.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Partner with a thoughtful local community for learning, open source, and practical technology.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-16">
        
        {/* Our Sponsors Section */}
        <section className="space-y-6 w-full">
          <div className="max-w-3xl space-y-2">
            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest font-bold">Our Sponsors</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">In good company.</h2>
            <p className="text-slate-600 text-base">
              Confirmed sponsor names and marks will appear here after agreements are in place.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-sm flex items-start gap-3 shadow-xs">
            <span className="font-bold text-amber-800 shrink-0 font-mono uppercase tracking-wider text-xs bg-amber-200 px-2 py-0.5 rounded">Partner space available</span>
            <span>This section intentionally has no sponsor logos until they are confirmed.</span>
          </div>

          <div>
            <a
              href="#partner"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-blue-600 transition-colors shadow-md"
            >
              <span>Sponsor us</span>
            </a>
          </div>
        </section>

        {/* Why Partner Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-200/80 shadow-md space-y-8 w-full"
        >
          <div className="max-w-3xl space-y-3">
            <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-bold">Why partner</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">Make useful work more accessible.</h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Partners help create opportunities for people to exchange ideas, build confidence, and connect with a wider technical community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider block">Reach</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">Meet curious builders</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Support a community of learners, practitioners, and contributors.
              </p>
            </article>

            <article className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="text-xs font-mono text-amber-600 font-bold uppercase tracking-wider block">Support</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">Enable practical learning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Help make rooms, materials, and programming possible.
              </p>
            </article>

            <article className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider block">Participate</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">Build lasting ties</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Join a conversation grounded in craft and generosity.
              </p>
            </article>
          </div>
        </motion.section>

        {/* Let's Collaborate Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          id="partner" 
          className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 lg:p-16 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full"
        >
          <div className="lg:col-span-4">
            <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-amber-300 font-mono text-sm uppercase font-semibold">
              Let’s collaborate
            </span>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-bold">Want to partner with us?</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading">Start a conversation.</h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Tell us about your organization and the kind of support or collaboration you have in mind. An official partnership contact route will be added here.
            </p>
            <div className="pt-3">
              <a
                href="https://chat.whatsapp.com/EIaEqgTDw5d3zGT04Jsw1E"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors shadow-md"
              >
                <span>Want to partner with us</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
