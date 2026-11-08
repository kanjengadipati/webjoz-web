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
        <div className="mt-11 mb-4 mx-3 sm:mx-6 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs shadow-sm">
          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 text-amber-400">⚠️</span>
            <div className="space-y-2 flex-1">
              <p className="font-medium leading-relaxed">
                {t("dashboard.sitesEditor.testimonialsExampleBanner",
                  "Contoh testimoni buatan AI. Tidak tampil di situs publik sampai Anda menggantinya dengan testimoni asli atau mengonfirmasinya.")}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {params?.id && (
                  <Link
                    href={`/dashboard/sites/${params.id}/testimonials`}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors"
                  >
                    {t("dashboard.sitesEditor.testimonialsCollect", "Kumpulkan testimoni asli")}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={confirmReal}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {t("dashboard.sitesEditor.testimonialsConfirmReal", "Ini testimoni asli, tayangkan")}
                </button>
              </div>
            </div>
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
