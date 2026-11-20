"use client";
import React from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { AboutVariantProps } from "./classic";
import type { VariantDef } from "../variant-meta";
import { ABOUT_VARIANTS } from "./variants";

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
  // Varian tak dikenal (mis. sudah dihapus) jatuh ke "classic", bukan error.
  const Renderer = (
    (ABOUT_VARIANTS as Record<string, VariantDef<AboutVariantProps>>)[variant] ?? ABOUT_VARIANTS.classic
  ).component;

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
