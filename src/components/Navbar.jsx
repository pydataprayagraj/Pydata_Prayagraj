import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Albums', path: '/albums' },
    { name: 'Journal', path: '/blogs' },
    { name: 'People', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'Sponsor', path: '/sponsor' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-slate-900 py-0' 
          : 'bg-transparent border-b border-transparent text-white py-2'
      }`}
    >
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-20">

        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with Official PyData Prayagraj Image */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group transition-transform active:scale-95 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={`p-1.5 rounded-xl transition-all ${!scrolled ? 'bg-white/95 shadow-md backdrop-blur-md' : ''}`}>
              <img 
                src="/email-sign.png" 
                alt="PyData Prayagraj" 
                className="h-8 sm:h-10 w-auto object-contain max-w-[200px] sm:max-w-[280px] hover:brightness-105 transition-all"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav 
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-2xl transition-all ${
              scrolled 
                ? 'bg-slate-100/90 border border-slate-200/80 shadow-inner' 
                : 'bg-slate-950/60 backdrop-blur-md border border-white/20 shadow-lg'
            }`}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? scrolled 
                        ? 'bg-slate-900 text-white shadow-sm font-semibold'
                        : 'bg-white text-slate-950 font-bold shadow-md'
                      : scrolled
                        ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
                        : 'text-slate-200 hover:text-white hover:bg-white/15'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://chat.whatsapp.com/EIaEqgTDw5d3zGT04Jsw1E"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-200 active:scale-95 group ${
                scrolled
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-950 shadow-lg'
              }`}
            >
              <span>Join the chapter</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform opacity-75" />
            </a>
          </div>


          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border transition-colors ${
              scrolled
                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                : 'text-white hover:bg-white/20 border-white/30 backdrop-blur-md'
            }`}
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>


      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-2">
            <a
              href="https://chat.whatsapp.com/EIaEqgTDw5d3zGT04Jsw1E"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-center shadow-md active:scale-95 transition-all"
            >
              <span>Join the chapter</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
