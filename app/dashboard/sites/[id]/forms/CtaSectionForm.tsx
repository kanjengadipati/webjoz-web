"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import FileUpload from "@/components/file-upload";
import { LinkTypeInput, SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function CtaSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  if (!content.cta) return null;

  return (
    <div className="space-y-3">
      <SidebarField
        section="cta"
        fieldKey="headline"
        label={t("dashboard.sitesEditor.ctaHeadline")}
        value={content.cta.headline || ""}
        onChange={(val) => updateField("cta", "headline", val)}
        needsAttention={needsAttention("cta.headline")}
        inputClassName={fieldClass("cta.headline", "")}
        undoCount={fieldUndoStacks?.["cta.headline"]?.length}
        onUndo={() => undoField?.("cta", "headline")}
      />
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.ctaEyebrow")}{" "}
          <span className="text-sidebar-subtle-foreground font-normal normal-case">
            {t("dashboard.sitesEditor.commonOptional")}
          </span>
        </label>
        <input
          type="text"
          value={content.cta?.eyebrow || ""}
          onChange={(e) => updateField("cta", "eyebrow", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phCtaEyebrow")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.ctaSubheadline")}{" "}
          <span className="text-sidebar-subtle-foreground font-normal normal-case">
            {t("dashboard.sitesEditor.commonOptional")}
          </span>
        </label>
        <input
          type="text"
          value={content.cta?.subheadline || ""}
          onChange={(e) => updateField("cta", "subheadline", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phCtaSubheadline")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.ctaTrustSignal")}{" "}
          <span className="text-sidebar-subtle-foreground font-normal normal-case">
            {t("dashboard.sitesEditor.commonOptional")}
          </span>
        </label>
        <input
          type="text"
          value={content.cta?.trust_signal || ""}
          onChange={(e) => updateField("cta", "trust_signal", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phCtaTrustSignal")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.ctaImage")}{" "}
          <span className="text-sidebar-subtle-foreground font-normal normal-case">
            {t("dashboard.sitesEditor.commonOptional")}, {t("dashboard.sitesEditor.ctaImageSplitVariant")}
          </span>
        </label>
        <FileUpload
          label=""
          value={content.cta?.image_url || ""}
          onChange={(val) => updateField("cta", "image_url", val)}
          placeholder="https://..."
          maxWidth={800}
          maxHeight={800}
          quality={0.85}
        />
      </div>
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.ctaButtonText")} {needsAttention("cta.button_text") && <span className="text-amber-300">⚠️</span>}
        </label>
        <input
          id="field-cta.button_text"
          type="text"
          value={content.cta.button_text || ""}
          onChange={(e) => updateField("cta", "button_text", e.target.value)}
          className={fieldClass("cta.button_text", SIDEBAR_FIELD_CLASS)}
        />
      </div>
      <LinkTypeInput
        urlValue={content.cta.button_url || ""}
        updateUrl={(val) => {
          updateField("cta", "button_url", val);
          const waNumber = val.replace(/\s+/g, "").match(/(?:wa\.me\/|phone=)([0-9]+)/i)?.[1] || "";
          if (waNumber && (!content.contact?.phone || content.contact?.phone === "08123456789")) {
            updateField("contact", "phone", "0" + waNumber.slice(2));
          }
        }}
        needsAttention={needsAttention("cta.button_url")}
        fieldClass={fieldClass}
        path="cta.button_url"
        label={t("dashboard.sitesEditor.ctaButtonLink")}
        defaultWaNumber={content.contact?.phone}
        suggestedHash={content.catalog ? "#catalog" : content.menu ? "#menu" : "#contact"}
      />
    </div>
  );
}

