"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/components/toast-provider";
import {
  ShieldAlert, Type, Palette, Layers, LayoutGrid,
  Eye, EyeOff, Trash2, Plus, RotateCcw, Search,
  Lock, Unlock, ChevronDown, Sun, Moon, Check,
  SlidersHorizontal,
} from "lucide-react";
import {
  Card, CardContent, Button, Badge, Input, Separator,
} from "@/components/ui";
import {
  TYPOGRAPHY_PAIRINGS, COLOR_PATTERNS, INDUSTRY_PRESETS,
  type TypographyPairing, type ColorPattern, type IndustryPreset,
  loadDesignAssetsConfig, saveDesignAssetsConfig, resetDesignAssetsConfig,
  loadConfig, updateCache,
  REQUIRED_SECTIONS_DEFAULT,
  type DesignAssetsConfig,
} from "@/lib/design-assets-config";
import { useAuthToken } from "@/lib/auth-store";
import { scoreDesignToken, scoreBadgeClass } from "@/lib/design-token-score";
import { SECTION_META, BODY_SECTION_KEYS, OPTIONAL_SECTION_KEYS } from "@/app/dashboard/sites/[id]/editor-utils";
import { loadGoogleFont } from "@/components/templates/helpers";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";

const GOOGLE_FONTS_WHITELIST = [
  "Inter", "Roboto", "Open Sans", "Montserrat", "Lato",
  "Poppins", "Outfit", "Plus Jakarta Sans", "Work Sans", "DM Sans",
  "Playfair Display", "Merriweather", "Lora", "PT Serif",
  "Cinzel", "Cormorant Garamond", "Arvo",
  "Oswald", "Bebas Neue", "Space Grotesk",
  "Fraunces", "Bricolage Grotesque", "Sora", "Urbanist",
  "Schibsted Grotesk", "JetBrains Mono",
];

// All sections superadmin can manage (excludes seo — not a visual section)
const MANAGEABLE_SECTIONS = ["header", ...BODY_SECTION_KEYS, "footer"];

