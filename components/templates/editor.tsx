"use client";

import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { SECTION_VARIANT_OPTIONS, getVariantLabel, getVariantGroupLabel } from "@/components/sections/variant-registry";
import { ChevronDown, Check, LayoutGrid, Pencil } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { getSectionLabel } from "@/app/dashboard/sites/[id]/editor-utils";
import { useSectionDrop, SectionDragControls } from "./section-reorder";
import { useSectionVisibility, SectionVisibilityButton, HiddenSectionNotice } from "./section-visibility";
import { CustomSelect, type CustomSelectOption, VisualVariantPanel } from "webjoz-ui";
import { VariantWireframe } from "@/app/dashboard/sites/[id]/components/SectionVariantWireframe";

// ---------------------------------------------------------------------------
// Shared mini SVG wireframe previews (canvas inline gallery)
// ---------------------------------------------------------------------------
function VariantWireframeSmall({ variant, section = "" }: { variant: string; section?: string }) {
  // 1. Header variants
  if (section === "header" || variant.includes("logo") || variant === "transparent-overlay") {
    if (variant === "left-logo-inline-nav") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-center overflow-hidden">
          <div className="h-5 rounded bg-slate-900 border border-white/10 px-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-primary shrink-0" />
              <div className="w-5 h-0.5 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 rounded-full bg-slate-400" />
              <div className="w-3 h-0.5 rounded-full bg-slate-400" />
            </div>
            <div className="w-4 h-2 rounded bg-primary/30 border border-primary/50 flex items-center justify-center shrink-0">
              <div className="w-2 h-0.5 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      );
    }
    if (variant === "centered-logo") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-center overflow-hidden">
          <div className="h-7 rounded bg-slate-900 border border-white/10 px-1 py-0.5 flex flex-col items-center justify-between">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded bg-primary shrink-0" />
              <div className="w-6 h-0.5 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center gap-1 pt-0.5 border-t border-white/5 w-full justify-center">
              <div className="w-3 h-0.5 rounded-full bg-slate-400" />
              <div className="w-3 h-0.5 rounded-full bg-slate-400" />
              <div className="w-3 h-0.5 rounded-full bg-slate-400" />
            </div>
          </div>
        </div>
      );
    }
    if (variant === "transparent-overlay") {
      return (
        <div className="w-full h-10 rounded bg-gradient-to-br from-primary/30 via-slate-900 to-slate-950 border border-primary/25 p-1 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 h-4 rounded bg-white/10 backdrop-blur-xs border border-white/20 px-1 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded bg-white shrink-0" />
              <div className="w-4 h-0.5 rounded-full bg-white/90" />
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-2.5 h-0.5 rounded-full bg-white/70" />
              <div className="w-2.5 h-0.5 rounded-full bg-white/70" />
            </div>
            <div className="w-3 h-1.5 rounded border border-white/40 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-0.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="relative z-10 text-[6px] text-white/50 text-center font-mono leading-none">Hero Overlay</div>
        </div>
      );
    }
    if (variant === "logo-with-cta-button") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-center overflow-hidden">
          <div className="h-5 rounded bg-slate-900 border border-white/10 px-1 flex items-center justify-between">
            <div className="w-2 h-2 rounded bg-primary shrink-0" />
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-0.5 rounded-full bg-slate-400" />
              <div className="w-2.5 h-0.5 rounded-full bg-slate-400" />
            </div>
            <div className="w-6 h-2.5 rounded bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
              <div className="w-4 h-0.5 rounded-full bg-white" />
            </div>
          </div>
        </div>
      );
    }
    if (variant === "stacked-logo-tagline") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-center overflow-hidden">
          <div className="h-7 rounded bg-slate-900 border border-white/10 px-1 py-0.5 flex flex-col items-center justify-center gap-0.5">
            <div className="w-2 h-2 rounded bg-primary shrink-0" />
            <div className="w-8 h-0.5 rounded-full bg-slate-200" />
            <div className="w-10 h-0.5 rounded-full bg-slate-500" />
          </div>
        </div>
      );
    }
  }

  // 2. Footer variants
  if (section === "footer" || variant.includes("band") || variant.includes("columns-with")) {
    if (variant === "minimal-band" || variant === "dark-contrast-band") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-end overflow-hidden">
          <div className={`h-4 rounded border px-1 flex items-center justify-between ${
            variant === "dark-contrast-band" ? "bg-black border-primary/40 border-t" : "bg-slate-900 border-white/10"
          }`}>
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded bg-primary shrink-0" />
              <div className="w-5 h-0.5 rounded-full bg-slate-300" />
            </div>
            <div className="w-8 h-0.5 rounded-full bg-slate-500" />
          </div>
        </div>
      );
    }
    if (variant === "columns-with-nav" || variant === "columns-with-social") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-between overflow-hidden">
          <div className="grid grid-cols-3 gap-1">
            <div className="space-y-0.5">
              <div className="w-1.5 h-1.5 rounded bg-primary shrink-0" />
              <div className="w-full h-0.5 rounded-full bg-slate-500" />
            </div>
            <div className="space-y-0.5">
              <div className="w-4 h-0.5 rounded-full bg-slate-400" />
              <div className="w-3 h-0.5 rounded-full bg-slate-600" />
            </div>
            <div className="space-y-0.5">
              <div className="w-4 h-0.5 rounded-full bg-slate-400" />
              {variant === "columns-with-social" ? (
                <div className="flex gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-primary/50" />
                  <div className="w-1 h-1 rounded-full bg-primary/50" />
                </div>
              ) : (
                <div className="w-3 h-0.5 rounded-full bg-slate-600" />
              )}
            </div>
          </div>
          <div className="border-t border-white/5 pt-0.5 flex justify-between">
            <div className="w-6 h-0.5 rounded-full bg-slate-600" />
            <div className="w-4 h-0.5 rounded-full bg-slate-600" />
          </div>
        </div>
      );
    }
    if (variant === "location-and-hours") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 grid grid-cols-3 gap-0.5 items-center overflow-hidden">
          <div className="space-y-0.5">
            <div className="w-2 h-2 rounded bg-primary/30 shrink-0" />
            <div className="w-full h-0.5 rounded-full bg-slate-400" />
          </div>
          <div className="space-y-0.5">
            <div className="w-3 h-0.5 rounded-full bg-primary" />
            <div className="w-full h-0.5 rounded-full bg-slate-500" />
          </div>
          <div className="space-y-0.5">
            <div className="w-3 h-0.5 rounded-full bg-emerald-400" />
            <div className="w-full h-0.5 rounded-full bg-slate-500" />
          </div>
        </div>
      );
    }
  }

  // 3. Hero & Split
  if (
    variant === "split" ||
    variant === "split-image" ||
    variant === "split-editorial" ||
    variant === "classic-split" ||
    variant === "dark-split" ||
    variant === "minimal-split" ||
    variant === "split-hero-catalog"
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

  if (variant === "bento-grid" || variant === "bento-photo-grid" || variant === "editorial-grid") {
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

  if (variant === "compact" || variant === "compact-list" || variant === "text-list") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-center gap-0.5 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-0.5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-1 flex-1">
              {variant === "compact-list" && <div className="w-1.5 h-1.5 rounded bg-slate-700 shrink-0" />}
              <div className="w-3/5 h-0.5 rounded-full bg-slate-300" />
            </div>
            <div className="w-4 h-0.5 rounded-full bg-primary/80 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "tabs-by-category") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col justify-between overflow-hidden">
        <div className="flex gap-0.5">
          <div className="w-5 h-1.5 rounded-full bg-primary" />
          <div className="w-4 h-1.5 rounded-full bg-slate-800" />
          <div className="w-4 h-1.5 rounded-full bg-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-0.5 flex-1 pt-0.5">
          <div className="rounded bg-slate-800/60 p-0.5 flex flex-col justify-between">
            <div className="w-3/4 h-0.5 rounded-full bg-slate-300" />
            <div className="w-1/2 h-0.5 rounded-full bg-primary/60" />
          </div>
          <div className="rounded bg-slate-800/60 p-0.5 flex flex-col justify-between">
            <div className="w-3/4 h-0.5 rounded-full bg-slate-300" />
            <div className="w-1/2 h-0.5 rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "comparison-table") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-0.5 flex flex-col gap-0.5 justify-center overflow-hidden">
        <div className="grid grid-cols-3 gap-0.5 pb-0.5 border-b border-white/10">
          <div className="h-0.5 bg-slate-600 rounded-full" />
          <div className="h-0.5 bg-primary/80 rounded-full" />
          <div className="h-0.5 bg-slate-500 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-0.5 py-0.5 border-b border-white/5">
          <div className="h-0.5 bg-slate-700 rounded-full" />
          <div className="h-0.5 bg-emerald-400 rounded-full" />
          <div className="h-0.5 bg-rose-400/60 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-0.5 py-0.5">
          <div className="h-0.5 bg-slate-700 rounded-full" />
          <div className="h-0.5 bg-emerald-400 rounded-full" />
          <div className="h-0.5 bg-emerald-400/60 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "single-tier-highlight" || variant === "highlighted-hero-card") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex items-center justify-center overflow-hidden">
        <div className="w-4/5 h-full rounded bg-primary/20 border border-primary/50 p-1 flex flex-col items-center justify-between">
          <div className="w-1/3 h-0.5 rounded-full bg-primary font-bold" />
          <div className="w-1/2 h-1 rounded-full bg-white" />
          <div className="w-2/3 h-1.5 rounded bg-primary flex items-center justify-center">
            <div className="w-1/2 h-0.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "marquee") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex items-center gap-1 overflow-hidden">
        <div className="flex gap-1 animate-pulse w-full justify-around">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-4 h-3 rounded bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
              <div className="w-2 h-0.5 rounded-full bg-slate-400" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "whatsapp-direct") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col items-center justify-center gap-0.5 overflow-hidden">
        <div className="w-3/4 h-0.5 rounded-full bg-slate-400/60" />
        <div className="w-4/5 h-3 rounded bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center gap-0.5 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <div className="w-8 h-0.5 rounded-full bg-white/90" />
        </div>
      </div>
    );
  }

  // FAQ variants
  if (section === "faq") {
    if (variant === "accordion") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col gap-0.5 justify-center overflow-hidden">
          <div className="h-2.5 rounded bg-primary/20 border border-primary/30 px-1 flex items-center justify-between">
            <div className="w-3/5 h-0.5 rounded-full bg-primary/80" />
            <div className="w-0.5 h-0.5 border-b border-r border-primary transform rotate-45" />
          </div>
          <div className="h-2.5 rounded bg-slate-800/60 border border-white/5 px-1 flex items-center justify-between">
            <div className="w-1/2 h-0.5 rounded-full bg-slate-400/50" />
            <div className="w-0.5 h-0.5 border-b border-r border-slate-400 transform -rotate-45" />
          </div>
          <div className="h-2.5 rounded bg-slate-800/60 border border-white/5 px-1 flex items-center justify-between">
            <div className="w-2/5 h-0.5 rounded-full bg-slate-400/50" />
            <div className="w-0.5 h-0.5 border-b border-r border-slate-400 transform -rotate-45" />
          </div>
        </div>
      );
    }
    if (variant === "simple") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col gap-0.5 justify-center overflow-hidden">
          {[1, 2].map((i) => (
            <div key={i} className="rounded bg-slate-800/40 border border-white/5 p-0.5 flex flex-col gap-0.5">
              <div className="w-3/5 h-0.5 rounded-full bg-white/70" />
              <div className="w-4/5 h-0.5 rounded-full bg-slate-500/50" />
            </div>
          ))}
        </div>
      );
    }
    if (variant === "columns") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 grid grid-cols-2 gap-0.5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded bg-slate-800/40 border border-white/5 p-0.5 flex flex-col gap-0.5">
              <div className="w-3/4 h-0.5 rounded-full bg-white/60" />
              <div className="w-full h-0.5 rounded-full bg-slate-600/50" />
            </div>
          ))}
        </div>
      );
    }
    if (variant === "sidebar-category") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex gap-1 overflow-hidden">
          <div className="w-6 flex flex-col gap-0.5 pt-0.5">
            <div className="w-full h-1 rounded-full bg-primary" />
            <div className="w-full h-0.5 rounded-full bg-slate-700" />
            <div className="w-full h-0.5 rounded-full bg-slate-700" />
            <div className="w-full h-0.5 rounded-full bg-slate-700" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-3 rounded bg-slate-800/60 border border-white/5 px-1 flex items-center justify-between">
              <div className="w-3/4 h-0.5 rounded-full bg-white/60" />
              <div className="w-0.5 h-0.5 border-b border-r border-primary transform rotate-45" />
            </div>
            <div className="h-3 rounded bg-slate-800/40 border border-white/5 px-1 flex items-center justify-between">
              <div className="w-1/2 h-0.5 rounded-full bg-slate-400/50" />
              <div className="w-0.5 h-0.5 border-b border-r border-slate-500 transform -rotate-45" />
            </div>
          </div>
        </div>
      );
    }
    if (variant === "two-column-grid") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 grid grid-cols-2 gap-0.5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded bg-slate-800/50 border border-white/10 p-0.5 flex flex-col gap-0.5">
              <div className="w-3/4 h-0.5 rounded-full bg-white/70" />
              <div className="w-full h-0.5 rounded-full bg-slate-500/40" />
            </div>
          ))}
        </div>
      );
    }
    if (variant === "chat-bubble-style") {
      return (
        <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col gap-0.5 justify-center overflow-hidden">
          <div className="flex justify-end">
            <div className="w-3/4 h-2.5 rounded-l rounded-br bg-primary/30 border border-primary/40 px-1 flex items-center">
              <div className="w-4/5 h-0.5 rounded-full bg-primary" />
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-4/5 h-2.5 rounded-r rounded-bl bg-slate-800 border border-white/10 px-1 flex items-center">
              <div className="w-3/4 h-0.5 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      );
    }
  }

  // Video wall / video grid — poster tiles with play badges
  if (variant === "video-wall" || variant === "video-grid") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-0.5 grid grid-cols-3 gap-0.5 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded bg-slate-800/70 border border-white/5 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/25 flex items-center justify-center">
              <div className="w-0 h-0 border-y-[2px] border-y-transparent border-l-[3px] border-l-primary/70 ml-px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "masonry-flow") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex gap-0.5 items-start overflow-hidden">
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="h-4 rounded bg-slate-800 border border-white/10" />
          <div className="h-2.5 rounded bg-primary/20 border border-primary/30" />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="h-2.5 rounded bg-slate-700/60 border border-white/10" />
          <div className="h-3.5 rounded bg-slate-800 border border-white/10" />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="h-3.5 rounded bg-primary/15 border border-primary/30" />
          <div className="h-2.5 rounded bg-slate-800 border border-white/10" />
        </div>
      </div>
    );
  }

  if (variant === "product-table") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-0.5 flex flex-col gap-0.5 justify-center overflow-hidden">
        <div className="grid grid-cols-3 gap-0.5 pb-0.5 border-b border-white/10">
          <div className="h-0.5 bg-primary/70 rounded-full" />
          <div className="h-0.5 bg-slate-600 rounded-full" />
          <div className="h-0.5 bg-slate-600 rounded-full" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-3 gap-0.5 py-0.5 border-b border-white/5 last:border-0">
            <div className="h-0.5 bg-slate-300/80 rounded-full" />
            <div className="h-0.5 bg-slate-600/70 rounded-full" />
            <div className="h-0.5 bg-slate-600/70 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "spotlight") {
    return (
      <div className="w-full h-10 rounded bg-[#090d16] border border-white/5 p-1 flex flex-col gap-0.5 overflow-hidden">
        <div className="h-5 rounded bg-primary/20 border border-primary/30 p-0.5 flex flex-col justify-center gap-0.5">
          <div className="w-2/5 h-0.5 rounded-full bg-primary/80" />
          <div className="w-3/5 h-0.5 rounded-full bg-slate-400/60" />
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2.5 rounded bg-slate-800/70 border border-white/10" />
          ))}
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
// Section shortcut bridge — lets the Contact overlay's "edit" segment jump to
// the matching field in the editor sidebar without threading an extra prop
// through every template. Value is a stable callback, so the memoised wrappers
// keep their bailout behaviour.
// ---------------------------------------------------------------------------
export type SectionShortcutHandler = () => void;

