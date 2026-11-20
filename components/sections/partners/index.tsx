"use client";
import React from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

import { resolveVariant } from "../variant-meta";
import { PARTNERS_VARIANTS } from "./variants";

export interface PartnersVariantProps {
  partners: NonNullable<TemplateProps["content"]["partners"]>;
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function PartnersSection(props: {
  partners?: TemplateProps["content"]["partners"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  if (!props.partners?.items?.length) return null;
  const variant = props.design_token?.layout?.section_variants?.partners ?? "logo-wall";
  const Renderer = resolveVariant<PartnersVariantProps>(PARTNERS_VARIANTS, variant, "logo-wall");
  return <Renderer {...props} partners={props.partners} />;
}
