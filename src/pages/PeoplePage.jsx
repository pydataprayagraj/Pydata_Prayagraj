import React from 'react';
import { motion } from 'framer-motion';
import { Users, ExternalLink, HeartHandshake, Award } from 'lucide-react';

export default function PeoplePage() {
  const organizers = [
    { name: 'Priyankar Shukla', role: 'Organizer', initials: 'PS' },
    { name: 'Animesh Pathak', role: 'Co-Organizer', initials: 'AP' },
    { name: 'Aryan Dubey', role: 'Co-Organizer', initials: 'AD' },
    { name: 'Shivansh Dubey', role: 'Co-Organizer', initials: 'SD' },
    { name: 'Suryansh Tripathi', role: 'Co-Organizer', initials: 'ST' },
  ];

  const volunteers = Array(5).fill({ name: 'Volunteer name', role: 'Volunteer', initials: 'VN' });
  const ambassadors = Array(5).fill({ name: 'Ambassador name', role: 'Ambassador', initials: 'AN' });

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
            <Users className="w-3.5 h-3.5" /> Organizers & contributors
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            People make the programme.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            The named team will be introduced here after each person has agreed to be listed publicly.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-16">
        
        {/* Organizers Section */}
        <section className="space-y-6 w-full">
          <div>
            <span className="text-blue-600 font-mono text-xs uppercase tracking-widest font-bold">Community</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Organizers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {organizers.map((person, idx) => (
              <motion.article 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-500 text-white flex items-center justify-center text-2xl font-bold font-mono shadow-md group-hover:scale-105 transition-transform">
                  {person.initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">{person.name}</h3>
                  <p className="text-xs font-mono text-blue-600 font-bold tracking-wider uppercase mt-0.5">{person.role}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <a href="#" className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors" aria-label="GitHub">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
                  </a>
                  <a href="#" className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-slate-200 transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z"/></svg>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-wrap gap-4 items-center">
            <a
              href="https://docs.google.com/forms/d/1DCHkBbmeQlBa0kZMwxC8-x2mj9-QaeDEkdduYqVJLDI/edit?usp=forms_home&ouid=113293290420530468365&ths=true&pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-blue-600 transition-all shadow-md active:scale-95"
            >
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <span>Be a Volunteer</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>

            <a
              href="https://forms.gle/DzxfTmGYXoZQLcrm6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-slate-800 border border-slate-200 font-bold text-base hover:bg-slate-100 transition-all shadow-xs active:scale-95"
            >
              <Award className="w-5 h-5 text-blue-600" />
              <span>Join as an Ambassador</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>
          </div>
        </section>

        {/* Volunteers Section */}
        <section className="space-y-6 w-full">
          <div>
            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest font-bold">Community</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Volunteers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {volunteers.map((person, idx) => (
              <motion.article 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm font-bold font-mono border border-slate-200/60">
                  {person.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">{person.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{person.role}</p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors" aria-label="GitHub">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z"/></svg>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Ambassadors Section */}
        <section className="space-y-6 w-full">
          <div>
            <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-bold">Community</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Ambassadors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {ambassadors.map((person, idx) => (
              <motion.article 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold font-mono border border-amber-200/60">
                  {person.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">{person.name}</h3>
                  <p className="text-xs font-mono text-amber-700">{person.role}</p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors" aria-label="GitHub">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z"/></svg>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
