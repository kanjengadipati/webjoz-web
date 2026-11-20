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

  const onAddItem = useCallback(() => {
    if (!onUpdateField) return;
    if (variant === "comparison-table") {
      const comp = benefits?.comparison || {
        column_a_label: "Kami",
        column_b_label: "Lainnya",
        rows: [],
      };
      const rows = [...(comp.rows || [])];
      rows.push({ label: "Fitur / Keunggulan Baru", value_a: "✓", value_b: "✗" });
      onUpdateField("benefits", "comparison", { ...comp, rows });
      return;
    }
    const items = [...(benefits?.items ?? [])];
    const itemNumber = items.length + 1;
    items.push({
      title: `Keunggulan ${itemNumber}`,
      description: "Deskripsi keunggulan layanan atau produk kami.",
      icon: "Star",
    });
    onUpdateField("benefits", "items", items);
  }, [benefits, onUpdateField, variant]);

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
