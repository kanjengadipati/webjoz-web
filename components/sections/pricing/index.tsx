"use client";
import React from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

import { resolveVariant } from "../variant-meta";
import { PRICING_VARIANTS } from "./variants";

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
  const Renderer = resolveVariant<PricingVariantProps>(PRICING_VARIANTS, variant, "cards");
  return <Renderer {...props} pricing={props.pricing} />;
}
