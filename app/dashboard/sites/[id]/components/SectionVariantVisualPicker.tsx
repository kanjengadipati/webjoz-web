"use client";

import React, { useState, useMemo } from "react";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";
import {
  Check,
  ChevronDown,
} from "lucide-react";

interface SectionVariantVisualPickerProps {
  sectionKey: string;
  isDynamic: boolean;
  designToken: any;
  updateSectionVariant: (section: string, value: string) => void;
  getEnabledVariants: (section: string, variants: string[]) => string[];
  t: any;
  compact?: boolean;
}

// Mini SVG wireframe illustrations for section layouts
function VariantWireframe({ section, variant }: { section: string; variant: string }) {
  // Specialized wireframes based on section & variant
  if (variant === "split" || variant === "split-image" || variant === "split-editorial" || variant === "classic-split") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex items-center gap-1.5 overflow-hidden">
        <div className="w-1/2 flex flex-col justify-center gap-1 pl-1">
          <div className="w-4/5 h-1.5 rounded-full bg-primary/70" />
          <div className="w-full h-1 rounded-full bg-slate-500/50" />
          <div className="w-3/5 h-1 rounded-full bg-slate-500/40" />
          <div className="w-2/5 h-1.5 rounded-xs bg-primary/40 mt-0.5" />
        </div>
        <div className="w-1/2 h-full rounded-md bg-gradient-to-br from-primary/25 to-violet-500/10 border border-primary/30 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/50" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "centered" || variant === "minimal" || variant === "minimal-centered" || variant === "minimalist-elegant") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex flex-col items-center justify-center gap-1 overflow-hidden">
        <div className="w-3/5 h-1.5 rounded-full bg-primary/70" />
        <div className="w-4/5 h-1 rounded-full bg-slate-500/50" />
        <div className="w-2/4 h-1 rounded-full bg-slate-500/40" />
        <div className="w-1/3 h-2 rounded-sm bg-primary/40 mt-1" />
      </div>
    );
  }

  if (variant === "full-bleed" || variant === "banner" || variant === "overlay-map") {
    return (
      <div className="w-full h-14 rounded-lg bg-gradient-to-br from-slate-900 via-primary/20 to-slate-900 border border-primary/30 p-2 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="relative z-10 w-2/3 h-1.5 rounded-full bg-white/80" />
        <div className="relative z-10 w-3/4 h-1 rounded-full bg-slate-200/60" />
        <div className="relative z-10 w-1/4 h-1.5 rounded-xs bg-primary" />
      </div>
    );
  }

  if (variant === "bento-grid") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 grid grid-cols-3 gap-1 overflow-hidden">
        <div className="col-span-2 row-span-2 rounded bg-primary/20 border border-primary/30 p-1 flex flex-col justify-between">
          <div className="w-3/4 h-1 rounded-full bg-primary/70" />
          <div className="w-full h-1 rounded-full bg-slate-500/40" />
        </div>
        <div className="rounded bg-slate-800/60 border border-white/10 p-1">
          <div className="w-full h-1 rounded-full bg-slate-400/50" />
        </div>
        <div className="rounded bg-slate-800/60 border border-white/10 p-1">
          <div className="w-2/3 h-1 rounded-full bg-slate-400/50" />
        </div>
      </div>
    );
  }

  if (variant === "tech-saas") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex flex-col items-center justify-between overflow-hidden">
        <div className="w-1/3 h-1 rounded-full bg-primary/80" />
        <div className="w-4/5 h-1.5 rounded-full bg-white/80" />
        <div className="w-full h-6 rounded-t-md bg-slate-800/80 border border-slate-700/60 p-1 flex gap-1 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
        </div>
      </div>
    );
  }

  if (variant === "carousel" || variant === "horizontal-swipe-carousel") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex items-center justify-between gap-1 overflow-hidden">
        <div className="w-3 h-full rounded bg-slate-800/40 opacity-40" />
        <div className="flex-1 h-full rounded-md bg-primary/15 border border-primary/30 p-1.5 flex flex-col justify-center gap-1 items-center">
          <div className="w-2/3 h-1.5 rounded-full bg-primary/80" />
          <div className="w-4/5 h-1 rounded-full bg-slate-400/50" />
          <div className="flex gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="w-1 h-1 rounded-full bg-slate-600" />
          </div>
        </div>
        <div className="w-3 h-full rounded bg-slate-800/40 opacity-40" />
      </div>
    );
  }

  if (variant === "accordion" || variant === "accordion-by-category") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex flex-col gap-1 justify-center overflow-hidden">
        <div className="h-3 rounded bg-primary/20 border border-primary/30 px-1.5 flex items-center justify-between">
          <div className="w-1/2 h-1 rounded-full bg-primary/80" />
          <div className="w-1 h-1 border-b border-r border-primary transform rotate-45" />
        </div>
        <div className="h-3 rounded bg-slate-800/60 border border-white/5 px-1.5 flex items-center justify-between">
          <div className="w-2/3 h-1 rounded-full bg-slate-400/50" />
          <div className="w-1 h-1 border-b border-r border-slate-400 transform -rotate-45" />
        </div>
        <div className="h-3 rounded bg-slate-800/60 border border-white/5 px-1.5 flex items-center justify-between">
          <div className="w-3/5 h-1 rounded-full bg-slate-400/50" />
          <div className="w-1 h-1 border-b border-r border-slate-400 transform -rotate-45" />
        </div>
      </div>
    );
  }

  if (variant === "checklist") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex flex-col gap-1 justify-center overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500/30 border border-emerald-500/60 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
            <div className="w-3/4 h-1 rounded-full bg-slate-400/50" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "comparison-table") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1 flex flex-col gap-0.5 justify-center overflow-hidden">
        <div className="grid grid-cols-3 gap-0.5 pb-0.5 border-b border-white/10">
          <div className="h-1 bg-slate-600 rounded-full" />
          <div className="h-1 bg-primary/80 rounded-full" />
          <div className="h-1 bg-slate-500 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-0.5 py-0.5 border-b border-white/5">
          <div className="h-1 bg-slate-700 rounded-full" />
          <div className="h-1 bg-emerald-400 rounded-full" />
          <div className="h-1 bg-rose-400/60 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-0.5 py-0.5">
          <div className="h-1 bg-slate-700 rounded-full" />
          <div className="h-1 bg-emerald-400 rounded-full" />
          <div className="h-1 bg-emerald-400/60 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "counter-row" || variant === "stat-heavy" || variant === "stat-grid") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 grid grid-cols-3 gap-1 items-center overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center p-1 rounded bg-slate-800/40 border border-white/5">
            <div className="w-3/4 h-2 rounded bg-primary/70 mb-0.5" />
            <div className="w-1/2 h-1 rounded bg-slate-500/50" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "whatsapp-direct") {
    return (
      <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 flex flex-col items-center justify-center gap-1 overflow-hidden">
        <div className="w-3/4 h-1.5 rounded-full bg-slate-400/60" />
        <div className="w-4/5 h-4 rounded-md bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center gap-1 px-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="w-12 h-1.5 rounded-full bg-white/90" />
        </div>
      </div>
    );
  }

  // Default Grid representation (for cards, grid, masonry, tabs, etc.)
  return (
    <div className="w-full h-14 rounded-lg bg-[#090d16] border border-white/5 p-1.5 grid grid-cols-3 gap-1 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded bg-slate-800/50 border border-white/5 p-1 flex flex-col justify-between">
          <div className="w-full h-3 rounded bg-slate-700/50 mb-1" />
          <div className="w-3/4 h-1 rounded-full bg-slate-400/50" />
          <div className="w-1/2 h-1 rounded-full bg-primary/50" />
        </div>
      ))}
    </div>
  );
}

