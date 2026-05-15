'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => (i! > 0 ? i! - 1 : images.length - 1));
  const next = () => setLightbox((i) => (i! < images.length - 1 ? i! + 1 : 0));

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative aspect-video rounded-xl overflow-hidden group hover:ring-2 hover:ring-violet-500/50 transition-all"
          >
            <Image src={src} alt={`${title} screenshot ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/60 hover:text-white p-2">
              <FiX className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/60 hover:text-white p-2">
              <FiChevronLeft className="w-8 h-8" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl max-h-[80vh] w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[lightbox]} alt={`${title} ${lightbox + 1}`} fill className="object-contain" />
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/60 hover:text-white p-2">
              <FiChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
