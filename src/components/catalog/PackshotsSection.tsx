"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type {
  PackshotsData,
  PackshotGroup,
  PackshotItem,
} from "@/types/catalog";
import { renderQxText } from "./renderQxText";
import { responsiveImg } from "@/lib/responsive-image";

interface PackshotsSectionProps {
  data: PackshotsData;
  theme?: string;
  catalogId?: string;
}

const ADJUSTABLE_DESK_LABEL = "Height-adjustable desk";

function hasAdjustableMarker(value?: string): boolean {
  if (!value) return false;

  const modelToken = value.toUpperCase().split(/[\\/_-]/)[0];

  return modelToken.includes("R");
}

function isAdjustableGroup(group: PackshotGroup): boolean {
  if (hasAdjustableMarker(group.model) || hasAdjustableMarker(group.label)) {
    return true;
  }

  return group.items.some((item) => hasAdjustableMarker(item.code));
}

function resolveGroupDescription(
  group: PackshotGroup,
  addAdjustableLabel: boolean,
): string | undefined {
  if (addAdjustableLabel && isAdjustableGroup(group)) {
    return ADJUSTABLE_DESK_LABEL;
  }

  return group.desc?.trim() || undefined;
}

// ── qx0: Clean catalog grid ───────────────────────────────────────
function DefaultCard({ item }: { item: PackshotItem }) {
  return (
    <div className="group bg-background overflow-hidden">
      <img
        src={item.image}
        {...responsiveImg(item.image, "packshot")}
        draggable={true}
        alt={`${item.code} – ${item.colorName}`}
        className="block w-full aspect-[3/2] object-cover object-[center_84%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="p-3">
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
      <div className="bg-surface/20 p-0 flex items-end justify-center aspect-[16/9] overflow-hidden">
        <img
          src={item.image}
          {...responsiveImg(item.image, "packshot")}
          draggable={true}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-cover object-[center_82%]"
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
            <span className="text-muted-foreground/50">
              {" "}
              · {item.colorCode}
            </span>
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
      <div className="bg-surface/20 mix-blend-multiply p-0 flex items-end justify-center aspect-[16/9] overflow-hidden relative">
        <img
          src={item.image}
          {...responsiveImg(item.image, "packshot")}
          draggable={true}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-cover object-[center_82%]"
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
          {...responsiveImg(item.image, "packshot")}
          draggable={true}
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
          {...responsiveImg(item.image, "packshot")}
          draggable={true}
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

// ── qx5: Linear premium / architectural ──────────────────────────
function LinearCard({ item }: { item: PackshotItem }) {
  return (
    <div className="packshot-linear-card group bg-transparent overflow-hidden text-left">
      <div className="packshot-linear-media p-0 flex items-end justify-center aspect-[4/3]">
        <img
          src={item.image}
          {...responsiveImg(item.image, "packshot")}
          draggable={true}
          alt={`${item.code} – ${item.colorName}`}
          className="w-full h-full object-cover object-[center_84%] transition-transform duration-500 group-hover:scale-[1.015]"
          loading="lazy"
        />
      </div>
      <div className="packshot-linear-caption px-0 py-2 bg-transparent text-left">
        <p className="packshot-linear-code font-mono text-[11px] text-[#111] tracking-[0.18em] uppercase">
          {item.code}
        </p>
        <p className="packshot-linear-color text-[11px] text-[#555] uppercase tracking-[0.12em] mt-0.5">
          {item.colorName}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
const PackshotsSection = ({
  data,
  theme = "qx0",
  catalogId,
}: PackshotsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const normalizedTheme = theme.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedCatalogId = catalogId?.toUpperCase();
  const isQxCatalog = normalizedCatalogId?.startsWith("QX") ?? false;

  const isDark = normalizedTheme === "qx3" || normalizedCatalogId === "QX-3";
  const isLinear = normalizedTheme === "qx5" || normalizedCatalogId === "QX-5";
  const isWarm = normalizedTheme === "qx4" || normalizedCatalogId === "QX-4";
  const isPremium = normalizedTheme === "qx2" || normalizedCatalogId === "QX-2";
  const isFunctional =
    normalizedTheme === "qx1" || normalizedCatalogId === "QX-1";

  const sectionBg = isDark
    ? "bg-[#060606] text-white"
    : isLinear
      ? "bg-[#f2f2f2]"
      : isWarm
        ? "bg-[#fdf8f2]"
        : "bg-background";

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
          className={`mb-12 ${isWarm ? "text-center" : ""}`}
        >
          <p
            className={`font-display font-semibold text-sm uppercase mb-4 ${
              isDark
                ? "font-mono tracking-[0.3em] text-white/30"
                : "tracking-[0.2em] text-accent"
            }`}
          >
            {renderQxText(data.sectionLabel)}
          </p>
          <h2
            id="packshots-title"
            className={`font-display font-bold ${isDark ? "text-white" : "text-foreground"}`}
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            {renderQxText(data.title)}
          </h2>
          {data.subtitle && (
            <p
              className={`mt-3 text-sm ${isDark ? "text-white/40" : "text-muted-foreground"}`}
            >
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* Groups */}
        <div
          className={
            isDark
              ? "divide-y divide-white/[0.04]"
              : isFunctional
                ? "space-y-8"
                : "space-y-14"
          }
        >
          {data.groups.map((group, gi) => {
            const groupDescription = resolveGroupDescription(
              group,
              isQxCatalog,
            );
            const gridCols = (() => {
              if (isFunctional)
                return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3";
              if (isPremium)
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
              if (isDark)
                return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-px";
              if (isLinear)
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0";
              if (isWarm)
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";
              return "grid-cols-2 sm:grid-cols-3 gap-4";
            })();

            return (
              <motion.div
                key={group.model}
                initial={{ opacity: 0, y: isDark ? 0 : 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.06 + gi * 0.07 }}
                className={isDark ? "py-8" : ""}
              >
                {/* Group header */}
                <div
                  className={`flex items-center gap-3 mb-5 pb-3 border-b ${
                    isDark
                      ? "border-white/[0.06]"
                      : isLinear
                        ? "border-[#555]"
                        : isWarm
                          ? "border-[#e6ddd4]"
                          : "border-border"
                  }`}
                >
                  <h3
                    className={`font-display font-bold ${
                      isDark
                        ? "font-mono text-xs uppercase tracking-[0.25em] text-white/60"
                        : isLinear
                          ? "text-base uppercase tracking-[0.14em] text-[#111]"
                          : isFunctional
                            ? "text-base text-foreground"
                            : "text-lg text-foreground"
                    }`}
                  >
                    {renderQxText(group.label)}
                  </h3>
                  {groupDescription && (
                    <span
                      className={`text-sm ${
                        isDark
                          ? "font-mono text-white/25"
                          : isLinear
                            ? "text-[#555]"
                            : "text-muted-foreground"
                      }`}
                    >
                      {isDark ? "// " : ""}
                      {groupDescription}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div
                  className={`grid ${gridCols} ${isDark ? "bg-white/[0.02]" : ""}`}
                >
                  {group.items.map((item: PackshotItem) => {
                    if (isDark) return <DarkCard key={item.code} item={item} />;
                    if (isLinear)
                      return <LinearCard key={item.code} item={item} />;
                    if (isWarm) return <WarmCard key={item.code} item={item} />;
                    if (isPremium)
                      return <PremiumCard key={item.code} item={item} />;
                    if (isFunctional)
                      return <FunctionalCard key={item.code} item={item} />;
                    return <DefaultCard key={item.code} item={item} />;
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
