"use client";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

const BenefitsClassic = dynamic(() => import("./classic"));
const BenefitsStatGrid = dynamic(() => import("./stat-grid"));
const BenefitsChecklist = dynamic(() => import("./checklist"));
const BenefitsComparisonTable = dynamic(() => import("./comparison-table"));
const BenefitsFeaturedGrid = dynamic(() => import("./featured-grid"));
const BenefitsIconRow = dynamic(() => import("./icon-row"));
const BenefitsBentoGrid = dynamic(() => import("./bento-grid"));
const BenefitsTrustBar = dynamic(() => import("./trust-bar"));
const BenefitsHowItWorks = dynamic(() => import("./how-it-works"));

type BenefitVariantProps = {
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

const variants: Record<string, ComponentType<BenefitVariantProps>> = {
  grid: BenefitsClassic,
  "stat-grid": BenefitsStatGrid,
  checklist: BenefitsChecklist,
  "comparison-table": BenefitsComparisonTable,
  "featured-grid": BenefitsFeaturedGrid,
  "icon-row": BenefitsIconRow,
  "bento-grid": BenefitsBentoGrid,
  "trust-bar": BenefitsTrustBar,
  "how-it-works": BenefitsHowItWorks,
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
  const Renderer = variants[variant] ?? BenefitsClassic;
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
