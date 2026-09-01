"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import TestimonialsClassic from "./classic";
import TestimonialsCompact from "./compact";
import TestimonialsGrid from "./grid";
import TestimonialsLogoWall from "./logo-wall";
import TestimonialsFeaturedSpotlight from "./featured-spotlight";
import TestimonialsGoogleReviews from "./google-reviews";

type TestimonialVariantProps = {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
};

const variants: Record<string, ComponentType<TestimonialVariantProps>> = {
  carousel: TestimonialsClassic,
  compact: TestimonialsCompact,
  grid: TestimonialsGrid,
  "logo-wall": TestimonialsLogoWall,
  "featured-spotlight": TestimonialsFeaturedSpotlight,
  "google-reviews": TestimonialsGoogleReviews,
};

export default function TestimonialsSection({
  testimonials,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const variant = design_token?.layout?.section_variants?.testimonials ?? "carousel";
  const Renderer = variants[variant] ?? TestimonialsClassic;
  return (
    <Renderer
      testimonials={testimonials}
      design_token={design_token}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
    />
  );
}