// ─── Variant wireframe previews ───────────────────────────────────────────────
function VariantPreview({ id }: { id: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const };
  const b = "bg-gradient-to-br from-primary/5 to-muted/20 text-muted-foreground/60";

  const diagrams: Record<string, React.ReactNode> = {
    // About
    "about-classic": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="8" y="8" width="64" height="6" rx="1" fill="currentColor" opacity=".3"/><rect x="8" y="18" width="48" height="4" rx="1" fill="currentColor" opacity=".15"/><rect x="8" y="25" width="52" height="4" rx="1" fill="currentColor" opacity=".15"/><rect x="8" y="32" width="40" height="4" rx="1" fill="currentColor" opacity=".15"/></svg>
    ),
    "about-split-image": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="8" width="34" height="32" rx="2" fill="currentColor" opacity=".15"/><rect x="44" y="10" width="32" height="5" rx="1" fill="currentColor" opacity=".3"/><rect x="44" y="19" width="26" height="3" rx="1" fill="currentColor" opacity=".15"/><rect x="44" y="25" width="28" height="3" rx="1" fill="currentColor" opacity=".15"/><rect x="44" y="31" width="22" height="3" rx="1" fill="currentColor" opacity=".15"/></svg>
    ),
    "about-stat-heavy": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="8" y="6" width="64" height="6" rx="1" fill="currentColor" opacity=".3"/><rect x="8" y="18" width="18" height="12" rx="2" fill="currentColor" opacity=".2"/><rect x="31" y="18" width="18" height="12" rx="2" fill="currentColor" opacity=".2"/><rect x="54" y="18" width="18" height="12" rx="2" fill="currentColor" opacity=".2"/><rect x="12" y="35" width="56" height="3" rx="1" fill="currentColor" opacity=".12"/></svg>
    ),
    // Benefits
    "benefits-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="6" y="6" width="20" height="18" rx="2" fill="currentColor" opacity=".15"/><rect x="30" y="6" width="20" height="18" rx="2" fill="currentColor" opacity=".15"/><rect x="54" y="6" width="20" height="18" rx="2" fill="currentColor" opacity=".15"/><rect x="6" y="28" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/><rect x="30" y="28" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/><rect x="54" y="28" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/></svg>
    ),
    "benefits-stat-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="6" y="6" width="20" height="18" rx="2" fill="currentColor" opacity=".15"/><text x="16" y="18" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".5">50+</text><rect x="30" y="6" width="20" height="18" rx="2" fill="currentColor" opacity=".15"/><text x="40" y="18" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".5">99%</text><rect x="54" y="6" width="20" height="18" rx="2" fill="currentColor" opacity=".15"/><text x="64" y="18" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".5">24h</text><rect x="6" y="28" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/><rect x="30" y="28" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/><rect x="54" y="28" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/></svg>
    ),
    "benefits-checklist": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[8,16,24,32,40].map(y=><g key={y}><circle cx="14" cy={y+4} r="3" fill="currentColor" opacity=".3"/><rect x="22" y={y+2} width="44" height="4" rx="1" fill="currentColor" opacity=".15"/></g>)}</svg>
    ),
    // Testimonials
    "testimonials-carousel": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="12" y="8" width="56" height="26" rx="3" fill="currentColor" opacity=".12"/><rect x="18" y="14" width="44" height="3" rx="1" fill="currentColor" opacity=".2"/><rect x="18" y="20" width="36" height="3" rx="1" fill="currentColor" opacity=".15"/><circle cx="18" cy="38" r="3" fill="currentColor" opacity=".15"/><rect x="24" y="36" width="18" height="4" rx="1" fill="currentColor" opacity=".2"/><circle cx="36" cy="44" r="2" fill="currentColor" opacity=".3"/><circle cx="41" cy="44" r="2" fill="currentColor" opacity=".15"/><circle cx="46" cy="44" r="2" fill="currentColor" opacity=".15"/></svg>
    ),
    "testimonials-compact": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,17,30].map(y=><g key={y}><circle cx="12" cy={y+7} r="5" fill="currentColor" opacity=".2"/><rect x="22" y={y+4} width="48" height="3" rx="1" fill="currentColor" opacity=".2"/><rect x="22" y={y+10} width="34" height="3" rx="1" fill="currentColor" opacity=".12"/></g>)}</svg>
    ),
    "testimonials-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="34" height="20" rx="2" fill="currentColor" opacity=".12"/><rect x="8" y="9" width="26" height="3" rx="1" fill="currentColor" opacity=".2"/><rect x="8" y="15" width="20" height="3" rx="1" fill="currentColor" opacity=".12"/><rect x="42" y="4" width="34" height="20" rx="2" fill="currentColor" opacity=".12"/><rect x="46" y="9" width="26" height="3" rx="1" fill="currentColor" opacity=".2"/><rect x="46" y="15" width="20" height="3" rx="1" fill="currentColor" opacity=".12"/><rect x="4" y="28" width="34" height="16" rx="2" fill="currentColor" opacity=".08"/><rect x="42" y="28" width="34" height="16" rx="2" fill="currentColor" opacity=".08"/></svg>
    ),
    // CTA
    "cta-banner": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="12" width="76" height="24" rx="3" fill="currentColor" opacity=".12"/><rect x="14" y="18" width="32" height="5" rx="1" fill="currentColor" opacity=".25"/><rect x="14" y="26" width="24" height="5" rx="2" fill="currentColor" opacity=".35"/></svg>
    ),
    "cta-card": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="12" y="6" width="56" height="36" rx="4" fill="currentColor" opacity=".08"/><rect x="12" y="6" width="56" height="36" rx="4" {...s} opacity=".2"/><rect x="20" y="14" width="40" height="5" rx="1" fill="currentColor" opacity=".25"/><rect x="26" y="22" width="28" height="4" rx="1" fill="currentColor" opacity=".15"/><rect x="26" y="30" width="28" height="6" rx="2" fill="currentColor" opacity=".3"/></svg>
    ),
    "cta-centered": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="16" y="10" width="48" height="6" rx="1" fill="currentColor" opacity=".25"/><rect x="20" y="20" width="40" height="4" rx="1" fill="currentColor" opacity=".15"/><rect x="24" y="30" width="32" height="8" rx="3" fill="currentColor" opacity=".3"/></svg>
    ),
    // FAQ
    "faq-accordion": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,14,24,34].map((y,i)=><g key={y}><rect x="6" y={y} width="68" height="9" rx="2" fill="currentColor" opacity={i===0?".18":".1"}/><rect x="10" y={y+3} width="40" height="3" rx="1" fill="currentColor" opacity=".25"/><text x="68" y={y+7} fontSize="8" fill="currentColor" opacity=".4">{i===0?"▲":"▼"}</text></g>)}</svg>
    ),
    "faq-simple": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,16,28,40].map(y=><g key={y}><rect x="6" y={y} width="48" height="4" rx="1" fill="currentColor" opacity=".3"/><rect x="6" y={y+6} width="60" height="3" rx="1" fill="currentColor" opacity=".12"/></g>)}</svg>
    ),
    "faq-columns": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="6" width="34" height="8" rx="2" fill="currentColor" opacity=".15"/><rect x="4" y="17" width="34" height="8" rx="2" fill="currentColor" opacity=".1"/><rect x="4" y="28" width="34" height="8" rx="2" fill="currentColor" opacity=".1"/><rect x="42" y="6" width="34" height="8" rx="2" fill="currentColor" opacity=".15"/><rect x="42" y="17" width="34" height="8" rx="2" fill="currentColor" opacity=".1"/><rect x="42" y="28" width="34" height="8" rx="2" fill="currentColor" opacity=".1"/></svg>
    ),
    // Gallery
    "gallery-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,26].map(y=>[4,28,52].map(x=><rect key={`${x}${y}`} x={x} y={y} width="22" height="18" rx="2" fill="currentColor" opacity=".2"/>))}</svg>
    ),
    "gallery-masonry": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="22" height="28" rx="2" fill="currentColor" opacity=".2"/><rect x="30" y="4" width="22" height="18" rx="2" fill="currentColor" opacity=".2"/><rect x="56" y="4" width="22" height="24" rx="2" fill="currentColor" opacity=".2"/><rect x="30" y="26" width="22" height="16" rx="2" fill="currentColor" opacity=".15"/></svg>
    ),
    "gallery-carousel": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="10" y="6" width="60" height="30" rx="3" fill="currentColor" opacity=".2"/><text x="8" y="25" fontSize="12" fill="currentColor" opacity=".5">‹</text><text x="68" y="25" fontSize="12" fill="currentColor" opacity=".5">›</text><circle cx="33" cy="42" r="2" fill="currentColor" opacity=".4"/><circle cx="40" cy="42" r="2" fill="currentColor" opacity=".2"/><circle cx="47" cy="42" r="2" fill="currentColor" opacity=".2"/></svg>
    ),
    // Menu
    "menu-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,26].map(y=>[4,28,52].map(x=><g key={`${x}${y}`}><rect x={x} y={y} width="22" height="18" rx="2" fill="currentColor" opacity=".15"/><rect x={x+2} y={y+11} width="18" height="3" rx="1" fill="currentColor" opacity=".2"/></g>))}</svg>
    ),
    "menu-compact": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,12,20,28,36].map(y=><g key={y}><rect x="6" y={y} width="48" height="6" rx="1" fill="currentColor" opacity=".1"/><rect x="8" y={y+2} width="28" height="2" rx="1" fill="currentColor" opacity=".25"/><rect x="58" y={y+1} width="14" height="4" rx="1" fill="currentColor" opacity=".2"/></g>)}</svg>
    ),
    "menu-cards": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,26].map(y=>[4,42].map(x=><g key={`${x}${y}`}><rect x={x} y={y} width="32" height="18" rx="3" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2"/><rect x={x} y={y} width="32" height="10" rx="3" fill="currentColor" opacity=".15"/><rect x={x+2} y={y+12} width="22" height="2" rx="1" fill="currentColor" opacity=".2"/></g>))}</svg>
    ),
    "menu-text-list": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[6,14,22,30,38].map(y=><g key={y}><rect x="6" y={y} width="44" height="3" rx="1" fill="currentColor" opacity=".25"/><rect x="54" y={y} width="20" height="3" rx="1" fill="currentColor" opacity=".15"/></g>)}</svg>
    ),
    "menu-compact-list": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,14,24,34].map(y=><g key={y}><rect x="4" y={y} width="10" height="8" rx="1" fill="currentColor" opacity=".2"/><rect x="18" y={y+1} width="36" height="3" rx="1" fill="currentColor" opacity=".25"/><rect x="58" y={y+1} width="16" height="3" rx="1" fill="currentColor" opacity=".15"/><rect x="18" y={y+5} width="24" height="2" rx="1" fill="currentColor" opacity=".12"/></g>)}</svg>
    ),
    "menu-tabs-by-category": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".3"/><rect x="25" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".12"/><rect x="46" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".12"/><rect x="4" y="14" width="72" height="1" fill="currentColor" opacity=".2"/>{[18,28,38].map(y=><g key={y}><rect x="6" y={y} width="48" height="6" rx="1" fill="currentColor" opacity=".1"/><rect x="8" y={y+2} width="28" height="2" rx="1" fill="currentColor" opacity=".2"/></g>)}</svg>
    ),
    "menu-accordion-by-category": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,18,32].map((y,i)=><g key={y}><rect x="4" y={y} width="72" height="11" rx="2" fill="currentColor" opacity={i===0?".18":".1"}/><rect x="8" y={y+4} width="36" height="3" rx="1" fill="currentColor" opacity=".25"/><text x="70" y={y+9} fontSize="8" fill="currentColor" opacity=".4">{i===0?"▲":"▼"}</text>{i===0&&<><rect x="8" y="18" width="48" height="2" rx="1" fill="currentColor" opacity=".1"/><rect x="8" y="22" width="40" height="2" rx="1" fill="currentColor" opacity=".1"/></>}</g>)}</svg>
    ),
    "menu-bento-photo-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="2" width="36" height="22" rx="2" fill="currentColor" opacity=".2"/><rect x="42" y="2" width="36" height="10" rx="2" fill="currentColor" opacity=".15"/><rect x="42" y="14" width="17" height="10" rx="2" fill="currentColor" opacity=".15"/><rect x="61" y="14" width="17" height="10" rx="2" fill="currentColor" opacity=".12"/><rect x="2" y="26" width="17" height="18" rx="2" fill="currentColor" opacity=".15"/><rect x="21" y="26" width="17" height="18" rx="2" fill="currentColor" opacity=".12"/><rect x="42" y="26" width="36" height="18" rx="2" fill="currentColor" opacity=".15"/></svg>
    ),
    "menu-visual-showcase-hero": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="72" height="22" rx="3" fill="currentColor" opacity=".2"/><rect x="4" y="4" width="72" height="8" rx="3" fill="currentColor" opacity=".1"/><rect x="8" y="14" width="20" height="2" rx="1" fill="currentColor" opacity=".3"/><rect x="8" y="18" width="14" height="2" rx="1" fill="currentColor" opacity=".2"/><rect x="4" y="30" width="22" height="14" rx="2" fill="currentColor" opacity=".15"/><rect x="29" y="30" width="22" height="14" rx="2" fill="currentColor" opacity=".12"/><rect x="54" y="30" width="22" height="14" rx="2" fill="currentColor" opacity=".15"/></svg>
    ),
    "menu-sidebar-scrollspy-photo": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="4" width="16" height="40" rx="2" fill="currentColor" opacity=".1"/>{[6,12,18,24,30,36].map(y=><rect key={y} x="4" y={y} width="12" height="3" rx="1" fill="currentColor" opacity=".2"/>)}<rect x="22" y="4" width="26" height="18" rx="2" fill="currentColor" opacity=".18"/><rect x="52" y="4" width="26" height="18" rx="2" fill="currentColor" opacity=".12"/><rect x="22" y="26" width="26" height="18" rx="2" fill="currentColor" opacity=".12"/><rect x="52" y="26" width="26" height="18" rx="2" fill="currentColor" opacity=".18"/></svg>
    ),
    // Catalog
    "catalog-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,26].map(y=>[4,28,52].map(x=><g key={`${x}${y}`}><rect x={x} y={y} width="22" height="18" rx="2" fill="currentColor" opacity=".15"/><rect x={x+2} y={y+11} width="18" height="3" rx="1" fill="currentColor" opacity=".2"/></g>))}</svg>
    ),
    "catalog-compact": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,12,20,28,36].map(y=><g key={y}><rect x="6" y={y} width="52" height="6" rx="1" fill="currentColor" opacity=".1"/><rect x="8" y={y+2} width="28" height="2" rx="1" fill="currentColor" opacity=".25"/><rect x="58" y={y+1} width="14" height="4" rx="1" fill="currentColor" opacity=".2"/></g>)}</svg>
    ),
    "catalog-cards": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,26].map(y=>[4,42].map(x=><g key={`${x}${y}`}><rect x={x} y={y} width="32" height="18" rx="3" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2"/><rect x={x} y={y} width="32" height="10" rx="3" fill="currentColor" opacity=".15"/><rect x={x+2} y={y+12} width="22" height="2" rx="1" fill="currentColor" opacity=".2"/></g>))}</svg>
    ),
    "catalog-grid-dense": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[4,21,38].map(y=>[4,22,40,58].map(x=><rect key={`${x}${y}`} x={x} y={y} width="16" height="15" rx="1" fill="currentColor" opacity=".15"/>))}</svg>
    ),
    "catalog-showcase-featured": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="44" height="32" rx="3" fill="currentColor" opacity=".2"/><rect x="4" y="4" width="44" height="12" rx="3" fill="currentColor" opacity=".1"/><text x="8" y="14" fontSize="6" fill="currentColor" opacity=".5">★ UNGGULAN</text><rect x="52" y="4" width="24" height="14" rx="2" fill="currentColor" opacity=".12"/><rect x="52" y="21" width="24" height="14" rx="2" fill="currentColor" opacity=".12"/></svg>
    ),
    "catalog-tabs-by-category": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".3"/><rect x="25" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".12"/><rect x="46" y="4" width="18" height="7" rx="2" fill="currentColor" opacity=".12"/><rect x="4" y="14" width="72" height="1" fill="currentColor" opacity=".2"/>{[4,28].map(y=>[4,28,52].map(x=><rect key={`${x}${y}`} x={x} y={y+16} width="22" height="14" rx="2" fill="currentColor" opacity=".12"/>))}</svg>
    ),
    "catalog-editorial-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="4" width="36" height="26" rx="2" fill="currentColor" opacity=".2"/><rect x="42" y="4" width="36" height="12" rx="2" fill="currentColor" opacity=".15"/><rect x="42" y="18" width="17" height="12" rx="2" fill="currentColor" opacity=".12"/><rect x="61" y="18" width="17" height="12" rx="2" fill="currentColor" opacity=".15"/><rect x="2" y="32" width="17" height="12" rx="2" fill="currentColor" opacity=".12"/><rect x="21" y="32" width="17" height="12" rx="2" fill="currentColor" opacity=".15"/><rect x="42" y="32" width="36" height="12" rx="2" fill="currentColor" opacity=".12"/></svg>
    ),
    "catalog-masonry-flow": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="4" width="24" height="18" rx="2" fill="currentColor" opacity=".18"/><rect x="28" y="4" width="24" height="14" rx="2" fill="currentColor" opacity=".15"/><rect x="54" y="4" width="24" height="26" rx="2" fill="currentColor" opacity=".2"/><rect x="2" y="24" width="24" height="20" rx="2" fill="currentColor" opacity=".15"/><rect x="28" y="20" width="24" height="24" rx="2" fill="currentColor" opacity=".18"/></svg>
    ),
    "catalog-instagram-square-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full">{[2,20,38].map(y=>[2,20,38,56].map(x=><rect key={`${x}${y}`} x={x} y={y} width="16" height="14" rx="2" fill="currentColor" opacity=".15"/>))}</svg>
    ),
    "catalog-split-hero-catalog": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="2" width="46" height="44" rx="3" fill="currentColor" opacity=".2"/><rect x="2" y="2" width="46" height="10" rx="3" fill="currentColor" opacity=".1"/><rect x="6" y="16" width="14" height="2" rx="1" fill="currentColor" opacity=".3"/><rect x="6" y="22" width="24" height="2" rx="1" fill="currentColor" opacity=".2"/><rect x="6" y="28" width="20" height="2" rx="1" fill="currentColor" opacity=".15"/><rect x="52" y="2" width="26" height="20" rx="2" fill="currentColor" opacity=".12"/><rect x="52" y="24" width="26" height="20" rx="2" fill="currentColor" opacity=".12"/></svg>
    ),
    "catalog-neo-brutalist-matrix": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="4" width="24" height="18" rx="1" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".3"/><rect x="30" y="2" width="22" height="14" rx="1" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".2"/><rect x="56" y="6" width="22" height="18" rx="1" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".25"/><rect x="2" y="26" width="22" height="18" rx="1" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".2"/><rect x="30" y="20" width="22" height="18" rx="1" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".3"/><rect x="56" y="28" width="22" height="14" rx="1" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".2"/></svg>
    ),
    "catalog-horizontal-swipe-carousel": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="72" height="34" rx="3" fill="currentColor" opacity=".18"/><rect x="4" y="4" width="72" height="12" rx="3" fill="currentColor" opacity=".1"/><text x="8" y="14" fontSize="8" fill="currentColor" opacity=".5">‹</text><text x="68" y="14" fontSize="8" fill="currentColor" opacity=".5">›</text><rect x="8" y="20" width="18" height="14" rx="2" fill="currentColor" opacity=".15"/><rect x="30" y="20" width="18" height="14" rx="2" fill="currentColor" opacity=".12"/><rect x="52" y="20" width="18" height="14" rx="2" fill="currentColor" opacity=".15"/><circle cx="30" cy="42" r="2" fill="currentColor" opacity=".4"/><circle cx="40" cy="42" r="2" fill="currentColor" opacity=".2"/><circle cx="50" cy="42" r="2" fill="currentColor" opacity=".2"/></svg>
    ),
    // Contact
    "contact-classic-split": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="6" width="34" height="36" rx="2" fill="currentColor" opacity=".08" stroke="currentColor" strokeWidth="0.5" strokeOpacity=".2"/>{[10,19,28,37].map(y=><rect key={y} x="8" y={y} width="26" height="5" rx="1" fill="currentColor" opacity=".12"/>)}<rect x="42" y="6" width="34" height="36" rx="2" fill="currentColor" opacity=".08"/><rect x="46" y="10" width="26" height="4" rx="1" fill="currentColor" opacity=".2"/>{[16,22,28,34].map(y=><rect key={y} x="46" y={y} width="22" height="3" rx="1" fill="currentColor" opacity=".12"/>)}</svg>
    ),
    "contact-minimal-centered": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="20" y="6" width="40" height="6" rx="1" fill="currentColor" opacity=".25"/><rect x="24" y="16" width="14" height="4" rx="1" fill="currentColor" opacity=".2"/><rect x="24" y="22" width="18" height="4" rx="1" fill="currentColor" opacity=".2"/><rect x="24" y="28" width="16" height="4" rx="1" fill="currentColor" opacity=".2"/><rect x="24" y="38" width="32" height="6" rx="2" fill="currentColor" opacity=".25"/></svg>
    ),
    "contact-overlay-map": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="2" width="76" height="44" rx="3" fill="currentColor" opacity=".08"/>{[[10,10],[25,25],[45,15],[60,30],[20,38]].map(([x,y])=><circle key={`${x}${y}`} cx={x} cy={y} r="2" fill="currentColor" opacity=".15"/>)}<line x1="2" y1="2" x2="76" y2="44" stroke="currentColor" strokeWidth="0.5" strokeOpacity=".05"/><rect x="10" y="14" width="28" height="20" rx="3" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="0.5" strokeOpacity=".3"/><rect x="13" y="18" width="20" height="3" rx="1" fill="currentColor" opacity=".3"/><rect x="13" y="24" width="16" height="2" rx="1" fill="currentColor" opacity=".2"/></svg>
    ),
    "contact-bento-grid": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="4" y="4" width="34" height="20" rx="3" fill="currentColor" opacity=".15"/><rect x="42" y="4" width="34" height="9" rx="2" fill="currentColor" opacity=".12"/><rect x="42" y="16" width="34" height="9" rx="2" fill="currentColor" opacity=".12"/><rect x="4" y="28" width="16" height="16" rx="2" fill="currentColor" opacity=".1"/><rect x="24" y="28" width="16" height="16" rx="2" fill="currentColor" opacity=".1"/><rect x="44" y="28" width="32" height="16" rx="2" fill="currentColor" opacity=".15"/></svg>
    ),
    "contact-dark-split": (
      <svg viewBox="0 0 80 48" className="w-full h-full"><rect x="2" y="2" width="76" height="44" rx="3" fill="currentColor" opacity=".2"/><rect x="2" y="2" width="36" height="44" rx="3" fill="currentColor" opacity=".1"/><rect x="8" y="10" width="24" height="5" rx="1" fill="currentColor" opacity=".3"/>{[18,24,30].map(y=><rect key={y} x="8" y={y} width="20" height="3" rx="1" fill="currentColor" opacity=".2"/>)}<rect x="44" y="8" width="28" height="32" rx="2" fill="currentColor" opacity=".08" stroke="currentColor" strokeWidth="0.5" strokeOpacity=".2"/>{[12,20,28,36].map(y=><rect key={y} x="48" y={y} width="20" height="4" rx="1" fill="currentColor" opacity=".12"/>)}</svg>
    ),
  };

  const diagram = diagrams[id];
  return (
    <div className={`h-16 flex items-center justify-center ${diagram ? "bg-gradient-to-br from-primary/5 to-muted/30" : "bg-muted/20"} text-muted-foreground/60`}>
      {diagram ?? <span className="text-[10px] font-mono opacity-40">{id}</span>}
    </div>
  );
}

