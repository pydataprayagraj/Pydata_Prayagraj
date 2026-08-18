import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is PyData Prayagraj?',
      a: 'It is a planned local gathering point for people interested in Python, data science, machine learning, research, and open source in and around Prayagraj.'
    },
    {
      q: 'Do I need to be an expert to take part?',
      a: 'No. The intention is to welcome students, professionals, researchers, contributors, and curious beginners. Specific event prerequisites will be listed with each event.'
    },
    {
      q: 'When is the first event?',
      a: 'No date has been announced in this site bundle. Please add an official event listing once a venue, format, and schedule have been confirmed.'
    },
    {
      q: 'How can I speak or volunteer?',
      a: 'Volunteer and speaker submission routes have not been published yet. Add an official contact or form link when it is available.'
    },
    {
      q: 'Is there a code of conduct?',
      a: 'Yes. The chapter should use and publish a finalized code of conduct before events begin. The current draft section is available on the privacy and conduct page.'
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
          <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            A few useful answers.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Information will be refined as the chapter’s plans and official channels are confirmed.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full">
        <div className="space-y-5 w-full">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-8 text-left flex items-center justify-between gap-4 font-bold text-slate-900 font-heading text-xl sm:text-2xl hover:text-blue-600 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div className={`p-2.5 rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-8 pb-8 text-slate-600 text-base sm:text-lg leading-relaxed border-t border-slate-100 pt-5 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
