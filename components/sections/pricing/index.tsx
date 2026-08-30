"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import PricingCards from "./cards";
import PricingHorizontalRows from "./horizontal-rows";
import PricingComparisonTable from "./comparison-table";

export interface PricingVariantProps {
  pricing: NonNullable<TemplateProps["content"]["pricing"]>;
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

const variants: Record<string, ComponentType<PricingVariantProps>> = {
  cards: PricingCards,
  "horizontal-rows": PricingHorizontalRows,
  "comparison-table": PricingComparisonTable,
};

export default function PricingSection(props: {
  pricing?: TemplateProps["content"]["pricing"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  if (!props.pricing?.plans?.length) return null;
  const variant = props.design_token?.layout?.section_variants?.pricing ?? "cards";
  const Renderer = variants[variant] ?? PricingCards;
  return <Renderer {...props} pricing={props.pricing} />;
}
