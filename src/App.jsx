import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import JournalPage from './pages/JournalPage';
import TeamPage from './pages/TeamPage';
import EventsPage from './pages/EventsPage';
import SponsorPage from './pages/SponsorPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const routeTitles = {
      '/': 'PyData Prayagraj',
      '/events': 'Events — PyData Prayagraj',
      '/team': 'Team & Organizers — PyData Prayagraj',
      '/blogs': 'Journal & Blogs — PyData Prayagraj',
      '/albums': 'Albums & Gallery — PyData Prayagraj',
      '/sponsor': 'Sponsor & Partners — PyData Prayagraj',
      '/faq': 'FAQ — PyData Prayagraj',
      '/privacy': 'Code of Conduct & Privacy — PyData Prayagraj',
      '/mainuser': 'Admin Portal — PyData Prayagraj',
    };

    document.title = routeTitles[location.pathname] || 'PyData Prayagraj';
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <PageTitleManager />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/blogs" element={<JournalPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/mainuser" element={<AdminDashboardPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
