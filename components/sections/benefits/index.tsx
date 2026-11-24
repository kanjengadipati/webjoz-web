"use client";
import React, { useCallback } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

import { resolveVariant } from "../variant-meta";
import { BENEFITS_VARIANTS } from "./variants";

export type BenefitVariantProps = {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
  onAddItem?: () => void;
};

export default function BenefitsSection({
  benefits,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
}) {
  const variant = design_token?.layout?.section_variants?.benefits ?? "grid";
  const Renderer = resolveVariant<BenefitVariantProps>(BENEFITS_VARIANTS, variant, "grid");
  const isEditor = !!isEditorMode;
  const isEN = language === "en";

  const onAddItem = useCallback(() => {
    if (!onUpdateField) return;
    if (variant === "comparison-table") {
      const comp = benefits?.comparison || {
        column_a_label: isEN ? "Us" : "Kami",
        column_b_label: isEN ? "Others" : "Lainnya",
        rows: [],
      };
      const rows = [...(comp.rows || [])];
      rows.push({
        label: isEN ? "New Feature / Benefit" : "Fitur / Keunggulan Baru",
        value_a: "✓",
        value_b: "✗",
      });
      onUpdateField("benefits", "comparison", { ...comp, rows });
      return;
    }
    if (variant === "big-statistics") {
      const items = [...(benefits?.items ?? [])];
      const itemNumber = items.length + 1;
      items.push({
        title: isEN ? `Key Metric ${itemNumber}` : `Metrik Pencapaian ${itemNumber}`,
        description: isEN
          ? "Measurable impact and positive outcomes for clients."
          : "Dampak terukur dan hasil positif bagi pelanggan.",
        stat: "100%",
        stat_label: isEN ? "Success Rate" : "Tingkat Keberhasilan",
      });
      onUpdateField("benefits", "items", items);
      return;
    }
    if (variant === "alternating-feature") {
      const items = [...(benefits?.items ?? [])];
      const itemNumber = items.length + 1;
      items.push({
        title: isEN ? `Pillar ${itemNumber}` : `Pilar Keunggulan ${itemNumber}`,
        description: isEN
          ? "In-depth narrative describing how this solution delivers excellence."
          : "Penjelasan mendalam bagaimana solusi ini memberikan hasil terbaik.",
        icon: "Star",
      });
      onUpdateField("benefits", "items", items);
      return;
    }
    const items = [...(benefits?.items ?? [])];
    const itemNumber = items.length + 1;
    items.push({
      title: isEN ? `Benefit ${itemNumber}` : `Keunggulan ${itemNumber}`,
      description: isEN
        ? "Description of this service or product benefit."
        : "Deskripsi keunggulan layanan atau produk kami.",
      icon: "Star",
    });
    onUpdateField("benefits", "items", items);
  }, [benefits, onUpdateField, variant, isEN]);

  return (
    <Renderer
      benefits={benefits}
      design_token={design_token}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
      language={language}
      onAddItem={isEditor ? onAddItem : undefined}
    />
  );
}
