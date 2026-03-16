'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import type { MaterialsConfiguratorOption, MaterialsData } from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface MaterialsSectionProps {
  data: MaterialsData;
}

interface MaterialsOptionGroupProps {
  title: string;
  options: MaterialsConfiguratorOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const EMPTY_MATERIAL_OPTIONS: MaterialsConfiguratorOption[] = [];

function MaterialsOptionGroup({
  title,
  options,
  selectedId,
  onSelect,
}: MaterialsOptionGroupProps) {
  const selectedOption = options.find((option) => option.id === selectedId);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {renderQxText(title)}
        </h3>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {renderQxText(selectedOption?.label ?? '')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`rounded-2xl border p-2 text-left transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                  : 'border-border bg-background hover:border-accent/40 hover:bg-accent/5'
              }`}
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-muted/40">
                <img
                  src={option.thumbnail}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {renderQxText(option.label)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MaterialsSection = ({ data }: MaterialsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const frameOptions = data.configurator?.frameOptions ?? EMPTY_MATERIAL_OPTIONS;
  const desktopOptions =
    data.configurator?.desktopOptions ?? EMPTY_MATERIAL_OPTIONS;
  const hasConfigurator = frameOptions.length > 0 && desktopOptions.length > 0;
  const [selectedFrameId, setSelectedFrameId] = useState(
    frameOptions[0]?.id ?? '',
  );
  const [selectedDesktopId, setSelectedDesktopId] = useState(
    desktopOptions[0]?.id ?? '',
  );

  useEffect(() => {
    setSelectedFrameId((current) =>
      frameOptions.some((option) => option.id === current)
        ? current
        : (frameOptions[0]?.id ?? ''),
    );
  }, [frameOptions]);

  useEffect(() => {
    setSelectedDesktopId((current) =>
      desktopOptions.some((option) => option.id === current)
        ? current
        : (desktopOptions[0]?.id ?? ''),
    );
  }, [desktopOptions]);

  const selectedFrame =
    frameOptions.find((option) => option.id === selectedFrameId) ??
    frameOptions[0];
  const selectedDesktop =
    desktopOptions.find((option) => option.id === selectedDesktopId) ??
    desktopOptions[0];
  const configuratorAlt =
    selectedFrame && selectedDesktop
      ? `Metro desk with desktop ${selectedDesktop.label} and frame ${selectedFrame.label}`
      : data.detailImageAlt;

  return (
    <section
      id="materials"
      className="section-padding bg-background"
      aria-labelledby="materials-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center"
        >
          <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {renderQxText(data.sectionLabel)}
          </p>
          <h2
            id="materials-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {renderQxText(data.title)}
          </h2>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            {hasConfigurator && selectedFrame && selectedDesktop ? (
              <>
                <figure className="relative mb-4 overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,238,230,0.9))] shadow-2xl">
                  <div
                    className="relative aspect-square"
                    role="img"
                    aria-label={configuratorAlt}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(232,224,211,0.52)_55%,rgba(216,207,191,0.18)_100%)]" />

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={`frame-${selectedFrame.image}`}
                        src={selectedFrame.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-contain p-5 sm:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      />
                    </AnimatePresence>

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={`desktop-${selectedDesktop.image}`}
                        src={selectedDesktop.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-contain p-5 sm:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      />
                    </AnimatePresence>
                  </div>
                </figure>

                <div className="space-y-1 px-4 text-center">
                  <p className="materials-detail-caption text-sm text-muted-foreground">
                    {renderQxText(data.detailImageCaption)}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                    {renderQxText(
                      `Desktop ${selectedDesktop.label} / Frame ${selectedFrame.label}`,
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                <figure className="group relative mb-4 overflow-hidden shadow-2xl">
                  <img
                    src={data.detailImage}
                    alt={data.detailImageAlt}
                    className="aspect-square h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </figure>
                <p className="materials-detail-caption px-4 text-center text-sm text-muted-foreground">
                  {renderQxText(data.detailImageCaption)}
                </p>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {data.materials.map((material) => (
              <div key={material.name} className="border-l-2 border-accent pl-6">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {renderQxText(material.name)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {renderQxText(material.desc)}
                </p>
                <p className="mt-2 text-xs font-medium text-accent">
                  {renderQxText(material.specs)}
                </p>
              </div>
            ))}

            {hasConfigurator ? (
              <div className="space-y-6">
                <MaterialsOptionGroup
                  title="Frame Colours"
                  options={frameOptions}
                  selectedId={selectedFrame?.id}
                  onSelect={setSelectedFrameId}
                />
                <MaterialsOptionGroup
                  title="Desktop Colours"
                  options={desktopOptions}
                  selectedId={selectedDesktop?.id}
                  onSelect={setSelectedDesktopId}
                />
              </div>
            ) : (
              <div>
                <h3 className="mb-4 font-display font-semibold text-foreground">
                  Colour & Decor Palette
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {data.swatches.map((swatch) => (
                    <div key={swatch.name} className="text-center">
                      <div
                        className="aspect-square w-full shadow-md transition-transform hover:scale-110"
                        style={{ backgroundColor: swatch.hex }}
                        role="img"
                        aria-label={`${swatch.name} colour swatch`}
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {renderQxText(swatch.name)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
