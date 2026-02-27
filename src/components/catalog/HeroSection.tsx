import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { HeroData } from '@/types/catalog';

interface HeroSectionProps {
  data: HeroData;
}

const DEFAULT_SLIDER = {
  autoAdvance: true,
  interval: 5000,
  pauseOnHover: true,
  transitionMs: 500,
  showArrows: true,
  showDots: true,
  initialSlide: 0,
};

const HeroSection = ({ data }: HeroSectionProps) => {
  const slider = { ...DEFAULT_SLIDER, ...data.slider };
  const images = data.heroImages ?? [];
  const hasSlider = images.length > 0;
  const displayImages = hasSlider ? images : [data.heroImage];
  const initialIdx = Math.min(
    Math.max(0, slider.initialSlide ?? 0),
    displayImages.length - 1,
  );
  const [currentIndex, setCurrentIndex] = useState(initialIdx);
  const [isHovered, setIsHovered] = useState(false);
  const alt = data.heroImageAlt;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(
        ((index % displayImages.length) + displayImages.length) %
          displayImages.length,
      );
    },
    [displayImages.length],
  );

  const goPrev = useCallback(
    () => goTo(currentIndex - 1),
    [currentIndex, goTo],
  );
  const goNext = useCallback(
    () => goTo(currentIndex + 1),
    [currentIndex, goTo],
  );

  useEffect(() => {
    if (
      !hasSlider ||
      displayImages.length <= 1 ||
      prefersReducedMotion ||
      !slider.autoAdvance ||
      (slider.pauseOnHover && isHovered)
    )
      return;
    const t = setInterval(goNext, slider.interval);
    return () => clearInterval(t);
  }, [
    hasSlider,
    displayImages.length,
    prefersReducedMotion,
    slider.autoAdvance,
    slider.interval,
    slider.pauseOnHover,
    isHovered,
    goNext,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!hasSlider) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
        return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasSlider, goPrev, goNext]);

  return (
    <section
      id="cover"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label={`${data.collectionName} Collection cover`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0"
        role={hasSlider ? 'region' : undefined}
        aria-roledescription={hasSlider ? 'Image carousel' : undefined}
        aria-live={hasSlider ? 'polite' : undefined}
      >
        {displayImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={
              i === 0
                ? alt
                : `${alt} — slide ${i + 1} of ${displayImages.length}`
            }
            className="absolute inset-0 w-full h-full object-cover transition-opacity ease-out"
            style={{
              transitionDuration: `${slider.transitionMs}ms`,
              opacity: i === currentIndex ? 1 : 0,
              zIndex: i === currentIndex ? 1 : 0,
              visibility: i === currentIndex ? 'visible' : 'hidden',
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="hero-overlay-layer absolute inset-0 bg-[hsl(var(--hero-overlay)/0.65)] z-[2]" />
      </div>

      {hasSlider && displayImages.length > 1 && (
        <>
          {slider.showArrows && (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-on-dark-muted hover:text-on-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Previous slide"
              >
                <ArrowDown size={24} className="rotate-90" />
              </motion.button>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-on-dark-muted hover:text-on-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Next slide"
              >
                <ArrowDown size={24} className="-rotate-90" />
              </motion.button>
            </>
          )}
          {slider.showDots && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2"
              role="tablist"
              aria-label="Slide indicators"
            >
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2"
                >
                  <span
                    className={`block w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-accent' : 'bg-on-dark-muted/60'
                    }`}
                  />
                </button>
              ))}
            </motion.div>
          )}
        </>
      )}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-on-dark-muted font-body text-sm uppercase tracking-[0.3em] mb-6"
        >
          {data.brandLabel}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display font-bold text-primary-foreground leading-[0.95]"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          {data.collectionName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-on-dark-muted font-body text-lg md:text-xl mt-6 max-w-2xl mx-auto text-balance"
        >
          {data.tagline}
          {data.taglineLine2 && (
            <>
              <br className="hidden md:block" />
              {data.taglineLine2}
            </>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={() =>
              document
                .getElementById('overview')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-md font-display font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity min-h-[44px]"
          >
            {data.ctaLabel}
          </button>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() =>
          document
            .getElementById('overview')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-on-dark-muted hover:text-on-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Scroll to overview"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
