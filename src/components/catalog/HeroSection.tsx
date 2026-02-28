import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type {
  HeroData,
  HeroSlide,
  HeroDescriptionPosition,
  HeroDescriptionStyleConfig,
} from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface HeroSectionProps {
  data: HeroData;
  catalogId?: string;
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

const DEFAULT_DESCRIPTION_STYLE: Required<HeroDescriptionStyleConfig> = {
  enabled: true,
  position: 'bottom-center',
  offsetPx: 40,
  textColor: 'hsl(var(--on-dark-muted))',
  backgroundColor: 'rgba(0, 0, 0, 0.35)',
  backdropBlurPx: 6,
  paddingX: 16,
  paddingY: 8,
  borderRadiusPx: 9999,
  fontSizePx: 13,
  fontWeight: 500,
  letterSpacingEm: 0.04,
  maxWidth: '90vw',
  textAlign: 'center',
  uppercase: false,
};

function descriptionPositionClasses(position: HeroDescriptionPosition): string {
  switch (position) {
    case 'bottom-left':
      return 'left-6';
    case 'bottom-right':
      return 'right-6';
    case 'top-left':
      return 'left-6';
    case 'top-right':
      return 'right-6';
    case 'top-center':
      return 'left-1/2 -translate-x-1/2';
    case 'bottom-center':
    default:
      return 'left-1/2 -translate-x-1/2';
  }
}

const HeroSection = ({ data, catalogId }: HeroSectionProps) => {
  const slider = { ...DEFAULT_SLIDER, ...data.slider };
  const fallbackSlides: HeroSlide[] = (data.heroImages ?? []).map(
    (src, index, all) => ({
      src,
      alt:
        index === 0
          ? data.heroImageAlt
          : `${data.heroImageAlt} - slide ${index + 1} of ${all.length}`,
    }),
  );
  const configuredSlides: HeroSlide[] = data.heroSlides ?? fallbackSlides;
  const hasSlider = configuredSlides.length > 0;
  const displaySlides: HeroSlide[] = hasSlider
    ? configuredSlides
    : [{ src: data.heroImage, alt: data.heroImageAlt }];
  const initialIdx = Math.min(
    Math.max(0, slider.initialSlide ?? 0),
    displaySlides.length - 1,
  );
  const [currentIndex, setCurrentIndex] = useState(initialIdx);
  const [isHovered, setIsHovered] = useState(false);
  const descriptionStyle = {
    ...DEFAULT_DESCRIPTION_STYLE,
    ...data.descriptionStyle,
  };
  const descriptionPosClass = descriptionPositionClasses(
    descriptionStyle.position,
  );
  const isTopDescription = descriptionStyle.position.startsWith('top');
  const descriptionInlineStyle: CSSProperties = {
    color: descriptionStyle.textColor,
    backgroundColor: descriptionStyle.backgroundColor,
    backdropFilter: `blur(${descriptionStyle.backdropBlurPx}px)`,
    WebkitBackdropFilter: `blur(${descriptionStyle.backdropBlurPx}px)`,
    padding: `${descriptionStyle.paddingY}px ${descriptionStyle.paddingX}px`,
    borderRadius: `${descriptionStyle.borderRadiusPx}px`,
    fontSize: `${descriptionStyle.fontSizePx}px`,
    fontWeight: descriptionStyle.fontWeight,
    letterSpacing: `${descriptionStyle.letterSpacingEm}em`,
    maxWidth: descriptionStyle.maxWidth,
    textAlign: descriptionStyle.textAlign,
    textTransform: descriptionStyle.uppercase ? 'uppercase' : 'none',
    ...(isTopDescription
      ? { top: `${descriptionStyle.offsetPx}px` }
      : { bottom: `${descriptionStyle.offsetPx}px` }),
  };
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(
        ((index % displaySlides.length) + displaySlides.length) %
        displaySlides.length,
      );
    },
    [displaySlides.length],
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  useEffect(() => {
    if (
      !hasSlider ||
      displaySlides.length <= 1 ||
      prefersReducedMotion ||
      !slider.autoAdvance ||
      (slider.pauseOnHover && isHovered)
    ) {
      return;
    }

    const t = setInterval(goNext, slider.interval);
    return () => clearInterval(t);
  }, [
    hasSlider,
    displaySlides.length,
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
        {displaySlides.map((slide, i) => (
          <img
            key={`${slide.src}-${i}`}
            src={slide.src}
            alt={slide.alt}
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

      {hasSlider && displaySlides.length > 1 && (
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
              {displaySlides.map((_, i) => (
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
                    className={`block w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-accent' : 'bg-on-dark-muted/60'
                      }`}
                  />
                </button>
              ))}
            </motion.div>
          )}
        </>
      )}

      {descriptionStyle.enabled && displaySlides[currentIndex]?.description && (
        <motion.p
          key={`slide-description-${currentIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute z-20 ${descriptionPosClass}`}
          style={descriptionInlineStyle}
          aria-live="polite"
        >
          {displaySlides[currentIndex].description}
        </motion.p>
      )}

      <div className={`relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${catalogId?.toUpperCase() === 'QX-2' ? 'text-left mb-[clamp(6rem,16vw,14rem)]' : 'text-center'}`}>
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
          className={`font-display font-bold text-primary-foreground leading-[0.8] flex flex-col overflow-visible ${catalogId?.toUpperCase() === 'QX-2' ? 'items-start' : 'items-center'}`}
        >
          {catalogId?.toUpperCase() === 'QX-0' && data.collectionName.toLowerCase().includes('qx series') ? (
            <span
              className="flex items-baseline gap-[0.15em] text-[clamp(5.6rem,17.5vw,15.4rem)] tracking-tighter qx-giant py-4"
              style={{ lineHeight: '0.9', fontFamily: "'Sora', sans-serif", fontWeight: 200 }}
            >
              QX
              <span
                className="text-[0.22em] uppercase tracking-[0.5em] opacity-90 font-semibold"
              >
                Series
              </span>
            </span>
          ) : catalogId?.toUpperCase() === 'QX-2' ? (
            <span className="flex items-baseline gap-[0.2em] uppercase">
              <span style={{ fontSize: 'clamp(6rem, 16vw, 14rem)', fontWeight: 100 }}>
                QX
              </span>
              <span style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
                SERIES
              </span>
            </span>
          ) : (
            <span style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
              {renderQxText(data.collectionName)}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`text-white/90 font-body text-lg md:text-xl mt-8 max-w-2xl text-balance leading-relaxed ${catalogId?.toUpperCase() === 'QX-2' ? 'ml-0' : 'mx-auto'}`}
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        >
          {renderQxText(data.tagline)}
          {data.taglineLine2 && (
            <>
              <br className="hidden md:block" />
              <span className="opacity-80 font-light text-base md:text-lg block mt-2">
                {renderQxText(data.taglineLine2)}
              </span>
            </>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <button
            onClick={() =>
              document
                .getElementById('overview')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-premium inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg min-h-[44px]"
          >
            <span>{data.ctaLabel}</span>
            <ArrowDown size={18} className="animate-bounce" />
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
