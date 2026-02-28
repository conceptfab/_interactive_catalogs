import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { VariantsData } from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface VariantsSectionProps {
  data: VariantsData;
}

const VariantsSection = ({ data }: VariantsSectionProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const basicLabel = data.comparisonBasicLabel ?? 'Basic';
  const premiumLabel = data.comparisonPremiumLabel ?? 'Premium';

  return (
    <section
      id="variants"
      className="section-padding bg-background"
      aria-labelledby="variants-title"
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
            id="variants-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {renderQxText(data.title)}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="sticky top-24"
          >
            <div
              className="w-full bg-surface/30 mix-blend-multiply p-8 lg:p-12 flex justify-center items-center relative transition-all duration-300 group"
              style={{
                filter:
                  selectedColor > 2
                    ? `hue-rotate(${selectedColor * 20}deg) saturate(0.5)`
                    : 'none',
              }}
            >
              <img
                src={data.previewImage}
                alt={`Desk in ${data.desktopColors[selectedColor].name} finish with ${data.frameColors[selectedFrame].name} frame`}
                className="w-full h-auto object-contain max-h-[500px] group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <div className="mt-6 text-center" aria-live="polite">
              <p className="font-display font-semibold text-foreground text-lg">
                {renderQxText(data.sizes[selectedSize].label)}
              </p>
              <p className="text-sm text-muted-foreground">
                {renderQxText(data.desktopColors[selectedColor].name)} /{' '}
                {renderQxText(data.frameColors[selectedFrame].name)} Frame /{' '}
                {renderQxText(data.sizes[selectedSize].label)} mm
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-10"
          >
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Desktop Finish
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select your desktop colour -{' '}
                {renderQxText(data.desktopColors[selectedColor].name)}
                {data.desktopColors[selectedColor].ral &&
                  ` (${data.desktopColors[selectedColor].ral})`}
              </p>
              <div
                className="flex flex-wrap gap-3"
                role="radiogroup"
                aria-label="Desktop colour"
              >
                {data.desktopColors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(i)}
                    role="radio"
                    aria-checked={selectedColor === i}
                    className={`w-12 h-12 rounded-full border-2 transition-all min-h-[44px] min-w-[44px] ${
                      selectedColor === i
                        ? 'border-accent scale-110 shadow-md'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ backgroundColor: c.code }}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Frame Colour
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {renderQxText(data.frameColors[selectedFrame].name)}
              </p>
              <div
                className="flex gap-3"
                role="radiogroup"
                aria-label="Frame colour"
              >
                {data.frameColors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedFrame(i)}
                    role="radio"
                    aria-checked={selectedFrame === i}
                    className={`w-12 h-12 rounded-full border-2 transition-all min-h-[44px] min-w-[44px] ${
                      selectedFrame === i
                        ? 'border-accent scale-110 shadow-md'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ backgroundColor: c.code }}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">
                Desk Size
              </h3>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                role="radiogroup"
                aria-label="Desk size"
              >
                {data.sizes.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(i)}
                    role="radio"
                    aria-checked={selectedSize === i}
                    className={`p-4 text-left transition-all min-h-[44px] ${
                      selectedSize === i
                        ? 'border-b-2 border-foreground'
                        : 'border-b-2 border-transparent text-muted-foreground hover:border-muted'
                    }`}
                  >
                    <span className="font-display font-bold text-base block">
                      {renderQxText(s.label)}
                    </span>
                    <span className="text-xs">{renderQxText(s.desc)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">
                Quick Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 font-semibold text-foreground">
                        Feature
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        {renderQxText(basicLabel)}
                      </th>
                      <th className="text-left py-3 pl-4 font-semibold text-foreground">
                        {renderQxText(premiumLabel)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {data.comparisonTable.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-3 pr-4">{renderQxText(row.feature)}</td>
                        <td className="py-3 px-4">{renderQxText(row.basic)}</td>
                        <td className="py-3 pl-4 text-foreground font-medium">
                          {renderQxText(row.premium)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VariantsSection;
