"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import AboutClassic from "./classic";
import AboutSplitImage from "./split-image";
import AboutStatHeavy from "./stat-heavy";
import AboutTimeline from "./timeline";
import AboutTeamGrid from "./team-grid";

import type { AboutVariantProps } from "./classic";

const variants: Record<string, ComponentType<AboutVariantProps>> = {
  classic: AboutClassic,
  "split-image": AboutSplitImage,
  "stat-heavy": AboutStatHeavy,
  timeline: AboutTimeline,
  "team-grid": AboutTeamGrid,
};

export default function AboutSection({
  about,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const variant = design_token?.layout?.section_variants?.about ?? "classic";
  const Renderer = variants[variant] ?? AboutClassic;
  return (
    <Renderer
      about={about}
      design_token={design_token}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
    />
  );
}
