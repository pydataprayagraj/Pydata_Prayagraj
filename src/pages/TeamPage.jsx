import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ExternalLink, HeartHandshake, Award, X, Sparkles, Shield, UserCheck, Heart } from 'lucide-react';
import { fetchTeam } from '../services/api';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    async function loadTeam() {
      const data = await fetchTeam();
      setTeamMembers(data);
    }
    loadTeam();
  }, []);

  const organizers = teamMembers.filter(m => m.category === 'organizer' || (!m.category && !['core_team', 'core', 'volunteer', 'ambassador'].includes(m.category)));
  const coreTeam = teamMembers.filter(m => m.category === 'core_team' || m.category === 'core');
  const volunteers = teamMembers.filter(m => m.category === 'volunteer');
  const ambassadors = teamMembers.filter(m => m.category === 'ambassador');

  const getCategoryLabel = (category) => {
    if (category === 'core_team' || category === 'core') return 'Core Team';
    if (category === 'volunteer') return 'Volunteer';
    if (category === 'ambassador') return 'Ambassador';
    return 'Organizer';
  };

  const getMainRole = (person) => {
    if (!person) return '';
    if (person.role && person.role.includes(' - ') && !person.subRole) {
      return person.role.split(' - ')[0].trim();
    }
    return person.role || 'Organizer';
  };

  const getSubRole = (person) => {
    if (!person) return null;
    if (person.subRole && person.subRole.trim()) {
      return person.subRole.trim();
    }
    if (person.role && person.role.includes(' - ')) {
      return person.role.split(' - ').slice(1).join(' - ').trim();
    }
    return null;
  };

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
            <Users className="w-3.5 h-3.5" /> PyData Prayagraj Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Meet the Team
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            The passionate organizers, core team members, dedicated volunteers, and campus ambassadors driving PyData Prayagraj forward. Click any profile to view details.
          </p>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-20">

        {/* SECTION 1: ORGANIZERS */}
        <section className="space-y-10 w-full">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-200 text-amber-900 font-mono text-xs uppercase tracking-widest font-extrabold">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              Chapter Leadership
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
              Organizers
            </h2>
            <p className="text-slate-500 text-sm">Lead & Co-Organizers shaping community vision, events, and strategic partnerships.</p>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 via-blue-600 to-amber-500 rounded-full mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {organizers.map((person, idx) => (
              <motion.article
                key={person.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onMouseEnter={() => setSelectedMember(person)}
                onClick={() => setSelectedMember(person)}
                className="w-full bg-white p-8 rounded-3xl border-2 border-slate-200/90 shadow-md hover:shadow-2xl hover:border-amber-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center space-y-5 group cursor-pointer"
              >
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-44 h-44 sm:w-48 sm:h-48 rounded-3xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-600 to-blue-600 text-white flex items-center justify-center text-4xl font-black font-mono shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {person.initials || 'ORG'}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 font-heading group-hover:text-amber-600 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-sm font-mono text-amber-600 font-extrabold tracking-wider uppercase">
                    {getMainRole(person)}
                  </p>
                  {getSubRole(person) && (
                    <p className="text-xs font-mono text-amber-700 font-bold tracking-wider uppercase">
                      {getSubRole(person)}
                    </p>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-mono font-bold mt-1 border border-amber-200/60">
                    Organizer · PyData Prayagraj
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* SECTION 2: CORE TEAM (DISPLAYED ONLY IF MEMBERS EXIST) */}
        {coreTeam.length > 0 && (
          <section className="space-y-10 w-full pt-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 font-mono text-xs uppercase tracking-widest font-extrabold">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Technical & Operations Core
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
                Core Team
              </h2>
              <p className="text-slate-500 text-sm">Key technical leads, content strategists, and operations managers execution crew.</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 rounded-full mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {coreTeam.map((person, idx) => (
                <motion.article
                  key={person.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onMouseEnter={() => setSelectedMember(person)}
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
                    <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-4xl font-black font-mono shadow-lg group-hover:scale-105 transition-transform duration-300">
                      {person.initials || 'CR'}
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 font-heading group-hover:text-blue-600 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-sm font-mono text-blue-600 font-extrabold tracking-wider uppercase">
                      {getMainRole(person)}
                    </p>
                    {getSubRole(person) && (
                      <p className="text-xs font-mono text-blue-700 font-bold tracking-wider uppercase">
                        {getSubRole(person)}
                      </p>
                    )}
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-mono font-bold mt-1 border border-blue-200/60">
                      Core Team
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: VOLUNTEER (DISPLAYED ONLY IF MEMBERS EXIST) */}
        {volunteers.length > 0 && (
          <section className="space-y-10 w-full pt-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 font-mono text-xs uppercase tracking-widest font-extrabold">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                Community Backbone
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
                Volunteers
              </h2>
              <p className="text-slate-500 text-sm">Dedicated volunteers keeping meetups, logistics, registration, and workshops running smoothly.</p>
              <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
              {volunteers.map((person, idx) => (
                <motion.article
                  key={person.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onMouseEnter={() => setSelectedMember(person)}
                  onClick={() => setSelectedMember(person)}
                  className="w-full bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer group"
                >
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base sm:text-lg font-bold font-mono border border-emerald-200/60">
                      {person.initials || 'VL'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 font-heading group-hover:text-emerald-600 transition-colors leading-tight">{person.name}</h3>
                    <p className="text-[11px] sm:text-xs font-mono text-emerald-600 font-semibold mt-0.5">{person.role || 'Volunteer'}</p>
                    {person.college && (
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 block font-medium mt-1 line-clamp-1">
                        🎓 {person.college}
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: AMBASSADOR (DISPLAYED ONLY IF MEMBERS EXIST) */}
        {ambassadors.length > 0 && (
          <section className="space-y-10 w-full pt-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200 text-purple-900 font-mono text-xs uppercase tracking-widest font-extrabold">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                Campus & Outreach Leaders
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
                Ambassadors
              </h2>
              <p className="text-slate-500 text-sm">Empowering campus hubs, colleges, and regional tech circles across Prayagraj.</p>
              <div className="w-16 h-1 bg-purple-500 rounded-full mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
              {ambassadors.map((person, idx) => (
                <motion.article
                  key={person.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onMouseEnter={() => setSelectedMember(person)}
                  onClick={() => setSelectedMember(person)}
                  className="w-full bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-400 transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer group"
                >
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-base sm:text-lg font-bold font-mono border border-purple-200/60">
                      {person.initials || 'AM'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 font-heading group-hover:text-purple-600 transition-colors leading-tight">{person.name}</h3>
                    <p className="text-[11px] sm:text-xs font-mono text-purple-700 font-semibold mt-0.5">{person.role || 'Ambassador'}</p>
                    {person.college && (
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 block font-medium mt-1 line-clamp-1">
                        🎓 {person.college}
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Global Action CTAs for Volunteer and Ambassador */}
        <div className="pt-12 border-t border-slate-200/80 max-w-4xl mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold uppercase tracking-wider">
              Get Involved
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Join the PyData Prayagraj Movement
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Help build the premier data science community in Prayagraj. Apply to join as a Volunteer or Campus Ambassador.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 items-center justify-center pt-2">
            <a
              href="https://docs.google.com/forms/d/1DCHkBbmeQlBa0kZMwxC8-x2mj9-QaeDEkdduYqVJLDI/edit?usp=forms_home&ouid=113293290420530468365&ths=true&pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 group"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Apply as Volunteer</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            <a
              href="https://forms.gle/DzxfTmGYXoZQLcrm6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 group"
            >
              <Award className="w-5 h-5 text-purple-200 group-hover:scale-110 transition-transform" />
              <span>Apply as Ambassador</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedMember(null)}
            onMouseLeave={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden relative flex flex-col sm:flex-row my-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner / Profile Image - Display Full Image (object-contain) */}
              <div className="w-full sm:w-1/2 bg-slate-950 flex items-center justify-center p-3 sm:p-6 min-h-[260px] sm:min-h-[340px]">
                {selectedMember.avatarUrl ? (
                  <img
                    src={selectedMember.avatarUrl}
                    alt={selectedMember.name}
                    className="w-full max-h-[300px] sm:max-h-[380px] object-contain rounded-2xl shadow-xl bg-slate-900"
                  />
                ) : (
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-tr from-amber-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-extrabold font-mono shadow-xl">
                    {selectedMember.initials || 'PY'}
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center space-y-4 overflow-y-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>PyData Prayagraj</span>
                </span>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                    {selectedMember.name}
                  </h2>
                  <p className="text-sm font-mono text-amber-600 font-extrabold uppercase tracking-wider mt-1">
                    {getMainRole(selectedMember)}
                  </p>
                  {getSubRole(selectedMember) && (
                    <p className="text-xs font-mono text-amber-700 font-bold uppercase tracking-wider mt-0.5">
                      {getSubRole(selectedMember)}
                    </p>
                  )}
                </div>

                {/* Member Bio / Description - ONLY FOR ORGANIZERS */}
                {(selectedMember.category === 'organizer' || (!selectedMember.category && !['core_team', 'core', 'volunteer', 'ambassador'].includes(selectedMember.category))) && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-mono text-amber-700 font-bold block mb-1 uppercase tracking-widest">
                      About / Description
                    </span>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
                      {selectedMember.description || `${selectedMember.name} is an active contributor to PyData Prayagraj driving technical workshops, open-source initiatives, and community engagement.`}
                    </p>
                  </div>
                )}

                {/* Metadata details - Category & Chapter ONLY for Organizers, College for Volunteers/Ambassadors */}
                <div className="border-t border-slate-100 pt-3 text-xs font-mono text-slate-500 space-y-1">
                  {(selectedMember.category === 'organizer' || (!selectedMember.category && !['core_team', 'core', 'volunteer', 'ambassador'].includes(selectedMember.category))) && (
                    <>
                      <p>Category: <span className="text-slate-800 font-bold">{getCategoryLabel(selectedMember.category)}</span></p>
                      <p>Chapter: <span className="text-slate-800 font-bold">Prayagraj, UP · India</span></p>
                    </>
                  )}
                  {selectedMember.college && (
                    <p>College / Univ: <span className="text-slate-800 font-bold">{selectedMember.college}</span></p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