export const SectionShortcutContext = React.createContext<SectionShortcutHandler | null>(null);

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
  label?: string;
  hasHeaderOverlay?: boolean;
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
  hasHeaderOverlay = false,
}) => {
    const { t, locale } = useI18n();
    const displayLabel = getSectionLabel(section, locale) || label || section;
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    
    const panelRef = useRef<HTMLDivElement>(null);

    const editSectionShortcut = useContext(SectionShortcutContext);
    const canEditSection = section === "contact" && Boolean(editSectionShortcut);
    const { setNodeRef: setDropRef, canReorder, isSource, indicator } = useSectionDrop(section);
    const { hideable: canHide, isHidden } = useSectionVisibility(section);

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

    const variants = SECTION_VARIANT_OPTIONS[section] || [];
    const hasVariants = variants.length > 1 && Boolean(onUpdateVariant);
    const activeOpt = variants.find((v) => v.value === currentVariant) || variants[0];

    // Groups for filter chips — kept for reference but no longer used by the picker
    

    if (!isEditorMode) {
      if (section === "header") {
        return <>{children}</>;
      }
      return (
        <div id={`section-${section}`} data-section={section} className="scroll-mt-20">
          {children}
        </div>
      );
    }

    const isSelected = activeSection === section;

    return (
      <div
        ref={setDropRef}
        id={`section-preview-${section}`}
        data-section={section}
        onClick={(e) => {
          // Do NOT activate section selection when the user clicked inside a
          // contentEditable inline-edit element — that would open the mobile
          // bottom drawer and overlap the editing surface.
          const target = e.target as HTMLElement;
          if (target.closest('[contenteditable="true"]')) return;
          if (target.closest('nav, [data-nav-menu="true"]')) return;
          onSelectSection?.(section);
        }}
        className={`group relative transition-all duration-150 scroll-mt-20 ${isSource ? "opacity-60" : ""} ${
          isHidden ? "[&>*:not([data-section-ui])]:opacity-40 [&>*:not([data-section-ui])]:grayscale [&>*:not([data-section-ui])]:pointer-events-none" : ""
        } ${
          isGalleryOpen ? "z-[80]" : section === "header" ? (isSelected ? "z-40" : "z-30") : (isSelected ? "z-20" : "z-10")
        } ${isSelected
          ? "outline outline-2 outline-primary/60 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-slate-300/40 hover:outline-offset-[-1px]"
          }`}
      >
        {/* Section label + variant — fused button group */}
        <div
          ref={panelRef}
          data-section-ui
          className={`absolute ${
            section === "hero" && hasHeaderOverlay
              ? "top-24 left-2.5"
              : "top-2 left-2.5"
          } ${isGalleryOpen ? "z-[90]" : "z-[70]"} transition-all duration-150 ${
            isSelected || isGalleryOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
          }`}
        >
          {/* Relative wrapper lives OUTSIDE the pill so the gallery panel is not clipped */}
          <div className="relative">
            <div className={`h-[22px] sm:h-[26px] inline-flex items-center bg-slate-950/90 backdrop-blur-md border shadow-sm rounded-2xl transition-all duration-150 ${isGalleryOpen ? "border-sky-400/80 ring-1 ring-sky-400/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]" : "border-white/15"}`}>
              {canHide && <SectionVisibilityButton section={section} />}
              {canReorder && <SectionDragControls section={section} />}
              {/* Label segment */}
              <span className={`${hasVariants ? "hidden sm:inline-flex" : "inline-flex"} items-center h-full px-2 sm:px-2.5 text-[8px] sm:text-[8.5px] font-bold tracking-[0.1em] text-slate-400 uppercase select-none`}>
                {displayLabel}
              </span>

              {hasVariants && (
                <>
                  {/* Divider */}
                  <div className="hidden sm:block w-px h-3 bg-white/15 shrink-0" />

                  {/* Variant trigger segment */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Opening the sidebar is a mobile-only affordance: on mobile the
                      // drawer is the only way to reach the section form, so picking a
                      // variant has to reveal it. On desktop the sidebar is already
                      // docked and would just cover the dropdown we are opening.
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        onSelectSection?.(section);
                      }
                      setIsGalleryOpen((prev) => !prev);
                    }}
                    className={`h-full inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:pl-2 sm:pr-2.5 ${canEditSection ? "rounded-2xl sm:rounded-none" : "rounded-2xl sm:rounded-none sm:rounded-r-2xl"} text-[9px] sm:text-[9.5px] font-medium cursor-pointer transition-colors outline-none focus:outline-none focus-visible:outline-none select-none ${
                      isGalleryOpen ? "text-sky-300 bg-sky-500/10" : "text-slate-200 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="max-w-[85px] sm:max-w-[150px] truncate leading-none">
                      {activeOpt ? getVariantLabel(section, activeOpt.value, t) : t("dashboard.sitesEditor.variantLabel")}
                    </span>
                    <ChevronDown className={`w-2.5 h-2.5 shrink-0 transition-transform duration-200 ${isGalleryOpen ? "rotate-180 text-sky-400" : "text-slate-400"}`} />
                  </button>
                </>
              )}

              {canEditSection && (
                <>
                  {/* Divider */}
                  <div className="hidden sm:block w-px h-3 bg-white/15 shrink-0" />

                  {/* Edit segment — opens the section form in the sidebar */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGalleryOpen(false);
                      editSectionShortcut?.();
                    }}
                    title={t("dashboard.sitesEditor.editSectionContent")}
                    aria-label={t("dashboard.sitesEditor.editSectionContent")}
                    className="h-full inline-flex items-center gap-1 sm:gap-1.5 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 rounded-r-2xl text-[9px] sm:text-[9.5px] font-medium cursor-pointer text-slate-200 hover:text-white hover:bg-white/5 transition-colors outline-none focus:outline-none focus-visible:outline-none select-none"
                  >
                    <Pencil className="w-2.5 h-2.5 shrink-0" />
                    <span className="hidden sm:inline leading-none">
                      {t("dashboard.sitesEditor.editShortcut")}
                    </span>
                  </button>
                </>
              )}
            </div>

                  {/* Floating Visual Gallery Panel — powered by VisualVariantPanel from webjoz-ui */}
                  {isGalleryOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 mt-1.5 z-50 w-[320px]"
                      style={{ animation: "fadeInDown 0.15s ease-out" }}
                    >
                      <VisualVariantPanel
                        value={currentVariant || variants[0]?.value || ""}
                        onChange={(val) => {
                          onUpdateVariant?.(section, val);
                          setIsGalleryOpen(false);
                        }}
                        onClose={() => setIsGalleryOpen(false)}
                        options={variants.map((v): CustomSelectOption => ({
                          value: v.value,
                          label: getVariantLabel(section, v.value, t),
                          group: v.group ? getVariantGroupLabel(v.group, locale) : undefined,
                          description: v.description,
                          preview: <VariantWireframe section={section} variant={v.value} />,
                        }))}
                        allLabel={t("dashboard.sitesEditor.allVariants", "Semua")}
                        hintText={t("dashboard.sitesEditor.variantPreviewHint", "Klik varian untuk pratinjau langsung di kanvas.")}
                        doneLabel={t("dashboard.sitesEditor.done", "Selesai")}
                      />
                    </div>
                  )}
          </div>{/* end relative wrapper */}
        </div>{/* end outer absolute container */}

        {/* Section Action (Top Right) — Regen */}
        {!isHidden && (
        <button
          data-section-ui
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenSection?.(section);
          }}
          className={`absolute ${
            section === "hero" && hasHeaderOverlay ? "top-24 right-2.5" : "top-2 right-2.5"
          } z-[70] h-6 inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-md text-primary-foreground border border-primary/50 hover:bg-primary hover:border-primary text-[9px] font-bold px-2.5 rounded-full cursor-pointer transition-all active:scale-95 duration-150 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <SparkleGenAI className="w-3 h-3 shrink-0" />
          Regen
        </button>
        )}
        {indicator && (
          <div
            aria-hidden
            data-section-ui
            className={`pointer-events-none absolute left-0 right-0 z-[75] h-1 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] ${indicator === "before" ? "top-0" : "bottom-0"}`}
          />
        )}
        {isHidden && (
          <HiddenSectionNotice
            section={section}
            className={section === "hero" && hasHeaderOverlay ? "top-24" : "top-10"}
          />
        )}
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
