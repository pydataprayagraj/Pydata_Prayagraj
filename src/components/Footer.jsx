import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MapPin, ExternalLink, Heart, Send, Shield } from 'lucide-react';

export default function Footer({ pageSubtitle = 'Independent local community · Details to be verified before launch' }) {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  if (location.pathname === '/mainuser') {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-slate-200/80 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 left-1/3 w-96 h-48 bg-blue-600/10 blur-3xl pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 pt-12 sm:pt-16 pb-12 relative z-10">



        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-slate-800/80 text-center md:text-left">

          {/* Brand & Slogan Column */}
          <div className="lg:col-span-5 space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="inline-block group">
              <img 
                src="/email-sign.png" 
                alt="PyData Prayagraj" 
                className="h-12 w-auto object-contain bg-white/90 p-2 rounded-xl backdrop-blur-md shadow-md hover:brightness-110 transition-all"
              />
            </Link>

            <h2 className="text-2xl font-extrabold text-white tracking-tight font-heading">
              Let’s make data work more human.
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A local home in Prayagraj for curious minds learning, building, researching, and sharing open-source Python and data science tools.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Prayagraj, Uttar Pradesh · India</span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white font-bold block">
              Explore
            </span>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/albums" className="hover:text-white transition-colors">Albums</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white font-bold block">
              Community
            </span>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/team" className="hover:text-white transition-colors">Team</Link></li>
              <li><Link to="/sponsor" className="hover:text-white transition-colors">Sponsor Us</Link></li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/1DCHkBbmeQlBa0kZMwxC8-x2mj9-QaeDEkdduYqVJLDI/edit?usp=forms_home&ouid=113293290420530468365&ths=true&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center justify-center md:justify-start gap-1"
                >
                  <span>Volunteer</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://forms.gle/DzxfTmGYXoZQLcrm6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center justify-center md:justify-start gap-1"
                >
                  <span>Ambassadors</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white font-bold block">
              Governance & FAQ
            </span>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/privacy#conduct" className="hover:text-white transition-colors">Code of Conduct</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>

            <div className="pt-2 space-y-2.5 max-w-xs mx-auto md:mx-0">
              <a
                href="https://pydata.org/code-of-conduct/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors border border-slate-800 shadow-md group cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
                <span>PyData Code of Conduct</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://chat.whatsapp.com/EIaEqgTDw5d3zGT04Jsw1E"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                <span>Join Chapter WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p className="flex items-center justify-center gap-1 font-mono">
            © {currentYear} <strong className="text-white font-semibold">PyData Prayagraj</strong>. All rights reserved.
          </p>

          <p className="text-slate-400 font-mono text-center sm:text-right flex items-center justify-center sm:justify-end gap-1.5 flex-wrap">
            <span>Prepared by</span>
            <a
              href="https://portfolioanimeshpathak.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Animesh Pathak</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
