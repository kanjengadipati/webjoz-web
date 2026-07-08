"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { useToast } from "@/components/toast-provider";
import { Dialog } from "@/components/ui/dialog";
import { Button, Card } from "@/components/ui";
import {
  Loader2, Sparkles, Zap, HelpCircle, Layout, Globe,
  ChevronLeft, ChevronDown, Check, GripVertical, RotateCcw,
  Eye, EyeOff, Rocket, Copy,
} from "lucide-react";
import { getTemplate, TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { getTemplateDefaultDesignToken } from "@/lib/template-defaults";
import { getHiddenSections } from "@/lib/design-assets-config";
import {
  BODY_SECTION_KEYS, EDITOR_SECTION_KEYS, SECTION_META, AI_SUGGESTIONS,
  getOrderedSections, collectQualityIssues, isDesignTokenEqual, getSectionScore,
} from "./editor-utils";
import TemplateThumbnail from "./TemplateThumbnail";
import SectionForms from "./SectionForms";

// ── extracted components ──────────────────────────────────────────────────────
import ColorPatternPicker from "./components/ColorPatternPicker";
import TypographyPairingPicker from "./components/TypographyPairingPicker";
import IndustryPresetPicker from "./components/IndustryPresetPicker";

// ── modals ────────────────────────────────────────────────────────────────────
import PublishModal from "./modals/PublishModal";
import CongratsModal from "./modals/CongratsModal";

// ── hooks ─────────────────────────────────────────────────────────────────────
import { useEditorData } from "./hooks/useEditorData";
import { useEditorAi } from "./hooks/useEditorAi";
import { useEditorActions } from "./hooks/useEditorActions";

export default function SiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const isPremium =
    activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";
  const siteId = params.id ? Number(params.id) : null;

  // ── ui state ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("header");
  const [editorTab, setEditorTab] = useState<"content" | "design">("content");
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templateSaving] = useState(false);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobileView, setMobileView] = useState<"edit" | "preview">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "preview" : "edit",
  );
  const [sectionNavCollapsed] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);

  const activeTabRef = useRef(activeTab);
  const shouldScrollToActiveRef = useRef(false);
  const templatePickerRef = useRef<HTMLDivElement | null>(null);
  const colorRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const designContentRef = useRef<HTMLDivElement | null>(null);

  // ── data hook ────────────────────────────────────────────────────────────────
  const data = useEditorData(token, activeTenantId, siteId, pushToast);
  const {
    loading, saving, autosaveStatus,
    siteDetails, setSiteDetails,
    content, setContent,
    designToken, setDesignToken,
    latestAiDesignToken, setLatestAiDesignToken,
    designTokenScore, setDesignTokenScore,
    customTemplates, customTemplatesTotal, loadingTemplates,
    fetchData, handleSaveContent, fetchCustomTemplates,
    contentRef, designTokenRef,
  } = data;

  // ── actions hook (needs siteDetails/designToken/content which come from data hook) ──
  const actions = useEditorActions(siteDetails, designToken, content, setContent, setDesignToken, setSiteDetails);
  const {
    globalUndo,
    updateField, updateDesignTokenField, updateDesignTokenLayout, updateSectionVariant,
    handleColorChange, handleTemplateChange, handleReorderSection, toggleSectionVisibility,
    applyTypographyBatch, applyColorPattern, applyIndustryPreset,
    pushGlobalUndo, handleGlobalUndo,
  } = actions;

  // ── select section helper (defined before AI hook so it can be passed in) ───
  const selectSection = useCallback((section: string, scrollToPreview = true) => {
    shouldScrollToActiveRef.current = scrollToPreview;
    activeTabRef.current = section;
    setActiveTab(section);
  }, []);

  // ── AI hook ──────────────────────────────────────────────────────────────────
  const ai = useEditorAi(
    token, activeTenantId, siteId,
    contentRef, designTokenRef,
    setContent, setDesignToken, setLatestAiDesignToken, setDesignTokenScore, setSiteDetails,
    selectSection, pushToast,
  );
  const {
    aiLoading, pendingDiff, undoStack,
    aiInstructions, setAiInstructions,
    recentInstructions,
    aiDesignPromptOpen, setAiDesignPromptOpen,
    aiDesignInstructions, setAiDesignInstructions,
    aiPromptModal, setAiPromptModal,
    aiPromptInput, setAiPromptInput,
    setPendingDiff,
    handleAiRegenerateForSection, handleAiRegenerateDesign,
    applyRegeneratedSection, restorePendingDiff, undoLastRegen,
  } = ai;

  const handleAiRegenerateSection = () => handleAiRegenerateForSection(activeTab);
  const handleRegenWithPremiumCheck = useCallback((section: string) => {
    if (!isPremium) { setUpgradePromptOpen(true); return; }
    return handleAiRegenerateForSection(section);
  }, [isPremium, handleAiRegenerateForSection]);

  const handlePreviewSelectSection = useCallback((section: string) => {
    selectSection(section, false);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileView("edit");
    }
  }, [selectSection]);

  // ── publish ───────────────────────────────────────────────────────────────────
  const handlePublishWithSubdomain = async (subdomain: string) => {
    if (!siteDetails || !token || !activeTenantId) return;
    try {
      setPublishing(true);
      const { request } = await import("@/lib/api/client");
      await request(`/sites/${siteDetails.id}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: siteDetails.name,
          template_id: siteDetails.template_id,
          subdomain,
        }),
      }, token);
      const publishRes = await request<any>(`/sites/${siteDetails.id}/publish`, {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
      }, token);
      pushToast("Website berhasil dipublikasikan! 🚀", "success");
      setPublishModalOpen(false);
      if (publishRes.data) setSiteDetails(publishRes.data);
      setShowCongrats(true);
    } catch (err: any) {
      pushToast(err.message || "Gagal memublikasikan website", "error");
    } finally {
      setPublishing(false);
    }
  };

  // ── effects ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTenantId && siteId) void fetchData().then(() => void fetchCustomTemplates(true));
  }, [activeTenantId, siteId]);

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  useEffect(() => {
    if (!content) return;
    const siteTitle = content?.seo?.title || siteDetails?.name;
    const originalTitle = document.title;
    if (siteTitle) document.title = `${siteTitle} — Edit`;
    return () => { document.title = originalTitle; };
  }, [content?.seo?.title, siteDetails?.name]);

  useEffect(() => {
    if (!templatePickerOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!templatePickerRef.current?.contains(event.target as Node)) setTemplatePickerOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [templatePickerOpen]);

  // Scroll preview to active section
  useEffect(() => {
    if (!shouldScrollToActiveRef.current) return;
    shouldScrollToActiveRef.current = false;
    if (!activeTab) return;
    const sectionEl = document.getElementById(`section-preview-${activeTab}`);
    if (sectionEl) {
      requestAnimationFrame(() => sectionEl.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [activeTab]);

  // Scroll preview to pending diff section
  useEffect(() => {
    if (!pendingDiff?.section) return;
    const sectionEl = document.getElementById(`section-preview-${pendingDiff.section}`);
    if (sectionEl) {
      requestAnimationFrame(() => sectionEl.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }, [pendingDiff?.section]);

  // Scrollspy — keep sidebar section in sync while user scrolls the preview
  useEffect(() => {
    if (pendingDiff) return;
    const containerEl = document.getElementById("preview-scroll-container");
    if (!containerEl) return;
    let frame = 0;
    const syncActiveSection = () => {
      frame = 0;
      const containerRect = containerEl.getBoundingClientRect();
      let nextSection = activeTabRef.current;
      let bestTop = Number.NEGATIVE_INFINITY;
      for (const section of EDITOR_SECTION_KEYS) {
        const el = document.getElementById(`section-preview-${section}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - containerRect.top;
        if (top <= 60 && top > bestTop) { bestTop = top; nextSection = section; }
      }
      if (bestTop === Number.NEGATIVE_INFINITY) {
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (const section of EDITOR_SECTION_KEYS) {
          const el = document.getElementById(`section-preview-${section}`);
          if (!el) continue;
          const distance = Math.abs(el.getBoundingClientRect().top - containerRect.top);
          if (distance < nearestDistance) { nearestDistance = distance; nextSection = section; }
        }
      }
      if (nextSection !== activeTabRef.current) {
        shouldScrollToActiveRef.current = false;
        activeTabRef.current = nextSection;
        setActiveTab(nextSection);
      }
    };
    const handleScroll = () => { if (frame) return; frame = requestAnimationFrame(syncActiveSection); };
    containerEl.addEventListener("scroll", handleScroll, { passive: true });
    syncActiveSection();
    return () => { if (frame) cancelAnimationFrame(frame); containerEl.removeEventListener("scroll", handleScroll); };
  }, [device, pendingDiff]);

  // Scroll active pill into view
  useEffect(() => {
    const pill = document.querySelector(`[data-section-key="${activeTab}"]`) as HTMLElement | null;
    if (pill) pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  // ── derived values ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat editor...</p>
      </div>
    );
  }

  if (!siteDetails || !content) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center border-dashed">
        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="text-lg font-bold mb-2">Situs Tidak Ditemukan</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Kami tidak dapat menemukan situs yang Anda cari pada workspace saat ini.
        </p>
        <Button onClick={() => router.push("/dashboard/sites")} className="rounded-xl">
          Kembali
        </Button>
      </Card>
    );
  }

  const orderedSectionKeys = getOrderedSections(designToken, content, getHiddenSections());
  const SECTIONS = orderedSectionKeys
    .filter((key) => {
      if (key === "menu") return !!content?.menu;
      if (key === "catalog") return !!content?.catalog;
      return true;
    })
    .map((key, idx) => ({
      key,
      label: SECTION_META[key]?.label ?? key,
      icon: SECTION_META[key]?.icon ?? Layout,
      num: idx + 1,
    }));

  const quality = collectQualityIssues(content);
  const issuePaths = new Set(quality.issues.map((issue) => issue.path));
  const activeSuggestions = AI_SUGGESTIONS[activeTab] ?? AI_SUGGESTIONS.hero;
  const aiPlaceholder = activeSuggestions[0] || "Buat copy lebih jelas dan meyakinkan...";
  const fieldClass = (path: string, base: string) =>
    `${base} ${issuePaths.has(path) ? "!border-amber-400/80 !bg-amber-400/10 focus:!border-amber-300" : ""}`;
  const needsAttention = (path: string) => issuePaths.has(path);

  const currentTemplate = getTemplate(siteDetails.template_id) ?? getTemplate("TEMPLATE_JASA02")!;
  const TemplateComponent = currentTemplate.component;
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
    activeTemplateName = `AI: ${activeCustomTemplate.business_type}`;
    activeTemplateCategory = `Hasil AI (${activeCustomTemplate.mood})`;
    activeTemplateAccent = activeCustomTemplate.design_token?.palette?.primary || "#7C3AED";
    activeTemplatePreviewType = "dynamic";
  } else if (siteDetails.template_id === "TEMPLATE_DYNAMIC") {
    activeTemplateName = "AI Design Engine";
    activeTemplateCategory = "Latest AI Generated";
    activeTemplateAccent = designToken?.palette?.primary || "#7C3AED";
    activeTemplatePreviewType = "dynamic";
  }

  const hiddenSections: string[] = designToken?.layout?.hidden_sections ?? [];

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#0d0f14] text-slate-100">
      <div className="relative flex flex-1 min-h-0 overflow-hidden">

        {/* ════ LEFT SIDEBAR ════ */}
        <div
          className={`absolute inset-0 z-20 flex h-full w-full flex-shrink-0 flex-col overflow-hidden border-r bg-[#111318] shadow-xl transition-transform duration-300 ease-out md:relative md:inset-auto md:z-10 md:w-[380px] md:translate-x-0 ${
            mobileView === "preview" ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Site identity */}
          <div className="flex h-14 flex-shrink-0 items-center gap-2.5 border-b border-white/10 px-3">
            <button
              onClick={() => router.push("/dashboard/sites")}
              className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-slate-100 active:scale-95"
              aria-label="Kembali ke daftar situs"
            >
              <ChevronLeft className="h-5 w-5 flex-shrink-0" />
            </button>
            <div className="h-5 w-px bg-white/10 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[13px] font-bold tracking-tight text-slate-100">
                {siteDetails.name}
              </h1>
            </div>
          </div>

          {/* Content / Design tab switcher */}
          <div className="flex border-b border-white/10 p-1 bg-white/[0.02] flex-shrink-0">
            {(["content", "design"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setEditorTab(tab)}
                className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                  editorTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab === "content" ? "Konten" : "Desain"}
              </button>
            ))}
          </div>

          {/* ── Design tab: template picker + AI design regen ── */}
          {editorTab === "design" && (
            <div ref={templatePickerRef} className="flex-shrink-0 border-b border-white/10 p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Gaya Situs</p>
                {templateSaving && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              </div>
              <button
                type="button"
                onClick={() => !pendingDiff && setTemplatePickerOpen((o) => !o)}
                disabled={templateSaving || !!pendingDiff}
                className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-left transition hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={templatePickerOpen}
              >
                <div className="w-12 flex-shrink-0">
                  <TemplateThumbnail
                    previewType={activeTemplatePreviewType}
                    accent={activeTemplateAccent}
                    active compact
                    palette={activeDesignToken?.palette}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-slate-100">{activeTemplateName}</p>
                  <p className="truncate text-[10px] text-slate-500">{activeTemplateCategory}</p>
                </div>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${templatePickerOpen ? "rotate-180" : ""}`} />
              </button>

              {templatePickerOpen && (
                <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1" role="listbox" aria-label="Pilihan gaya website">
                  {/* Latest AI generated */}
                  {dynamicTemplate && (() => {
                    const isTopActive = siteDetails.template_id === "TEMPLATE_DYNAMIC" && !activeCustomTemplate;
                    return (
                      <button
                        key="top-dynamic-template"
                        type="button"
                        onClick={() => handleTemplateChange("TEMPLATE_DYNAMIC", latestAiDesignToken)}
                        disabled={templateSaving}
                        className={`group w-full rounded-xl border p-2 text-left transition ${
                          isTopActive ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                        }`}
                        role="option"
                        aria-selected={isTopActive}
                      >
                        <TemplateThumbnail
                          previewType="dynamic"
                          accent={latestAiDesignToken?.palette?.primary || dynamicTemplate.accent}
                          active={isTopActive}
                          palette={latestAiDesignToken?.palette}
                        />
                        <div className="mt-2 flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-[12px] font-bold text-slate-100">{dynamicTemplate.name}</p>
                              <span className="bg-primary/25 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Terbaru</span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">
                              Gaya visual unik buatan AI terbaru untuk website Anda.
                            </p>
                          </div>
                          {isTopActive && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                        </div>
                      </button>
                    );
                  })()}

                  {/* Static presets */}
                  {TEMPLATE_REGISTRY.filter((t) => t.id !== "TEMPLATE_DYNAMIC").map((template) => {
                    const active = template.id === siteDetails.template_id;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateChange(template.id)}
                        disabled={templateSaving}
                        className={`group w-full rounded-xl border p-2 text-left transition ${
                          active ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                        }`}
                        role="option"
                        aria-selected={active}
                      >
                        <TemplateThumbnail
                          previewType={template.previewType}
                          accent={template.accent}
                          active={active}
                          palette={getTemplateDefaultDesignToken(template.id).palette}
                        />
                        <div className="mt-2 flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-bold text-slate-100">{template.name}</p>
                            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">{template.description}</p>
                          </div>
                          {active && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom AI template history */}
                  {customTemplates.length > 0 && (
                    <>
                      <div className="border-t border-white/10 my-2.5 pt-2" />
                      <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">Riwayat Desain AI</p>
                      {(() => {
                        let hasMatchedActive = false;
                        return customTemplates.map((template) => {
                          const isMatch =
                            siteDetails.template_id === "TEMPLATE_DYNAMIC" &&
                            isDesignTokenEqual(designToken, template.design_token);
                          const active = isMatch && !hasMatchedActive;
                          if (active) hasMatchedActive = true;
                          return (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => handleTemplateChange("TEMPLATE_DYNAMIC", template.design_token)}
                              disabled={templateSaving}
                              className={`group w-full rounded-xl border p-2 text-left transition ${
                                active ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                              }`}
                              role="option"
                              aria-selected={active}
                            >
                              <TemplateThumbnail
                                previewType="dynamic"
                                accent={template.design_token?.palette?.primary || "#7C3AED"}
                                active={active}
                                palette={template.design_token?.palette}
                              />
                              <div className="mt-2 flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <p className="truncate text-[12px] font-bold text-slate-100">AI: {template.business_type}</p>
                                    <span className="bg-emerald-500/25 text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Hasil AI</span>
                                  </div>
                                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">
                                    Nuansa {template.mood || "custom"}. Dibuat pada {new Date(template.created_at).toLocaleDateString("id-ID")}.
                                  </p>
                                </div>
                                {active && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                              </div>
                            </button>
                          );
                        });
                      })()}
                      {customTemplates.length < customTemplatesTotal && (
                        <div className="pt-2 px-1">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); void fetchCustomTemplates(false); }}
                            disabled={loadingTemplates}
                            className="w-full py-2.5 text-center text-[11px] font-bold text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 rounded-xl hover:bg-white/[0.02] disabled:opacity-60 flex items-center justify-center gap-1.5"
                          >
                            {loadingTemplates ? (
                              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat...</>
                            ) : (
                              <>Muat Lebih Banyak ({customTemplatesTotal - customTemplates.length} tersisa)</>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {!templatePickerOpen && (
                <div className="mt-2 space-y-1.5">
                  {!aiDesignPromptOpen ? (
                    <button
                      type="button"
                      onClick={() => { if (!isPremium) { setUpgradePromptOpen(true); return; } setAiDesignPromptOpen(true); }}
                      disabled={aiLoading || !!pendingDiff}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition disabled:opacity-50"
                    >
                      <Sparkles className="h-3 w-3" /> Regenerate dengan AI
                    </button>
                  ) : (
                    <div className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary">AI Design Prompt</span>
                        <button type="button" onClick={() => setAiDesignPromptOpen(false)} className="text-[9px] text-slate-400 hover:text-slate-200">Batal</button>
                      </div>
                      <input
                        type="text"
                        value={aiDesignInstructions}
                        onChange={(e) => setAiDesignInstructions(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !pendingDiff) void handleAiRegenerateDesign(); }}
                        placeholder="cth: tema kopi vintage hangat..."
                        className="w-full px-2 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60 placeholder:text-slate-700"
                        disabled={aiLoading || !!pendingDiff}
                      />
                      <button
                        type="button"
                        onClick={() => void handleAiRegenerateDesign()}
                        disabled={aiLoading || !aiDesignInstructions.trim() || !!pendingDiff}
                        className="w-full py-1.5 flex items-center justify-center gap-1 rounded bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {aiLoading ? "Memproses..." : "Terapkan Gaya"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Content tab: section nav ── */}
          {editorTab === "content" && (
            <div className="flex-shrink-0 border-b border-white/10 hidden md:block">
              <div className="px-3 py-1.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Bagian halaman</p>
              </div>
              <div
                className="flex flex-col overflow-y-auto scrollbar-none transition-all duration-300 ease-in-out"
                style={{ maxHeight: sectionNavCollapsed ? 0 : 180, overflow: sectionNavCollapsed ? "hidden" : "auto" }}
              >
                {SECTIONS.map(({ key, label, icon: Icon, num }) => (
                  <div
                    key={key}
                    draggable={BODY_SECTION_KEYS.includes(key) && !pendingDiff}
                    onDragStart={(e) => {
                      if (!BODY_SECTION_KEYS.includes(key) || pendingDiff) return;
                      setDraggingSection(key);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", key);
                    }}
                    onDragOver={(e) => {
                      if (!draggingSection || !BODY_SECTION_KEYS.includes(key) || pendingDiff) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const source = e.dataTransfer.getData("text/plain") || draggingSection;
                      if (source) handleReorderSection(source, key);
                      setDraggingSection(null);
                    }}
                    onDragEnd={() => setDraggingSection(null)}
                    onClick={() => { if (!pendingDiff) selectSection(key, true); }}
                    className={`group flex items-center gap-2 px-3 py-[7px] cursor-pointer transition-colors ${
                      activeTab === key ? "bg-primary/15"
                        : hiddenSections.includes(key) ? "opacity-40 hover:opacity-60"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <GripVertical className={`h-3 w-3 shrink-0 ${BODY_SECTION_KEYS.includes(key) ? "text-slate-600" : "text-slate-800"}`} />
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${activeTab === key ? "text-primary" : "text-slate-500"}`} />
                    <span className={`flex-1 text-[12px] truncate ${
                      activeTab === key ? "text-slate-100 font-medium"
                        : hiddenSections.includes(key) ? "line-through text-slate-600"
                        : "text-slate-400"
                    }`}>
                      {label}
                    </span>
                    {key === "seo" && !isPremium && (
                      <span className="text-[7px] px-1 py-0.5 bg-primary/30 text-primary rounded font-extrabold uppercase tracking-wider leading-none ml-1">Pro</span>
                    )}
                    {!["header", "footer", "seo"].includes(key) && (
                      <div
                        role="button" tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(key); }}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); toggleSectionVisibility(key); } }}
                        title={hiddenSections.includes(key) ? "Tampilkan" : "Sembunyikan"}
                        className="p-0.5 rounded transition-colors cursor-pointer shrink-0"
                      >
                        {hiddenSections.includes(key)
                          ? <EyeOff className="w-3 h-3 text-slate-600" />
                          : <Eye className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        }
                      </div>
                    )}
                    <div className="flex items-center gap-1 shrink-0">
                      {!["header", "footer", "seo"].includes(key) && (() => {
                        const score = getSectionScore(content, key);
                        if (score >= 100) return null;
                        const color = score >= 85 ? "bg-emerald-500" : score >= 65 ? "bg-amber-500" : "bg-red-500";
                        return <div className={`w-1.5 h-1.5 rounded-full ${color}`} title={`Kualitas: ${score}%`} />;
                      })()}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${activeTab === key ? "bg-primary/30 text-primary" : "bg-white/5 text-slate-500"}`}>{num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Field panel (scrollable) ── */}
          <div
            className="flex-1 border-t border-white/10 flex flex-col overflow-hidden [&_input]:!border-white/10 [&_textarea]:!border-white/10 [&_select]:!border-white/10 [&_input]:!bg-[#05070b] [&_textarea]:!bg-[#05070b] [&_select]:!bg-[#05070b] [&_input]:!text-slate-100 [&_textarea]:!text-slate-100 [&_select]:!text-slate-100 [&_input::placeholder]:!text-slate-700 [&_textarea::placeholder]:!text-slate-700"
            style={{ minHeight: 0 }}
          >
            {editorTab === "design" ? (
              <>
                <div className="px-3.5 py-2 border-b border-white/10 flex-shrink-0">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Kustomisasi Visual</p>
                </div>
                <div ref={designContentRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 relative bg-[#111318] text-slate-100">

                  {/* Color palette */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Palet Warna</p>
                    <ColorPatternPicker
                      designToken={designToken}
                      aiDesignToken={latestAiDesignToken}
                      designTokenScore={designTokenScore}
                      onApply={applyColorPattern}
                      onRestoreAi={() => {
                        if (!latestAiDesignToken?.palette) return;
                        pushGlobalUndo();
                        setDesignToken((prev: any) => {
                          const next = { ...(prev || {}) };
                          next.palette = { ...(next.palette || {}), ...latestAiDesignToken.palette };
                          if (latestAiDesignToken.theme_mode) next.theme_mode = latestAiDesignToken.theme_mode;
                          return next;
                        });
                      }}
                    />
                    <div className="border-t border-white/10 my-2" />

                    {/* Individual color pickers */}
                    {(["primary", "accent", "background", "surface", "text"] as const).map((colorKey) => {
                      const labels: Record<string, string> = {
                        primary: "Warna Utama (Primary)",
                        accent: "Warna Aksen (Accent)",
                        background: "Warna Latar (Background)",
                        surface: "Warna Permukaan (Surface)",
                        text: "Warna Teks (Text)",
                      };
                      const defaults: Record<string, string> = {
                        primary: "#4F46E5", accent: "#7C3AED",
                        background: "#FAF7F2", surface: "#FFFFFF", text: "#1E293B",
                      };
                      const val = designToken?.palette?.[colorKey] || defaults[colorKey];
                      return (
                        <div key={colorKey} className="space-y-1">
                          <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">{labels[colorKey]}</label>
                          <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                              <input
                                type="color"
                                value={val}
                                onChange={(e) => handleColorChange(colorKey, e.target.value)}
                                ref={(el) => { colorRefs.current[colorKey] = el; }}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                              />
                              <div className="w-full h-full" style={{ backgroundColor: val }} />
                            </div>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleColorChange(colorKey, e.target.value)}
                              onClick={() => colorRefs.current[colorKey]?.click()}
                              className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60 cursor-pointer"
                              placeholder={defaults[colorKey]}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/10 my-2" />

                  {/* Typography */}
                  <TypographyPairingPicker
                    designToken={designToken}
                    aiDesignToken={latestAiDesignToken}
                    designTokenScore={designTokenScore}
                    onApply={(pairing) => applyTypographyBatch({
                      heading_font: pairing.heading_font,
                      body_font: pairing.body_font,
                      heading_weight: pairing.heading_weight,
                      heading_size_hero: pairing.heading_size_hero,
                      heading_style: pairing.heading_style ?? "normal",
                      heading_transform: pairing.heading_transform ?? "none",
                      heading_tracking: pairing.heading_tracking ?? "normal",
                    })}
                    onFieldChange={(_, subfield, value) => updateDesignTokenField("typography", subfield, value)}
                    onRestoreAi={() => {
                      if (!latestAiDesignToken?.typography) return;
                      pushGlobalUndo();
                      setDesignToken((prev: any) => ({
                        ...(prev || {}),
                        typography: { ...(prev?.typography || {}), ...latestAiDesignToken.typography },
                      }));
                    }}
                  />

                  <div className="border-t border-white/10 my-2" />

                  {/* Industry presets */}
                  <IndustryPresetPicker
                    designToken={designToken}
                    aiDesignToken={latestAiDesignToken}
                    designTokenScore={designTokenScore}
                    onApply={applyIndustryPreset}
                    onRestoreAi={() => {
                      if (!latestAiDesignToken) return;
                      pushGlobalUndo();
                      setDesignToken((prev: any) => ({
                        ...(prev || {}),
                        palette: { ...(prev?.palette || {}), ...(latestAiDesignToken.palette || {}) },
                        typography: { ...(prev?.typography || {}), ...(latestAiDesignToken.typography || {}) },
                        ...(latestAiDesignToken.theme_mode ? { theme_mode: latestAiDesignToken.theme_mode } : {}),
                      }));
                    }}
                  />

                  {/* Undo design */}
                  {globalUndo.length > 0 && (
                    <button
                      type="button"
                      onClick={handleGlobalUndo}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 text-slate-400 text-[11px] hover:bg-white/5 hover:text-slate-200 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo perubahan desain
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Pending diff banner */}
                {pendingDiff && (
                  <div className="flex-shrink-0 bg-primary/10 border-b border-primary/20 px-3.5 py-2.5 space-y-2">
                    <p className="text-[11px] font-bold text-primary">Hasil AI — {pendingDiff.section}</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {pendingDiff.rows.map((row, i) => (
                        <div key={i} className="text-[10px] bg-black/20 rounded px-2 py-1 space-y-0.5">
                          <p className="text-slate-500 font-medium truncate">{row.label}</p>
                          <p className="text-red-400 line-through truncate">{row.before}</p>
                          <p className="text-emerald-400 truncate">{row.after}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={restorePendingDiff}
                        className="flex-1 py-1.5 rounded border border-white/10 text-[11px] text-slate-400 hover:bg-white/5 transition"
                      >
                        Batalkan
                      </button>
                      <button
                        type="button"
                        onClick={applyRegeneratedSection}
                        className="flex-1 py-1.5 rounded bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 transition"
                      >
                        Pakai Ini
                      </button>
                    </div>
                  </div>
                )}

                {/* Section mobile pills */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-3 py-2 border-b border-white/10 flex-shrink-0 md:hidden">
                  {SECTIONS.map(({ key, label, num }) => (
                    <button
                      key={key}
                      data-section-key={key}
                      type="button"
                      onClick={() => { if (!pendingDiff) selectSection(key, true); }}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition ${
                        activeTab === key
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Section form */}
                <div className="flex-1 overflow-y-auto px-3.5 py-3">
                  <SectionForms
                    activeTab={activeTab}
                    content={content}
                    updateField={updateField}
                    needsAttention={needsAttention}
                    fieldClass={fieldClass}
                    token={token}
                    activeTenantId={activeTenantId}
                    siteId={siteId}
                    designToken={designToken}
                    updateDesignTokenLayout={updateDesignTokenLayout}
                    isPremium={isPremium}
                    onUpgradeRequired={() => setUpgradePromptOpen(true)}
                  />
                </div>

                {/* AI bar sticky bottom */}
                <div className="flex-shrink-0 px-3.5 pb-3 pt-2 border-t border-white/10 bg-[#111318] space-y-1.5">
                  {activeSuggestions.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                      {activeSuggestions.slice(0, 3).map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => { if (!isPremium) { setUpgradePromptOpen(true); return; } setAiInstructions(chip); }}
                          disabled={!!pendingDiff}
                          className="flex-shrink-0 px-2 py-1 rounded-full border border-primary/20 bg-primary/10 text-[9px] font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !pendingDiff) {
                          if (!isPremium) { setUpgradePromptOpen(true); return; }
                          void handleAiRegenerateSection();
                        }
                      }}
                      placeholder={aiPlaceholder}
                      disabled={aiLoading || !!pendingDiff}
                      className="flex-1 h-9 px-3 border border-primary/25 bg-[#05070b] text-slate-100 rounded-[10px] text-[11px] outline-none focus:border-primary/60 placeholder:text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => { if (!isPremium) { setUpgradePromptOpen(true); return; } void handleAiRegenerateSection(); }}
                      disabled={aiLoading || !!pendingDiff}
                      className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-primary text-primary-foreground disabled:opacity-50"
                    >
                      {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Publish footer */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#0d0f14]/95 backdrop-blur px-6 py-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              {siteDetails?.status === "published" ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-emerald-400 font-medium">Website sedang live</span>
                </>
              ) : (
                <span>Draft — belum dipublikasikan</span>
              )}
            </div>
            {siteDetails?.status === "published" ? (
              <button
                type="button"
                onClick={() => setConfirmPublishOpen(true)}
                disabled={publishing}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_35%,transparent)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #000))" }}
              >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
                {publishing ? "Menerapkan..." : "Terapkan ke Live"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_35%,transparent)] transition-all hover:scale-105 active:scale-95 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #000))" }}
              >
                <Rocket className="w-4 h-4 animate-bounce" style={{ animationDuration: "2.8s" }} />
                Publikasikan Website
              </button>
            )}
          </div>
        </div>

        {/* ════ RIGHT: PREVIEW CANVAS ════ */}
        <div className="relative flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden bg-[#0d0f14]">
          {/* Device toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 border-b border-white/10 bg-[#111318] px-4 py-2">
            <div className="flex items-center gap-1">
              {(["desktop", "tablet", "mobile"] as const).map((d) => {
                const Icon = d === "desktop" ? ({ className }: any) => <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v8h12V4H4zm4 10h4v2H8v-2z" /></svg>
                  : d === "tablet" ? ({ className }: any) => <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  : ({ className }: any) => <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 13a1 1 0 110-2 1 1 0 010 2z" /></svg>;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    className={`p-1.5 rounded-md transition-colors ${device === d ? "bg-white/10 text-slate-100" : "text-slate-500 hover:text-slate-300"}`}
                    title={d}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Autosave status */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              {autosaveStatus === "saving" && <><Loader2 className="w-3 h-3 animate-spin" /> Menyimpan...</>}
              {autosaveStatus === "saved" && <><Check className="w-3 h-3 text-emerald-400" /> Tersimpan</>}
              {autosaveStatus === "error" && <span className="text-red-400">Gagal simpan</span>}
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileView((v) => v === "edit" ? "preview" : "edit")}
              className="md:hidden px-3 py-1 rounded-md border border-white/10 text-[11px] text-slate-400 hover:text-slate-200 transition"
            >
              {mobileView === "edit" ? "Preview" : "Edit"}
            </button>
          </div>

          {/* Template preview */}
          <div
            id="preview-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            <div
              className={`mx-auto transition-all duration-300 ${
                device === "mobile" ? "max-w-[390px]"
                  : device === "tablet" ? "max-w-[768px]"
                  : "w-full"
              }`}
            >
              <TemplateComponent
                content={content}
                design_token={designToken}
                onSelectSection={handlePreviewSelectSection}
                isEditorMode
              />
            </div>
          </div>

          {/* Undo AI regen floating button */}
          {undoStack.length > 0 && !pendingDiff && (
            <div className="absolute bottom-4 right-4 z-20">
              <button
                type="button"
                onClick={undoLastRegen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1d26] border border-white/10 text-[11px] text-slate-300 hover:bg-white/10 transition shadow-lg"
              >
                <RotateCcw className="w-3 h-3" /> Undo AI
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════ MODALS ════ */}
      {publishModalOpen && siteDetails && (
        <PublishModal
          site={siteDetails}
          onConfirm={handlePublishWithSubdomain}
          onCancel={() => setPublishModalOpen(false)}
          loading={publishing}
        />
      )}

      {showCongrats && siteDetails && (
        <CongratsModal
          site={siteDetails}
          onClose={() => { setShowCongrats(false); router.push("/dashboard/sites"); }}
        />
      )}

      {/* Upgrade prompt */}
      <Dialog
        open={upgradePromptOpen}
        onOpenChange={setUpgradePromptOpen}
        title="Fitur AI Only untuk Pro"
        footer={
          <>
            <Button type="button" variant="outline" className="flex-1 rounded-xl h-11 text-[13.5px] border-white/10 hover:bg-white/[0.04]" onClick={() => setUpgradePromptOpen(false)}>
              Nanti
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-xl h-11 text-[13.5px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-0 cursor-pointer shadow-[0_4px_14px_color-mix(in_srgb,var(--primary)_30%,transparent)] flex items-center justify-center gap-2"
              onClick={() => { setUpgradePromptOpen(false); router.push("/dashboard/upgrade"); }}
            >
              <Zap className="w-4 h-4" /> Upgrade ke Pro
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4 py-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-100">Fitur AI hanya tersedia untuk pengguna Pro</p>
            <p className="text-[12px] text-slate-400 mt-1">Dengan Pro, kamu bisa menggunakan AI Generate untuk konten, gambar, SEO, dan desain website.</p>
          </div>
        </div>
      </Dialog>

      {/* Inline AI prompt modal */}
      {aiPromptModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-150"
          onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-100 leading-tight">Instruksi AI</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Apa yang ingin kamu ubah di bagian{" "}
                  <span className="font-semibold text-primary capitalize">
                    {SECTION_META[aiPromptModal.section]?.label ?? aiPromptModal.section}
                  </span>?
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <input
                autoFocus
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && aiPromptInput.trim()) { aiPromptModal.resolve(aiPromptInput.trim()); setAiPromptModal(null); }
                  if (e.key === "Escape") { aiPromptModal.resolve(null); setAiPromptModal(null); }
                }}
                placeholder={`cth. "buat lebih persuasif dan emosional"`}
                className="w-full px-4 py-3 border border-white/10 bg-[#05070b] text-slate-100 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-slate-600 transition-all"
              />
              <div className="flex flex-wrap gap-1.5">
                {(AI_SUGGESTIONS[aiPromptModal.section] ?? []).slice(0, 3).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAiPromptInput(chip)}
                    className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl border border-white/10 text-[13px] font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!aiPromptInput.trim()}
                onClick={() => { if (!aiPromptInput.trim()) return; aiPromptModal.resolve(aiPromptInput.trim()); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_14px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
              >
                <Sparkles className="h-3.5 w-3.5" /> Generate AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
