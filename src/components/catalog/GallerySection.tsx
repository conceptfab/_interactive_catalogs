import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryData } from '@/types/catalog';

interface GallerySectionProps {
  data: GalleryData;
}

const GallerySection = ({ data }: GallerySectionProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = (dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex + dir + data.images.length) % data.images.length,
    );
  };

  return (
    <section
      id="gallery"
      className="section-padding bg-surface"
      aria-labelledby="gallery-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.2em] mb-4">
            {data.sectionLabel}
          </p>
          <h2
            id="gallery-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {data.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data.images.map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onClick={() => openLightbox(i)}
              className={`group relative overflow-hidden ${
                i === 0 ? 'col-span-2 lg:col-span-2 row-span-2' : ''
              } min-h-[44px] shadow-lg`}
              aria-label={`View ${img.category} image in fullscreen`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover aspect-[4/3] group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                <ZoomIn
                  className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  size={28}
                />
              </div>
              <span className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm text-card-foreground text-xs font-medium px-3 py-1">
                {img.category}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/90 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-on-dark-muted hover:text-on-dark min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-dark-muted hover:text-on-dark min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-dark-muted hover:text-on-dark min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={data.images[lightboxIndex].src}
              alt={data.images[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p
              className="absolute bottom-6 text-on-dark-muted text-sm"
              aria-live="polite"
            >
              {lightboxIndex + 1} / {data.images.length} —{' '}
              {data.images[lightboxIndex].category}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
