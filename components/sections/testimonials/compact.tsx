"use client";
import React from "react";
import { SharedTestimonialsSection } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function TestimonialsCompact({
  testimonials,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: TestimonialsVariantProps) {
  return (
    <SharedTestimonialsSection
      testimonials={testimonials}
      variant="carousel"
      wrapperClass="py-16 px-5 sm:px-6"
      wrapperStyle={{ background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}
      eyebrowStyle={{ color: "var(--dt-primary)" }}
      titleStyle={{ color: "var(--dt-text)" }}
      cardStyle={{
        background: "var(--dt-surface)",
        border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
        borderRadius: "var(--dt-radius-lg)",
        boxShadow: "0 2px 12px color-mix(in srgb, var(--dt-primary) 8%, transparent)",
      }}
      quoteStyle={{ color: "var(--dt-text)" }}
      nameStyle={{ color: "var(--dt-text)" }}
      roleStyle={{ color: "var(--dt-text-muted)" }}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
    />
  );
}
