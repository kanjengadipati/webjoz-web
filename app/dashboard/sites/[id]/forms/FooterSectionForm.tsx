"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SocialPlatformSelect, SOCIAL_PLATFORMS, SocialIcon } from "@/components/sections/social-platforms";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function FooterSectionForm({
  content,
  updateField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.footerTagline")}
        </label>
        <input
          id="field-footer.tagline"
          type="text"
          value={content.footer?.tagline || ""}
          onChange={(e) => updateField("footer", "tagline", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.footerCopyright")}
        </label>
        <input
          id="field-footer.copyright_text"
          type="text"
          value={content.footer?.copyright_text || ""}
          onChange={(e) => updateField("footer", "copyright_text", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.footerSocialLinks")}
        </label>
        {(content.footer?.social_links || []).map((link: any, idx: number) => {
          const isCustom = link.platform && !SOCIAL_PLATFORMS[link.platform];
          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 w-8 justify-center">
                {link.platform && SOCIAL_PLATFORMS[link.platform] ? (
                  <SocialIcon platform={link.platform} className="shrink-0" size={18} />
                ) : (
                  <Globe className="w-4 h-4 text-sidebar-subtle-foreground shrink-0" />
                )}
              </div>
              <div className="flex-1 flex items-center gap-1.5">
                {isCustom ? (
                  <input
                    type="text"
                    value={link.platform || ""}
                    onChange={(e) => {
                      const n = [...(content.footer?.social_links || [])];
                      n[idx] = { ...n[idx], platform: e.target.value };
                      updateField("footer", "social_links", n);
                    }}
                    placeholder={t("dashboard.sitesEditor.footerSocialPlatformName")}
                    className="w-1/3 px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"
                  />
                ) : (
                  <SocialPlatformSelect
                    value={link.platform || ""}
                    onChange={(v) => {
                      const n = [...(content.footer?.social_links || [])];
                      n[idx] = { ...n[idx], platform: v === "__custom__" ? "" : v };
                      updateField("footer", "social_links", n);
                    }}
                    className="w-1/3 px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"
                  />
                )}
                <input
                  type="text"
                  value={link.url || ""}
                  onChange={(e) => {
                    const n = [...(content.footer?.social_links || [])];
                    n[idx] = { ...n[idx], url: e.target.value };
                    updateField("footer", "social_links", n);
                  }}
                  placeholder={t("dashboard.sitesEditor.phSocialUrl")}
                  className="flex-1 px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const n = content.footer?.social_links?.filter((_: any, i: number) => i !== idx) || [];
                  updateField("footer", "social_links", n);
                }}
                className="text-red-400 hover:text-red-300 text-xs shrink-0 cursor-pointer"
              >
                {t("dashboard.sitesEditor.commonRemove")}
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const n = [
              ...(content.footer?.social_links || []),
              { platform: "Instagram", url: "https://instagram.com/" },
            ];
            updateField("footer", "social_links", n);
          }}
          className="w-full text-center py-1.5 text-[11px] font-semibold text-primary border border-dashed border-border rounded-md hover:border-primary/60 transition-colors cursor-pointer"
        >
          {t("dashboard.sitesEditor.footerAddSocialLink")}
        </button>
      </div>
    </div>
  );
}

