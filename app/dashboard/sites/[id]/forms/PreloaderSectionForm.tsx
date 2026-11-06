"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Loader2, Eye, X } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { SiteLoadingScreen, resolvePreloaderConfig } from "webjoz-ui";
import { IconPicker, SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function PreloaderSectionForm({
  content,
  updateField,
  designToken,
}: BaseSectionFormProps) {
  const { t } = useI18n();
  const [testPreloaderKey, setTestPreloaderKey] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-[12px] leading-relaxed text-primary">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <p className="font-bold text-primary">
            {t("dashboard.sitesEditor.preloaderSectionBanner")}
          </p>
        </div>
        <p className="mt-1 text-sidebar-muted-foreground text-[11px] leading-relaxed">
          {t("dashboard.sitesEditor.preloaderSectionBannerDesc")}
        </p>
      </div>

      {/* Test Preview Button */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-sidebar-muted/40">
        <div>
          <p className="text-[11px] font-bold text-sidebar-foreground">
            {t("dashboard.sitesEditor.preloaderTestTitle")}
          </p>
          <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5">
            {t("dashboard.sitesEditor.preloaderTestDesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTestPreloaderKey(Date.now())}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t("dashboard.sitesEditor.preloaderTestBtn")}</span>
        </button>
      </div>

      {/* 1. Custom Text / Brand Override */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.preloaderBrandText")}
        </label>
        <input
          type="text"
          value={content?.preloader?.brand_name || ""}
          onChange={(e) => updateField("preloader", "brand_name", e.target.value)}
          placeholder={t("dashboard.sitesEditor.preloaderBrandAuto", undefined, {
            value: content?.header?.brand_name || t("dashboard.sitesEditor.preloaderBrandFallback"),
          })}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
        <p className="text-[10px] text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.preloaderBrandHint")}
        </p>
      </div>

      {/* 2. Custom Tagline / Message */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.preloaderTagline")}
        </label>
        <input
          type="text"
          value={content?.preloader?.tagline || ""}
          onChange={(e) => updateField("preloader", "tagline", e.target.value)}
          placeholder={t("dashboard.sitesEditor.preloaderTaglineAuto", undefined, {
            value: content?.header?.tagline || t("dashboard.sitesEditor.preloaderTaglineFallback"),
          })}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
        <p className="text-[10px] text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.preloaderTaglineHint")}
        </p>
      </div>

      {/* 3. Icon / Logo Selection */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.preloaderIconLogo")}
        </label>

        {/* Icon Picker */}
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.preloaderChooseIcon")}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <IconPicker
                value={content?.preloader?.icon || ""}
                onChange={(iconName) => updateField("preloader", "icon", iconName)}
              />
            </div>
            {content?.preloader?.icon && (
              <button
                type="button"
                onClick={() => updateField("preloader", "icon", "")}
                className="p-1.5 text-xs text-red-400 hover:bg-red-400/10 rounded transition cursor-pointer"
                title={t("dashboard.sitesEditor.preloaderClearIcon")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Custom Logo Image Upload */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-medium text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.preloaderOrUploadLogo")}
          </span>
          <FileUpload
            label=""
            value={content?.preloader?.logo_url || ""}
            onChange={(val) => updateField("preloader", "logo_url", val)}
            placeholder="https://..."
            maxWidth={400}
            maxHeight={400}
            quality={0.9}
          />
          <p className="text-[10px] text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.preloaderLogoHint")}
          </p>
        </div>
      </div>

      {/* 4. Display Duration */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.preloaderDurationLabel")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: 800, label: "Cepat", desc: "0.8 detik" },
            { val: 1200, label: "Standar", desc: "1.2 detik (Default)" },
            { val: 1800, label: "Santai", desc: "1.8 detik" },
          ].map((opt) => {
            const currentDuration = content?.preloader?.duration_ms || 1200;
            const active = currentDuration === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => updateField("preloader", "duration_ms", opt.val)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-primary/15 text-primary font-bold ring-1 ring-primary"
                    : "border-border bg-muted/30 text-sidebar-muted-foreground hover:bg-muted/60"
                }`}
              >
                <p className="text-[11px]">{opt.label}</p>
                <p className="text-[9px] opacity-75 mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Test Preview Overlay for Preloader ── */}
      {testPreloaderKey !== null && (
        <div className="fixed inset-0 z-[99999]">
          <SiteLoadingScreen
            key={testPreloaderKey}
            visual={resolvePreloaderConfig(designToken, content?.header, content?.preloader)}
            onComplete={() => setTestPreloaderKey(null)}
          />
          <button
            type="button"
            onClick={() => setTestPreloaderKey(null)}
            className="fixed top-4 right-4 z-[100000] px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs border border-white/20 transition-all cursor-pointer shadow-lg backdrop-blur"
          >
            Tutup Preview ✕
          </button>
        </div>
      )}
    </div>
  );
}

