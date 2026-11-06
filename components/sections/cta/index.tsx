"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

const CtaClassic = dynamic(() => import("./classic"));
const CtaCard = dynamic(() => import("./card"));
const CtaCentered = dynamic(() => import("./centered"));
const CtaSplitImage = dynamic(() => import("./split-image"));
const CtaInlineLeadForm = dynamic(() => import("./inline-lead-form"));

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
