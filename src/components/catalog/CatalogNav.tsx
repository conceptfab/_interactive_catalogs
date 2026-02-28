import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { SectionConfig } from '@/types/catalog';

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'cover', label: 'Cover' },
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Looks' },
  { id: 'variants', label: 'Config' },
  { id: 'dimensions', label: 'Specs' },
  { id: 'materials', label: 'Build' },
  { id: 'features', label: 'Tech' },
  { id: 'assembly', label: 'Setup' },
];

interface CatalogNavProps {
  sections?: SectionConfig[];
  brandLabel?: string;
  brandLogoSrc?: string;
  backToCatalogListHref?: string;
  variant?: 'default' | 'qx1' | 'qx2';
}

const CatalogNav = ({
  sections = DEFAULT_SECTIONS,
  brandLabel = 'METRO',
  brandLogoSrc,
  backToCatalogListHref,
  variant = 'default',
}: CatalogNavProps) => {
  const [activeSection, setActiveSection] = useState('cover');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const visibleSections = sections.filter((s) => s.enabled !== false);

  const renderBrand = (logoClassName: string) => {
    if (!brandLogoSrc) return brandLabel;
    return (
      <Image
        src={brandLogoSrc}
        alt={`${brandLabel} logo`}
        width={160}
        height={48}
        className={logoClassName}
      />
    );
  };

  const renderQx1Brand = () => {
    if (brandLogoSrc) {
      return (
        <Image
          src={brandLogoSrc}
          alt={`${brandLabel} logo`}
          width={160}
          height={48}
          className={`h-9 w-auto object-contain ${
            scrolled || isOpen ? 'mix-blend-difference invert' : ''
          }`}
        />
      );
    }

    return (
      <span
        className={
          scrolled || isOpen
            ? 'text-foreground mix-blend-difference invert'
            : 'text-primary-foreground'
        }
      >
        {brandLabel}
      </span>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sectionElements = visibleSections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i].el;
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sectionElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleSections]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  if (variant === 'qx2') {
    return (
      <>
        <nav
          role="navigation"
          aria-label="Catalog sections"
          className="fixed top-3 left-0 right-0 z-[60]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-transparent shadow-[0_8px_22px_hsl(220_10%_10%/0.06)]">
              <div className="flex items-center gap-2 p-1.5">
                {backToCatalogListHref ? (
                <a
                  href={backToCatalogListHref}
                  className="shrink-0 bg-transparent text-foreground px-3 py-2 text-xs font-display font-semibold tracking-[0.16em] min-h-[40px] inline-flex items-center"
                  aria-label="Back to catalog list"
                >
                  {renderBrand('h-6 w-auto object-contain')}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('cover')}
                  className="shrink-0 bg-transparent text-foreground px-3 py-2 text-xs font-display font-semibold tracking-[0.16em] min-h-[40px] inline-flex items-center"
                  aria-label={`${brandLabel} - back to top`}
                >
                  {renderBrand('h-6 w-auto object-contain')}
                </button>
              )}

                <ul
                  className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="list"
                >
                  {visibleSections.map((section, idx) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollTo(section.id)}
                        className={`px-3 py-2 min-h-[44px] inline-flex items-center gap-2 text-sm transition-colors border-b-2 ${
                          activeSection === section.id
                            ? 'border-accent text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                        aria-current={
                          activeSection === section.id ? 'true' : undefined
                        }
                      >
                        <span className="font-mono text-[10px] opacity-70">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display font-medium">
                          {section.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2 bg-transparent text-foreground hover:text-muted-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  aria-expanded={isOpen}
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                  {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="lg:hidden fixed top-24 left-4 right-4 z-[59] bg-background/95 backdrop-blur-xl p-3 shadow-xl"
            >
              <ul className="grid grid-cols-2 gap-2" role="list">
                {visibleSections.map((section, idx) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`w-full px-2 py-3 text-left text-sm min-h-[44px] inline-flex items-center gap-2 transition-colors border-b-2 ${
                        activeSection === section.id
                          ? 'border-accent text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-70">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display font-medium">
                        {section.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (variant === 'qx1') {
    return (
      <>
        <nav
          role="navigation"
          aria-label="Catalog sections"
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
            scrolled || isOpen ? 'bg-transparent py-4' : 'bg-transparent py-6'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between">
              {backToCatalogListHref ? (
                <a
                  href={backToCatalogListHref}
                  className="font-display font-medium text-2xl tracking-wide"
                  aria-label="Back to catalog list"
                >
                  {renderQx1Brand()}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('cover')}
                  className="font-display font-medium text-2xl tracking-wide"
                  aria-label={`${brandLabel} - back to top`}
                >
                  {renderQx1Brand()}
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-foreground text-background rounded-full hover:scale-105 transition-transform shadow-xl flex items-center justify-center min-h-[50px] min-w-[50px]"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
              animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
              exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col justify-center"
            >
              <div className="max-w-7xl mx-auto w-full px-6 sm:px-8">
                <ul className="flex flex-col gap-6 md:gap-8" role="list">
                  {visibleSections.map((section, idx) => (
                    <motion.li
                      key={section.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }}
                    >
                      <button
                        onClick={() => scrollTo(section.id)}
                        className={`text-4xl md:text-6xl font-display font-light tracking-wide transition-colors text-left ${
                          activeSection === section.id
                            ? 'text-accent'
                            : 'text-foreground hover:text-accent/70'
                        }`}
                      >
                        {section.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <nav
        role="navigation"
        aria-label="Catalog sections"
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          scrolled || isOpen
            ? 'bg-background/95 backdrop-blur-md border-b border-border py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between">
            {backToCatalogListHref ? (
              <a
                href={backToCatalogListHref}
                className="font-display font-black text-xl tracking-tighter text-foreground"
                aria-label="Back to catalog list"
              >
                {renderBrand('h-7 w-auto object-contain')}
              </a>
            ) : (
              <button
                onClick={() => scrollTo('cover')}
                className="font-display font-black text-xl tracking-tighter text-foreground"
                aria-label={`${brandLabel} - back to top`}
              >
                {renderBrand('h-7 w-auto object-contain')}
              </button>
            )}

            <ul
              className="hidden lg:flex items-center gap-2 flex-1 justify-end"
              role="list"
            >
              {visibleSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      activeSection === section.id
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                    aria-current={
                      activeSection === section.id ? 'true' : undefined
                    }
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden ml-4 p-2 text-foreground hover:bg-muted rounded-md transition-colors"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-[72px] left-0 right-0 z-[59] border-b border-border bg-background shadow-xl"
          >
            <ul className="flex flex-col p-4" role="list">
              {visibleSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`w-full p-4 text-left text-base font-medium transition-colors ${
                      activeSection === section.id
                        ? 'text-foreground bg-muted/50 rounded-md'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CatalogNav;
