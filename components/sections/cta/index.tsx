"use client";
import React from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

import { resolveVariant } from "../variant-meta";
import { CTA_VARIANTS } from "./variants";

export type CtaVariantProps = {
  cta: TemplateProps["content"]["cta"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<string | void>;
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
};

export default function CtaSection({
  cta,
  design_token,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onSubmitLead,
  leadSubmitting,
  leadSuccess,
  leadError,
}: {
  cta: TemplateProps["content"]["cta"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<string | void>;
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
}) {
  const variant = design_token?.layout?.section_variants?.cta ?? "banner";
  const Renderer = resolveVariant<CtaVariantProps>(CTA_VARIANTS, variant, "banner");
  return (
    <Renderer
      cta={cta}
      design_token={design_token}
      language={language}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
      onSubmitLead={onSubmitLead}
      leadSubmitting={leadSubmitting}
      leadSuccess={leadSuccess}
      leadError={leadError}
    />
  );
}
