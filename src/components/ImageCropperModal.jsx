import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crop, X, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';

export default function ImageCropperModal({ isOpen, imageSrc, aspectRatio = 1, onCancel, onCropComplete }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const viewportRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleConfirmCrop = () => {
    const viewport = viewportRef.current;
    const img = imageRef.current;
    if (!viewport || !img) return;

    const viewportRect = viewport.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const canvas = document.createElement('canvas');
    const targetWidth = aspectRatio === 1 ? 600 : aspectRatio === 16 / 9 ? 1200 : 800;
    const targetHeight = Math.round(targetWidth / aspectRatio);
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Scaling ratio from DOM viewport pixels to output canvas pixels
    const scaleToCanvas = targetWidth / viewportRect.width;

    // Draw the image onto output canvas exactly as positioned in the viewport
    const drawX = (imgRect.left - viewportRect.left) * scaleToCanvas;
    const drawY = (imgRect.top - viewportRect.top) * scaleToCanvas;
    const drawW = imgRect.width * scaleToCanvas;
    const drawH = imgRect.height * scaleToCanvas;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedBase64);
  };

  // Determine viewport CSS dimensions matching website display aspect ratio
  const getViewportStyle = () => {
    if (aspectRatio === 1) {
      return 'w-64 h-64 sm:w-72 sm:h-72 aspect-square';
    } else if (aspectRatio === 16 / 9) {
      return 'w-full h-48 sm:h-60 aspect-video';
    } else {
      return 'w-full h-56 sm:h-64 aspect-[4/3]';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Crop className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold font-heading">Position & Crop Image</h2>
            </div>
            <button 
              onClick={onCancel}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Move className="w-3.5 h-3.5" /> Drag image inside frame
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              {aspectRatio === 1 ? '1:1 Square Format' : aspectRatio === 16/9 ? '16:9 Widescreen' : '4:3 Standard'}
            </span>
          </div>

          {/* EXACT ASPECT RATIO VIEWPORT CONTAINER */}
          <div className="flex justify-center items-center py-2">
            <div 
              ref={viewportRef}
              className={`relative ${getViewportStyle()} bg-slate-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border-2 border-amber-400 shadow-2xl flex items-center justify-center select-none`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.05s linear',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  minWidth: '100%',
                  minHeight: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Grid guide */}
              <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/15"></div>
                <div className="border-r border-b border-white/15"></div>
                <div className="border-b border-white/15"></div>
                <div className="border-r border-b border-white/15"></div>
                <div className="border-r border-b border-white/15"></div>
                <div className="border-b border-white/15"></div>
                <div className="border-r border-white/15"></div>
                <div className="border-r border-white/15"></div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Zoom Control Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1"><ZoomOut className="w-3.5 h-3.5" /> Zoom Out</span>
              <span className="font-bold text-amber-400">{(zoom * 100).toFixed(0)}%</span>
              <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Zoom In</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmCrop}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Upload</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
