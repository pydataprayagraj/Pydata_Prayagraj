import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ExternalLink, HeartHandshake, Award, X, Sparkles } from 'lucide-react';
import { fetchTeam } from '../services/api';

export default function PeoplePage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    async function loadTeam() {
      const data = await fetchTeam();
      setTeamMembers(data);
    }
    loadTeam();
  }, []);

  const organizers = teamMembers.filter(m => m.category === 'organizer' || !m.category);
  const volunteers = teamMembers.filter(m => m.category === 'volunteer');
  const ambassadors = teamMembers.filter(m => m.category === 'ambassador');

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
            Community organizers, dedicated volunteers, and ambassadors shaping PyData Prayagraj. Click any profile to view details.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-16">
        
        {/* Organizers / Core Team Section */}
        <section className="space-y-10 w-full">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 font-mono text-xs uppercase tracking-widest font-extrabold">
              Community Leadership
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
              Core Team & Organizers
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 rounded-full mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {organizers.map((person, idx) => (
              <motion.article 
                key={person.id || idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setSelectedMember(person)}
                className="w-full bg-white p-8 rounded-3xl border-2 border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center space-y-5 group cursor-pointer"
              >
                {person.avatarUrl ? (
                  <img 
                    src={person.avatarUrl} 
                    alt={person.name} 
                    className="w-44 h-44 sm:w-48 sm:h-48 rounded-3xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-500 text-white flex items-center justify-center text-4xl font-black font-mono shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {person.initials || 'PY'}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 font-heading group-hover:text-blue-600 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-sm font-mono text-blue-600 font-extrabold tracking-wider uppercase">
                    {person.role || 'Organizer'}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-mono font-bold mt-1">
                    PyData Prayagraj
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-wrap gap-4 items-center justify-center">
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
        {volunteers.length > 0 && (
          <section className="space-y-10 w-full pt-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-200/80 text-slate-700 font-mono text-xs uppercase tracking-widest font-extrabold">
                Volunteer Force
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
                Dedicated Volunteers
              </h2>
              <div className="w-16 h-1 bg-slate-400 rounded-full mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
              {volunteers.map((person, idx) => (
                <motion.article 
                  key={person.id || idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => setSelectedMember(person)}
                  className="w-full bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer group"
                >
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg font-bold font-mono border border-slate-200/60">
                      {person.initials || 'VL'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-blue-600 transition-colors">{person.name}</h3>
                    <p className="text-xs font-mono text-slate-500">{person.role || 'Volunteer'}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Ambassadors Section */}
        {ambassadors.length > 0 && (
          <section className="space-y-10 w-full pt-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100/80 text-amber-800 font-mono text-xs uppercase tracking-widest font-extrabold">
                Chapter Ambassadors
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
                Community Ambassadors
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
              {ambassadors.map((person, idx) => (
                <motion.article 
                  key={person.id || idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => setSelectedMember(person)}
                  className="w-full bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer group"
                >
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold font-mono border border-amber-200/60">
                      {person.initials || 'AM'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-amber-600 transition-colors">{person.name}</h3>
                    <p className="text-xs font-mono text-amber-700">{person.role || 'Ambassador'}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* BIG BANNER POPUP LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden relative flex flex-col sm:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Big High-Res Banner Image */}
              <div className="w-full sm:w-1/2 bg-slate-900 flex items-center justify-center p-6 min-h-[280px]">
                {selectedMember.avatarUrl ? (
                  <img
                    src={selectedMember.avatarUrl}
                    alt={selectedMember.name}
                    className="w-full h-72 sm:h-80 object-cover rounded-2xl shadow-xl"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-500 text-white flex items-center justify-center text-4xl font-extrabold font-mono shadow-xl">
                    {selectedMember.initials || 'PY'}
                  </div>
                )}
              </div>

              {/* Info & Details Below Banner */}
              <div className="w-full sm:w-1/2 p-8 sm:p-10 flex flex-col justify-center space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>PyData Prayagraj</span>
                </span>

                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
                    {selectedMember.name}
                  </h2>
                  <p className="text-sm font-mono text-blue-600 font-extrabold uppercase tracking-wider mt-1">
                    {selectedMember.role || (selectedMember.category === 'organizer' || !selectedMember.category ? 'Core Team' : selectedMember.category)}
                  </p>
                </div>

                {/* Member Bio / Description */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-mono text-amber-700 font-bold block mb-1 uppercase tracking-widest">
                    About / Description
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
                    {selectedMember.description || `${selectedMember.name} is a key contributor to PyData Prayagraj driving technical workshops, open-source initiatives, and community engagement.`}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 text-xs font-mono text-slate-500 space-y-1">
                  <p>Category: <span className="text-slate-800 font-bold capitalize">{!selectedMember.category || selectedMember.category.toLowerCase() === 'organizer' ? 'Core Team' : selectedMember.category}</span></p>
                  <p>Chapter: <span className="text-slate-800 font-bold">Prayagraj, UP · India</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



