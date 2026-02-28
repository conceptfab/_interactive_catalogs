import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import type { DimensionsData } from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface DimensionsSectionProps {
  data: DimensionsData;
}

const DimensionsSection = ({ data }: DimensionsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="dimensions"
      className="section-padding bg-surface"
      aria-labelledby="dimensions-title"
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
            id="dimensions-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {renderQxText(data.title)}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-transparent p-0 lg:p-8 flex items-center justify-center"
          >
            <Image
              src="/axo.svg"
              alt="Technical dimension drawing"
              width={842}
              height={842}
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h3 className="font-display font-bold text-2xl text-foreground mb-6">
              Technical Specifications
            </h3>
            <dl className="space-y-4">
              {data.specs.map((s) => (
                <div
                  key={s.label}
                  className="py-2 flex justify-between gap-4 border-b border-border/50"
                >
                  <dt className="text-muted-foreground text-base">
                    {renderQxText(s.label)}
                  </dt>
                  <dd className="text-foreground text-base font-bold text-right">
                    {renderQxText(s.value)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award size={18} className="text-accent" />
                Certifications
              </h3>
              <ul className="space-y-2">
                {data.certifications.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle
                      size={16}
                      className="text-success mt-0.5 shrink-0"
                    />
                    {renderQxText(c)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DimensionsSection;
