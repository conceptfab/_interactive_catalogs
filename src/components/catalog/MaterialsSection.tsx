import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { MaterialsData } from '@/types/catalog';

interface MaterialsSectionProps {
  data: MaterialsData;
}

const MaterialsSection = ({ data }: MaterialsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="materials"
      className="section-padding bg-background"
      aria-labelledby="materials-title"
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
            id="materials-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {data.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <figure className="overflow-hidden shadow-2xl mb-4 group relative">
              <img
                src={data.detailImage}
                alt={data.detailImageAlt}
                className="w-full h-auto aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </figure>
            <p className="text-sm text-muted-foreground text-center px-4">
              {data.detailImageCaption}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {data.materials.map((m) => (
              <div key={m.name} className="border-l-2 border-accent pl-6">
                <h3 className="font-display font-semibold text-foreground text-lg">
                  {m.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  {m.desc}
                </p>
                <p className="text-xs text-accent font-medium mt-2">
                  {m.specs}
                </p>
              </div>
            ))}

            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">
                Colour & Décor Palette
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {data.swatches.map((s) => (
                  <div key={s.name} className="text-center group">
                    <div
                      className="w-full aspect-square group-hover:scale-110 transition-transform shadow-md"
                      style={{ backgroundColor: s.hex }}
                      role="img"
                      aria-label={`${s.name} colour swatch`}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {s.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