type Tab = "sections" | "pairings" | "patterns" | "presets";

// ─── Colour swatch strip ──────────────────────────────────────────────────────
function PaletteStrip({ palette }: { palette: ColorPattern["palette"] }) {
  return (
    <div className="flex gap-1.5">
      {(["primary", "accent", "background", "surface", "text"] as const).map((k) => (
        <div
          key={k}
          className="size-5 rounded-full border border-white/20 shadow-sm shrink-0"
          style={{ background: palette[k] }}
          title={`${k}: ${palette[k]}`}
        />
      ))}
    </div>
  );
}

// ─── Hidden / visible badge ───────────────────────────────────────────────────
function VisibilityBadge({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive gap-1 font-semibold">
      <EyeOff className="size-2.5" /> Disembunyikan
    </Badge>
  ) : (
    <Badge variant="outline" className="text-[10px] border-green-500/40 text-green-500 gap-1 font-semibold">
      <Eye className="size-2.5" /> Aktif
    </Badge>
  );
}

// ─── Sections Tab ─────────────────────────────────────────────────────────────
function SectionsTab({
  hiddenSections, requiredSections, hiddenVariants, hiddenMapTiles,
  onToggleHide, onToggleRequired, onToggleVariant, onToggleMapTile, onReset,
}: {
  hiddenSections: Set<string>;
  requiredSections: Set<string>;
  hiddenVariants: Record<string, string[]>;
  hiddenMapTiles: string[];
  onToggleHide: (key: string, hide: boolean) => void;
  onToggleRequired: (key: string, required: boolean) => void;
  onToggleVariant: (section: string, variant: string, hide: boolean) => void;
  onToggleMapTile: (tile: string, hide: boolean) => void;
  onReset: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* ── Section visibility ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Visibilitas Section</p>
            <p className="text-xs text-muted-foreground mt-0.5">Section yang disembunyikan tidak muncul di sidebar editor.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5 shrink-0">
            <RotateCcw className="size-3.5" /> Reset Default
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MANAGEABLE_SECTIONS.map((key) => {
            const meta = SECTION_META[key];
            const isHidden = hiddenSections.has(key);
            const isRequired = requiredSections.has(key);
            const isOptional = OPTIONAL_SECTION_KEYS.includes(key);
            const Icon = meta?.icon;
            const hasVariants = !!SECTION_VARIANT_OPTIONS[key];
            const variantCount = SECTION_VARIANT_OPTIONS[key]?.length ?? 0;
            const hiddenVariantCount = (hiddenVariants[key] ?? []).length;
            const isExpanded = expandedSection === key;

            return (
              <Card key={key} className={`border transition-all ${isHidden ? "opacity-50 border-border/30" : "border-border/50 hover:border-border/80"}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="size-4 text-muted-foreground shrink-0" />}
                      <div>
                        <p className="font-semibold text-sm">{meta?.label ?? key}</p>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">{key}</p>
                      </div>
                    </div>
                    <VisibilityBadge hidden={isHidden} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {isOptional && <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-semibold">Opsional</Badge>}
                    {isRequired && (
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-amber-500/40 text-amber-500 font-semibold gap-0.5">
                        <Lock className="size-2" /> Wajib
                      </Badge>
                    )}
                    {hasVariants && (
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-semibold gap-0.5 cursor-pointer hover:bg-muted/50"
                        onClick={() => setExpandedSection(isExpanded ? null : key)}>
                        {variantCount - hiddenVariantCount}/{variantCount} variasi aktif
                      </Badge>
                    )}
                  </div>

                  <Separator className="bg-border/30" />

                  <div className="flex gap-2">
                    <Button size="sm" variant={isHidden ? "default" : "outline"}
                      className="flex-1 h-7 text-[11px] font-semibold gap-1"
                      disabled={isRequired && !isHidden}
                      onClick={() => onToggleHide(key, !isHidden)}>
                      {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                    </Button>
                    <Button size="sm" variant={isRequired ? "secondary" : "outline"}
                      className="flex-1 h-7 text-[11px] font-semibold gap-1"
                      onClick={() => onToggleRequired(key, !isRequired)}>
                      {isRequired ? <><Unlock className="size-3" /> Lepas Wajib</> : <><Lock className="size-3" /> Wajibkan</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Variasi Tampilan ── */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Variasi Tampilan</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola variasi tampilan per section. Variasi yang disembunyikan tidak muncul di dropdown editor.
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(SECTION_VARIANT_OPTIONS).map(([sectionKey, variants]) => {
            const meta = SECTION_META[sectionKey];
            const Icon = meta?.icon;
            const hiddenForSection = new Set(hiddenVariants[sectionKey] ?? []);
            const activeCount = variants.filter(v => !hiddenForSection.has(v.value)).length;

            return (
              <div key={sectionKey} className="border border-border/40 rounded-xl overflow-hidden">
                {/* Section header */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-b border-border/30">
                  {Icon && <Icon className="size-4 text-muted-foreground shrink-0" />}
                  <span className="font-semibold text-sm">{meta?.label ?? sectionKey}</span>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1.5 ml-auto">
                    {activeCount}/{variants.length} aktif
                  </Badge>
                </div>

                {/* Variant cards */}
                <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                  {variants.map((variant) => {
                    const isHidden = hiddenForSection.has(variant.value);
                    return (
                      <div key={variant.value}
                        className={`relative rounded-xl border transition-all overflow-hidden ${isHidden ? "opacity-50 border-border/20 bg-muted/10" : "border-border/40 bg-card hover:border-border/70"}`}>
                        {/* Visual preview */}
                        <div className={`border-b border-border/20 select-none overflow-hidden ${isHidden ? "opacity-40" : ""}`}>
                          <VariantPreview id={`${sectionKey}-${variant.value}`} />
                        </div>

                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <p className="font-semibold text-xs truncate">{variant.label}</p>
                              <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{variant.description}</p>
                            </div>
                            <VisibilityBadge hidden={isHidden} />
                          </div>
                          <p className="text-[9px] font-mono text-muted-foreground/60">{variant.value}</p>

                          <Button
                            size="sm"
                            variant={isHidden ? "default" : "outline"}
                            className="w-full h-6 text-[10px] font-semibold gap-1"
                            onClick={() => onToggleVariant(sectionKey, variant.value, !isHidden)}
                          >
                            {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Gaya Peta (Map Tiles) ── */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Gaya Peta</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola pilihan gaya peta yang muncul di editor section Kontak.
          </p>
        </div>

        {(() => {
          const ALL_TILES = [
            { key: "default",  label: "OSM",      description: "OpenStreetMap standar, detail dan gratis.", bg: "#e8f4f8", accent: "#3b82f6" },
            { key: "cyclosm",  label: "CyclOSM",  description: "OSM dengan jalur sepeda, warna lebih cerah.", bg: "#f0f9ef", accent: "#22c55e" },
            { key: "light",    label: "Terang",   description: "Peta minimalis terang dari CartoCDN.", bg: "#fafafa", accent: "#94a3b8" },
            { key: "dark",     label: "Gelap",    description: "Peta gelap elegan dari CartoCDN.", bg: "#1e293b", accent: "#94a3b8" },
            { key: "esri",     label: "Esri",     description: "Peta jalan bergaya Esri / ArcGIS.", bg: "#fff8f0", accent: "#f97316" },
            { key: "satelit",  label: "Satelit",  description: "Citra satelit dari Esri World Imagery.", bg: "#0f172a", accent: "#10b981" },
          ];
          const hiddenSet = new Set(hiddenMapTiles);
          return (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ALL_TILES.map((tile) => {
                const isHidden = hiddenSet.has(tile.key);
                return (
                  <div key={tile.key}
                    className={`rounded-xl border overflow-hidden transition-all ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
                    {/* Visual map preview */}
                    <div className="h-20 relative overflow-hidden border-b border-border/20" style={{ background: tile.bg }}>
                      <svg viewBox="0 0 120 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <line x1="0" y1="20" x2="120" y2="22" stroke={tile.accent} strokeWidth="2" strokeOpacity="0.25"/>
                        <line x1="0" y1="40" x2="120" y2="38" stroke={tile.accent} strokeWidth="1" strokeOpacity="0.15"/>
                        <line x1="30" y1="0" x2="28" y2="60" stroke={tile.accent} strokeWidth="2" strokeOpacity="0.2"/>
                        <line x1="75" y1="0" x2="77" y2="60" stroke={tile.accent} strokeWidth="1.5" strokeOpacity="0.15"/>
                        <rect x="33" y="5" width="40" height="12" rx="1" fill={tile.accent} fillOpacity="0.08"/>
                        <rect x="33" y="26" width="40" height="9" rx="1" fill={tile.accent} fillOpacity="0.06"/>
                        <rect x="80" y="5" width="16" height="30" rx="1" fill={tile.accent} fillOpacity="0.07"/>
                        <rect x="5" y="25" width="20" height="18" rx="1" fill={tile.accent} fillOpacity="0.07"/>
                        <circle cx="55" cy="28" r="5" fill={tile.accent} fillOpacity="0.9"/>
                        <circle cx="55" cy="28" r="2.5" fill="white" fillOpacity="0.9"/>
                        <line x1="55" y1="33" x2="55" y2="40" stroke={tile.accent} strokeWidth="1.5" strokeOpacity="0.7"/>
                      </svg>
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: tile.accent + "33", color: tile.accent, border: `1px solid ${tile.accent}44` }}>
                        {tile.label}
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="font-semibold text-xs">{tile.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{tile.description}</p>
                        </div>
                        <VisibilityBadge hidden={isHidden} />
                      </div>
                      <p className="text-[9px] font-mono text-muted-foreground/50">{tile.key}</p>
                      <Button size="sm" variant={isHidden ? "default" : "outline"}
                        className="w-full h-6 text-[10px] font-semibold gap-1"
                        onClick={() => onToggleMapTile(tile.key, !isHidden)}>
                        {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── New Pairing Form ─────────────────────────────────────────────────────────
const EMPTY_PAIRING: Omit<TypographyPairing, "id"> = {
  name: "", description: "",
  heading_font: "Inter", body_font: "Inter",
  heading_weight: "700", heading_size_hero: "3rem",
};

function AddPairingForm({ onAdd, onCancel }: { onAdd: (p: TypographyPairing) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...EMPTY_PAIRING });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.heading_font || !form.body_font) return;
    onAdd({ ...form, id: `custom-${Date.now()}`, is_custom: true });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Tambah Pasangan Font Baru</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nama</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="cth. Startup Bold" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Deskripsi</label>
            <Input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Singkat, 1 kalimat" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Font Heading</label>
            <select value={form.heading_font} onChange={(e) => set("heading_font", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {GOOGLE_FONTS_WHITELIST.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Font Body</label>
            <select value={form.body_font} onChange={(e) => set("body_font", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {GOOGLE_FONTS_WHITELIST.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ketebalan</label>
            <select value={form.heading_weight} onChange={(e) => set("heading_weight", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {["300","400","500","600","700","800","900"].map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ukuran Hero</label>
            <select value={form.heading_size_hero} onChange={(e) => set("heading_size_hero", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {["2rem","2.5rem","3rem","3.5rem","4rem"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!form.name.trim()} className="h-7 text-xs gap-1"><Check className="size-3" /> Simpan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Typography Pairings Tab ──────────────────────────────────────────────────
function PairingsTab({
  hiddenPairings, customPairings, onToggleHide, onAdd, onDelete,
}: {
  hiddenPairings: Set<string>;
  customPairings: TypographyPairing[];
  onToggleHide: (id: string, hide: boolean) => void;
  onAdd: (p: TypographyPairing) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const allPairings = [...TYPOGRAPHY_PAIRINGS, ...customPairings];
  const filtered = allPairings.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.heading_font.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    allPairings.forEach((p) => loadGoogleFont(p.heading_font, p.body_font));
  }, [customPairings.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Cari pasangan font..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 shrink-0 h-9">
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {showAdd && (
        <AddPairingForm onAdd={(p) => { onAdd(p); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((pairing) => {
          const isHidden = hiddenPairings.has(pairing.id);
          return (
            <Card key={pairing.id} className={`overflow-hidden transition-all flex flex-col ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
              {/* Preview strip */}
              <div className="h-20 bg-zinc-950 flex flex-col justify-center px-4 border-b border-white/5">
                <p style={{ fontFamily: `'${pairing.heading_font}', sans-serif`, fontWeight: pairing.heading_weight, fontStyle: pairing.heading_style ?? "normal", textTransform: (pairing.heading_transform ?? "none") as any, letterSpacing: pairing.heading_tracking ?? "normal", fontSize: "16px", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                  {pairing.name}
                </p>
                <p style={{ fontFamily: `'${pairing.body_font}', sans-serif`, fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, marginTop: 4 }}>
                  {pairing.heading_font} / {pairing.body_font}
                </p>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{pairing.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{pairing.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <VisibilityBadge hidden={isHidden} />
                    {pairing.is_custom && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Custom</Badge>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-auto">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pairing.heading_weight}w</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pairing.heading_size_hero}</span>
                  {pairing.heading_transform && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pairing.heading_transform}</span>}
                </div>

                <Separator className="bg-border/30" />

                <div className="flex gap-1.5">
                  <Button size="sm" variant={isHidden ? "default" : "outline"} className="flex-1 h-7 text-[11px] gap-1" onClick={() => onToggleHide(pairing.id, !isHidden)}>
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  {pairing.is_custom && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(pairing.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">Tidak ada pasangan font yang cocok.</div>
      )}
    </div>
  );
}

// ─── New Pattern Form ─────────────────────────────────────────────────────────
const EMPTY_PATTERN_PALETTE = { primary: "#4F46E5", accent: "#7C3AED", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A" };

function AddPatternForm({ onAdd, onCancel }: { onAdd: (p: ColorPattern) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState({ ...EMPTY_PATTERN_PALETTE });
  const setPaletteKey = (k: string, v: string) => setPalette((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ id: `custom-${Date.now()}`, name, description, palette, theme_mode: themeMode, is_custom: true });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Tambah Palet Warna Baru</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nama</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Laut Biru" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Deskripsi</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Singkat, 1 kalimat" className="h-8 text-xs" />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-5">
          {(["primary","accent","background","surface","text"] as const).map((k) => (
            <div key={k} className="space-y-1">
              <label className="text-[9px] font-semibold uppercase text-muted-foreground block capitalize">{k}</label>
              <div className="flex items-center gap-1.5">
                <div className="relative size-6 rounded border border-border overflow-hidden shrink-0">
                  <input type="color" value={palette[k]} onChange={(e) => setPaletteKey(k, e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  <div className="w-full h-full" style={{ backgroundColor: palette[k] }} />
                </div>
                <Input value={palette[k]} onChange={(e) => setPaletteKey(k, e.target.value)} className="h-6 text-[10px] font-mono px-1.5 min-w-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Mode</label>
          <button type="button" onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")} className="flex items-center gap-1.5 px-2 py-1 rounded border border-border/50 text-xs font-medium">
            {themeMode === "light" ? <><Sun className="size-3" /> Terang</> : <><Moon className="size-3" /> Gelap</>}
          </button>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim()} className="h-7 text-xs gap-1"><Check className="size-3" /> Simpan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Color Patterns Tab ───────────────────────────────────────────────────────
function PatternsTab({
  hiddenPatterns, customPatterns, onToggleHide, onAdd, onDelete,
}: {
  hiddenPatterns: Set<string>;
  customPatterns: ColorPattern[];
  onToggleHide: (id: string, hide: boolean) => void;
  onAdd: (p: ColorPattern) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const allPatterns = [...COLOR_PATTERNS, ...customPatterns];
  const filtered = allPatterns.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Cari palet warna..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 shrink-0 h-9">
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {showAdd && <AddPatternForm onAdd={(p) => { onAdd(p); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((pattern) => {
          const isHidden = hiddenPatterns.has(pattern.id);
          const mockDt = { palette: pattern.palette };
          const { total: score } = scoreDesignToken(mockDt);
          return (
            <Card key={pattern.id} className={`overflow-hidden transition-all flex flex-col ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
              {/* Colour strip */}
              <div className="h-20 relative flex items-end p-3 border-b border-border/30"
                style={{ background: `linear-gradient(135deg, ${pattern.palette.background}, ${pattern.palette.surface})` }}>
                <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5">
                  <PaletteStrip palette={pattern.palette} />
                </div>
                <div className="absolute top-2 right-2">
                  {pattern.theme_mode === "dark" ? <Moon className="size-3.5 text-white/50" /> : <Sun className="size-3.5 text-black/40" />}
                </div>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{pattern.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{pattern.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <VisibilityBadge hidden={isHidden} />
                    {pattern.is_custom && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Custom</Badge>}
                  </div>
                </div>

                <Badge variant="outline" className={`self-start text-[10px] font-mono font-bold border ${scoreBadgeClass(score)}`}>
                  Score: {score}
                </Badge>

                <Separator className="bg-border/30" />

                <div className="flex gap-1.5">
                  <Button size="sm" variant={isHidden ? "default" : "outline"} className="flex-1 h-7 text-[11px] gap-1" onClick={() => onToggleHide(pattern.id, !isHidden)}>
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  {pattern.is_custom && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(pattern.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">Tidak ada palet yang cocok.</div>
      )}
    </div>
  );
}

// ─── New Preset Form ──────────────────────────────────────────────────────────
function AddPresetForm({
  onAdd, onCancel,
  enabledPairingIds, enabledPatternIds,
}: {
  onAdd: (p: IndustryPreset) => void;
  onCancel: () => void;
  enabledPairingIds: string[];
  enabledPatternIds: string[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("💼");
  const [pairingId, setPairingId] = useState(enabledPairingIds[0] ?? "");
  const [patternId, setPatternId] = useState(enabledPatternIds[0] ?? "");

  const handleSubmit = () => {
    if (!name.trim() || !pairingId || !patternId) return;
    onAdd({ id: `custom-${Date.now()}`, name, description, icon, pairing_id: pairingId, pattern_id: patternId, is_custom: true });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Tambah Paket Tampilan Baru</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nama</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Apotek Modern" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Deskripsi</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Singkat, 1 kalimat" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ikon Emoji</label>
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🏥" className="h-8 text-xs" maxLength={4} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Pasangan Font</label>
            <select value={pairingId} onChange={(e) => setPairingId(e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {enabledPairingIds.map((id) => {
                const p = TYPOGRAPHY_PAIRINGS.find((t) => t.id === id);
                return <option key={id} value={id}>{p?.name ?? id}</option>;
              })}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Palet Warna</label>
            <select value={patternId} onChange={(e) => setPatternId(e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {enabledPatternIds.map((id) => {
                const p = COLOR_PATTERNS.find((c) => c.id === id);
                return <option key={id} value={id}>{p?.name ?? id}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim()} className="h-7 text-xs gap-1"><Check className="size-3" /> Simpan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Industry Presets Tab ─────────────────────────────────────────────────────
function PresetsTab({
  hiddenPresets, customPresets, hiddenPairings, hiddenPatterns, customPairings, customPatterns,
  onToggleHide, onAdd, onDelete,
}: {
  hiddenPresets: Set<string>;
  customPresets: IndustryPreset[];
  hiddenPairings: Set<string>;
  hiddenPatterns: Set<string>;
  customPairings: TypographyPairing[];
  customPatterns: ColorPattern[];
  onToggleHide: (id: string, hide: boolean) => void;
  onAdd: (p: IndustryPreset) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const allPresets = [...INDUSTRY_PRESETS, ...customPresets];
  const allPairings = [...TYPOGRAPHY_PAIRINGS, ...customPairings];
  const allPatterns = [...COLOR_PATTERNS, ...customPatterns];
  const filtered = allPresets.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const enabledPairingIds = allPairings.filter((p) => !hiddenPairings.has(p.id)).map((p) => p.id);
  const enabledPatternIds = allPatterns.filter((p) => !hiddenPatterns.has(p.id)).map((p) => p.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Cari paket tampilan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 shrink-0 h-9">
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {showAdd && (
        <AddPresetForm
          onAdd={(p) => { onAdd(p); setShowAdd(false); }}
          onCancel={() => setShowAdd(false)}
          enabledPairingIds={enabledPairingIds}
          enabledPatternIds={enabledPatternIds}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((preset) => {
          const isHidden = hiddenPresets.has(preset.id);
          const pairing = allPairings.find((p) => p.id === preset.pairing_id);
          const pattern = allPatterns.find((p) => p.id === preset.pattern_id);

          return (
            <Card key={preset.id} className={`overflow-hidden transition-all flex flex-col ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
              {/* Strip */}
              <div className="h-20 relative flex flex-col justify-end p-3 border-b border-border/30"
                style={{ background: pattern ? `linear-gradient(135deg, ${pattern.palette.background}, ${pattern.palette.surface})` : "var(--muted)" }}>
                {pattern && (
                  <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5 w-fit">
                    <PaletteStrip palette={pattern.palette} />
                  </div>
                )}
                <span className="absolute top-2 right-2 text-xl">{preset.icon}</span>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{preset.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{preset.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <VisibilityBadge hidden={isHidden} />
                    {preset.is_custom && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Custom</Badge>}
                  </div>
                </div>

                {pairing && (
                  <div className="text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-md space-y-0.5">
                    <p style={{ fontFamily: `'${pairing.heading_font}', sans-serif`, fontWeight: pairing.heading_weight, fontSize: "11px", color: "var(--foreground)" }}>
                      {pairing.heading_font}
                    </p>
                    <p style={{ fontFamily: `'${pairing.body_font}', sans-serif`, fontSize: "10px" }}>{pairing.body_font}</p>
                  </div>
                )}

                <Separator className="bg-border/30" />

                <div className="flex gap-1.5">
                  <Button size="sm" variant={isHidden ? "default" : "outline"} className="flex-1 h-7 text-[11px] gap-1" onClick={() => onToggleHide(preset.id, !isHidden)}>
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  {preset.is_custom && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(preset.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">Tidak ada paket yang cocok.</div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DesignAssetsPage() {
  const { role: userRole } = usePermissions();
  const { pushToast } = useToast();
  const authToken = useAuthToken();
  const isSuperAdmin = userRole === "superadmin";
  const [saving, setSaving] = useState(false);

  // Local config state (mirrors API / localStorage)
  const [hiddenPairings, setHiddenPairings] = useState<Set<string>>(new Set());
  const [hiddenPatterns, setHiddenPatterns] = useState<Set<string>>(new Set());
  const [hiddenPresets, setHiddenPresets] = useState<Set<string>>(new Set());
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [requiredSections, setRequiredSections] = useState<Set<string>>(new Set(REQUIRED_SECTIONS_DEFAULT));
  const [hiddenVariants, setHiddenVariants] = useState<Record<string, string[]>>({});
  const [hiddenMapTiles, setHiddenMapTiles] = useState<string[]>([]);
  const [customPairings, setCustomPairings] = useState<TypographyPairing[]>([]);
  const [customPatterns, setCustomPatterns] = useState<ColorPattern[]>([]);
  const [customPresets, setCustomPresets] = useState<IndustryPreset[]>([]);
  const [tab, setTab] = useState<Tab>("sections");
  const [loading, setLoading] = useState(true);

  // Load config from API (falls back to localStorage) on mount
  useEffect(() => {
    if (!isSuperAdmin) return;
    setLoading(true);
    loadDesignAssetsConfig(authToken).then((cfg) => {
      setHiddenPairings(new Set(cfg.hidden_pairings));
      setHiddenPatterns(new Set(cfg.hidden_patterns));
      setHiddenPresets(new Set(cfg.hidden_presets));
      setHiddenSections(new Set(cfg.hidden_sections));
      setRequiredSections(new Set(cfg.required_sections));
      setHiddenVariants(cfg.hidden_variants ?? {});
      setHiddenMapTiles(cfg.hidden_map_tiles ?? []);
      setCustomPairings(cfg.custom_pairings ?? []);
      setCustomPatterns(cfg.custom_patterns ?? []);
      setCustomPresets(cfg.custom_presets ?? []);
    }).finally(() => setLoading(false));
  }, [isSuperAdmin, authToken]);

  const syncAndPersist = useCallback(async (updater: (prev: ReturnType<typeof loadConfig>) => ReturnType<typeof loadConfig>) => {
    const next = updater(loadConfig());
    // Update in-memory cache + localStorage mirror immediately (optimistic)
    updateCache(next);
    setHiddenPairings(new Set(next.hidden_pairings));
    setHiddenPatterns(new Set(next.hidden_patterns));
    setHiddenPresets(new Set(next.hidden_presets));
    setHiddenSections(new Set(next.hidden_sections));
    setRequiredSections(new Set(next.required_sections));
    setHiddenVariants(next.hidden_variants ?? {});
    setHiddenMapTiles(next.hidden_map_tiles ?? []);
    setCustomPairings(next.custom_pairings ?? []);
    setCustomPatterns(next.custom_patterns ?? []);
    setCustomPresets(next.custom_presets ?? []);
    // Persist to API in background
    if (authToken) {
      setSaving(true);
      try {
        await saveDesignAssetsConfig(next, authToken);
      } catch {
        pushToast("Gagal menyimpan ke server. Perubahan tersimpan lokal.", "error");
      } finally {
        setSaving(false);
      }
    }
  }, [authToken, pushToast]);

  if (!isSuperAdmin) {    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4 animate-in fade-in duration-300">
        <ShieldAlert className="size-16 text-destructive opacity-80" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-foreground">Akses Ditolak</h2>
          <p className="text-sm max-w-sm">Halaman ini hanya dapat diakses oleh akun dengan peran <span className="font-semibold text-primary">Superadmin</span>.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-muted-foreground animate-in fade-in duration-300">
        <SlidersHorizontal className="size-8 animate-pulse text-primary" />
        <p className="text-sm font-medium">Memuat konfigurasi design assets...</p>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "sections", label: "Sections", icon: LayoutGrid, count: MANAGEABLE_SECTIONS.length - hiddenSections.size },
    { id: "pairings", label: "Tipografi", icon: Type, count: TYPOGRAPHY_PAIRINGS.length + customPairings.length - hiddenPairings.size },
    { id: "patterns", label: "Palet Warna", icon: Palette, count: COLOR_PATTERNS.length + customPatterns.length - hiddenPatterns.size },
    { id: "presets", label: "Paket Tampilan", icon: Layers, count: INDUSTRY_PRESETS.length + customPresets.length - hiddenPresets.size },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
            <SlidersHorizontal className="size-6 text-primary" />
            Design Assets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola section, tipografi, palet warna, dan paket tampilan yang tersedia di editor website.
          {saving && <span className="text-[10px] text-muted-foreground animate-pulse font-medium">Menyimpan...</span>}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0"
          onClick={async () => {
            if (!window.confirm("Reset semua pengaturan Design Assets ke default?")) return;
            setSaving(true);
            try {
              const cfg = authToken
                ? await resetDesignAssetsConfig(authToken)
                : (() => { updateCache({ hidden_pairings: [], hidden_patterns: [], hidden_presets: [], hidden_sections: [], required_sections: REQUIRED_SECTIONS_DEFAULT, hidden_variants: {}, hidden_map_tiles: [], custom_pairings: [], custom_patterns: [], custom_presets: [] }); return loadConfig(); })();
              setHiddenPairings(new Set(cfg.hidden_pairings));
              setHiddenPatterns(new Set(cfg.hidden_patterns));
              setHiddenPresets(new Set(cfg.hidden_presets));
              setHiddenSections(new Set(cfg.hidden_sections));
              setRequiredSections(new Set(cfg.required_sections));
              setHiddenVariants(cfg.hidden_variants ?? {});
              setHiddenMapTiles(cfg.hidden_map_tiles ?? []);
              setCustomPairings(cfg.custom_pairings ?? []);
              setCustomPatterns(cfg.custom_patterns ?? []);
              setCustomPresets(cfg.custom_presets ?? []);
              pushToast("Semua pengaturan Design Assets direset ke default.", "success");
            } catch {
              pushToast("Gagal reset ke server.", "error");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          <RotateCcw className={`size-3.5 ${saving ? "animate-spin" : ""}`} /> Reset Semua
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border/40 pb-px gap-1">
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 ${
              tab === id
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "sections" && (
        <SectionsTab
          hiddenSections={hiddenSections}
          requiredSections={requiredSections}
          hiddenVariants={hiddenVariants}
          onToggleHide={(key, hide) => {            if (hide && requiredSections.has(key)) {
              pushToast(`Section "${key}" wajib aktif dan tidak bisa disembunyikan.`, "error");
              return;
            }
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_sections);
              hide ? s.add(key) : s.delete(key);
              return { ...cfg, hidden_sections: Array.from(s) };
            });
            pushToast(hide ? `Section "${key}" disembunyikan.` : `Section "${key}" ditampilkan.`, "success");
          }}
          onToggleRequired={(key, required) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.required_sections);
              required ? s.add(key) : s.delete(key);
              // If making required, also un-hide it
              const h = new Set(cfg.hidden_sections);
              if (required) h.delete(key);
              return { ...cfg, required_sections: Array.from(s), hidden_sections: Array.from(h) };
            });
            pushToast(required ? `Section "${key}" dijadikan wajib.` : `Section "${key}" bisa disembunyikan.`, "success");
          }}
          onToggleVariant={(section, variant, hide) => {
            syncAndPersist((cfg) => {
              const current = new Set((cfg.hidden_variants ?? {})[section] ?? []);
              hide ? current.add(variant) : current.delete(variant);
              return {
                ...cfg,
                hidden_variants: { ...(cfg.hidden_variants ?? {}), [section]: Array.from(current) },
              };
            });
            pushToast(
              hide ? `Variasi "${variant}" pada "${section}" disembunyikan.` : `Variasi "${variant}" pada "${section}" ditampilkan.`,
              "success"
            );
          }}
          onReset={() => {
            syncAndPersist((cfg) => ({ ...cfg, hidden_sections: [], required_sections: REQUIRED_SECTIONS_DEFAULT, hidden_variants: {}, hidden_map_tiles: [] }));
            pushToast("Pengaturan sections direset.", "success");
          }}
          hiddenMapTiles={hiddenMapTiles}
          onToggleMapTile={(tile, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_map_tiles ?? []);
              hide ? s.add(tile) : s.delete(tile);
              return { ...cfg, hidden_map_tiles: Array.from(s) };
            });
            pushToast(hide ? `Gaya peta "${tile}" disembunyikan.` : `Gaya peta "${tile}" ditampilkan.`, "success");
          }}
        />
      )}

      {tab === "pairings" && (
        <PairingsTab
          hiddenPairings={hiddenPairings}
          customPairings={customPairings}
          onToggleHide={(id, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_pairings);
              hide ? s.add(id) : s.delete(id);
              return { ...cfg, hidden_pairings: Array.from(s) };
            });
            pushToast(hide ? "Pasangan font disembunyikan." : "Pasangan font ditampilkan.", "success");
          }}
          onAdd={(p) => {
            syncAndPersist((cfg) => ({ ...cfg, custom_pairings: [...(cfg.custom_pairings ?? []), p] }));
            pushToast(`Pasangan font "${p.name}" ditambahkan.`, "success");
          }}
          onDelete={(id) => {
            if (!window.confirm("Hapus pasangan font custom ini?")) return;
            syncAndPersist((cfg) => ({ ...cfg, custom_pairings: (cfg.custom_pairings ?? []).filter((p) => p.id !== id) }));
            pushToast("Pasangan font dihapus.", "success");
          }}
        />
      )}

      {tab === "patterns" && (
        <PatternsTab
          hiddenPatterns={hiddenPatterns}
          customPatterns={customPatterns}
          onToggleHide={(id, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_patterns);
              hide ? s.add(id) : s.delete(id);
              return { ...cfg, hidden_patterns: Array.from(s) };
            });
            pushToast(hide ? "Palet disembunyikan." : "Palet ditampilkan.", "success");
          }}
          onAdd={(p) => {
            syncAndPersist((cfg) => ({ ...cfg, custom_patterns: [...(cfg.custom_patterns ?? []), p] }));
            pushToast(`Palet "${p.name}" ditambahkan.`, "success");
          }}
          onDelete={(id) => {
            if (!window.confirm("Hapus palet custom ini?")) return;
            syncAndPersist((cfg) => ({ ...cfg, custom_patterns: (cfg.custom_patterns ?? []).filter((p) => p.id !== id) }));
            pushToast("Palet dihapus.", "success");
          }}
        />
      )}

      {tab === "presets" && (
        <PresetsTab
          hiddenPresets={hiddenPresets}
          customPresets={customPresets}
          hiddenPairings={hiddenPairings}
          hiddenPatterns={hiddenPatterns}
          customPairings={customPairings}
          customPatterns={customPatterns}
          onToggleHide={(id, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_presets);
              hide ? s.add(id) : s.delete(id);
              return { ...cfg, hidden_presets: Array.from(s) };
            });
            pushToast(hide ? "Paket tampilan disembunyikan." : "Paket tampilan ditampilkan.", "success");
          }}
          onAdd={(p) => {
            syncAndPersist((cfg) => ({ ...cfg, custom_presets: [...(cfg.custom_presets ?? []), p] }));
            pushToast(`Paket "${p.name}" ditambahkan.`, "success");
          }}
          onDelete={(id) => {
            if (!window.confirm("Hapus paket tampilan custom ini?")) return;
            syncAndPersist((cfg) => ({ ...cfg, custom_presets: (cfg.custom_presets ?? []).filter((p) => p.id !== id) }));
            pushToast("Paket tampilan dihapus.", "success");
          }}
        />
      )}
    </div>
  );
}
