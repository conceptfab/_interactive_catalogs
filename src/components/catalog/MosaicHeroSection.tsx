import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { HeroData, HeroSlide } from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface MosaicHeroSectionProps {
  data: HeroData;
  variant: 'qx3' | 'qx4';
}

function normalizeSlides(data: HeroData): HeroSlide[] {
  const base =
    data.heroSlides && data.heroSlides.length > 0
      ? data.heroSlides
      : [
          {
            src: data.heroImage,
            alt: data.heroImageAlt,
          },
        ];

  if (base.length >= 4) return base;

  const padded = [...base];
  while (padded.length < 4) {
    padded.push(base[padded.length % base.length]);
  }
  return padded;
}

function resolveHeroTitle(
  rawTitle: string | undefined,
  variant: 'qx3' | 'qx4',
) {
  const cleaned = rawTitle?.trim();
  if (!cleaned || cleaned.toLowerCase() === 'qx series') {
    return variant === 'qx3' ? 'QX-3 Dark Precision' : 'QX';
  }
  return cleaned;
}

const blendTransition = {
  duration: 1.2,
  ease: 'easeInOut' as const,
};

const thumbIndex = (slidesLength: number, mainIndex: number, slot: number) =>
  (mainIndex + slot + 1) % slidesLength;

const pad2 = (value: number) => String(value).padStart(2, '0');

