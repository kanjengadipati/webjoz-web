"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import BenefitsClassic from "./classic";
import BenefitsStatGrid from "./stat-grid";
import BenefitsChecklist from "./checklist";
import BenefitsComparisonTable from "./comparison-table";

type BenefitVariantProps = {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
};

const variants: Record<string, ComponentType<BenefitVariantProps>> = {
  grid: BenefitsClassic,
  "stat-grid": BenefitsStatGrid,
  checklist: BenefitsChecklist,
  "comparison-table": BenefitsComparisonTable,
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
    />
  );
}
