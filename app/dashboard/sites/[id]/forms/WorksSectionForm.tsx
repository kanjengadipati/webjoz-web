"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function WorksSectionForm({
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
        <p className="font-semibold text-primary">💼 {t("dashboard.sitesEditor.worksSectionBanner")}</p>
        <p className="mt-1 text-primary/80">{t("dashboard.sitesEditor.worksSectionBannerDesc")}</p>
      </div>
      <SidebarField
        section="works"
        fieldKey="title"
        label={t("dashboard.sitesEditor.worksTitle")}
        value={content.works?.title || ""}
        onChange={(val) => updateField("works", "title", val)}
        needsAttention={needsAttention("works.title")}
        inputClassName={fieldClass("works.title", "")}
        placeholder={t("dashboard.sitesEditor.phWorksTitle")}
        undoCount={fieldUndoStacks?.["works.title"]?.length}
        onUndo={() => undoField?.("works", "title")}
      />
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>{t("dashboard.sitesEditor.worksEyebrow")}</span>
          {renderFieldActions?.("works", "eyebrow")}
        </label>
        <input
          id="field-works.eyebrow"
          type="text"
          value={content.works?.eyebrow || ""}
          onChange={(e) => updateField("works", "eyebrow", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
          placeholder="PORTFOLIO"
        />
      </div>
      <SidebarField
        section="works"
        fieldKey="subtitle"
        multiline
        rows={2}
        label={t("dashboard.sitesEditor.worksSubtitle")}
        value={content.works?.subtitle || ""}
        onChange={(val) => updateField("works", "subtitle", val)}
        placeholder={t("dashboard.sitesEditor.phWorksSubtitle")}
      />
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.worksLayout")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: "grid", label: t("dashboard.sitesEditor.worksLayoutGrid"), desc: t("dashboard.sitesEditor.worksLayoutGridDesc") },
            { value: "masonry", label: t("dashboard.sitesEditor.worksLayoutMasonry"), desc: t("dashboard.sitesEditor.worksLayoutMasonryDesc") },
            { value: "featured-grid", label: t("dashboard.sitesEditor.worksLayoutFeaturedGrid"), desc: t("dashboard.sitesEditor.worksLayoutFeaturedGridDesc") },
            { value: "showcase-featured", label: t("dashboard.sitesEditor.worksLayoutShowcase"), desc: t("dashboard.sitesEditor.worksLayoutShowcaseDesc") },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("works", "layout", opt.value)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                (content.works?.layout || "grid") === opt.value
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
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.worksItems")} ({content.works?.items?.length || 0})
          </span>
          <button
            type="button"
            onClick={() => {
              const existingWorks = content.works?.items || [];
              const next = [
                ...existingWorks,
                {
                  title: `Proyek ${existingWorks.length + 1}`,
                  category: "",
                  year: new Date().getFullYear().toString(),
                  client: "",
                  description: "Deskripsi proyek ini",
                  image_url: "",
                  project_url: "",
                  alt_text: "",
                },
              ];
              updateField("works", "items", next);
            }}
            className="text-[12px] py-1.5 px-3 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.worksAddItem")}
          </button>
        </div>
        {(content.works?.items || []).map((item: any, idx: number) => (
          <div key={idx} className="mb-3 p-4 rounded-xl border border-border/50 bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-sidebar-subtle-foreground font-medium">
                {t("dashboard.sitesEditor.worksItem")} #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = (content.works?.items || []).filter((_: any, i: number) => i !== idx);
                  updateField("works", "items", next);
                }}
                className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.worksItemTitle")}
              </label>
              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => {
                  const next = [...(content.works?.items || [])];
                  next[idx] = { ...next[idx], title: e.target.value };
                  updateField("works", "items", next);
                }}
                className={SIDEBAR_FIELD_CLASS}
                placeholder={t("dashboard.sitesEditor.phWorksItemTitle")}
              />
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                  {t("dashboard.sitesEditor.commonCategory")}
                </label>
                <input
                  list="works-category-suggestions"
                  value={item.category || ""}
                  onChange={(e) => {
                    const next = [...(content.works?.items || [])];
                    next[idx] = { ...next[idx], category: e.target.value };
                    updateField("works", "items", next);
                  }}
                  className={SIDEBAR_FIELD_CLASS}
                  placeholder="Branding"
                />
                <datalist id="works-category-suggestions">
                  <option value="Branding" />
                  <option value="Photography" />
                  <option value="Design" />
                  <option value="Video" />
                  <option value="Consulting" />
                  <option value="Portfolio" />
                  <option value="Freelance" />
                  <option value="Agency" />
                  <option value="Studio" />
                </datalist>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                  {t("dashboard.sitesEditor.commonYear")}
                </label>
                <input
                  type="text"
                  value={item.year || ""}
                  onChange={(e) => {
                    const next = [...(content.works?.items || [])];
                    next[idx] = { ...next[idx], year: e.target.value };
                    updateField("works", "items", next);
                  }}
                  className={SIDEBAR_FIELD_CLASS}
                  placeholder="2025"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                  {t("dashboard.sitesEditor.commonClientLabel")}
                </label>
                <input
                  type="text"
                  value={item.client || ""}
                  onChange={(e) => {
                    const next = [...(content.works?.items || [])];
                    next[idx] = { ...next[idx], client: e.target.value };
                    updateField("works", "items", next);
                  }}
                  className={SIDEBAR_FIELD_CLASS}
                  placeholder={t("dashboard.sitesEditor.phWorksClient")}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                  {t("dashboard.sitesEditor.commonProjectLink")}
                </label>
                <input
                  type="text"
                  value={item.project_url || ""}
                  onChange={(e) => {
                    const next = [...(content.works?.items || [])];
                    next[idx] = { ...next[idx], project_url: e.target.value };
                    updateField("works", "items", next);
                  }}
                  className={`${SIDEBAR_FIELD_CLASS} font-mono`}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.worksDescription")}
              </label>
              <textarea
                rows={2}
                value={item.description || ""}
                onChange={(e) => {
                  const next = [...(content.works?.items || [])];
                  next[idx] = { ...next[idx], description: e.target.value };
                  updateField("works", "items", next);
                }}
                className={`${SIDEBAR_FIELD_CLASS} resize-none`}
                placeholder={t("dashboard.sitesEditor.phWorksDescription")}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.commonImageUrl")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.image_url || ""}
                  onChange={(e) => {
                    const next = [...(content.works?.items || [])];
                    next[idx] = { ...next[idx], image_url: e.target.value };
                    updateField("works", "items", next);
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
                {t("dashboard.sitesEditor.commonAltText")}
              </label>
              <input
                type="text"
                value={item.alt_text || ""}
                onChange={(e) => {
                  const next = [...(content.works?.items || [])];
                  next[idx] = { ...next[idx], alt_text: e.target.value };
                  updateField("works", "items", next);
                }}
                className={SIDEBAR_FIELD_CLASS}
                placeholder={t("dashboard.sitesEditor.phWorksAltText")}
              />
            </div>
          </div>
        ))}
        {(!content.works?.items || content.works.items.length === 0) && (
          <button
            type="button"
            onClick={() =>
              updateField("works", "items", [
                {
                  title: "",
                  category: "",
                  year: "",
                  client: "",
                  description: "",
                  image_url: "",
                  project_url: "",
                  alt_text: "",
                },
              ])
            }
            className="w-full text-[12px] py-2 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.worksAddFirst")}
          </button>
        )}
      </div>
    </div>
  );
}

