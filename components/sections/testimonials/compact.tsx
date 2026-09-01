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
      wrapperStyle={{ background: "transparent" }}
      cardStyle={{ background: "var(--dt-surface)", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)", borderRadius: "var(--dt-radius-lg)" }}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
    />
  );
}
