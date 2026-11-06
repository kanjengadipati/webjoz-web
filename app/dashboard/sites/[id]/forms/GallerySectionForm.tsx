"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function GallerySectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
  renderFieldActions,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary mb-1">
        <p className="font-semibold text-primary">📸 {t("dashboard.sitesEditor.gallerySectionBanner")}</p>
        <p className="mt-1 text-primary/80">{t("dashboard.sitesEditor.gallerySectionBannerDesc2")}</p>
      </div>
      <SidebarField
        section="gallery"
        fieldKey="title"
        label={t("dashboard.sitesEditor.galleryTitle")}
        value={content.gallery?.title || ""}
        onChange={(val) => updateField("gallery", "title", val)}
        needsAttention={needsAttention("gallery.title")}
        inputClassName={fieldClass("gallery.title", "")}
        placeholder={t("dashboard.sitesEditor.phGalleryTitle")}
        undoCount={fieldUndoStacks?.["gallery.title"]?.length}
        onUndo={() => undoField?.("gallery", "title")}
      />
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>{t("dashboard.sitesEditor.galleryEyebrow")}</span>
          {renderFieldActions?.("gallery", "eyebrow")}
        </label>
        <input
          id="field-gallery.eyebrow"
          type="text"
          value={content.gallery?.eyebrow || ""}
          onChange={(e) => updateField("gallery", "eyebrow", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
          placeholder={t("dashboard.sitesEditor.phGalleryEyebrow")}
        />
      </div>

      {/* Layout Picker */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.galleryLayout")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: "grid", label: t("dashboard.sitesEditor.galleryLayoutGrid"), desc: t("dashboard.sitesEditor.galleryLayoutGridDesc") },
            { value: "masonry", label: t("dashboard.sitesEditor.galleryLayoutMasonry"), desc: t("dashboard.sitesEditor.galleryLayoutMasonryDesc") },
            { value: "carousel", label: t("dashboard.sitesEditor.galleryLayoutCarousel"), desc: t("dashboard.sitesEditor.galleryLayoutCarouselDesc") },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("gallery", "layout", opt.value)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                (content.gallery?.layout || "grid") === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-sidebar-muted-foreground hover:border-border"
              }`}
            >
              <div className="text-[11px] font-semibold">{opt.label}</div>
              <div className="text-[9px] opacity-60">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Carousel config (only when carousel selected) */}
      {(content.gallery?.layout || "grid") === "carousel" && (
        <div className="space-y-3 p-3 rounded-xl border border-border/50 bg-muted/30">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.galleryCarouselSettingsLabel")}
          </span>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.galleryAutoplaySpeed")}
            </label>
            <input
              type="number"
              min={1000}
              max={15000}
              step={500}
              value={content.gallery?.autoplay_speed ?? 4000}
              onChange={(e) => updateField("gallery", "autoplay_speed", parseInt(e.target.value) || 4000)}
              className={SIDEBAR_FIELD_CLASS}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={content.gallery?.show_dots ?? true}
              onChange={(e) => updateField("gallery", "show_dots", e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-[11px] font-medium text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.galleryShowDots")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={content.gallery?.show_arrows ?? true}
              onChange={(e) => updateField("gallery", "show_arrows", e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-[11px] font-medium text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.galleryShowArrows")}
            </span>
          </label>
        </div>
      )}

      {/* Gallery Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.galleryItems")} ({content.gallery?.items?.length || 0})
          </span>
          <button
            type="button"
            onClick={() => {
              const next = [...(content.gallery?.items || []), { image_url: "", caption: "", alt_text: "" }];
              updateField("gallery", "items", next);
            }}
            className="text-[12px] py-1.5 px-3 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.galleryAddItem")}
          </button>
        </div>
        {(content.gallery?.items || []).map((item: any, idx: number) => (
          <div key={idx} className="mb-3 p-4 rounded-xl border border-border/50 bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-sidebar-subtle-foreground font-medium">
                {t("dashboard.sitesEditor.galleryItem")} #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = (content.gallery?.items || []).filter((_: any, i: number) => i !== idx);
                  updateField("gallery", "items", next);
                }}
                className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.commonImageUrl")}
              </label>
              <div className="flex gap-2">
                <input
                  id={`field-gallery.items.${idx}.image_url`}
                  type="text"
                  value={item.image_url || ""}
                  onChange={(e) => {
                    const next = [...(content.gallery?.items || [])];
                    next[idx] = { ...next[idx], image_url: e.target.value };
                    updateField("gallery", "items", next);
                  }}
                  className="flex-1 px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              {item.image_url && (
                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img
                    src={item.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.commonCaption")}
              </label>
              <input
                type="text"
                value={item.caption || ""}
                onChange={(e) => {
                  const next = [...(content.gallery?.items || [])];
                  next[idx] = { ...next[idx], caption: e.target.value };
                  updateField("gallery", "items", next);
                }}
                className={SIDEBAR_FIELD_CLASS}
                placeholder={t("dashboard.sitesEditor.phGalleryCaption")}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.commonAltText")}
              </label>
              <input
                type="text"
                value={item.alt_text || ""}
                onChange={(e) => {
                  const next = [...(content.gallery?.items || [])];
                  next[idx] = { ...next[idx], alt_text: e.target.value };
                  updateField("gallery", "items", next);
                }}
                className={SIDEBAR_FIELD_CLASS}
                placeholder={t("dashboard.sitesEditor.phGalleryAltText")}
              />
            </div>
          </div>
        ))}
        {(!content.gallery?.items || content.gallery.items.length === 0) && (
          <button
            type="button"
            onClick={() => updateField("gallery", "items", [{ image_url: "", caption: "", alt_text: "" }])}
            className="w-full text-[12px] py-2 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.galleryAddFirst")}
          </button>
        )}
      </div>
    </div>
  );
}