const MosaicHeroSection = ({ data, variant }: MosaicHeroSectionProps) => {
  const slides = useMemo(() => normalizeSlides(data), [data]);
  const [mainIndex, setMainIndex] = useState(0);
  const [qx4ThumbOffset, setQx4ThumbOffset] = useState(1);
  const [qx4ThumbIndices, setQx4ThumbIndices] = useState(() =>
    [0, 1, 2].map((slot) => thumbIndex(slides.length, 0, slot)),
  );

  useEffect(() => {
    setMainIndex(0);
    setQx4ThumbOffset(1);
    setQx4ThumbIndices(
      [0, 1, 2].map((slot) => thumbIndex(slides.length, 0, slot)),
    );
  }, [slides.length]);

  useEffect(() => {
    if (variant !== 'qx3') return;
    if (slides.length <= 1) return;

    const cycle = () => {
      setMainIndex((previousIndex) => (previousIndex + 1) % slides.length);
    };

    const interval = setInterval(cycle, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [slides.length, variant]);

  useEffect(() => {
    if (variant !== 'qx4') return;
    if (slides.length <= 1) return;

    const mainInterval = setInterval(() => {
      setMainIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    const thumbInterval = setInterval(() => {
      setQx4ThumbOffset((prev) => prev + 1);
    }, 5000);

    return () => {
      clearInterval(mainInterval);
      clearInterval(thumbInterval);
    };
  }, [slides.length, variant]);

  useEffect(() => {
    if (variant !== 'qx4') return;
    setQx4ThumbIndices(
      [0, 1, 2].map(
        (slot) => (mainIndex + qx4ThumbOffset + slot) % slides.length,
      ),
    );
  }, [mainIndex, qx4ThumbOffset, slides.length, variant]);

  const mainSlide = slides[mainIndex];
  const heroTitle = resolveHeroTitle(data.collectionName, variant);

  const qx3PreviewSlides = Array.from(
    { length: Math.max(0, slides.length - 1) },
    (_, offset) => {
      const keyIndex = (mainIndex + offset + 1) % slides.length;
      return {
        slide: slides[keyIndex],
        keyIndex,
      };
    },
  );

  const scrollToOverview = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [qx3TaglineLine1, qx3TaglineLine2] = (() => {
    if (data.taglineLine2) return [data.tagline, data.taglineLine2] as const;
    const splitIndex = data.tagline.indexOf('. ');
    if (splitIndex === -1) return [data.tagline, undefined] as const;
    return [
      data.tagline.slice(0, splitIndex + 1),
      data.tagline.slice(splitIndex + 2),
    ] as const;
  })();

  if (variant === 'qx3') {
    return (
      <section
        id="cover"
        className="relative overflow-hidden text-primary-foreground"
        aria-label={`${heroTitle} Collection cover`}
      >
        <div className="hero-qx3-grid grid min-h-[100svh] grid-cols-1 gap-[2px] lg:grid-cols-[68fr_32fr]">
          <div className="hero-main relative min-h-[60svh] overflow-hidden lg:min-h-[100svh]">
            <AnimatePresence mode="sync">
              <motion.img
                key={`main-qx3-${mainIndex}`}
                src={mainSlide.src}
                alt={mainSlide.alt}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0, 0, 1] }}
              />
            </AnimatePresence>

            <div className="absolute left-4 top-4 z-[3] flex gap-2 text-[10px] uppercase tracking-[0.24em] text-on-dark-muted sm:left-8 sm:top-8">
              <span className="border border-border/70 bg-background/40 px-3 py-1 text-primary-foreground">
                QX-3
              </span>
              <span className="border border-border/70 bg-background/40 px-3 py-1">
                Frame {pad2(mainIndex + 1)}
              </span>
            </div>

            <div className="qx3-hero-copy absolute inset-x-0 bottom-0 z-[3] px-4 pb-6 sm:px-8 sm:pb-10">
              <div className="max-w-3xl p-5 sm:p-8">
                <h1 className="font-display text-[clamp(4.8rem,12.8vw,11.2rem)] font-light uppercase leading-[0.82] tracking-[0.04em] text-primary-foreground">
                  {renderQxText('QX')}
                </h1>
                <p className="max-w-2xl text-sm text-on-dark-muted sm:text-base">
                  <span className="block">{renderQxText(qx3TaglineLine1)}</span>
                  {qx3TaglineLine2 ? (
                    <span className="block">
                      {renderQxText(qx3TaglineLine2)}
                    </span>
                  ) : null}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={scrollToOverview}
                    className="btn-premium inline-flex min-h-[44px] items-center gap-3 border border-accent/50 bg-accent/10 px-5 py-3 font-display text-[11px] uppercase tracking-[0.24em] text-accent"
                  >
                    <span>{renderQxText(data.ctaLabel)}</span>
                    <ArrowDown size={15} />
                  </button>
                  {mainSlide.description && (
                    <p className="text-xs uppercase tracking-[0.16em] text-on-dark-subtle">
                      {renderQxText(mainSlide.description)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 gap-[2px] lg:min-h-[100svh]"
            style={{
              gridTemplateRows: `repeat(${qx3PreviewSlides.length}, minmax(0, 1fr))`,
            }}
          >
            {qx3PreviewSlides.map(({ slide, keyIndex }, slot) => (
              <div
                key={`qx3-preview-${slot}`}
                className="qx3-preview relative min-h-[18svh] overflow-hidden"
              >
                <img
                  key={`qx3-preview-image-${slot}-${keyIndex}`}
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                />
                <p className="absolute bottom-3 left-3 z-[2] text-[10px] uppercase tracking-[0.24em] text-on-dark-muted">
                  Feed {pad2(slot + 1)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollToOverview}
          className="absolute bottom-5 right-4 z-20 inline-flex min-h-[44px] items-center gap-2 border border-border/70 bg-background/35 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-on-dark-muted transition-colors hover:text-primary-foreground sm:right-8"
          aria-label="Scroll to overview"
        >
          <span>Scroll</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          >
            <ArrowDown size={14} />
          </motion.span>
        </button>
      </section>
    );
  }

  return (
    <section
      id="cover"
      className="relative overflow-hidden text-foreground"
      aria-label={`${heroTitle} Collection cover`}
    >
      <div className="hero-mosaic grid h-[100svh] grid-cols-1 gap-0 lg:grid-cols-[62fr_38fr] lg:grid-rows-3">
        <div className="hero-main relative min-h-[58svh] overflow-hidden lg:row-span-3 lg:min-h-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={`main-${mainIndex}`}
              src={mainSlide.src}
              alt={mainSlide.alt}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={blendTransition}
            />
          </AnimatePresence>

          <div className="hero-overlay-layer absolute inset-0 z-[1] bg-[hsl(var(--hero-overlay)/0.76)]" />

          <div className="absolute inset-x-0 bottom-0 z-[2] p-4 sm:p-6 lg:p-10">
            <div className="max-w-2xl rounded-2xl border border-border/70 bg-surface-elevated/70 p-5 text-foreground backdrop-blur-md sm:p-7">
              <p className="font-body text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {renderQxText(data.brandLabel || 'METRO')}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.4rem,5.8vw,4.5rem)] font-light leading-[0.9] text-foreground">
                {renderQxText(heroTitle)}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
                {renderQxText(data.tagline)}
                {data.taglineLine2 ? ` ${renderQxText(data.taglineLine2)}` : ''}
              </p>

              {mainSlide.description && (
                <p
                  className="mt-4 text-xs uppercase tracking-[0.16em] text-accent/90"
                  aria-live="polite"
                >
                  {renderQxText(mainSlide.description)}
                </p>
              )}

              <div className="mt-6">
                <button
                  onClick={scrollToOverview}
                  className="btn-premium inline-flex min-h-[44px] items-center gap-3 rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-[0.22em] text-accent-foreground"
                >
                  <span>{renderQxText(data.ctaLabel)}</span>
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {[0, 1, 2].map((slot) => {
          const slide = slides[qx4ThumbIndices[slot] % slides.length];
          return (
            <div
              key={`thumb-slot-${slot}`}
              className="hero-thumb relative min-h-[20svh] overflow-hidden"
            >
              <AnimatePresence mode="sync">
                <motion.img
                  key={`thumb-${slot}-${qx4ThumbIndices[slot]}`}
                  src={slide.src}
                  alt={slide.alt}
                  className={`absolute inset-0 h-full w-full object-cover hero-thumb-image hero-thumb-image-${
                    slot + 1
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={blendTransition}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-[hsl(var(--hero-overlay)/0.34)]" />
            </div>
          );
        })}
      </div>

      <button
        onClick={scrollToOverview}
        className="absolute bottom-5 left-1/2 z-20 min-h-[44px] min-w-[44px] -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Scroll to overview"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <ArrowDown size={22} />
        </motion.div>
      </button>
    </section>
  );
};

export default MosaicHeroSection;
