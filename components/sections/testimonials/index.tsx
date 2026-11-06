"use client";
import React, { useCallback } from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import TestimonialsClassic from "./classic";
import TestimonialsCompact from "./compact";
import TestimonialsGrid from "./grid";
import TestimonialsLogoWall from "./logo-wall";
import TestimonialsFeaturedSpotlight from "./featured-spotlight";
import TestimonialsGoogleReviews from "./google-reviews";
import TestimonialsVideoWall from "./video-wall";

type TestimonialVariantProps = {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
};

const variants: Record<string, ComponentType<TestimonialVariantProps>> = {
  carousel: TestimonialsClassic,
  compact: TestimonialsCompact,
  grid: TestimonialsGrid,
  "logo-wall": TestimonialsLogoWall,
  "featured-spotlight": TestimonialsFeaturedSpotlight,
  "google-reviews": TestimonialsGoogleReviews,
  "video-wall": TestimonialsVideoWall,
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
  const isEditor = !!isEditorMode;

  // Option B: AI-generated testimonials are marked as examples.
  // On the public site, don't render them until the owner approves/replaces.
  const isExample = (testimonials as any)?._is_example === true;
  if (isExample && !isEditor) {
    return null;
  }

  const onAddItem = useCallback(() => {
    if (!onUpdateField) return;
    const items = [...(testimonials?.items ?? [])];
    items.push({
      quote: "Pelayanan sangat ramah, profesional, dan hasil yang diberikan sangat memuaskan!",
      name: "Nama Pelanggan",
      role: "Pelanggan",
      avatar_initials: "NP",
      avatar_color: "var(--dt-primary)",
    });
    onUpdateField("testimonials", "items", items);
  }, [testimonials?.items, onUpdateField]);

  return (
    <>
      {isExample && isEditor && (
        <div className="mb-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          Contoh testimoni (AI) — ganti atau setujui sebelum tayang
        </div>
      )}
      <Renderer
        testimonials={testimonials}
      design_token={design_token}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
      onAddItem={isEditor ? onAddItem : undefined}
    />
    </>
  );
}
