"use client";

import React from "react";
import { CustomSelect } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import FileUpload from "@/components/file-upload";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function HeaderSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  renderFieldActions,
  designToken,
  updateDesignTokenLayout,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>
            {t("dashboard.sitesEditor.headerBrandName")}{" "}
            {needsAttention("header.brand_name") && <span className="text-amber-300">⚠️</span>}
          </span>
          {renderFieldActions?.("header", "brand_name")}
        </label>
        <input
          id="field-header.brand_name"
          type="text"
          value={content.header?.brand_name || ""}
          onChange={(e) => updateField("header", "brand_name", e.target.value)}
          className={fieldClass("header.brand_name", SIDEBAR_FIELD_CLASS)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
        <span className="text-[12px] font-medium text-sidebar-foreground">
          {t("dashboard.sitesEditor.headerShowNavButton")}
        </span>
        <input
          type="checkbox"
          checked={!(content.header as any)?.nav_cta_hidden}
          onChange={(e) => updateField("header", "nav_cta_hidden", !e.target.checked)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
      </div>

      {!(content.header as any)?.nav_cta_hidden && (
        <>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>
                {t("dashboard.sitesEditor.headerNavButtonText")}{" "}
                {needsAttention("header.nav_cta_text") && <span className="text-amber-300">⚠️</span>}
              </span>
              {renderFieldActions?.("header", "nav_cta_text")}
            </label>
            <input
              id="field-header.nav_cta_text"
              type="text"
              value={content.header?.nav_cta_text || ""}
              onChange={(e) => updateField("header", "nav_cta_text", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phNavCta")}
              className={fieldClass(
                "header.nav_cta_text",
                `${SIDEBAR_FIELD_CLASS} text-sidebar-foreground placeholder-sidebar-subtle-foreground`
              )}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.headerNavButtonLink")}
            </label>
            <CustomSelect
              value={(content.header as any)?.nav_cta_href || ""}
              onChange={(val) => updateField("header", "nav_cta_href", val)}
              size="sm"
              triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
              placeholder={t("dashboard.sitesEditor.headerNavButtonLinkAuto")}
              options={[
                { value: "", label: t("dashboard.sitesEditor.headerNavButtonLinkAuto") },
                { value: "#hero", label: t("dashboard.sitesEditor.headerNavLinkHero") },
                { value: "#about", label: t("dashboard.sitesEditor.headerNavLinkAbout") },
                { value: "#benefits", label: t("dashboard.sitesEditor.headerNavLinkBenefits") },
                { value: "#catalog", label: t("dashboard.sitesEditor.headerNavLinkCatalog") },
                { value: "#menu", label: t("dashboard.sitesEditor.headerNavLinkMenu") },
                { value: "#works", label: t("dashboard.sitesEditor.headerNavLinkWorks") },
                { value: "#gallery", label: t("dashboard.sitesEditor.headerNavLinkGallery") },
                { value: "#testimonials", label: t("dashboard.sitesEditor.headerNavLinkTestimonials") },
                { value: "#faq", label: t("dashboard.sitesEditor.headerNavLinkFaq") },
                { value: "#contact", label: t("dashboard.sitesEditor.headerNavLinkContact") },
              ]}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5 leading-snug">
              {t("dashboard.sitesEditor.headerNavButtonLinkHint")}
            </p>
          </div>
        </>
      )}

      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.headerTagline")}{" "}
          <span className="text-sidebar-subtle-foreground font-normal normal-case">
            {t("dashboard.sitesEditor.headerTaglineOptional")}
          </span>
        </label>
        <input
          type="text"
          value={content.header?.tagline || ""}
          onChange={(e) => updateField("header", "tagline", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phTagline")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.headerLogoUrl")}
        </label>
        <FileUpload
          label=""
          value={content.header?.logo_url || ""}
          onChange={(val) => updateField("header", "logo_url", val)}
          placeholder="https://..."
          maxWidth={400}
          maxHeight={400}
          quality={0.85}
          previewSize="sm"
          objectFit="contain"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.headerLogoLight")}
        </label>
        <p className="text-[11px] text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.headerLogoLightHint")}
        </p>
        <FileUpload
          label=""
          value={content.header?.logo_url_light || ""}
          onChange={(val) => updateField("header", "logo_url_light", val)}
          placeholder="https://..."
          maxWidth={400}
          maxHeight={400}
          quality={0.85}
          previewSize="sm"
          objectFit="contain"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.headerFavicon")}
        </label>
        <FileUpload
          label=""
          value={content.seo?.favicon_url || ""}
          onChange={(val) => updateField("seo", "favicon_url", val)}
          placeholder="https://..."
          accept=".ico,.png,.jpg,.jpeg"
          maxWidth={128}
          maxHeight={128}
          quality={0.9}
          previewSize="icon"
          objectFit="contain"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.headerIconName")}
        </label>
        <input
          id="field-header.icon"
          type="text"
          value={content.header?.icon || ""}
          onChange={(e) => updateField("header", "icon", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
          placeholder={t("dashboard.sitesEditor.phIconName")}
        />
      </div>

      {/* Nav Menu Items */}
      <div className="pt-2 space-y-2">
        <div>
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            {t("dashboard.sitesEditor.headerNavMenu")}
          </label>
          <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5">
            {t("dashboard.sitesEditor.headerNavMenuHint")}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([
            ["about", t("dashboard.sitesEditor.headerNavSectionAbout")],
            ["benefits", t("dashboard.sitesEditor.headerNavSectionBenefits")],
            ["menu", t("dashboard.sitesEditor.headerNavSectionMenu")],
            ["catalog", t("dashboard.sitesEditor.headerNavSectionCatalog")],
            ["works", t("dashboard.sitesEditor.headerNavSectionWorks")],
            ["gallery", t("dashboard.sitesEditor.headerNavSectionGallery")],
            ["testimonials", t("dashboard.sitesEditor.headerNavSectionTestimonials")],
            ["faq", t("dashboard.sitesEditor.headerNavSectionFaq")],
            ["cta", t("dashboard.sitesEditor.headerNavSectionPromo")],
            ["contact", t("dashboard.sitesEditor.headerNavSectionContact")],
            ["blog", t("dashboard.sitesEditor.headerNavSectionBlog")],
          ] as const)
            .filter(([key]) => {
              if (key === "menu") return Boolean((content as any)?.menu?.categories?.length);
              if (key === "catalog")
                return Boolean((content as any)?.catalog?.categories?.length) && !(content as any)?.works?.items?.length;
              if (key === "works") return Boolean((content as any)?.works?.items?.length);
              if (key === "gallery") return Boolean((content as any)?.gallery?.items?.length);
              if (key === "blog") return Boolean((content as any)?.blog?.posts?.length);
              return true;
            })
            .map(([key, label]) => {
              const hidden = designToken?.layout?.nav_hidden_sections?.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const current: string[] = designToken?.layout?.nav_hidden_sections ?? [];
                    const next = hidden ? current.filter((s: string) => s !== key) : [...current, key];
                    updateDesignTokenLayout?.("nav_hidden_sections", next);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                    hidden
                      ? "border-border/50 bg-muted/40 text-sidebar-subtle-foreground line-through"
                      : "border-primary/20 bg-primary/10 text-primary"
                  }`}
                >
                  {hidden ? "🙈" : "👁️"}
                  {(content.header as any)?.nav_labels?.[key] || label}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

