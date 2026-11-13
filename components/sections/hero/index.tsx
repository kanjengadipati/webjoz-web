"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { MotionConfig } from "motion/react";
import type { HeroVariantProps } from "./types";
import type { HeroStyle } from "./meta";
import { getHeroStyle } from "./meta";
import { DesignToken, TemplateProps } from "../../templates/types";

// Dynamic lazy-loaded hero variants (code-split per variant)
const HeroCentered = dynamic(() => import("./centered"));
const HeroSplit = dynamic(() => import("./split"));
const HeroMinimal = dynamic(() => import("./minimal"));
const HeroFullBleed = dynamic(() => import("./full-bleed"));
const HeroMinimalistElegant = dynamic(() => import("./minimalist-elegant"));
const HeroTechSaaS = dynamic(() => import("./tech-saas"));
const HeroNeoBrutalist = dynamic(() => import("./neo-brutalist"));
const HeroBentoGrid = dynamic(() => import("./bento-grid"));
const HeroSplitEditorial = dynamic(() => import("./split-editorial"));
const HeroNaturalOrganic = dynamic(() => import("./natural-organic"));
const HeroPersonalBillboard = dynamic(() => import("./personal-billboard"));
const HeroProfileCutout = dynamic(() => import("./profile-cutout"));
const HeroPortraitShowcase = dynamic(() => import("./portrait-showcase"));
const HeroWorkPreviewStrip = dynamic(() => import("./work-preview-strip"));
const HeroChronologyBadge = dynamic(() => import("./chronology-badge"));
const HeroFloatingCard = dynamic(() => import("./floating-card"));
const HeroArchPortrait = dynamic(() => import("./arch-portrait"));
const HeroCollageMosaic = dynamic(() => import("./collage-mosaic"));
const HeroProofBar = dynamic(() => import("./proof-bar"));
const HeroImageCarousel = dynamic(() => import("./image-carousel"));
const HeroCarouselSplit = dynamic(() => import("./carousel-split"));
const HeroCarouselFilmstrip = dynamic(() => import("./carousel-filmstrip"));
const HeroVideoBg = dynamic(() => import("./video-bg"));
const HeroBookingForm = dynamic(() => import("./booking-form"));
const HeroLocationMap = dynamic(() => import("./location-map"));
const HeroProductShowcase = dynamic(() => import("./product-showcase"));
const HeroCinematic = dynamic(() => import("./cinematic"));

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
  // Portfolio & personal-brand (5)
  "personal-billboard": HeroPersonalBillboard,
  "profile-cutout": HeroProfileCutout,
  "portrait-showcase": HeroPortraitShowcase,
  "work-preview-strip": HeroWorkPreviewStrip,
  "chronology-badge": HeroChronologyBadge,
  // Tier 1 additions (no new fields)
  "floating-card": HeroFloatingCard,
  "arch-portrait": HeroArchPortrait,
  "collage-mosaic": HeroCollageMosaic,
  "proof-bar": HeroProofBar,
  // Tier 2 additions (video_url + contact/lead props)
  "video-bg": HeroVideoBg,
  "booking-form": HeroBookingForm,
  "location-map": HeroLocationMap,
  // Tier 3 additions
  "product-showcase": HeroProductShowcase,
  "cinematic": HeroCinematic,
};

export default function HeroSection({
  hero,
  contact,
  onSubmitLead,
  leadSubmitting,
  leadSuccess,
  leadError,
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
    <MotionConfig reducedMotion="user">
      <div style={{ containerType: "inline-size", width: "100%" }}>
        <Renderer
          hero={hero}
          contact={contact}
          onSubmitLead={onSubmitLead}
          leadSubmitting={leadSubmitting}
          leadSuccess={leadSuccess}
          leadError={leadError}
          design_token={design_token}
          language={language}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>
    </MotionConfig>
  );
}
