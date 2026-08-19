import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSlideshow from '../components/HeroSlideshow';
import VideoCarousel from '../components/VideoCarousel';
import { fetchEvents, formatDate } from '../services/api';
import {
  Sparkles,
  BookOpen,
  Users,
  Heart,
  ArrowUpRight,
  Play,
  Calendar,
  Activity,
  ChevronRight,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await fetchEvents();
      setEvents(data);
    }
    loadEvents();
  }, []);

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.85 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-light pb-16 overflow-x-hidden">

      {/* Hero Showcase Section with Diamond Framed Auto-Changing Images */}
      <section className="relative w-full pt-20 sm:pt-28 pb-8 sm:pb-12 bg-white border-b border-slate-200/60 overflow-hidden">
        <HeroSlideshow />
      </section>


      {/* Intro Section: Why PyData */}
      <motion.section
        {...fadeInUp}
        className="py-16 sm:py-24 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-200/80 shadow-md relative overflow-hidden w-full">

          <div className="max-w-4xl mb-12 space-y-4 relative z-10">
            <span className="text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-slate-900" /> Why PyData
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
              A room for better questions.
            </h2>
            <p className="text-slate-600 text-base sm:text-xl leading-relaxed">
              PyData is a global community for users and developers of data tools in Python. In Prayagraj, we are making space for practical learning, generous exchange, and work that reaches beyond the screen.
            </p>
          </div>

          {/* 3 Pillars with Monochrome Card Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                num: '01',
                title: 'Learn openly',
                desc: 'From first notebooks to production systems, concepts become clearer when shared.'
              },
              {
                num: '02',
                title: 'Build together',
                desc: 'Meet collaborators, trade perspective, and make room for useful experiments.'
              },
              {
                num: '03',
                title: 'Include deliberately',
                desc: 'A respectful, welcoming community for people at every stage of their work.'
              }
            ].map((pillar, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="p-8 sm:p-10 rounded-3xl bg-slate-50/90 border border-slate-200/80 hover:border-slate-900 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-mono font-bold text-lg flex items-center justify-center mb-6 transition-colors shadow-sm">
                  {pillar.num}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 font-heading group-hover:text-slate-950 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Big About PyData Showcase Section with Circular Emblem Logo on Left */}
      <motion.section
        {...fadeInUp}
        className="py-16 sm:py-24 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-200/80 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden w-full">
          {/* Left Hand Side: Circular Emblem Logo */}
          <motion.div
            {...scaleIn}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="relative group">
              <div className="absolute -inset-6 rounded-full bg-slate-900/10 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="relative p-3 rounded-full bg-white border border-slate-300 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                <img
                  src="/pydata-logo-circle.png"
                  alt="PyData Prayagraj Emblem"
                  className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Hand Side: Big Written About PyData */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-slate-900" /> About PyData
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
                Open source, practical data science, & community.
              </h2>
            </div>

            <div className="space-y-4 text-slate-600 text-base sm:text-xl leading-relaxed">
              <p>
                <strong className="text-slate-900 font-semibold">PyData</strong> is an educational program of <strong className="text-slate-900 font-bold underline">NumFOCUS</strong>, a 501(c)(3) non-profit organization in the United States. It provides a forum for the international community of users and developers of data analysis tools to share ideas and learn from one another.
              </p>
              <p>
                In <strong className="text-slate-900 font-semibold">Prayagraj</strong>, PyData is establishing a vibrant local gathering space for students, researchers, developers, and industry practitioners working with Python, Machine Learning, Open Source, and Data Science.
              </p>
              <p>
                Whether you are writing your first lines of Pandas code or building large-scale AI systems, PyData Prayagraj is dedicated to offering practical learning, generous exchange, and a welcoming environment for everyone.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
              <a
                href="https://chat.whatsapp.com/EIaEqgTDw5d3zGT04Jsw1E"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-md transition-all active:scale-95 group"
              >
                <span>Join PyData Prayagraj</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://pydata.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-base transition-all border border-slate-300"
              >
                <span>Explore PyData Global</span>
                <ArrowUpRight className="w-5 h-5 opacity-75" />
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* The Chapter Section */}
      <motion.section
        {...fadeInUp}
        className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="space-y-8 w-full">
          <div className="max-w-3xl space-y-2">
            <span className="text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold">The chapter</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">Community Milestones</h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Growing an active data science, AI, and open-source developer ecosystem across Prayagraj.
            </p>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Community members', val: '5' },
              { label: 'Events hosted', val: '0' },
              { label: 'Volunteer speakers', val: '0' },
              { label: 'Workshops', val: '0' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center shadow-xs hover:shadow-md hover:border-amber-500 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="block text-4xl sm:text-5xl font-mono font-extrabold text-slate-900 mb-2">{stat.val}</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider font-mono">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Global PyData Video Showcase Carousel */}
      <motion.section
        {...fadeInUp}
        className="py-16 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <VideoCarousel />
      </motion.section>



      {/* Stay Close / Social Join Cards */}
      <motion.section
        {...fadeInUp}
        id="join"
        className="py-16 px-6 sm:px-12 lg:px-16 xl:px-20 w-full"
      >
        <div className="space-y-8 w-full">
          <div className="max-w-3xl space-y-2">
            <span className="text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold">Stay close</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">Be here from the beginning.</h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Official community channels have not been published yet. Add verified links in script.js when the chapter is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Meetup Card */}
            <motion.a
              href="https://www.meetup.com/pydata-prayagraj/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-red-50/60 via-white to-white border border-red-200/80 shadow-xs hover:shadow-xl hover:border-red-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-red-600 bg-red-100/90 px-3 py-1 rounded-lg font-bold">
                  Meetup
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading group-hover:text-red-600 transition-colors">Events and RSVPs</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Join our official Meetup group to RSVP for upcoming events, workshops, and gatherings.
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white bg-[#f26522] hover:bg-[#d95517] px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20">
                  <span>Join on Meetup</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </motion.a>

            {/* LinkedIn Card */}
            <motion.a
              href="https://www.linkedin.com/search/results/all/?keywords=PyData%20Prayagraj&origin=RICH_QUERY_TYPEAHEAD_HISTORY&heroEntityKey=urn%3Ali%3Aorganization%3A143293110&position=0"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-sky-50/60 via-white to-white border border-sky-200/80 shadow-xs hover:shadow-xl hover:border-sky-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-700 bg-sky-100/90 px-3 py-1 rounded-lg font-bold">
                  <svg className="w-4 h-4 fill-sky-700" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" /></svg> LinkedIn
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading group-hover:text-sky-600 transition-colors">Community news</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Follow PyData Prayagraj on LinkedIn for technical posts, speaker spotlights, and chapter news.
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white bg-[#0A66C2] hover:bg-[#084e96] px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-sky-500/20">
                  <span>Follow on LinkedIn</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </motion.a>

            {/* Instagram Card */}
            <motion.a
              href="https://instagram.com/pydata.prayagraj"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-purple-50/60 via-pink-50/30 to-white border border-purple-200/80 shadow-xs hover:shadow-xl hover:border-pink-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-purple-700 bg-purple-100/90 px-3 py-1 rounded-lg font-bold">
                  <svg className="w-4 h-4 fill-purple-700" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> Instagram
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading group-hover:text-purple-600 transition-colors">From the room</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Catch event highlights, community photos, behind-the-scenes moments, and announcements.
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-purple-500/20">
                  <span>Follow on Instagram</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </motion.a>

          </div>
        </div>
      </motion.section>

    </div>
  );
}
