"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";
import { ChevronDown, Check, LayoutGrid } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ---------------------------------------------------------------------------
// Shared mini SVG wireframe previews (canvas inline gallery)
// ---------------------------------------------------------------------------
function VariantWireframeSmall({ variant }: { variant: string }) {
  if (
    variant === "split" ||
    variant === "split-image" ||
    variant === "split-editorial" ||
    variant === "classic-split" ||
    variant === "dark-split"
  ) {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex items-center gap-1 overflow-hidden">
        <div className="w-1/2 flex flex-col justify-center gap-0.5 pl-0.5">
          <div className="w-4/5 h-1 rounded-full bg-primary/70" />
          <div className="w-full h-0.5 rounded-full bg-slate-500/50" />
          <div className="w-2/5 h-1 rounded-xs bg-primary/40 mt-0.5" />
        </div>
        <div className="w-1/2 h-full rounded bg-gradient-to-br from-primary/25 to-violet-500/10 border border-primary/25 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary/30" />
        </div>
      </div>
    );
  }

  if (
    variant === "centered" ||
    variant === "minimal" ||
    variant === "minimal-centered" ||
    variant === "minimalist-elegant"
  ) {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col items-center justify-center gap-0.5 overflow-hidden">
        <div className="w-3/5 h-1 rounded-full bg-primary/70" />
        <div className="w-4/5 h-0.5 rounded-full bg-slate-500/50" />
        <div className="w-1/3 h-1.5 rounded-sm bg-primary/40 mt-0.5" />
      </div>
    );
  }

  if (variant === "full-bleed" || variant === "banner" || variant === "overlay-map") {
    return (
      <div className="w-full h-10 rounded bg-gradient-to-br from-slate-900 via-primary/20 to-slate-900 border border-primary/25 p-1 flex flex-col items-center justify-center gap-0.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-2/3 h-1 rounded-full bg-white/70" />
        <div className="relative z-10 w-1/4 h-1.5 rounded-xs bg-primary" />
      </div>
    );
  }

  if (variant === "bento-grid") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 grid grid-cols-3 gap-0.5 overflow-hidden">
        <div className="col-span-2 row-span-2 rounded bg-primary/20 border border-primary/25 p-0.5 flex flex-col justify-between">
          <div className="w-3/4 h-0.5 rounded-full bg-primary/70" />
          <div className="w-full h-0.5 rounded-full bg-slate-500/40" />
        </div>
        <div className="rounded bg-slate-800/60 border border-white/10 p-0.5">
          <div className="w-full h-0.5 rounded-full bg-slate-400/50" />
        </div>
        <div className="rounded bg-slate-800/60 border border-white/10 p-0.5">
          <div className="w-2/3 h-0.5 rounded-full bg-slate-400/50" />
        </div>
      </div>
    );
  }

  if (variant === "tech-saas") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col items-center justify-between overflow-hidden">
        <div className="w-1/3 h-0.5 rounded-full bg-primary/80" />
        <div className="w-4/5 h-1 rounded-full bg-white/80" />
        <div className="w-full h-4 rounded-t bg-slate-800/80 border border-slate-700/60 p-0.5 flex gap-0.5 items-start">
          <div className="w-1 h-1 rounded-full bg-rose-500/60" />
          <div className="w-1 h-1 rounded-full bg-amber-500/60" />
          <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
        </div>
      </div>
    );
  }

  if (variant === "carousel" || variant === "horizontal-swipe-carousel") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex items-center justify-between gap-0.5 overflow-hidden">
        <div className="w-2 h-full rounded bg-slate-800/40 opacity-40" />
        <div className="flex-1 h-full rounded bg-primary/15 border border-primary/25 p-1 flex flex-col justify-center items-center gap-0.5">
          <div className="w-2/3 h-1 rounded-full bg-primary/80" />
          <div className="flex gap-0.5 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-primary" />
            <div className="w-0.5 h-0.5 rounded-full bg-slate-600" />
            <div className="w-0.5 h-0.5 rounded-full bg-slate-600" />
          </div>
        </div>
        <div className="w-2 h-full rounded bg-slate-800/40 opacity-40" />
      </div>
    );
  }

  if (variant === "accordion" || variant === "accordion-by-category") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col gap-0.5 justify-center overflow-hidden">
        <div className="h-2 rounded bg-primary/20 border border-primary/30 px-1 flex items-center justify-between">
          <div className="w-1/2 h-0.5 rounded-full bg-primary/80" />
          <div className="w-0.5 h-0.5 border-b border-r border-primary transform rotate-45" />
        </div>
        <div className="h-2 rounded bg-slate-800/60 border border-white/5 px-1 flex items-center">
          <div className="w-2/3 h-0.5 rounded-full bg-slate-400/50" />
        </div>
        <div className="h-2 rounded bg-slate-800/60 border border-white/5 px-1 flex items-center">
          <div className="w-3/5 h-0.5 rounded-full bg-slate-400/50" />
        </div>
      </div>
    );
  }

  if (variant === "whatsapp-direct") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col items-center justify-center gap-0.5 overflow-hidden">
        <div className="w-3/4 h-0.5 rounded-full bg-slate-400/60" />
        <div className="w-4/5 h-3 rounded bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center gap-0.5 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <div className="w-8 h-0.5 rounded-full bg-white/90" />
        </div>
      </div>
    );
  }

  // Default: generic grid
  return (
    <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 grid grid-cols-3 gap-0.5 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded bg-slate-800/50 border border-white/5 p-0.5 flex flex-col justify-between">
          <div className="w-full h-2 rounded bg-slate-700/50 mb-0.5" />
          <div className="w-3/4 h-0.5 rounded-full bg-slate-400/50" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PreviewSectionWrapper — canvas overlay with unified visual gallery trigger
// ---------------------------------------------------------------------------
export const PreviewSectionWrapper: React.FC<{
  section: string;
  activeSection?: string;
  currentVariant?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  onUpdateVariant?: (section: string, variant: string) => void;
  isEditorMode?: boolean;
  children: React.ReactNode;
  label: string;
}> = ({
  section,
  activeSection,
  currentVariant,
  onSelectSection,
  onRegenSection,
  onUpdateVariant,
  isEditorMode = false,
  children,
  label,
}) => {
    const { t } = useI18n();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string>("Semua");
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isGalleryOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          setIsGalleryOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isGalleryOpen]);

    if (!isEditorMode) {
      return <>{children}</>;
    }

    const isSelected = activeSection === section;
    const variants = SECTION_VARIANT_OPTIONS[section] || [];
    const hasVariants = variants.length > 1 && Boolean(onUpdateVariant);
    const activeOpt = variants.find((v) => v.value === currentVariant) || variants[0];

    // Groups for filter chips
    const groups = useMemo(() => {
      const list = new Set<string>();
      variants.forEach((v) => { if (v.group) list.add(v.group); });
      return Array.from(list);
    }, [variants]);

    const filteredVariants = useMemo(() => {
      if (selectedGroup === "Semua") return variants;
      return variants.filter((v) => v.group === selectedGroup);
    }, [variants, selectedGroup]);

    return (
      <div
        id={`section-preview-${section}`}
        onClick={(e) => {
          // Do NOT activate section selection when the user clicked inside a
          // contentEditable inline-edit element — that would open the mobile
          // bottom drawer and overlap the editing surface.
          const target = e.target as HTMLElement;
          if (target.closest('[contenteditable="true"]')) return;
          onSelectSection?.(section);
        }}
        className={`group relative transition-all duration-150 ${isSelected
          ? "outline outline-2 outline-primary/60 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-slate-300/40 hover:outline-offset-[-1px]"
          }`}
      >
        {/* Section Title Badge & Unified Variant Gallery Trigger (Top Left) */}
        <div
          ref={panelRef}
          className={`absolute top-2.5 left-3 z-30 flex items-center gap-1.5 transition-all duration-150 ${
            isSelected || isGalleryOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="bg-slate-900/85 backdrop-blur-sm text-slate-200 border border-white/10 text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded uppercase select-none shadow-sm">
            {label}
          </span>

          {hasVariants && (
            <div className="relative">
              {/* Single unified trigger button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryOpen((prev) => !prev);
                  if (!isGalleryOpen) setSelectedGroup("Semua");
                }}
                className={`backdrop-blur-sm border text-[9px] font-medium px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm ${
                  isGalleryOpen
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-slate-900/90 text-slate-300 hover:text-white border-white/10 hover:border-primary/50"
                }`}
                title={t("dashboard.sitesEditor.changeSectionVariant") || "Pilih Variasi Tampilan"}
              >
                <LayoutGrid className="w-2.5 h-2.5" />
                <span className="max-w-[80px] truncate">
                  {activeOpt?.label || t("dashboard.sitesEditor.variantLabel") || "Varian"}
                </span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isGalleryOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Floating Visual Gallery Panel */}
              {isGalleryOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-slate-950/97 backdrop-blur-xl border border-white/15 p-3 shadow-2xl z-50 space-y-2.5"
                  style={{ animation: "fadeInDown 0.15s ease-out" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <LayoutGrid className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                        {t("dashboard.sitesEditor.variantLabel") || "Variasi"} {label}
                      </span>
                    </div>
                    <span className="text-[9px] text-primary font-semibold">
                      {variants.length} {t("dashboard.sitesEditor.optionsCount") || "opsi"}
                    </span>
                  </div>

                  {/* Group Filter Chips */}
                  {groups.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedGroup("Semua")}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition whitespace-nowrap cursor-pointer shrink-0 ${
                          selectedGroup === "Semua"
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-slate-800/70 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {t("dashboard.sitesEditor.allVariants") || "Semua"}
                      </button>
                      {groups.map((grp) => (
                        <button
                          key={grp}
                          type="button"
                          onClick={() => setSelectedGroup(grp)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition whitespace-nowrap cursor-pointer shrink-0 ${
                            selectedGroup === grp
                              ? "bg-primary text-primary-foreground font-bold"
                              : "bg-slate-800/70 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {grp}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Visual Card Grid */}
                  <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-0.5">
                    {filteredVariants.map((v) => {
                      const isActive = v.value === (currentVariant || variants[0]?.value);
                      return (
                        <button
                          key={v.value}
                          type="button"
                          onClick={() => {
                            onUpdateVariant?.(section, v.value);
                            setIsGalleryOpen(false);
                          }}
                          className={`group/card relative flex flex-col text-left p-1.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                            isActive
                              ? "bg-primary/15 border-primary shadow-md ring-1 ring-primary/40"
                              : "bg-[#0b0f19]/80 border-white/5 hover:border-primary/40 hover:bg-[#111728]"
                          }`}
                        >
                          {/* Active badge */}
                          {isActive && (
                            <div className="absolute top-1.5 right-1.5 z-10 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                              <Check className="w-2 h-2 stroke-[3]" />
                            </div>
                          )}

                          {/* Wireframe thumbnail */}
                          <div className="mb-1.5">
                            <VariantWireframeSmall variant={v.value} />
                          </div>

                          {/* Label */}
                          <span
                            className={`text-[10px] font-bold line-clamp-1 leading-tight ${
                              isActive ? "text-primary" : "text-slate-200 group-hover/card:text-white"
                            }`}
                          >
                            {v.label}
                          </span>

                          {/* Group tag */}
                          {v.group && (
                            <span className="text-[8px] text-slate-500 mt-0.5 leading-none">{v.group}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer hint */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                    <span className="text-[9px] text-slate-500">
                      {t("dashboard.sitesEditor.variantPreviewHint") || "Klik untuk pratinjau langsung."}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(false)}
                      className="text-[9px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      {t("dashboard.sitesEditor.done") || "Selesai"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Action (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenSection?.(section);
          }}
          className={`absolute top-2.5 right-3 z-20 bg-slate-900/85 backdrop-blur-sm text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 duration-150 focus:outline-none focus:ring-1 focus:ring-primary group/regen shadow-sm ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <SparkleGenAI className="w-3.5 h-3.5" />
          Regen
        </button>
        {children}
      </div>
    );
  };

export const MemoPreviewSectionWrapper = React.memo(PreviewSectionWrapper);

interface MemoSectionContentProps<T> {
  content: T;
  render: (data: T) => React.ReactNode;
}

const MemoSectionContentInner = <T,>({ content, render }: MemoSectionContentProps<T>) => {
  return <>{render(content)}</>;
};

export const MemoSectionContent = React.memo(
  MemoSectionContentInner,
  (prevProps, nextProps) => {
    const a = prevProps.content as any;
    const b = nextProps.content as any;
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }
) as <T>(props: MemoSectionContentProps<T>) => React.ReactElement;
