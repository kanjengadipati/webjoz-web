"use client";
import React from "react";
import type { ComponentType } from "react";
import type { HeroVariantProps } from "./types";
import type { HeroStyle } from "./meta";
import { getHeroStyle } from "./meta";
import { DesignToken, TemplateProps } from "../../templates/types";
import HeroCentered from "./centered";
import HeroSplit from "./split";
import HeroMinimal from "./minimal";
import HeroFullBleed from "./full-bleed";
import HeroMinimalistElegant from "./minimalist-elegant";
import HeroTechSaaS from "./tech-saas";
import HeroNeoBrutalist from "./neo-brutalist";
import HeroBentoGrid from "./bento-grid";
import HeroSplitEditorial from "./split-editorial";
import HeroNaturalOrganic from "./natural-organic";
import HeroPersonalBillboard from "./personal-billboard";
import HeroPortraitShowcase from "./portrait-showcase";
import HeroWorkPreviewStrip from "./work-preview-strip";
import HeroChronologyBadge from "./chronology-badge";
import HeroImageCarousel from "./image-carousel";
import HeroCarouselSplit from "./carousel-split";
import HeroCarouselFilmstrip from "./carousel-filmstrip";

// Typed against HeroStyle (hero/meta.ts): adding a variant to the catalog without
// registering its component here is a compile error. "carousel" is a legacy alias.
const variants: Record<HeroStyle | "carousel", ComponentType<HeroVariantProps>> = {
  // Core classic (4)
  centered: HeroCentered,
  split: HeroSplit,
  minimal: HeroMinimal,
  "full-bleed": HeroFullBleed,
  "image-carousel": HeroImageCarousel,
  carousel: HeroImageCarousel, // Legacy alias for backward compatibility
  "carousel-split": HeroCarouselSplit,
  "carousel-filmstrip": HeroCarouselFilmstrip,
  // Curated layout styles (6)
  "minimalist-elegant": HeroMinimalistElegant,
  "tech-saas": HeroTechSaaS,
  "neo-brutalist": HeroNeoBrutalist,
  "bento-grid": HeroBentoGrid,
  "split-editorial": HeroSplitEditorial,
  "natural-organic": HeroNaturalOrganic,
  // Portfolio & personal-brand (4)
  "personal-billboard": HeroPersonalBillboard,
  "portrait-showcase": HeroPortraitShowcase,
  "work-preview-strip": HeroWorkPreviewStrip,
  "chronology-badge": HeroChronologyBadge,
};

export default function HeroSection({
  hero,
  design_token,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  // Authoritative field is design_token.layout.hero_style; fallback to section_variants.hero
  const heroStyle = getHeroStyle(design_token) ?? "centered";
  const Renderer = (variants as Record<string, ComponentType<HeroVariantProps>>)[heroStyle] ?? HeroCentered;
  return (
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <Renderer
        hero={hero}
        design_token={design_token}
        language={language}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
    </div>
  );
}
