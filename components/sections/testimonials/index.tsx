"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
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

  const confirmReal = useCallback(() => {
    if (!onUpdateField) return;
    const ok = window.confirm(
      t("dashboard.sitesEditor.testimonialsConfirmPrompt",
        "Dengan melanjutkan, Anda menyatakan testimoni ini nyata dan berasal dari pelanggan Anda. Lanjutkan?"),
    );
    if (ok) onUpdateField("testimonials", "_is_example", false);
  }, [onUpdateField, t]);

  // Semua hook di atas; baru boleh return awal.
  if (isExample && !isEditor) return null;

  return (
    <>
      {isExample && isEditor && (
        <div className="mb-2 px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs space-y-2">
          <p className="font-medium">
            {t("dashboard.sitesEditor.testimonialsExampleBanner",
              "Contoh testimoni buatan AI. Tidak tampil di situs publik sampai Anda menggantinya dengan testimoni asli atau mengonfirmasinya.")}
          </p>
          <div className="flex flex-wrap gap-2">
            {params?.id && (
              <Link href={`/dashboard/sites/${params.id}/testimonials`} className="underline">
                {t("dashboard.sitesEditor.testimonialsCollect", "Kumpulkan testimoni asli")}
              </Link>
            )}
            <button type="button" onClick={confirmReal} className="underline">
              {t("dashboard.sitesEditor.testimonialsConfirmReal", "Ini testimoni asli, tayangkan")}
            </button>
          </div>
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
