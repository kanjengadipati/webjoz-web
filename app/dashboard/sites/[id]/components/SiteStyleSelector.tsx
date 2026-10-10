"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { RotateCcw, ChevronDown, Check, Loader2, Sparkles } from "lucide-react";
import TemplateThumbnail from "../TemplateThumbnail";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { getTemplateDefaultDesignToken } from "@/lib/template-defaults";

interface Props {
  siteDetails: any;
  designToken: any;
  latestAiDesignToken?: any;
  customTemplates: any[];
  isSuperadmin: boolean;
  customTemplatesTotal: number;
  loadingTemplates: boolean;
  templateSaving: boolean;
  pendingDiff?: any;
  designOnlyUndo: any[];
  handleDesignUndo: () => void;
  handleTemplateChange: (templateId: string, designToken?: any) => Promise<void> | void;
  fetchCustomTemplates: (reset?: boolean) => Promise<void> | void;
  aiLoading: boolean;
  requirePremium: (feature: "ai_design" | "ai_regenerate" | "ai_suggestion", callback: () => void) => Promise<void> | void;
  aiDesignInstructions: string;
  setAiDesignInstructions: (val: string) => void;
  handleAiRegenerateDesign: () => Promise<void> | void;
  templatePickerOpen: boolean;
  setTemplatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiDesignPromptOpen: boolean;
  setAiDesignPromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesignTokenEqual: (a: any, b: any) => boolean;
  locale?: string;
}

const STYLE_SUGGESTIONS = [
  { label: "Minimalis Bersih", prompt: "desain minimalis modern dengan aksen netral elegan" },
  { label: "Vintage Hangat", prompt: "tema vintage hangat bernuansa kayu dan kopi" },
  { label: "Mewah & Eksklusif", prompt: "gaya mewah premium dengan aksen elegan dan kontras tajam" },
  { label: "Segar & Alami", prompt: "tema segar alami bernuansa hijau botani dan bersih" },
  { label: "Modern & Canggih", prompt: "gaya teknologi modern dengan tampilan dinamis dan sleek" },
];

