"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/toast-provider";
import { SidebarField } from "@/components/sidebar-field";
import { AiFieldButton } from "@/components/menu-catalog-form";
import FileUpload from "@/components/file-upload";
import { GoogleSnippetPreview } from "@/components/google-snippet-preview";
import { CustomSelect } from "webjoz-ui";
import { request } from "@/lib/api/client";
import { tenantHost } from "@/lib/site-config";
import { Lock, CheckCircle, Search, Loader2, Check } from "lucide-react";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  aiLoading?: boolean;
  onAiGenerate?: () => Promise<void>;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  renderFieldActions?: (section: string, key: string, aiButton?: React.ReactNode) => React.ReactNode;
}

export function KeywordsInput({
  keywords,
  onChange,
  aiLoading,
  onAiGenerate,
  isPremium,
  onUpgradeRequired,
  renderFieldActions,
}: KeywordsInputProps) {
  const { t } = useI18n();
  const [input, setInput] = useState("");

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed)) return;
    onChange([...keywords, trimmed]);
  };

  const removeKeyword = (idx: number) => {
    onChange(keywords.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(input);
      setInput("");
    }
  };

  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
        <span>{t("dashboard.sitesEditor.seoKeywordsLabel")}</span>
        {renderFieldActions ? (
          renderFieldActions(
            "seo",
            "keywords",
            onAiGenerate && (
              <AiFieldButton
                loading={!!aiLoading}
                onGenerate={onAiGenerate}
                title="AI: generate keywords"
                onUpgradeRequired={onUpgradeRequired}
                isPremium={isPremium}
              />
            )
          )
        ) : onAiGenerate ? (
          <AiFieldButton
            loading={!!aiLoading}
            onGenerate={onAiGenerate}
            title="AI: generate keywords"
            onUpgradeRequired={onUpgradeRequired}
            isPremium={isPremium}
          />
        ) : null}
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] px-2 py-1.5 border rounded-md bg-transparent">
        {keywords.map((kw, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: "rgba(99,102,241,0.15)", color: "rgb(165, 180, 252)" }}
          >
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(idx)}
              className="hover:text-red-400 cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keywords.length === 0 ? t("dashboard.sitesEditor.phKeywords") : ""}
          className="flex-1 min-w-[80px] bg-transparent text-[11px] outline-none text-sidebar-foreground placeholder:text-sidebar-subtle-foreground"
        />
      </div>
      <p className="text-[10px] text-sidebar-subtle-foreground">
        {t("dashboard.sitesEditor.seoKeywordsHint")}
      </p>
    </div>
  );
}