export default function SectionVariantVisualPicker({
  sectionKey,
  isDynamic,
  designToken,
  updateSectionVariant,
  getEnabledVariants,
  t,
  compact = false,
}: SectionVariantVisualPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("Semua");

  const allVars = SECTION_VARIANT_OPTIONS[sectionKey] || [];
  const enabledOpts = useMemo(() => {
    if (!isDynamic || !SECTION_VARIANT_OPTIONS[sectionKey]) return [];
    return allVars.filter((opt) =>
      getEnabledVariants(sectionKey, allVars.map((o) => o.value)).includes(opt.value)
    );
  }, [allVars, getEnabledVariants, isDynamic, sectionKey]);

  // Unique groups for filtering
  const groups = useMemo(() => {
    const list = new Set<string>();
    enabledOpts.forEach((opt) => {
      if (opt.group) list.add(opt.group);
    });
    return Array.from(list);
  }, [enabledOpts]);

  const filteredOptions = useMemo(() => {
    if (selectedGroup === "Semua") return enabledOpts;
    return enabledOpts.filter((opt) => opt.group === selectedGroup);
  }, [enabledOpts, selectedGroup]);

  if (!isDynamic || !SECTION_VARIANT_OPTIONS[sectionKey] || enabledOpts.length <= 1) {
    return null;
  }

  // Derive current variant for hero or normal section
  const currentVal =
    (sectionKey === "hero"
      ? (designToken?.layout?.section_variants?.hero || designToken?.layout?.hero_style)
      : designToken?.layout?.section_variants?.[sectionKey]) || enabledOpts[0]?.value;

  const currentOpt = enabledOpts.find((o) => o.value === currentVal) || enabledOpts[0];

  const getOptionLabel = (opt: { value: string; label: string; labelKey?: string }) => {
    if (t && opt.labelKey) {
      const translated = t(`dashboard.sitesEditor.${opt.labelKey}`);
      if (translated && !translated.startsWith("dashboard.")) return translated;
    }
    return opt.label;
  };

  return (
    <div
      data-edu="variant-picker"
      className="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.08] to-slate-900/40 p-3 space-y-2.5 mb-3.5 shadow-sm transition-all duration-200"
    >
      {/* Active Variant Pill — tap to open gallery */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/5 hover:border-primary/30 hover:bg-black/60 transition-all cursor-pointer text-left"
      >
        {/* Left: active variant info */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-[12px] font-bold text-slate-100 truncate">
            {getOptionLabel(currentOpt)}
          </span>
          {currentOpt.group && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 shrink-0">
              {currentOpt.group}
            </span>
          )}
        </div>

        {/* Right: "Pilih Varian (N)" + chevron */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-semibold text-slate-400">
            {isExpanded
              ? (t("dashboard.sitesEditor.closeGallery") || "Tutup")
              : `${t("dashboard.sitesEditor.pickVariant") || "Pilih Varian"} (${enabledOpts.length})`}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary" : ""}`}
          />
        </div>
      </button>

      {/* Description of current variant */}
      {currentOpt.description && !isExpanded && (
        <p className="text-[11px] text-slate-400 leading-relaxed pl-1 italic">
          {currentOpt.description}
        </p>
      )}

      {/* Visual Cards Grid (Expandable Mode) */}
      {isExpanded && (
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          {/* Category Filter Chips if multiple groups exist */}
          {groups.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setSelectedGroup("Semua")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition whitespace-nowrap cursor-pointer ${
                  selectedGroup === "Semua"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                }`}
              >
                {t("dashboard.sitesEditor.allVariants") || "Semua"} ({enabledOpts.length})
              </button>
              {groups.map((grp) => {
                const count = enabledOpts.filter((o) => o.group === grp).length;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition whitespace-nowrap cursor-pointer ${
                      selectedGroup === grp
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    {grp} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredOptions.map((opt) => {
              const isActive = opt.value === currentVal;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateSectionVariant(sectionKey, opt.value)}
                  className={`group relative flex flex-col text-left p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-primary/15 border-primary shadow-md ring-1 ring-primary/40"
                      : "bg-[#0b0f19]/80 border-white/5 hover:border-primary/40 hover:bg-[#111728]"
                  }`}
                >
                  {/* Selected Indicator Badge */}
                  {isActive && (
                    <div className="absolute top-2 right-2 z-10 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Wireframe Thumbnail */}
                  <div className="mb-2">
                    <VariantWireframe section={sectionKey} variant={opt.value} />
                  </div>

                  {/* Title & Group */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[11px] font-bold line-clamp-1 ${
                        isActive ? "text-primary font-extrabold" : "text-slate-200 group-hover:text-white"
                      }`}
                    >
                      {getOptionLabel(opt)}
                    </span>
                  </div>

                  {/* Group Tag */}
                  {opt.group && (
                    <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {opt.group}
                    </span>
                  )}

                  {/* Description */}
                  {opt.description && (
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {opt.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1 border-t border-white/5">
            <span>{t("dashboard.sitesEditor.variantPreviewHint") || "Klik varian untuk pratinjau langsung di kanvas."}</span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              {t("dashboard.sitesEditor.done") || "Selesai"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
