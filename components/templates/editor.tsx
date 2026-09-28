"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";
import { ChevronDown, Check, LayoutGrid } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

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
        id={`section-preview-${section}`}
        data-section={section}
        onClick={(e) => {
          // Do NOT activate section selection when the user clicked inside a
          // contentEditable inline-edit element — that would open the mobile
          // bottom drawer and overlap the editing surface.
          const target = e.target as HTMLElement;
          if (target.closest('[contenteditable="true"]')) return;
          onSelectSection?.(section);
        }}
        className={`group relative transition-all duration-150 scroll-mt-20 ${isSelected
          ? "outline outline-2 outline-primary/60 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-slate-300/40 hover:outline-offset-[-1px]"
          }`}
      >
        {/* Section label + variant — fused button group (Top Left) */}
        <div
          ref={panelRef}
          className={`absolute top-2 left-2.5 z-[60] transition-all duration-150 ${
            isSelected || isGalleryOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {/* Relative wrapper lives OUTSIDE the pill so the gallery panel is not clipped */}
          <div className="relative">
            <div className={`h-6 inline-flex items-center bg-slate-950/85 backdrop-blur-md border shadow-sm rounded-full ${isGalleryOpen ? "border-sky-400/80 ring-1 ring-sky-400/40" : "border-white/15"}`}>
              {/* Label segment */}
              <span className="inline-flex items-center h-full px-2.5 text-[9px] font-medium tracking-[0.08em] text-white/70 uppercase select-none">
                {label}
              </span>

              {hasVariants && (
                <>
                  {/* Divider */}
                  <div className="w-px h-3.5 bg-white/20 shrink-0" />

                  {/* Variant trigger segment */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGalleryOpen((prev) => !prev);
                      if (!isGalleryOpen) setSelectedGroup("Semua");
                    }}
                    className={`h-6 inline-flex items-center gap-1 pl-2 pr-2.5 text-[9px] font-semibold cursor-pointer transition-colors rounded-r-full ${
                      isGalleryOpen ? "text-sky-300" : "text-slate-200 hover:text-white"
                    }`}
                    title={t("dashboard.sitesEditor.changeSectionVariant") || "Pilih Variasi Tampilan"}
                  >
                    <span className="max-w-[90px] truncate">
                      {activeOpt?.label || t("dashboard.sitesEditor.variantLabel") || "Varian"}
                    </span>
                    <ChevronDown className={`w-2.5 h-2.5 shrink-0 transition-transform ${isGalleryOpen ? "rotate-180 text-sky-400" : "text-slate-400"}`} />
                  </button>
                </>
              )}
            </div>

                  {/* Floating Visual Gallery Panel */}
                  {isGalleryOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-slate-950/98 backdrop-blur-xl border border-white/15 p-3 shadow-2xl z-50 space-y-2.5"
                      style={{ animation: "fadeInDown 0.15s ease-out" }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <LayoutGrid className="w-3 h-3 text-sky-400" />
                          <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider">
                            {t("dashboard.sitesEditor.variantLabel") || "Variasi"} {label}
                          </span>
                        </div>
                        <span className="text-[9px] text-sky-400 font-bold">
                          {variants.length} {t("dashboard.sitesEditor.optionsCount") || "opsi"}
                        </span>
                      </div>

                      {/* Group Filter Chips */}
                      {groups.length > 0 && (
                        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedGroup("Semua")}
                            className={`px-2 py-0.5 rounded-full text-[9px] transition whitespace-nowrap cursor-pointer shrink-0 ${
                              selectedGroup === "Semua"
                                ? "bg-sky-500 text-slate-950 font-black shadow-xs"
                                : "bg-slate-800/80 text-slate-300 hover:text-white font-medium"
                            }`}
                          >
                            {t("dashboard.sitesEditor.allVariants") || "Semua"}
                          </button>
                          {groups.map((grp) => (
                            <button
                              key={grp}
                              type="button"
                              onClick={() => setSelectedGroup(grp)}
                              className={`px-2 py-0.5 rounded-full text-[9px] transition whitespace-nowrap cursor-pointer shrink-0 ${
                                selectedGroup === grp
                                  ? "bg-sky-500 text-slate-950 font-black shadow-xs"
                                  : "bg-slate-800/80 text-slate-300 hover:text-white font-medium"
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
                                  ? "bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                                  : "bg-[#0b0f19]/90 border-white/10 hover:border-sky-400/50 hover:bg-[#111728]"
                              }`}
                            >
                              {isActive && (
                                <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-md font-bold">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                              <div className="mb-1.5">
                                <VariantWireframeSmall variant={v.value} section={section} />
                              </div>
                              <span className={`text-[10px] font-bold line-clamp-1 leading-tight ${isActive ? "text-sky-300 font-extrabold" : "text-slate-200 group-hover/card:text-white"}`}>
                                {v.label}
                              </span>
                              {v.group && (
                                <span className={`text-[8px] mt-0.5 leading-none ${isActive ? "text-sky-400/80 font-medium" : "text-slate-400"}`}>{v.group}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer hint */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                        <span className="text-[9px] text-slate-400">
                          {t("dashboard.sitesEditor.variantPreviewHint") || "Klik untuk pratinjau langsung."}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsGalleryOpen(false)}
                          className="text-[10px] text-sky-400 hover:text-sky-300 hover:underline font-bold px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          {t("dashboard.sitesEditor.done") || "Selesai"}
                        </button>
                      </div>
                    </div>
                  )}
          </div>{/* end relative wrapper */}
        </div>{/* end outer absolute container */}

        {/* Section Action (Top Right) — Regen */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenSection?.(section);
          }}
          className={`absolute top-2 right-2.5 z-[60] h-6 inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-md text-primary-foreground border border-primary/50 hover:bg-primary hover:border-primary text-[9px] font-bold px-2.5 rounded-full cursor-pointer transition-all active:scale-95 duration-150 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <SparkleGenAI className="w-3 h-3 shrink-0" />
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
