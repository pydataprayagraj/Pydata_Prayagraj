import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, ChevronRight, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close mobile menu automatically
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Albums', path: '/albums' },
    { name: 'Journal', path: '/blogs' },
    { name: 'Team', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'Sponsor', path: '/sponsor' },
  ];

  // Completely hide public website Navbar on Admin Dashboard (/mainuser)
  if (location.pathname === '/mainuser') {
    return null;
  }

  return (
    <>
      {/* Click-outside Backdrop Overlay for Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/92 backdrop-blur-xl border-b border-slate-200/80 shadow-md shadow-slate-900/5 py-2.5 sm:py-3'
          : 'bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-xs py-3.5 sm:py-4'
          }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">

          {/* Brand Logo & PyData Prayagraj Title (Light Mode) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group transition-transform active:scale-95 py-0.5"
            aria-label="PyData Prayagraj Home"
          >
            <img
              src={import.meta.env.BASE_URL ? (import.meta.env.BASE_URL.endsWith('/') ? `${import.meta.env.BASE_URL}pydata-icon.png` : `${import.meta.env.BASE_URL}/pydata-icon.png`) : './pydata-icon.png'}
              alt="PyData Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-black text-xl sm:text-2xl tracking-tight leading-none font-heading flex items-center">
              <span className="text-[#f26522]">Py</span>
              <span className="text-[#2b74b8]">Data</span>{' '}
              <span className="text-slate-900 font-extrabold group-hover:text-amber-600 transition-colors ml-1">Prayagraj</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Minimalist Cool Capsule) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xs">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`relative px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${isActive
                    ? 'text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {/* Active Link Sliding Capsule */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-light-active-pill"
                      className="absolute inset-0 rounded-full bg-[#f26522] shadow-md shadow-orange-500/25"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}

                  {/* Hover Link Capsule */}
                  {!isActive && hoveredPath === item.path && (
                    <motion.div
                      layoutId="desktop-light-hover-pill"
                      className="absolute inset-0 rounded-full bg-slate-100/90"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}

                  <span className="relative z-10">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.meetup.com/pydata-prayagraj/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-950 hover:bg-slate-800 text-white shadow-md shadow-slate-950/15 transition-all duration-200 active:scale-95 group"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Join the chapter</span>
              <ExternalLink className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Cool Animated Hamburger Button (Light Mode) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative p-3 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-900 transition-all active:scale-95"
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center">
              <span
                className={`w-5 h-0.5 rounded-full bg-slate-900 transition-all duration-300 transform ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
              />
              <span
                className={`w-5 h-0.5 rounded-full bg-slate-900 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
              />
              <span
                className={`w-5 h-0.5 rounded-full bg-slate-900 transition-all duration-300 transform ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Super Cool Mobile Menu Drawer (Light Mode) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-3 shadow-2xl mt-2"
            >
              {/* Mobile Nav Links */}
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.2 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 text-base font-semibold rounded-xl transition-all ${isActive
                          ? 'bg-slate-950 text-white font-bold shadow-md'
                          : 'text-slate-700 hover:bg-slate-100/90'
                          }`}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-amber-400' : 'opacity-40'}`} />
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <div className="pt-2">
                <a
                  href="https://www.meetup.com/pydata-prayagraj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-center shadow-lg active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Join the chapter</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}



