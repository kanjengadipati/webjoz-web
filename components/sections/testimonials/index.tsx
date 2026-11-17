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
  editorChrome?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  isExample?: boolean;
  locale?: string;
  language?: string;
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
  editorChrome,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language,
}: {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  editorChrome?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: string;
}) {
  const { locale } = useI18n();
  const effectiveLang = language || locale || "id";
  const variant = design_token?.layout?.section_variants?.testimonials ?? "carousel";
  const Renderer = variants[variant] ?? TestimonialsClassic;
  const isEditor = !!(isEditorMode && (editorChrome ?? true));
  const isExample = testimonials?._is_example === true;

  const onAddItem = useCallback(() => {
    if (!onUpdateField) return;
    const isEN = effectiveLang.toLowerCase().startsWith("en");
    const items = [...(testimonials?.items ?? [])];
    items.push({
      quote: isEN
        ? "Very friendly and professional service, the results exceeded our expectations!"
        : "Pelayanan sangat ramah, profesional, dan hasil yang diberikan sangat memuaskan!",
      name: isEN ? "Client Name" : "Nama Pelanggan",
      role: isEN ? "Client" : "Pelanggan",
      avatar_initials: isEN ? "CN" : "NP",
      avatar_color: "var(--dt-primary)",
    });
    onUpdateField("testimonials", "items", items);
  }, [testimonials?.items, onUpdateField, effectiveLang]);


  // Semua hook di atas; baru boleh return awal.
  if (isExample && !isEditor) return null;

  return (
    <>
      <Renderer
        testimonials={testimonials}
        design_token={design_token}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        editorChrome={editorChrome}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
        isExample={isExample}
        locale={locale}
        language={effectiveLang}
        onAddItem={isEditor ? onAddItem : undefined}
      />
    </>
  );
}
