import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import type { DimensionsData } from '@/types/catalog';

interface DimensionsSectionProps {
  data: DimensionsData;
}

const DimensionsSection = ({ data }: DimensionsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const diagram = data.dimensionDiagram || {
    width: '1600 mm',
    depth: '800 mm',
    heightRange: '650–1300 mm',
  };

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
            {data.sectionLabel}
          </p>
          <h2
            id="dimensions-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {data.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-transparent p-0 lg:p-8 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 600 350"
              className="w-full h-auto"
              role="img"
              aria-label={`Technical dimension drawing showing width ${diagram.width}, depth ${diagram.depth}, height range ${diagram.heightRange}`}
            >
              <rect
                x="100"
                y="120"
                width="400"
                height="12"
                rx="2"
                fill="hsl(35, 40%, 65%)"
              />
              <rect
                x="120"
                y="132"
                width="8"
                height="150"
                rx="1"
                fill="hsl(220, 10%, 30%)"
              />
              <rect
                x="472"
                y="132"
                width="8"
                height="150"
                rx="1"
                fill="hsl(220, 10%, 30%)"
              />
              <rect
                x="120"
                y="275"
                width="60"
                height="8"
                rx="1"
                fill="hsl(220, 10%, 30%)"
              />
              <rect
                x="420"
                y="275"
                width="60"
                height="8"
                rx="1"
                fill="hsl(220, 10%, 30%)"
              />
              <line
                x1="100"
                y1="100"
                x2="500"
                y2="100"
                stroke="hsl(30, 60%, 52%)"
                strokeWidth="1.5"
              />
              <line
                x1="100"
                y1="94"
                x2="100"
                y2="106"
                stroke="hsl(30, 60%, 52%)"
                strokeWidth="1.5"
              />
              <line
                x1="500"
                y1="94"
                x2="500"
                y2="106"
                stroke="hsl(30, 60%, 52%)"
                strokeWidth="1.5"
              />
              <text
                x="300"
                y="93"
                textAnchor="middle"
                fill="hsl(30, 60%, 52%)"
                fontSize="13"
                fontFamily="Inter"
              >
                {diagram.width}
              </text>
              <line
                x1="540"
                y1="120"
                x2="540"
                y2="283"
                stroke="hsl(30, 60%, 52%)"
                strokeWidth="1.5"
              />
              <line
                x1="534"
                y1="120"
                x2="546"
                y2="120"
                stroke="hsl(30, 60%, 52%)"
                strokeWidth="1.5"
              />
              <line
                x1="534"
                y1="283"
                x2="546"
                y2="283"
                stroke="hsl(30, 60%, 52%)"
                strokeWidth="1.5"
              />
              <text
                x="560"
                y="205"
                textAnchor="start"
                fill="hsl(30, 60%, 52%)"
                fontSize="12"
                fontFamily="Inter"
              >
                {diagram.heightRange.replace(' mm', '')}
              </text>
              <text
                x="560"
                y="220"
                textAnchor="start"
                fill="hsl(30, 60%, 52%)"
                fontSize="12"
                fontFamily="Inter"
              >
                mm
              </text>
              <text
                x="300"
                y="330"
                textAnchor="middle"
                fill="hsl(220, 10%, 46%)"
                fontSize="12"
                fontFamily="Inter"
              >
                Depth: {diagram.depth}
              </text>
            </svg>
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
                  <dt className="text-muted-foreground text-base">{s.label}</dt>
                  <dd className="text-foreground text-base font-bold text-right">
                    {s.value}
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
                    {c}
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
