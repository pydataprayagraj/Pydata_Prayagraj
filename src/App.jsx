import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import JournalPage from './pages/JournalPage';
import PeoplePage from './pages/PeoplePage';
import EventsPage from './pages/EventsPage';
import SponsorPage from './pages/SponsorPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/blogs" element={<JournalPage />} />
            <Route path="/team" element={<PeoplePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
