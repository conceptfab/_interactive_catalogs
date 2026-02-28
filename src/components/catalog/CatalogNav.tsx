import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { SectionConfig } from '@/types/catalog';
import { renderQxText } from './renderQxText';

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
  variant?: 'default' | 'qx0' | 'qx1' | 'qx2' | 'qx3' | 'qx4';
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
          className="fixed top-0 left-0 right-0 z-[60]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-transparent shadow-[0_8px_22px_hsl(220_10%_10%/0.06)]">
              <div className="flex items-center gap-2 px-1.5 pt-1.5 pb-0">
                {backToCatalogListHref ? (
                  <a
                    href={backToCatalogListHref}
                    className="shrink-0 bg-transparent text-foreground px-3 py-2 text-xs font-display font-semibold tracking-[0.16em] min-h-[40px] inline-flex items-center brand-logo"
                    aria-label="Back to catalog list"
                  >
                    {renderBrand('h-6 w-auto object-contain')}
                  </a>
                ) : (
                  <button
                    onClick={() => scrollTo('cover')}
                    className="shrink-0 bg-transparent text-foreground px-3 py-2 text-xs font-display font-semibold tracking-[0.16em] min-h-[40px] inline-flex items-center brand-logo"
                    aria-label={`${brandLabel} - back to top`}
                  >
                    {renderBrand('h-6 w-auto object-contain')}
                  </button>
                )}

                <ul
                  className="hidden lg:flex items-center gap-1 flex-1 justify-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="list"
                >
                  {visibleSections.map((section, idx) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollTo(section.id)}
                        className={`nav-button px-3 py-2 min-h-[44px] inline-flex items-center gap-2 text-sm transition-colors border-b-2 ${
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
                          {renderQxText(section.label)}
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
                      className={`nav-button w-full px-2 py-3 text-left text-sm min-h-[44px] inline-flex items-center gap-2 transition-colors border-b-2 ${
                        activeSection === section.id
                          ? 'border-accent text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-70">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display font-medium">
                        {renderQxText(section.label)}
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

  if (variant === 'qx3') {
    return (
      <>
        <nav
          role="navigation"
          aria-label="Catalog sections"
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
            scrolled || isOpen ? 'py-0' : 'py-1'
          }`}
        >
          <div className="w-full px-2 sm:px-3 lg:px-4">
            <div
              className={`flex items-stretch border ${
                scrolled || isOpen
                  ? 'border-[hsl(220_14%_24%/0.9)] bg-[hsl(220_18%_8%/0.95)] shadow-[0_10px_24px_hsl(220_60%_2%/0.4)]'
                  : 'border-[hsl(220_14%_24%/0.75)] bg-[hsl(220_18%_8%/0.82)]'
              }`}
            >
              {backToCatalogListHref ? (
                <a
                  href={backToCatalogListHref}
                  className="inline-flex min-h-[56px] items-center border-r border-border/70 px-4 text-primary-foreground"
                  aria-label="Back to catalog list"
                >
                  {renderBrand('h-6 w-auto object-contain')}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('cover')}
                  className="inline-flex min-h-[56px] items-center border-r border-border/70 px-4 text-primary-foreground"
                  aria-label={`${brandLabel} - back to top`}
                >
                  {renderBrand('h-6 w-auto object-contain')}
                </button>
              )}

              <ul
                className="hidden lg:flex flex-1 items-stretch divide-x divide-border/60"
                role="list"
              >
                {visibleSections.map((section, idx) => (
                  <li key={section.id} className="flex-1">
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`nav-button qx3-nav-link ${
                        activeSection === section.id
                          ? 'is-active text-accent'
                          : 'text-on-dark-muted'
                      } flex min-h-[56px] w-full items-center justify-between px-4 py-2 transition-colors hover:text-primary-foreground`}
                      aria-current={
                        activeSection === section.id ? 'true' : undefined
                      }
                    >
                      <span className="font-mono text-[10px] tracking-[0.22em]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[10px] uppercase tracking-[0.2em]">
                        {renderQxText(section.label)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden inline-flex min-h-[56px] min-w-[56px] items-center justify-center border-l border-border/70 text-primary-foreground transition-colors hover:bg-white/10"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="lg:hidden fixed top-[70px] left-2 right-2 z-[59] border border-border/80 bg-[hsl(220_18%_8%/0.98)] p-2 shadow-2xl"
            >
              <ul className="space-y-1" role="list">
                {visibleSections.map((section, idx) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`w-full inline-flex min-h-[44px] items-center justify-between px-3 py-2 text-left text-[11px] uppercase tracking-[0.18em] ${
                        activeSection === section.id
                          ? 'text-accent'
                          : 'text-on-dark-muted hover:text-primary-foreground'
                      }`}
                    >
                      <span className="font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display">
                        {renderQxText(section.label)}
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

  if (variant === 'qx4') {
    return (
      <>
        <nav
          role="navigation"
          aria-label="Catalog sections"
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
            scrolled || isOpen ? 'py-2' : 'py-3'
          }`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div
              className={`flex items-center justify-between gap-3 border px-3 sm:px-4 py-2 backdrop-blur-2xl transition-colors ${
                scrolled || isOpen
                  ? 'bg-[hsl(20_18%_99%/0.94)] border-[hsl(15_20%_82%/0.95)] shadow-[0_14px_34px_hsl(340_30%_40%/0.12)]'
                  : 'bg-[hsl(20_18%_99%/0.82)] border-[hsl(15_20%_82%/0.7)]'
              }`}
            >
              {backToCatalogListHref ? (
                <a
                  href={backToCatalogListHref}
                  className="inline-flex items-center min-h-[44px] shrink-0 text-foreground"
                  aria-label="Back to catalog list"
                >
                  {renderBrand('h-7 w-auto object-contain')}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('cover')}
                  className="inline-flex items-center min-h-[44px] shrink-0 text-foreground"
                  aria-label={`${brandLabel} - back to top`}
                >
                  {renderBrand('h-7 w-auto object-contain')}
                </button>
              )}

              <ul
                className="hidden lg:flex items-center gap-1 flex-1 justify-end"
                role="list"
              >
                {visibleSections.map((section, idx) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`nav-button qx4-nav-link ${
                        activeSection === section.id
                          ? 'is-active text-accent'
                          : 'text-muted-foreground'
                      } inline-flex min-h-[44px] items-center gap-2 px-3 py-2 text-sm uppercase tracking-[0.16em] transition-colors hover:text-foreground`}
                      aria-current={
                        activeSection === section.id ? 'true' : undefined
                      }
                    >
                      <span className="font-mono text-[10px] opacity-70">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display font-medium">
                        {renderQxText(section.label)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm text-foreground transition-colors hover:bg-foreground/10"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="lg:hidden fixed top-20 left-3 right-3 z-[59] border border-[hsl(15_20%_82%/0.9)] bg-[hsl(20_18%_99%/0.96)] p-3 backdrop-blur-xl shadow-2xl"
            >
              <ul className="grid grid-cols-2 gap-2" role="list">
                {visibleSections.map((section, idx) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`w-full inline-flex min-h-[44px] items-center gap-2 px-2.5 py-3 text-left text-xs uppercase tracking-[0.14em] transition-colors ${
                        activeSection === section.id
                          ? 'text-accent'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-70">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display font-medium">
                        {renderQxText(section.label)}
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

  if (variant === 'qx0') {
    return (
      <>
        <nav
          role="navigation"
          aria-label="Catalog sections"
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
            scrolled || isOpen
              ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm'
              : 'bg-white'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between h-11 sm:h-14 transition-all duration-300">
              {backToCatalogListHref ? (
                <a
                  href={backToCatalogListHref}
                  className="font-display font-black text-xl tracking-tighter text-slate-900 !rounded-none"
                  aria-label="Back to catalog list"
                >
                  {renderBrand('h-7 w-auto object-contain rounded-none')}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('cover')}
                  className="font-display font-black text-xl tracking-tighter text-slate-900 !rounded-none"
                  aria-label={`${brandLabel} - back to top`}
                >
                  {renderBrand('h-7 w-auto object-contain !rounded-none')}
                </button>
              )}

              <ul
                className="hidden lg:flex items-stretch h-full flex-1 justify-end"
                role="list"
              >
                {visibleSections.map((section) => (
                  <li key={section.id} className="h-full">
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`h-full px-6 text-sm font-medium transition-colors !rounded-none flex items-center ${
                        activeSection === section.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      aria-current={
                        activeSection === section.id ? 'true' : undefined
                      }
                    >
                      {renderQxText(section.label)}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden ml-4 p-2 text-slate-900 hover:bg-slate-100 !rounded-none transition-colors"
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
              className="lg:hidden fixed top-[44px] sm:top-[56px] left-0 right-0 z-[59] border-b border-slate-200 bg-white shadow-xl !rounded-none"
            >
              <ul className="flex flex-col !rounded-none" role="list">
                {visibleSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`w-full p-5 text-left text-base font-medium transition-colors border-b border-slate-100 last:border-0 !rounded-none ${
                        activeSection === section.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {renderQxText(section.label)}
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
            scrolled || isOpen ? 'py-3' : 'py-5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div
              className={`flex items-center justify-between gap-3 rounded-sm border px-4 sm:px-5 py-2 backdrop-blur-xl transition-all duration-300 ${
                scrolled || isOpen
                  ? 'bg-background/90 border-border shadow-[0_14px_36px_hsl(0_0%_8%/0.16)]'
                  : 'bg-background/70 border-border/50 shadow-[0_8px_24px_hsl(0_0%_8%/0.08)]'
              }`}
            >
              {backToCatalogListHref ? (
                <a
                  href={backToCatalogListHref}
                  className="inline-flex items-center min-h-[44px] shrink-0"
                  aria-label="Back to catalog list"
                >
                  {renderQx1Brand()}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo('cover')}
                  className="inline-flex items-center min-h-[44px] shrink-0"
                  aria-label={`${brandLabel} - back to top`}
                >
                  {renderQx1Brand()}
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 min-h-[46px] rounded-full bg-foreground text-background px-3 py-2 hover:scale-[1.03] transition-transform shadow-lg shrink-0"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="hidden sm:inline text-[11px] font-body uppercase tracking-[0.24em]">
                  {isOpen ? 'Close' : 'Menu'}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15">
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </span>
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-50 bg-[hsl(var(--background)/0.92)] backdrop-blur-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 32 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-7xl mx-auto h-full w-full px-6 sm:px-8 pt-28 pb-10"
              >
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-border/70 pb-4">
                  <p className="font-display text-3xl leading-tight text-foreground">
                    {renderQxText('QX-1 Workspace System')}
                  </p>
                  <p className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {renderQxText('METRO Collection / QX-1')}
                  </p>
                </div>

                <ul className="grid content-start gap-3 sm:gap-4" role="list">
                  {visibleSections.map((section, idx) => (
                    <motion.li
                      key={section.id}
                      initial={{ opacity: 0, y: 36 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.05, duration: 0.35 }}
                    >
                      <button
                        onClick={() => scrollTo(section.id)}
                        className={`w-full min-h-[56px] inline-flex items-baseline gap-4 text-left transition-colors ${
                          activeSection === section.id
                            ? 'text-accent'
                            : 'text-foreground hover:text-accent/75'
                        }`}
                        aria-current={
                          activeSection === section.id ? 'true' : undefined
                        }
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display leading-[0.92] tracking-[-0.02em] text-[clamp(2rem,6vw,4.5rem)]">
                          {renderQxText(section.label)}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
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
            ? 'bg-white/30 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm'
            : 'bg-white py-4 shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between">
            {backToCatalogListHref ? (
              <a
                href={backToCatalogListHref}
                className="font-display font-black text-xl tracking-tighter text-slate-900"
                aria-label="Back to catalog list"
              >
                {renderBrand('h-7 w-auto object-contain')}
              </a>
            ) : (
              <button
                onClick={() => scrollTo('cover')}
                className="font-display font-black text-xl tracking-tighter text-slate-900"
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
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-200'
                    }`}
                    aria-current={
                      activeSection === section.id ? 'true' : undefined
                    }
                  >
                    {renderQxText(section.label)}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden ml-4 p-2 text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
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
            className="lg:hidden fixed top-[72px] left-0 right-0 z-[59] border-b border-slate-200 bg-white shadow-xl"
          >
            <ul className="flex flex-col p-4" role="list">
              {visibleSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`w-full p-4 text-left text-base font-medium transition-colors ${
                      activeSection === section.id
                        ? 'text-slate-900 bg-slate-50 rounded-md'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {renderQxText(section.label)}
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
