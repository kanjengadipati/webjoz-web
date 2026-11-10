"use client";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import { useI18n } from "@/lib/i18n/context";

const TestimonialsClassic = dynamic(() => import("./classic"));
const TestimonialsCompact = dynamic(() => import("./compact"));
const TestimonialsGrid = dynamic(() => import("./grid"));
const TestimonialsLogoWall = dynamic(() => import("./logo-wall"));
const TestimonialsFeaturedSpotlight = dynamic(() => import("./featured-spotlight"));
const TestimonialsGoogleReviews = dynamic(() => import("./google-reviews"));
const TestimonialsVideoWall = dynamic(() => import("./video-wall"));

type TestimonialVariantProps = {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  isExample?: boolean;
  locale?: string;
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
  const { locale } = useI18n();
  const variant = design_token?.layout?.section_variants?.testimonials ?? "carousel";
  const Renderer = variants[variant] ?? TestimonialsClassic;
  const isEditor = !!isEditorMode;
  const isExample = testimonials?._is_example === true;

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


  // Semua hook di atas; baru boleh return awal.
  if (isExample && !isEditor) return null;

  return (
    <>
      <Renderer
        testimonials={testimonials}
        design_token={design_token}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
        isExample={isExample}
        locale={locale}
        onAddItem={isEditor ? onAddItem : undefined}
      />
    </>
  );
}