export default function SiteStyleSelector({
  siteDetails,
  designToken,
  latestAiDesignToken,
  customTemplates,
  isSuperadmin,
  customTemplatesTotal,
  loadingTemplates,
  templateSaving,
  pendingDiff,
  designOnlyUndo,
  handleDesignUndo,
  handleTemplateChange,
  fetchCustomTemplates,
  aiLoading,
  requirePremium,
  aiDesignInstructions,
  setAiDesignInstructions,
  handleAiRegenerateDesign,
  templatePickerOpen,
  setTemplatePickerOpen,
  aiDesignPromptOpen,
  setAiDesignPromptOpen,
  isDesignTokenEqual,
  locale = "id",
}: Props) {
  const { t } = useI18n();

  const currentTemplate = TEMPLATE_REGISTRY.find((t) => t.id === siteDetails.template_id) || TEMPLATE_REGISTRY[0];
  const dynamicTemplate = TEMPLATE_REGISTRY.find((t) => t.id === "TEMPLATE_DYNAMIC");

  const activeCustomTemplate =
    siteDetails.template_id === "TEMPLATE_DYNAMIC" &&
    customTemplates.find((ct) => isDesignTokenEqual(designToken, ct.design_token));

  const activeDesignToken = activeCustomTemplate
    ? activeCustomTemplate.design_token
    : siteDetails.template_id === "TEMPLATE_DYNAMIC"
    ? designToken
    : null;

  let activeTemplateName = currentTemplate.name;
  let activeTemplateCategory = currentTemplate.category;
  let activeTemplateAccent = currentTemplate.accent;
  let activeTemplatePreviewType = currentTemplate.previewType;

  if (activeCustomTemplate) {
    activeTemplateName = t("dashboard.sitesEditor.aiTemplateName", undefined, {
      businessType: activeCustomTemplate.business_type,
    });
    activeTemplateCategory = t("dashboard.sitesEditor.aiTemplateCategory", undefined, {
      mood: activeCustomTemplate.mood,
    });
    activeTemplateAccent = activeCustomTemplate.design_token?.palette?.primary || "#7C3AED";
    activeTemplatePreviewType = "dynamic";
  } else if (siteDetails.template_id === "TEMPLATE_DYNAMIC") {
    activeTemplateName = t("dashboard.sitesEditor.aiDesignEngine");
    activeTemplateCategory = t("dashboard.sitesEditor.latestAiGenerated");
    activeTemplateAccent = designToken?.palette?.primary || "#7C3AED";
    activeTemplatePreviewType = "dynamic";
  }

  const staticTemplates = TEMPLATE_REGISTRY.filter((t) => t.id !== "TEMPLATE_DYNAMIC");

  return (
    <div>
      {/* Header Bar */}
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.styleLabel")}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDesignUndo}
            disabled={designOnlyUndo.length === 0}
            aria-label={t("dashboard.sitesEditor.undoDesign")}
            title={
              designOnlyUndo.length > 0
                ? t("dashboard.sitesEditor.undoDesignTitle")
                : t("dashboard.sitesEditor.noDesignChanges")
            }
            className="flex h-5 w-5 items-center justify-center rounded border border-border bg-muted/50 text-sidebar-muted-foreground transition-colors hover:bg-sidebar-muted hover:text-sidebar-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="h-2.5 w-2.5" />
          </button>
          {templateSaving && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
        </div>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !pendingDiff && setTemplatePickerOpen((open) => !open)}
        disabled={templateSaving || !!pendingDiff}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-sidebar-muted/40 p-1.5 text-left transition hover:border-primary/40 hover:bg-sidebar-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        aria-haspopup="listbox"
        aria-expanded={templatePickerOpen}
      >
        <div className="w-11 flex-shrink-0">
          <TemplateThumbnail
            previewType={activeTemplatePreviewType}
            accent={activeTemplateAccent}
            active
            compact
            palette={activeDesignToken?.palette}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate text-[11px] font-bold text-sidebar-foreground leading-tight">
              {activeTemplateName}
            </p>
            {siteDetails.template_id === "TEMPLATE_DYNAMIC" && (
              <span className="bg-primary/20 text-primary text-[8px] font-bold px-1 py-0.2 rounded shrink-0">
                AI
              </span>
            )}
          </div>
          <p className="truncate text-[9px] text-sidebar-subtle-foreground leading-tight mt-0.5">
            {activeTemplateCategory}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-sidebar-subtle-foreground transition-transform ${
            templatePickerOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Listbox */}
      {templatePickerOpen && (
        <div
          className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1"
          role="listbox"
          aria-label={t("dashboard.sitesEditor.styleChoiceAria")}
        >
          {/* 1. FEATURED: LATEST AI GENERATED (TEMPLATE_DYNAMIC) */}
          {dynamicTemplate && (() => {
            const isTopActive = siteDetails.template_id === "TEMPLATE_DYNAMIC" && !activeCustomTemplate;
            return (
              <button
                key="top-dynamic-template"
                type="button"
                onClick={() => void handleTemplateChange("TEMPLATE_DYNAMIC", latestAiDesignToken)}
                disabled={templateSaving}
                className={`group relative w-full rounded-xl border p-2 text-left transition cursor-pointer ${
                  isTopActive
                    ? "border-primary bg-primary/10 ring-2 ring-primary/25"
                    : "border-border bg-sidebar-muted/50 hover:border-primary/40 hover:bg-sidebar-muted"
                }`}
                role="option"
                aria-selected={isTopActive}
              >
                <div className="relative">
                  <TemplateThumbnail
                    previewType="dynamic"
                    accent={latestAiDesignToken?.palette?.primary || dynamicTemplate.accent}
                    active={isTopActive}
                    palette={latestAiDesignToken?.palette}
                  />
                  {isTopActive && (
                    <span className="absolute top-1 right-1 z-10 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground">
                      <Check className="h-2 w-2 stroke-[3]" />
                      {t("dashboard.sitesEditor.activeBadge")}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-start gap-1.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[11px] font-bold text-sidebar-foreground">
                        {dynamicTemplate.name}
                      </p>
                      <span className="bg-primary/25 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2" /> {t("dashboard.sitesEditor.latest")}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[9px] leading-snug text-sidebar-subtle-foreground">
                      {t("dashboard.sitesEditor.latestAiDesc")}
                    </p>
                  </div>
                </div>
              </button>
            );
          })()}

          {/* 2. STATIC PRESETS GRID (2 Kolom Compact) */}
          <div className="grid grid-cols-2 gap-2">
            {staticTemplates.map((template) => {
              const active = template.id === siteDetails.template_id;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => void handleTemplateChange(template.id)}
                  disabled={templateSaving}
                  className={`group relative w-full rounded-xl border p-1.5 text-left transition cursor-pointer flex flex-col justify-between ${
                    active
                      ? "border-primary bg-primary/10 ring-2 ring-primary/25"
                      : "border-border bg-sidebar-muted/50 hover:border-primary/40 hover:bg-sidebar-muted"
                  }`}
                  role="option"
                  aria-selected={active}
                >
                  <div className="relative w-full">
                    <TemplateThumbnail
                      previewType={template.previewType}
                      accent={template.accent}
                      active={active}
                      compact
                      palette={getTemplateDefaultDesignToken(template.id).palette}
                    />
                    {active && (
                      <span className="absolute top-1 right-1 z-10 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-1 min-w-0">
                    <p className="truncate text-[10px] font-bold text-sidebar-foreground leading-tight">
                      {template.name}
                    </p>
                    <p className="truncate text-[8px] text-sidebar-subtle-foreground leading-tight mt-0.5">
                      {template.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3. CUSTOM AI TEMPLATES (Superadmin) */}
          {isSuperadmin && customTemplates.length > 0 && (
            <>
              <div className="border-t border-border my-2 pt-1.5" />
              <p className="px-1 pb-1 text-[9px] font-bold uppercase tracking-widest text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.templateLibraryAdmin")}
              </p>
              <div className="space-y-1.5">
                {(() => {
                  let hasMatchedActive = false;
                  return customTemplates.map((template) => {
                    const isMatch =
                      siteDetails.template_id === "TEMPLATE_DYNAMIC" &&
                      isDesignTokenEqual(designToken, template.design_token);

                    const active = isMatch && !hasMatchedActive;
                    if (active) {
                      hasMatchedActive = true;
                    }

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => void handleTemplateChange("TEMPLATE_DYNAMIC", template.design_token)}
                        disabled={templateSaving}
                        className={`group relative w-full rounded-xl border p-2 text-left transition cursor-pointer ${
                          active
                            ? "border-primary bg-primary/10 ring-2 ring-primary/25"
                            : "border-border bg-sidebar-muted/50 hover:border-primary/40 hover:bg-sidebar-muted"
                        }`}
                        role="option"
                        aria-selected={active}
                      >
                        <div className="relative">
                          <TemplateThumbnail
                            previewType="dynamic"
                            accent={template.design_token?.palette?.primary || "#7C3AED"}
                            active={active}
                            compact
                            palette={template.design_token?.palette}
                          />
                          {active && (
                            <span className="absolute top-1 right-1 z-10 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground">
                              <Check className="h-2 w-2 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-start gap-1">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-bold text-sidebar-foreground">
                              AI: {template.business_type}
                            </p>
                            <p className="truncate text-[9px] text-sidebar-subtle-foreground">
                              {t("dashboard.sitesEditor.aiMoodCreated", undefined, {
                                mood: template.mood || "custom",
                                date: new Date(template.created_at).toLocaleDateString(
                                  locale === "id" ? "id-ID" : "en-US"
                                ),
                              })}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>

              {customTemplates.length < customTemplatesTotal && (
                <div className="pt-2 px-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void fetchCustomTemplates(false);
                    }}
                    disabled={loadingTemplates}
                    className="w-full py-2 text-center text-[10px] font-bold text-primary hover:text-primary transition-colors border border-dashed border-border hover:border-primary/30 rounded-xl hover:bg-muted/30 disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loadingTemplates ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {t("dashboard.sitesEditor.loading")}
                      </>
                    ) : (
                      t("dashboard.sitesEditor.loadMore", undefined, {
                        count: String(customTemplatesTotal - customTemplates.length),
                      })
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* AI Regenerate Section */}
      {!templatePickerOpen && (
        <div className="mt-2 space-y-2">
          {!aiDesignPromptOpen ? (
            <button
              type="button"
              onClick={() => {
                requirePremium("ai_design", () => setAiDesignPromptOpen(true));
              }}
              disabled={aiLoading || !!pendingDiff}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-primary/25 bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <SparkleGenAI className="h-4 w-4" />
              {t("dashboard.sitesEditor.regenerateWithAi")}
            </button>
          ) : (
            <div className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <SparkleGenAI className="w-3 h-3" />
                  {t("dashboard.sitesEditor.aiDesignPrompt")}
                </span>
                <button
                  type="button"
                  onClick={() => setAiDesignPromptOpen(false)}
                  className="text-[10px] text-sidebar-muted-foreground hover:text-sidebar-foreground cursor-pointer font-medium"
                >
                  {t("dashboard.sitesEditor.cancel")}
                </button>
              </div>

              <input
                type="text"
                value={aiDesignInstructions}
                onChange={(e) => setAiDesignInstructions(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !pendingDiff) void handleAiRegenerateDesign();
                }}
                placeholder="cth: tema kopi vintage hangat..."
                className="w-full px-2.5 py-1.5 border border-border bg-sidebar-input text-sidebar-foreground rounded-lg text-[11px] outline-none focus:border-primary/60 placeholder:text-sidebar-subtle-foreground"
                disabled={aiLoading || !!pendingDiff}
                autoFocus
              />

              {/* Quick Suggestion Chips */}
              <div className="space-y-1">
                <span className="text-[9px] text-sidebar-subtle-foreground font-medium">Ide Gaya:</span>
                <div className="flex flex-wrap gap-1">
                  {STYLE_SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAiDesignInstructions(item.prompt)}
                      className="px-1.5 py-0.5 rounded-md border border-border/80 bg-sidebar-muted/80 hover:bg-primary/15 hover:border-primary/30 text-[9px] text-sidebar-foreground transition cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleAiRegenerateDesign()}
                disabled={aiLoading || !aiDesignInstructions.trim() || !!pendingDiff}
                className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {aiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <SparkleGenAI className="w-4 h-4" />
                )}
                {aiLoading
                  ? t("dashboard.sitesEditor.processing")
                  : t("dashboard.sitesEditor.applyStyle")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
