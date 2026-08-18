import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#conduct') {
      const el = document.getElementById('conduct');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

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
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy & conduct
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Trust is part of the infrastructure.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            A launch-ready page structure for the chapter’s confirmed policy, reporting route, and code of conduct.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 sm:p-14 lg:p-16 rounded-3xl border border-slate-200/80 shadow-sm space-y-10 w-full"
        >
          {/* Draft Notice */}
          <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-sm sm:text-base flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800">Draft placeholder — not legal advice. </span>
              <span>Replace this page with reviewed, approved policy text plus real contact and reporting details before accepting submissions or collecting personal information.</span>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Privacy</h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              This demonstration site is static and does not collect, store, or transmit personal information. If the live site later adds registration forms, analytics, newsletters, photographs, or third-party services, publish a clear policy naming what is collected, why it is collected, how long it is held, and who can access it.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Code of Conduct Section */}
          <div id="conduct" className="space-y-5 pt-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
              <span>Code of conduct</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              PyData Prayagraj should be a welcoming and harassment-free space for everyone, regardless of background, identity, experience, or beliefs. Participants are expected to treat one another with respect and contribute to an environment where people can learn and collaborate safely.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                'Be considerate in speech, behavior, and online interaction.',
                'Do not harass, intimidate, discriminate against, or deliberately exclude others.',
                'Respect boundaries, consent, and requests to stop a behavior.',
                'Report concerns through a published, confidential channel.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 text-base sm:text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2">
              Organizers should define a specific reporting address, response process, and consequences before publication. Include applicable event and online-community scope, and link to any governing global policy that the chapter officially adopts.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Contact Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>Contact</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              No official contact address has been supplied. Add a monitored chapter email address and an urgent-event escalation path here before launch.
            </p>
            <p className="text-xs font-mono text-slate-400 pt-4">
              Last reviewed: placeholder · replace on approval
            </p>
          </div>

        </motion.article>
      </section>
    </div>
  );
}
