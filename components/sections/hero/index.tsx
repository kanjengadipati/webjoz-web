"use client";
import React from "react";
import type { ComponentType } from "react";
import type { HeroVariantProps } from "./types";
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

const variants: Record<string, ComponentType<HeroVariantProps>> = {
  // Original 4
  centered: HeroCentered,
  split: HeroSplit,
  minimal: HeroMinimal,
  "full-bleed": HeroFullBleed,
  // New 6
  "minimalist-elegant": HeroMinimalistElegant,
  "tech-saas": HeroTechSaaS,
  "neo-brutalist": HeroNeoBrutalist,
  "bento-grid": HeroBentoGrid,
  "split-editorial": HeroSplitEditorial,
  "natural-organic": HeroNaturalOrganic,
};

export default function HeroSection({
  hero,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const heroStyle = design_token?.layout?.hero_style ?? "centered";
  const Renderer = variants[heroStyle] ?? HeroCentered;
  return (
    <Renderer
      hero={hero}
      design_token={design_token}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
    />
  );
}
