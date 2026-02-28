import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { OverviewData } from '@/types/catalog';
import { getIcon } from '@/lib/icon-map';
import { renderQxText } from './renderQxText';

interface OverviewSectionProps {
  data: OverviewData;
}

const OverviewSection = ({ data }: OverviewSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="overview"
      className="section-padding bg-background"
      aria-labelledby="overview-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              {renderQxText(data.sectionLabel)}
            </p>
            <h2
              id="overview-title"
              className="font-display font-bold text-foreground leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
            >
              {renderQxText(data.title)}
              {data.titleLine2 && (
                <>
                  <br />
                  {renderQxText(data.titleLine2)}
                </>
              )}
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground font-body text-base leading-relaxed max-w-lg">
              {data.paragraphs.map((p, i) => (
                <p key={i}>{renderQxText(p)}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {data.quickLinkLabels.map((label) => (
                <button
                  key={label}
                  onClick={() =>
                    document
                      .getElementById(label.toLowerCase())
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-bold tracking-wide hover:scale-105 transition-transform min-h-[44px]"
                >
                  {renderQxText(label)}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <figure className="w-full overflow-hidden bg-transparent">
              <div className="relative aspect-auto bg-surface/50 mix-blend-multiply flex items-center justify-center p-8 lg:p-12">
                <img
                  src={data.packshotImage}
                  alt={data.packshotImageAlt}
                  className="w-full h-auto object-contain max-h-[600px] hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-6 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
                {renderQxText(data.packshotCaption)}
              </figcaption>
            </figure>
          </motion.div>
        </div>

        <div className="mt-32 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {data.features.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="group"
              >
                <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-display font-black text-foreground text-xl mb-2">
                  {renderQxText(f.title)}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {renderQxText(f.desc)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
