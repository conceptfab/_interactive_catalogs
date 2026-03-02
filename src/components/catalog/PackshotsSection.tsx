'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { PackshotsData, PackshotItem } from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface PackshotsSectionProps {
  data: PackshotsData;
  theme?: string;
}

// ── qx0: Clean catalog grid ───────────────────────────────────────
function DefaultCard({ item }: { item: PackshotItem }) {
  return (
    <div className="group border border-border bg-background overflow-hidden">
      <div className="bg-surface/30 mix-blend-multiply p-4 flex items-center justify-center aspect-square">
        <img
          src={item.image}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>
      <div className="p-3 border-t border-border">
        <p className="font-mono text-xs font-semibold text-foreground tracking-wide">
          {item.code}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {item.colorHex && (
            <span
              className="w-2.5 h-2.5 rounded-full border border-border flex-shrink-0"
              style={{ backgroundColor: item.colorHex }}
              aria-hidden="true"
            />
          )}
          <p className="text-xs text-muted-foreground">{item.colorName}</p>
        </div>
      </div>
    </div>
  );
}

// ── qx1: Functional / compact ─────────────────────────────────────
function FunctionalCard({ item }: { item: PackshotItem }) {
  return (
    <div className="group">
      <div className="bg-surface/20 p-3 flex items-center justify-center aspect-square">
        <img
          src={item.image}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="pt-2 pb-1 px-0.5">
        <p className="font-mono text-[11px] font-bold text-foreground leading-tight tracking-wide">
          {item.code}
        </p>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
          {item.colorName}
          {item.colorCode && (
            <span className="text-muted-foreground/50"> · {item.colorCode}</span>
          )}
        </p>
      </div>
    </div>
  );
}

// ── qx2: Premium elevated ─────────────────────────────────────────
function PremiumCard({ item }: { item: PackshotItem }) {
  return (
    <div className="group bg-background shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="bg-surface/20 mix-blend-multiply p-6 lg:p-8 flex items-center justify-center aspect-square relative">
        <img
          src={item.image}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        {item.colorHex && (
          <span
            className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: item.colorHex }}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="px-5 py-4 border-t border-border/50">
        <p className="font-mono text-sm font-semibold text-foreground tracking-wide">
          {item.code}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.colorName}</p>
      </div>
    </div>
  );
}

// ── qx3: Dark precision ───────────────────────────────────────────
function DarkCard({ item }: { item: PackshotItem }) {
  return (
    <div className="group bg-[#060606] p-4 flex flex-col hover:bg-white/[0.035] transition-colors duration-200">
      <div className="flex-1 flex items-center justify-center aspect-square">
        <img
          src={item.image}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-300"
          loading="lazy"
        />
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75">
          {item.code}
        </p>
        {item.colorCode && (
          <p className="font-mono text-[10px] text-white/25 mt-0.5 tracking-widest">
            {item.colorCode}
          </p>
        )}
      </div>
    </div>
  );
}

// ── qx4: Blush warm / editorial ──────────────────────────────────
function WarmCard({ item }: { item: PackshotItem }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-5 sm:p-7 flex items-center justify-center aspect-square">
        <img
          src={item.image}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="px-4 py-3 bg-[#fdf8f2] border-t border-[#ece5dc]">
        <p className="font-mono text-[11px] text-[#9a8a7e] tracking-widest uppercase">
          {item.code}
        </p>
        <p className="text-sm font-display text-[#5a4a3e] font-medium mt-0.5 italic">
          {item.colorName}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
const PackshotsSection = ({ data, theme = 'qx0' }: PackshotsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const isDark = theme === 'qx3';
  const isWarm = theme === 'qx4';
  const isPremium = theme === 'qx2';
  const isFunctional = theme === 'qx1';

  const sectionBg = isDark
    ? 'bg-[#060606] text-white'
    : isWarm
      ? 'bg-[#fdf8f2]'
      : 'bg-background';

  return (
    <section
      id="packshots"
      aria-labelledby="packshots-title"
      className={`section-padding ${sectionBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className={`mb-12 ${isWarm ? 'text-center' : ''}`}
        >
          <p
            className={`font-display font-semibold text-sm uppercase mb-4 ${
              isDark
                ? 'font-mono tracking-[0.3em] text-white/30'
                : 'tracking-[0.2em] text-accent'
            }`}
          >
            {renderQxText(data.sectionLabel)}
          </p>
          <h2
            id="packshots-title"
            className={`font-display font-bold ${isDark ? 'text-white' : 'text-foreground'}`}
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {renderQxText(data.title)}
          </h2>
          {data.subtitle && (
            <p className={`mt-3 text-sm ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* Groups */}
        <div
          className={
            isDark
              ? 'divide-y divide-white/[0.04]'
              : isFunctional
                ? 'space-y-8'
                : 'space-y-14'
          }
        >
          {data.groups.map((group, gi) => {
            const gridCols = (() => {
              if (isFunctional)  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3';
              if (isPremium)     return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
              if (isDark)        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-px';
              if (isWarm)        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5';
              return             'grid-cols-2 sm:grid-cols-3 gap-4';
            })();

            return (
              <motion.div
                key={group.model}
                initial={{ opacity: 0, y: isDark ? 0 : 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.06 + gi * 0.07 }}
                className={isDark ? 'py-8' : ''}
              >
                {/* Group header */}
                <div
                  className={`flex items-center gap-3 mb-5 pb-3 border-b ${
                    isDark
                      ? 'border-white/[0.06]'
                      : isWarm
                        ? 'border-[#e6ddd4]'
                        : 'border-border'
                  }`}
                >
                  <h3
                    className={`font-display font-bold ${
                      isDark
                        ? 'font-mono text-xs uppercase tracking-[0.25em] text-white/60'
                        : isFunctional
                          ? 'text-base text-foreground'
                          : 'text-lg text-foreground'
                    }`}
                  >
                    {renderQxText(group.label)}
                  </h3>
                  {group.desc && (
                    <span
                      className={`text-sm ${
                        isDark ? 'font-mono text-white/25' : 'text-muted-foreground'
                      }`}
                    >
                      {isDark ? '// ' : ''}{group.desc}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div
                  className={`grid ${gridCols} ${isDark ? 'bg-white/[0.02]' : ''}`}
                >
                  {group.items.map((item: PackshotItem) => {
                    if (isDark)       return <DarkCard      key={item.code} item={item} />;
                    if (isWarm)       return <WarmCard      key={item.code} item={item} />;
                    if (isPremium)    return <PremiumCard   key={item.code} item={item} />;
                    if (isFunctional) return <FunctionalCard key={item.code} item={item} />;
                    return                   <DefaultCard   key={item.code} item={item} />;
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackshotsSection;
