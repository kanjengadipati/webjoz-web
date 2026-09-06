"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import CtaClassic from "./classic";
import CtaCard from "./card";
import CtaCentered from "./centered";
import CtaSplitImage from "./split-image";
import CtaInlineLeadForm from "./inline-lead-form";

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

const variants: Record<string, ComponentType<CtaVariantProps>> = {
  banner: CtaClassic,
  card: CtaCard,
  centered: CtaCentered,
  "split-image": CtaSplitImage,
  "inline-lead-form": CtaInlineLeadForm,
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
  const Renderer = variants[variant] ?? CtaClassic;
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
