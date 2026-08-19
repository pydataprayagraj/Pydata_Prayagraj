import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  ArrowLeft,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { fetchGallery } from '../services/api';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadGallery() {
      const data = await fetchGallery();
      setAlbums(data);
    }
    loadGallery();
  }, []);

  const openPhotoLightbox = (photos, index) => {
    setLightboxPhoto(photos[index]);
    setLightboxIndex(index);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (!activeFolder || !activeFolder.photos) return;
    const prevIdx = (lightboxIndex - 1 + activeFolder.photos.length) % activeFolder.photos.length;
    setLightboxIndex(prevIdx);
    setLightboxPhoto(activeFolder.photos[prevIdx]);
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (!activeFolder || !activeFolder.photos) return;
    const nextIdx = (lightboxIndex + 1) % activeFolder.photos.length;
    setLightboxIndex(nextIdx);
    setLightboxPhoto(activeFolder.photos[nextIdx]);
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
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" /> Chapter Archives
            </span>
            {activeFolder && (
              <span className="text-xs font-mono text-slate-400">
                / {activeFolder.title}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
              {activeFolder ? activeFolder.title : 'Event Collections'}
            </h1>
            {activeFolder && (
              <button
                onClick={() => setActiveFolder(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back to Collections</span>
              </button>
            )}
          </div>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            {activeFolder
              ? `Viewing photos inside "${activeFolder.title}". Click any image to open in full screen with description.`
              : 'Explore PyData Prayagraj keynotes, workshops, and community gatherings.'}
          </p>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <section className="py-12 px-6 sm:px-12 lg:px-16 xl:px-20 w-full space-y-8">

        {/* VIEW 1: EVENT FOLDERS LIST */}
        {!activeFolder && (
          <>
            {albums.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-md">
                  <Camera className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
                    More Event Photos Coming Soon!
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans max-w-lg mx-auto">
                    There will be more event photos and highlights coming soon, please be connected with us!
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.meetup.com/pydata-prayagraj/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 group"
                  >
                    <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                    <span>Join Us on Meetup</span>
                  </a>
                </div>
              </motion.div>
            )}

            {albums.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album, idx) => (
                  <motion.article
                    key={album.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    onClick={() => setActiveFolder(album)}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden hover:shadow-2xl hover:border-amber-400 transition-all duration-300 group cursor-pointer relative"
                  >
                    {/* Folder Top Tab Graphic Header */}
                    <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold">
                        <FolderOpen className="w-4 h-4" />
                        <span>COLLECTION #{idx + 1}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-mono font-bold">
                        {album.photos?.length || album.photosCount || 1} Photos
                      </span>
                    </div>

                    {/* Cover Image Preview */}
                    <div className="h-56 bg-slate-100 relative overflow-hidden">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <Camera className="w-12 h-12 mb-2" />
                          <span className="text-xs font-mono">Event Collection</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold block mb-1">
                          {album.category || 'Event Archive'}
                        </span>
                        <h3 className="text-xl font-bold font-heading line-clamp-1">{album.title}</h3>
                      </div>
                    </div>

                    {/* Folder Footer Details */}
                    <div className="p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500 font-semibold">{album.date || 'August 2026'}</span>
                      <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono">
                        Explore Gallery →
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: INSIDE EVENT FOLDER (PHOTOS GRID) */}
        {activeFolder && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Click any image to view in full-screen popup modal along with its description.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(activeFolder.photos || [{ id: 'p1', url: activeFolder.coverImage, caption: activeFolder.title }]).map((photo, pIdx) => (
                <motion.div
                  key={photo.id || pIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: pIdx * 0.05 }}
                  onClick={() => openPhotoLightbox(activeFolder.photos || [{ id: 'p1', url: activeFolder.coverImage, caption: activeFolder.title }], pIdx)}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="h-64 bg-slate-100 overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.caption || activeFolder.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-mono font-bold shadow-lg">
                        View Photo & Description
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* POPUP LIGHTBOX MODAL (PHOTO + DESCRIPTION DISPLAYED ONLY HERE) */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Top Bar */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-300 truncate">
                    {activeFolder?.title} ({lightboxIndex + 1}/{activeFolder?.photos?.length || 1})
                  </span>
                </div>
                <button
                  onClick={() => setLightboxPhoto(null)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Photo Viewport */}
              <div className="relative bg-slate-950 min-h-[350px] sm:min-h-[480px] max-h-[70vh] flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.caption || 'Event photo'}
                  className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl"
                />

                {/* Left & Right Nav Arrows */}
                {activeFolder?.photos?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition-all backdrop-blur-md shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition-all backdrop-blur-md shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* PHOTO DESCRIPTION (DISPLAYED ONLY INSIDE THIS POPUP SCREEN) */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase">
                    Photo Description
                  </span>
                  <span className="text-xs font-mono text-slate-400">{activeFolder?.date}</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {lightboxPhoto.caption || lightboxPhoto.description || 'PyData Prayagraj Event Photograph'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


