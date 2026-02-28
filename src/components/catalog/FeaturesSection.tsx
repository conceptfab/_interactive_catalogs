import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { FeaturesData } from '@/types/catalog';
import { getIcon } from '@/lib/icon-map';
import { renderQxText } from './renderQxText';

interface FeaturesSectionProps {
  data: FeaturesData;
}

const FeaturesSection = ({ data }: FeaturesSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section
      id="features"
      className="section-padding bg-surface"
      aria-labelledby="features-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.2em] mb-4">
            {renderQxText(data.sectionLabel)}
          </p>
          <h2
            id="features-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {renderQxText(data.title)}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div
            className="space-y-2 lg:col-span-1"
            role="tablist"
            aria-label="Product features"
          >
            {data.items.map((f, i) => {
              const Icon = getIcon(f.icon);
              return (
                <button
                  key={f.title}
                  role="tab"
                  aria-selected={activeFeature === i}
                  onClick={() => setActiveFeature(i)}
                  className={`w-full text-left px-6 py-5 flex items-center gap-4 transition-all min-h-[44px] rounded-xl ${activeFeature === i
                      ? 'bg-foreground text-background shadow-lg scale-105'
                      : 'hover:bg-muted text-foreground'
                    }`}
                >
                  <Icon
                    size={24}
                    className={
                      activeFeature === i
                        ? 'text-background'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }
                  />
                  <span
                    className={`font-display text-lg font-bold ${activeFeature === i
                        ? 'text-background'
                        : 'text-foreground'
                      }`}
                  >
                    {renderQxText(f.title)}
                  </span>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
            className="lg:col-span-2 bg-transparent p-8 lg:p-12 flex flex-col justify-center rounded-xl"
          >
            {(() => {
              const f = data.items[activeFeature];
              const Icon = getIcon(f.icon);
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-warm-light flex items-center justify-center">
                      <Icon size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-xl">
                        {renderQxText(f.title)}
                      </h3>
                      <span className="text-xs font-medium text-accent bg-warm-light px-2 py-0.5 rounded">
                        {renderQxText(f.badge)}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {renderQxText(f.desc)}
                  </p>
                </>
              );
            })()}

            <div className="mt-12 bg-muted/50 p-8 rounded-xl">
              <div className="flex items-center justify-center h-40">
                <motion.div
                  className="w-48 h-3 bg-border rounded-full relative"
                  aria-hidden="true"
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-accent"
                    animate={{ width: ['20%', '80%', '50%', '20%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Interactive demonstration — animation placeholder
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