export function SEOSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
  token,
  activeTenantId,
  siteId,
  isPremium,
  onUpgradeRequired,
  subdomain,
  aiLoadingField,
  handleAiText,
  renderFieldActions,
}: BaseSectionFormProps) {
  const { t } = useI18n();
  const { pushToast } = useToast();

  const [gscInput, setGscInput] = useState("");
  const [gscSaving, setGscSaving] = useState(false);
  const [gscSaved, setGscSaved] = useState(false);

  // Fetch current GSC code on mount
  useEffect(() => {
    if (!token || !activeTenantId || !siteId) return;
    const tenantHeaders = { "X-Tenant-ID": String(activeTenantId) };
    request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, String(token))
      .then((res) => {
        const code = res.data?.tracking_codes?.gsc_verification ?? "";
        setGscInput(code);
      })
      .catch(() => {
        /* non-critical */
      });
  }, [token, activeTenantId, siteId]);

  const handleGscSave = async () => {
    if (!token || !activeTenantId || !siteId) return;
    setGscSaving(true);
    setGscSaved(false);
    const tenantHeaders = { "X-Tenant-ID": String(activeTenantId) };
    try {
      let existingCodes: Record<string, string> = {};
      try {
        const res = await request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, String(token));
        existingCodes = res.data?.tracking_codes ?? {};
      } catch {
        /* fall back to empty */
      }
      await request(
        `/sites/${siteId}/tracking-codes`,
        {
          method: "PATCH",
          headers: tenantHeaders,
          body: JSON.stringify({
            tracking_codes: { ...existingCodes, gsc_verification: gscInput.trim() },
          }),
        },
        String(token)
      );
      setGscSaved(true);
      pushToast?.(t("dashboard.sitesEditor.seoGscSaveSuccess"), "success");
      setTimeout(() => setGscSaved(false), 3000);
    } catch (err: any) {
      pushToast?.(err.message || t("dashboard.sitesEditor.seoGscSaveFailed"), "error");
    } finally {
      setGscSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-[12px] leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground">{t("dashboard.sitesEditor.seoNotPublicTitle")}</p>
        <p className="mt-1 text-muted-foreground">{t("dashboard.sitesEditor.seoNotPublicDesc")}</p>
      </div>

      {/* Meta Title + Char Count */}
      <div className="space-y-1">
        <SidebarField
          section="seo"
          fieldKey="title"
          label={t("dashboard.sitesEditor.seoMetaTitleLabel")}
          value={content.seo?.title || ""}
          onChange={(val) => updateField("seo", "title", val)}
          needsAttention={needsAttention("seo.title")}
          inputClassName={fieldClass("seo.title", "")}
          undoCount={fieldUndoStacks?.["seo.title"]?.length}
          onUndo={() => undoField?.("seo", "title")}
        />
        <div className="flex justify-end">
          <span
            className={`text-[10px] font-mono ${
              (content.seo?.title?.length || 0) > 60 ? "text-red-500" : "text-sidebar-subtle-foreground"
            }`}
          >
            {content.seo?.title?.length || 0}/60
          </span>
        </div>
      </div>

      {/* Meta Description + Char Count */}
      <div className="space-y-1">
        <SidebarField
          section="seo"
          fieldKey="description"
          multiline
          rows={3}
          label={t("dashboard.sitesEditor.seoMetaDescLabel")}
          value={content.seo?.description || ""}
          onChange={(val) => updateField("seo", "description", val)}
          needsAttention={needsAttention("seo.description")}
          inputClassName={fieldClass("seo.description", "")}
          undoCount={fieldUndoStacks?.["seo.description"]?.length}
          onUndo={() => undoField?.("seo", "description")}
        />
        <div className="flex justify-end">
          <span
            className={`text-[10px] font-mono ${
              (content.seo?.description?.length || 0) > 155
                ? "text-red-500"
                : "text-sidebar-subtle-foreground"
            }`}
          >
            {content.seo?.description?.length || 0}/155
          </span>
        </div>
      </div>

      {/* Keywords Tags */}
      <KeywordsInput
        keywords={content.seo?.keywords || []}
        onChange={(keywords) => updateField("seo", "keywords", keywords)}
        aiLoading={aiLoadingField === "seo.keywords"}
        onAiGenerate={
          isPremium && handleAiText
            ? async () => {
                handleAiText(
                  "seo",
                  "keywords",
                  t("dashboard.sitesEditor.seoAiKeywordsPrompt"),
                  t("dashboard.sitesEditor.seoKeywordsLabel")
                );
              }
            : undefined
        }
        onUpgradeRequired={onUpgradeRequired}
        isPremium={isPremium}
        renderFieldActions={renderFieldActions}
      />

      {/* Favicon + OG Image row */}
      <FileUpload
        label={t("dashboard.sitesEditor.seoFaviconLabel")}
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
      <FileUpload
        label={t("dashboard.sitesEditor.seoOgImageLabel")}
        value={content.seo?.og_image_url || ""}
        onChange={(val) => updateField("seo", "og_image_url", val)}
        placeholder="https://..."
        maxWidth={1200}
        maxHeight={630}
        quality={0.85}
        previewSize="lg"
      />

      {/* ── Social Share Preview ── */}
      {(() => {
        const ogTitle = content.seo?.title || "";
        const ogDesc = content.seo?.description || "";
        const ogImg = content.seo?.og_image_url || "";
        const ogDomain = subdomain ? tenantHost(subdomain) : "namabisnis.webjoz.com";
        return (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
              {t("dashboard.sitesEditor.seoSharePreviewTitle")}
            </p>

            {/* WhatsApp / iMessage style */}
            <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-muted border-b border-border/50">
                <span className="text-[10px] font-bold text-emerald-400">💬 WhatsApp / iMessage</span>
              </div>
              <div className="flex gap-0 overflow-hidden">
                {/* image thumbnail */}
                <div className="w-20 h-20 shrink-0 bg-[#111318] relative overflow-hidden">
                  {ogImg ? (
                    <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[18px] opacity-20">🖼️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 px-3 py-2 space-y-0.5 min-w-0">
                  <p className="text-[10px] text-sidebar-subtle-foreground truncate">{ogDomain}</p>
                  <p
                    className={`text-[12px] font-semibold leading-tight line-clamp-2 ${
                      ogTitle ? "text-sidebar-foreground" : "text-sidebar-subtle-foreground italic"
                    }`}
                  >
                    {ogTitle || t("dashboard.sitesEditor.seoSharePlaceholderTitle")}
                  </p>
                  <p
                    className={`text-[10px] leading-tight line-clamp-2 ${
                      ogDesc ? "text-sidebar-muted-foreground" : "text-sidebar-subtle-foreground italic"
                    }`}
                  >
                    {ogDesc || t("dashboard.sitesEditor.seoSharePlaceholderDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Facebook style */}
            <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-muted border-b border-border/50">
                <span className="text-[10px] font-bold text-blue-400">👍 Facebook / LinkedIn</span>
              </div>
              <div className="w-full aspect-[1.91/1] bg-[#111318] relative overflow-hidden">
                {ogImg ? (
                  <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <span className="text-[28px] opacity-20">🖼️</span>
                    <p className="text-[10px] text-sidebar-subtle-foreground italic">
                      {t("dashboard.sitesEditor.seoShareOgNotSet")}
                    </p>
                  </div>
                )}
              </div>
              <div className="px-3 py-2 space-y-0.5 bg-[#232630]">
                <p className="text-[9px] uppercase tracking-widest text-sidebar-subtle-foreground truncate">
                  {ogDomain}
                </p>
                <p
                  className={`text-[12px] font-bold leading-snug line-clamp-2 ${
                    ogTitle ? "text-sidebar-foreground" : "text-sidebar-subtle-foreground italic"
                  }`}
                >
                  {ogTitle || t("dashboard.sitesEditor.seoSharePlaceholderTitle")}
                </p>
                <p
                  className={`text-[10px] leading-snug line-clamp-2 ${
                    ogDesc ? "text-sidebar-muted-foreground" : "text-sidebar-subtle-foreground italic"
                  }`}
                >
                  {ogDesc || t("dashboard.sitesEditor.seoSharePlaceholderDesc")}
                </p>
              </div>
            </div>

            {/* Twitter/X style */}
            <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-muted border-b border-border/50">
                <span className="text-[10px] font-bold text-sidebar-foreground">𝕏 Twitter / X</span>
              </div>
              <div className="relative">
                <div className="w-full aspect-[2/1] bg-[#111318] relative overflow-hidden">
                  {ogImg ? (
                    <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[28px] opacity-20">🖼️</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/60 backdrop-blur-sm">
                  <p
                    className={`text-[11px] font-semibold leading-tight truncate ${
                      ogTitle ? "text-white" : "text-sidebar-subtle-foreground italic"
                    }`}
                  >
                    {ogTitle || t("dashboard.sitesEditor.seoSharePlaceholderTitle")}
                  </p>
                  <p className="text-[9px] text-sidebar-muted-foreground truncate">{ogDomain}</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-sidebar-subtle-foreground text-center">
              {t("dashboard.sitesEditor.seoShareAutoUpdate")}
            </p>
          </div>
        );
      })()}

      {/* OG Type Dropdown */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>{t("dashboard.sitesEditor.seoOgTypeLabel")}</span>
          {handleAiText && (
            <AiFieldButton
              loading={aiLoadingField === "seo.og_type"}
              onGenerate={async () => {
                handleAiText("seo", "og_type", t("dashboard.sitesEditor.seoAiOgTypePrompt"), "OG Type");
              }}
              title={t("dashboard.sitesEditor.seoAiOgTypeBtn")}
              onUpgradeRequired={onUpgradeRequired}
              isPremium={isPremium}
            />
          )}
        </label>
        <CustomSelect
          value={content.seo?.og_type || "website"}
          onChange={(val) => updateField("seo", "og_type", val)}
          size="sm"
          triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
          options={[
            { value: "website", label: t("dashboard.sitesEditor.seoOgTypeWebsite") },
            { value: "article", label: t("dashboard.sitesEditor.seoOgTypeArticle") },
            { value: "product", label: t("dashboard.sitesEditor.seoOgTypeProduct") },
            { value: "profile", label: t("dashboard.sitesEditor.seoOgTypeProfile") },
            { value: "business", label: t("dashboard.sitesEditor.seoOgTypeBusiness") },
          ]}
        />
      </div>

      {/* Twitter Card Dropdown */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>{t("dashboard.sitesEditor.seoTwitterCardLabel")}</span>
          {handleAiText && (
            <AiFieldButton
              loading={aiLoadingField === "seo.twitter_card"}
              onGenerate={async () => {
                handleAiText(
                  "seo",
                  "twitter_card",
                  t("dashboard.sitesEditor.seoAiTwitterCardPrompt"),
                  "Twitter Card"
                );
              }}
              title={t("dashboard.sitesEditor.seoAiTwitterCardBtn")}
              onUpgradeRequired={onUpgradeRequired}
              isPremium={isPremium}
            />
          )}
        </label>
        <CustomSelect
          value={content.seo?.twitter_card || "summary_large_image"}
          onChange={(val) => updateField("seo", "twitter_card", val)}
          size="sm"
          triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
          options={[
            { value: "summary_large_image", label: "summary_large_image" },
            { value: "summary", label: "summary" },
            { value: "app", label: "app" },
            { value: "player", label: "player" },
          ]}
        />
      </div>

      {/* Robots Dropdown */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.seoRobotsLabel")}
        </label>
        <CustomSelect
          value={content.seo?.robots || "index, follow"}
          onChange={(val) => updateField("seo", "robots", val)}
          size="sm"
          triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
          options={[
            { value: "index, follow", label: t("dashboard.sitesEditor.seoRobotsIndexFollow") },
            { value: "noindex, follow", label: t("dashboard.sitesEditor.seoRobotsNoindexFollow") },
            { value: "index, nofollow", label: t("dashboard.sitesEditor.seoRobotsIndexNofollow") },
            { value: "noindex, nofollow", label: t("dashboard.sitesEditor.seoRobotsNoindexNofollow") },
          ]}
        />
      </div>

      {/* OG Locale */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.seoOgLocaleLabel")}
        </label>
        <input
          type="text"
          value={content.seo?.og_locale || "id_ID"}
          onChange={(e) => updateField("seo", "og_locale", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
          placeholder="id_ID"
        />
      </div>

      {/* OG Site Name */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.seoOgSiteNameLabel")}
        </label>
        <input
          type="text"
          value={content.seo?.og_site_name || ""}
          onChange={(e) => updateField("seo", "og_site_name", e.target.value)}
          className={SIDEBAR_FIELD_CLASS}
          placeholder={t("dashboard.sitesEditor.seoOgSiteNamePlaceholder")}
        />
      </div>

      {/* Canonical Path */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.seoCanonicalPathLabel")}
        </label>
        <input
          type="text"
          value={content.seo?.canonical_path || "/"}
          onChange={(e) => updateField("seo", "canonical_path", e.target.value)}
          className={`${SIDEBAR_FIELD_CLASS} text-sidebar-foreground`}
          placeholder="/"
        />
      </div>

      {/* Custom Robots.txt (Pro) */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span className="flex items-center gap-1.5">
            {t("dashboard.sitesEditor.seoRobotsTxtTitle")}
            {!isPremium && (
              <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                Pro
              </span>
            )}
          </span>
        </label>
        {isPremium ? (
          <textarea
            rows={5}
            value={(content.seo as any)?.custom_robots_txt || ""}
            onChange={(e) => updateField("seo", "custom_robots_txt", e.target.value)}
            className="w-full px-2.5 py-1.5 border rounded-md text-[11px] font-mono outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground resize-none"
            placeholder={`User-agent: *\nAllow: /\n\nSitemap: https://${
              subdomain ? tenantHost(subdomain) : "namabisnis.webjoz.com"
            }/sitemap.xml`}
          />
        ) : (
          <div
            className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-[11px] text-sidebar-subtle-foreground cursor-pointer hover:border-amber-500/30 transition-colors"
            onClick={() => onUpgradeRequired?.()}
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <Lock className="w-3 h-3" />
              {t("dashboard.sitesEditor.seoRobotsTxtLockedTitle")}
            </div>
            <p>{t("dashboard.sitesEditor.seoRobotsTxtLockedDesc")}</p>
          </div>
        )}
      </div>

      {/* ── SEO Booster Upsell Card ── */}
      {isPremium ? (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-[12px] leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <CheckCircle className="w-4 h-4 text-primary" />
            {t("dashboard.sitesEditor.seoBoosterActiveTitle")}
          </div>
          <p className="mt-1 text-muted-foreground">{t("dashboard.sitesEditor.seoBoosterActiveDesc")}</p>
        </div>
      ) : (() => {
        const siteTitle = content.seo?.title || "Nama Bisnis — Layanan";
        const siteDesc = content.seo?.description || "Deskripsi singkat bisnis dan layanan yang ditawarkan.";
        const siteName =
          siteTitle.split(/[-—|]/)[0].trim() || content.header?.brand_name || "Nama Bisnis";
        const cleanSubdomain = subdomain || "namabisnis";

        const demoBusiness = {
          name: siteName,
          subdomain: cleanSubdomain,
          title: siteTitle,
          description: siteDesc,
          rating: "4.8",
          reviewCount: "128",
          priceRange: "Rp50.000–Rp200.000",
          isOpen: true,
        };

        return (
          <div className="rounded-2xl border border-amber-500/20 bg-black/60 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Search className="w-4 h-4 text-amber-400" />
                <span>{t("dashboard.sitesEditor.seoBoosterProTitle")}</span>
              </div>
              <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
                Premium
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5">
              <div>
                <p className="text-xs font-bold text-sidebar-subtle-foreground mb-2">
                  {t("dashboard.sitesEditor.seoBoosterWithout")}
                </p>
                <div className="opacity-60 grayscale-[30%]">
                  <GoogleSnippetPreview variant="plain" business={demoBusiness} />
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  ✨ Rich Result
                </div>
                <p className="text-xs font-bold text-primary mb-2">
                  {t("dashboard.sitesEditor.seoBoosterWith")}
                </p>
                <GoogleSnippetPreview variant="rich" business={demoBusiness} />
              </div>
            </div>

            <div className="px-5 pb-5">
              <p className="text-xs text-amber-200/70 text-center mb-2">
                {t("dashboard.sitesEditor.seoBoosterCompetitor")}
              </p>
              <button
                type="button"
                onClick={() => onUpgradeRequired?.()}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                {t("dashboard.sitesEditor.seoBoosterUpgradeBtn")}
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Google Search Console ── */}
      <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-sidebar-foreground">
                  {t("dashboard.sitesEditor.seoGscTitle")}
                </p>
                <p className="text-[11px] text-sidebar-subtle-foreground">
                  {t("dashboard.sitesEditor.seoGscSubtitle")}
                </p>
              </div>
            </div>
            {!isPremium && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Pro
              </span>
            )}
          </div>

          {/* How-to steps */}
          <div className="rounded-lg bg-muted/40 border border-border/50 px-3 py-2.5 space-y-1.5 text-[11px] text-sidebar-muted-foreground">
            <p className="font-semibold text-sidebar-foreground">
              {t("dashboard.sitesEditor.seoGscHowToTitle")}
            </p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>
                {t("dashboard.sitesEditor.seoGscStep1")} (
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Search Console
                </a>
                )
              </li>
              <li>{t("dashboard.sitesEditor.seoGscStep2")}</li>
              <li>{t("dashboard.sitesEditor.seoGscStep3")}</li>
              <li>{t("dashboard.sitesEditor.seoGscStep4")}</li>
              <li>{t("dashboard.sitesEditor.seoGscStep5")}</li>
            </ol>
          </div>

          {/* Meta tag preview */}
          {gscInput.trim() && (
            <div className="rounded-md bg-background border border-border/50 px-3 py-2 font-mono text-[10px] text-sidebar-muted-foreground break-all">
              {'<meta name="google-site-verification" content="'}
              <span className="text-emerald-400">{gscInput.trim()}</span>
              {'" />'}
            </div>
          )}

          {/* Input + save button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={gscInput}
              onChange={(e) => setGscInput(e.target.value)}
              placeholder={t("dashboard.sitesEditor.seoGscPlaceholder")}
              className="flex-1 px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground"
            />
            <button
              type="button"
              onClick={() => {
                if (!isPremium) {
                  onUpgradeRequired?.();
                  return;
                }
                handleGscSave();
              }}
              disabled={gscSaving || !gscInput.trim()}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {gscSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                  {t("dashboard.sitesEditor.seoGscSaving")}
                </>
              ) : gscSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.seoGscSaved")}
                </>
              ) : (
                t("dashboard.sitesEditor.seoGscSaveBtn")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
