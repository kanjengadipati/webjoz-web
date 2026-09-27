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

  const onAddItem = React.useCallback(() => {
    if (!onUpdateField) return;
    if (variant === "timeline") {
      const milestones = [...(about?.milestones || [])];
      milestones.push({
        year: String(new Date().getFullYear()),
        title: "Pencapaian Baru",
        description: "Deskripsi pencapaian atau momen penting.",
      });
      onUpdateField("about", "milestones", milestones);
      return;
    }
    if (variant === "team-grid") {
      const members = [...(about?.team_members || [])];
      members.push({
        name: "Nama Anggota",
        role: "Spesialis / Posisi",
        photo_url: null,
      });
      onUpdateField("about", "team_members", members);
      return;
    }
  }, [about, onUpdateField, variant]);

  return (
    <Renderer
      about={about}
      design_token={design_token}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
      onAddItem={isEditorMode ? onAddItem : undefined}
    />
  );
}
