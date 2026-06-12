"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Save, Loader2, Sparkles,
  HelpCircle, AlertCircle,
  Monitor, Smartphone, Layout, Globe, ChevronLeft, ChevronDown, Check, GripVertical, RotateCcw
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { getTemplate, TEMPLATE_REGISTRY } from "@/lib/template-registry";
import {
  stripRegeneratedMarkers,
  BODY_SECTION_KEYS,
  EDITOR_SECTION_KEYS,
  SECTION_META,
  AI_SUGGESTIONS,
  getOrderedSections,
  cloneData,
  collectQualityIssues,
  summarizeDiff,
  isDesignTokenEqual
} from "./editor-utils";
import TemplateThumbnail from "./TemplateThumbnail";
import SectionForms from "./SectionForms";

export default function SiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const siteId = params.id ? Number(params.id) : null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("header");
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const activeTabRef = useRef(activeTab);
  const shouldScrollToActiveRef = useRef(false);
  const templatePickerRef = useRef<HTMLDivElement | null>(null);
  const sectionDropdownRef = useRef<HTMLDivElement | null>(null);

  // Site details & content
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [designToken, setDesignToken] = useState<any>(null);
  const contentRef = useRef<any>(null);
  const designTokenRef = useRef<any>(null);
  const [latestAiDesignToken, setLatestAiDesignToken] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<Array<{ section: string; previousContent: any; previousDesignToken: any }>>([]);
  const [pendingDiff, setPendingDiff] = useState<{
    section: string;
    before: any;
    after: any;
    previousDesignToken: any;
    nextDesignToken: any;
    rows: Array<{ label: string; before: string; after: string }>;
  } | null>(null);

  // Autosave states & refs
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const autosaveTimerRef = useRef<any>(null);
  const lastSavedRef = useRef<{ content: any; designToken: any; siteDetails: any } | null>(null);
  const initialLoadedRef = useRef(false);
  
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [customTemplatesTotal, setCustomTemplatesTotal] = useState(0);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const fetchCustomTemplates = async (reset = false) => {
    if (!token || !activeTenantId || !siteId) return;
    try {
      setLoadingTemplates(true);
      const currentOffset = reset ? 0 : customTemplates.length;
      const templatesRes = await request<any>(`/ai/templates?limit=10&offset=${currentOffset}`, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);

      if (templatesRes.status === "success" && templatesRes.data) {
        const items = templatesRes.data.items || [];
        const total = templatesRes.data.total || 0;
        setCustomTemplates(prev => reset ? items : [...prev, ...items]);
        setCustomTemplatesTotal(total);
      }
    } catch (err) {
      console.warn("Failed to fetch template library:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // AI instructions state
  const [aiInstructions, setAiInstructions] = useState("");
  const [recentInstructions, setRecentInstructions] = useState<string[]>([]);

  const fetchData = async () => {
    if (!token || !activeTenantId || !siteId) return;
    initialLoadedRef.current = false;
    try {
      setLoading(true);
      // Fetch site details
      const siteRes = await request<any>(`/sites/${siteId}`, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSiteDetails(siteRes.data);

      // Fetch site content
      const contentRes = await request<any>(`/sites/${siteId}/content`, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      
      // Fallback empty content scaffold if empty
      const data = stripRegeneratedMarkers(contentRes.data?.content || {});
      const fallback = {
        header: { brand_name: "", nav_cta_text: "", logo_url: "", icon: "" },
        hero: { headline: "", subheadline: "", cta_text: "", cta_url: "", image_url: "" },
        about: { title: "", body: "", image_url: "", icon: "" },
        benefits: { title: "", items: [] },
        faq: { title: "", items: [] },
        cta: { headline: "", button_text: "", button_url: "" },
        contact: { title: "", address: "", phone: "", email: "", show_lead_form: true },
        footer: { brand_name: "", tagline: "", copyright_text: "" },
        seo: { title: "", description: "", favicon_url: "", og_image_url: "" }
      };

      const finalContent = {
        ...fallback,
        ...data,
        header: { ...fallback.header, ...data.header },
        hero: { ...fallback.hero, ...data.hero },
        about: { ...fallback.about, ...data.about },
        benefits: { ...fallback.benefits, ...data.benefits },
        faq: { ...fallback.faq, ...data.faq },
        cta: { ...fallback.cta, ...data.cta },
        contact: { ...fallback.contact, ...data.contact },
        footer: { ...fallback.footer, ...data.footer },
        seo: { ...fallback.seo, ...data.seo }
      };

      setContent(finalContent);

      const fetchedDesignToken = contentRes.data?.design_token || null;
      // Load design token if available
      if (fetchedDesignToken) {
        setDesignToken(fetchedDesignToken);
        setLatestAiDesignToken(fetchedDesignToken);
      }

      // Save initial loaded state for comparison
      lastSavedRef.current = {
        content: finalContent,
        designToken: fetchedDesignToken,
        siteDetails: siteRes.data
      };

      // Fetch custom templates library
      void fetchCustomTemplates(true);

    } catch (err: any) {
      pushToast(err.message || "Gagal memuat situs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId && siteId) {
      fetchData();
    }
  }, [activeTenantId, siteId]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    designTokenRef.current = designToken;
  }, [designToken]);

  useEffect(() => {
    if (!templatePickerOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!templatePickerRef.current?.contains(event.target as Node)) {
        setTemplatePickerOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [templatePickerOpen]);

  useEffect(() => {
    if (!sectionDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!sectionDropdownRef.current?.contains(event.target as Node)) {
        setSectionDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [sectionDropdownOpen]);

  const selectSection = useCallback((section: string, scrollToPreview = true) => {
    shouldScrollToActiveRef.current = scrollToPreview;
    activeTabRef.current = section;
    setActiveTab(section);
  }, []);

  // Scroll preview to active section
  useEffect(() => {
    if (!shouldScrollToActiveRef.current) return;
    shouldScrollToActiveRef.current = false;
    if (!activeTab) return;
    
    // Find the section element inside the preview
    const sectionEl = document.getElementById(`section-preview-${activeTab}`);
    const containerEl = document.getElementById("preview-scroll-container");
    
    if (sectionEl && containerEl) {
      requestAnimationFrame(() => {
        sectionEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [activeTab]);

  // Keep the sidebar section in sync while the user scrolls the preview.
  useEffect(() => {
    if (pendingDiff) return; // Disable scrollspy sync when review is active
    const containerEl = document.getElementById("preview-scroll-container");
    if (!containerEl) return;

    let frame = 0;
    const syncActiveSection = () => {
      frame = 0;
      const containerRect = containerEl.getBoundingClientRect();
      let nextSection = activeTabRef.current;
      let bestTop = Number.NEGATIVE_INFINITY;

      for (const section of EDITOR_SECTION_KEYS) {
        const sectionEl = document.getElementById(`section-preview-${section}`);
        if (!sectionEl) continue;
        const top = sectionEl.getBoundingClientRect().top - containerRect.top;
        if (top <= 60 && top > bestTop) {
          bestTop = top;
          nextSection = section;
        }
      }

      if (bestTop === Number.NEGATIVE_INFINITY) {
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (const section of EDITOR_SECTION_KEYS) {
          const sectionEl = document.getElementById(`section-preview-${section}`);
          if (!sectionEl) continue;
          const distance = Math.abs(sectionEl.getBoundingClientRect().top - containerRect.top);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nextSection = section;
          }
        }
      }

      if (nextSection !== activeTabRef.current) {
        shouldScrollToActiveRef.current = false;
        activeTabRef.current = nextSection;
        setActiveTab(nextSection);
      }
    };

    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(syncActiveSection);
    };

    containerEl.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount or device change
    syncActiveSection();
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [device, pendingDiff]);

  // Scroll preview to pending diff section when it changes
  useEffect(() => {
    if (!pendingDiff?.section) return;
    
    const sectionEl = document.getElementById(`section-preview-${pendingDiff.section}`);
    const containerEl = document.getElementById("preview-scroll-container");
    
    if (sectionEl && containerEl) {
      requestAnimationFrame(() => {
        sectionEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [pendingDiff?.section]);

  const performAutosave = async (currentContent: any, currentDesignToken: any, currentSiteDetails: any) => {
    if (!token || !activeTenantId || !siteId || !currentContent || !currentSiteDetails) return;
    try {
      setAutosaveStatus("saving");

      // Save template ID changes
      const patchPromise = request<any>(`/sites/${siteId}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: currentSiteDetails.name,
          template_id: currentSiteDetails.template_id,
          subdomain: currentSiteDetails.subdomain,
        }),
      }, token);

      // Save content and design token changes
      const putPromise = request(`/sites/${siteId}/content`, {
        method: "PUT",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ content: currentContent, design_token: currentDesignToken ?? undefined })
      }, token);

      const [patchRes] = await Promise.all([patchPromise, putPromise]);

      const updatedSiteDetails = patchRes.data || currentSiteDetails;
      if (patchRes.data) {
        setSiteDetails(patchRes.data);
      }

      lastSavedRef.current = {
        content: currentContent,
        designToken: currentDesignToken,
        siteDetails: updatedSiteDetails
      };
      setAutosaveStatus("saved");
    } catch (err: any) {
      console.error("Autosave error:", err);
      setAutosaveStatus("error");
    }
  };

  useEffect(() => {
    if (loading || !content || !siteDetails) return;

    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      return;
    }

    // Compare with the last saved state to check if there are actual modifications
    const currentStr = JSON.stringify({ content, designToken, siteDetails });
    const lastSavedStr = JSON.stringify(lastSavedRef.current);
    if (currentStr === lastSavedStr) {
      return;
    }

    // Status goes to pending/idle to indicate unsaved changes exist
    setAutosaveStatus("idle");

    // Clear previous timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Set 2-second debounce timer
    autosaveTimerRef.current = setTimeout(() => {
      void performAutosave(content, designToken, siteDetails);
    }, 2000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [content, designToken, siteDetails, loading]);

  const handleSaveContent = async () => {
    if (!token || !activeTenantId || !siteId || !content || !siteDetails) return;

    // Clear any active autosave timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    try {
      setSaving(true);
      setAutosaveStatus("saving");

      // Save template ID changes
      const patchPromise = request<any>(`/sites/${siteId}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: siteDetails.name,
          template_id: siteDetails.template_id,
          subdomain: siteDetails.subdomain,
        }),
      }, token);

      // Save content and design token changes
      const putPromise = request(`/sites/${siteId}/content`, {
        method: "PUT",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ content, design_token: designToken ?? undefined })
      }, token);

      const [patchRes] = await Promise.all([patchPromise, putPromise]);

      const updatedSiteDetails = patchRes.data || siteDetails;
      if (patchRes.data) {
        setSiteDetails(patchRes.data);
      }

      lastSavedRef.current = { content, designToken, siteDetails: updatedSiteDetails };
      setAutosaveStatus("saved");
      pushToast("Perubahan berhasil disimpan!", "success");
    } catch (err: any) {
      setAutosaveStatus("error");
      pushToast(err.message || "Gagal menyimpan perubahan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = (templateId: string, customDesignToken?: any) => {
    if (!siteDetails) return;

    // Skip if template_id is matching and no new design token is provided
    if (templateId === siteDetails.template_id && !customDesignToken) return;

    setTemplatePickerOpen(false);
    setSiteDetails({ ...siteDetails, template_id: templateId });
    if (customDesignToken) {
      setDesignToken(customDesignToken);
    }
  };

  const rememberInstruction = (instruction: string) => {
    const clean = instruction.trim();
    if (!clean) return;
    setRecentInstructions((current) => [clean, ...current.filter((item) => item !== clean)].slice(0, 5));
  };

  const applyRegeneratedSection = () => {
    if (!pendingDiff || !content) return;
    setUndoStack((current) => [
      {
        section: pendingDiff.section,
        previousContent: cloneData(content),
        previousDesignToken: cloneData(designToken),
      },
      ...current,
    ].slice(0, 3));
    setContent({
      ...content,
      [pendingDiff.section]: pendingDiff.after,
    });
    if (pendingDiff.nextDesignToken) {
      setDesignToken(pendingDiff.nextDesignToken);
      setLatestAiDesignToken(pendingDiff.nextDesignToken);
    }
    setPendingDiff(null);
    pushToast(`Hasil AI untuk ${pendingDiff.section} dipakai.`, "success");
  };

  const restorePendingDiff = () => {
    if (!pendingDiff) return;
    if (pendingDiff.previousDesignToken) {
      setDesignToken(pendingDiff.previousDesignToken);
    }
    setPendingDiff(null);
    pushToast("Hasil AI dibatalkan.", "info");
  };

  const undoLastRegen = () => {
    const latest = undoStack[0];
    if (!latest) return;
    setContent(latest.previousContent);
    setDesignToken(latest.previousDesignToken);
    setUndoStack((current) => current.slice(1));
    selectSection(latest.section, true);
    pushToast(`Perubahan AI pada ${latest.section} dikembalikan.`, "success");
  };

  const handleReorderSection = (source: string, target: string) => {
    if (source === target || !BODY_SECTION_KEYS.includes(source) || !BODY_SECTION_KEYS.includes(target)) return;
    const currentOrder = getOrderedSections(designToken).filter((key) => BODY_SECTION_KEYS.includes(key));
    const nextOrder = [...currentOrder];
    const from = nextOrder.indexOf(source);
    const to = nextOrder.indexOf(target);
    if (from < 0 || to < 0) return;
    nextOrder.splice(from, 1);
    nextOrder.splice(to, 0, source);
    setDesignToken({
      ...(designToken || {}),
      layout: {
        ...(designToken?.layout || {}),
        section_order: nextOrder,
      },
    });
  };

  const handleAiRegenerateForSection = useCallback(async (section: string, customInstructions?: string) => {
    const currentContent = contentRef.current;
    if (!token || !activeTenantId || !siteId || !currentContent) return;
    
    let instructions = customInstructions || aiInstructions;
    if (!instructions.trim()) {
      const input = window.prompt(`Masukkan instruksi AI untuk regenerasi bagian "${section}" (cth: "buat kalimat lebih persuasif"):`);
      if (!input || !input.trim()) return;
      instructions = input;
    }

    try {
      setAiLoading(true);
      const res = await request<any>("/ai/regenerate-section", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          section: section,
          instructions: instructions,
          tenant_id: activeTenantId,
        }),
      }, token);

      if (res.status === "success" && res.data) {
        const sectionData = stripRegeneratedMarkers(res.data.section !== undefined ? res.data.section : res.data);
        const newDesignToken = res.data.design_token;
        const diffRows = summarizeDiff(currentContent[section], sectionData);
        if (diffRows.length === 0) {
          pushToast("AI belum menghasilkan perubahan nyata.", "info", {
            message: "Coba instruksi yang lebih spesifik, misalnya: ubah jadi headline emosional, maksimal 8 kata, dan hilangkan teks input mentah.",
          });
          return;
        }
        rememberInstruction(instructions);
        setPendingDiff({
          section,
          before: cloneData(currentContent[section]),
          after: sectionData,
          previousDesignToken: cloneData(designTokenRef.current),
          nextDesignToken: newDesignToken || null,
          rows: diffRows,
        });
        pushToast(`AI selesai menulis ${section}. Cek diff sebelum dipakai.`, "success");
        setAiInstructions("");
      } else {
        throw new Error(res.message || "AI gagal memproses.");
      }
    } catch (err: any) {
      pushToast(err.message || "AI gagal meregenerasi bagian ini.", "error");
    } finally {
      setAiLoading(false);
    }
  }, [activeTenantId, aiInstructions, pushToast, siteId, token]);

  const handlePreviewSelectSection = useCallback((section: string) => selectSection(section, false), [selectSection]);

  const handleAiRegenerateSection = () => handleAiRegenerateForSection(activeTab);

  // Helper updates for form fields
  const updateField = (section: string, key: string, val: any) => {
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [key]: val
      }
    });
  };

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

  const orderedSectionKeys = getOrderedSections(designToken);
  const SECTIONS = orderedSectionKeys.map((key, idx) => ({
    key,
    label: SECTION_META[key]?.label ?? key,
    icon: SECTION_META[key]?.icon ?? Layout,
    num: idx + 1,
  }));
  const quality = collectQualityIssues(content);
  const issuePaths = new Set(quality.issues.map((issue) => issue.path));
  const activeSuggestions = AI_SUGGESTIONS[activeTab] ?? AI_SUGGESTIONS.hero;
  const aiPlaceholder = activeSuggestions[0] || "Buat copy lebih jelas dan meyakinkan...";
  const fieldClass = (path: string, base: string) => `${base} ${
    issuePaths.has(path)
      ? "!border-amber-400/80 !bg-amber-400/10 focus:!border-amber-300"
      : ""
  }`;
  const needsAttention = (path: string) => issuePaths.has(path);
  const currentTemplate = getTemplate(siteDetails.template_id) ?? getTemplate("TEMPLATE_JASA02")!;
  const TemplateComponent = currentTemplate.component;
  const dynamicTemplate = TEMPLATE_REGISTRY.find(t => t.id === "TEMPLATE_DYNAMIC");

  // Find if active template is one of the custom ones from the library
  const activeCustomTemplate = siteDetails.template_id === "TEMPLATE_DYNAMIC" && customTemplates.find(ct => 
    isDesignTokenEqual(designToken, ct.design_token)
  );

  const activeDesignToken = activeCustomTemplate ? activeCustomTemplate.design_token : (siteDetails.template_id === "TEMPLATE_DYNAMIC" ? designToken : null);

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

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -mx-4 -mb-6 overflow-hidden bg-[#05070b] text-slate-100">
      {/* ── Main editor split ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ════ LEFT SIDEBAR ════ */}
        <div className="w-[260px] flex-shrink-0 border-r border-white/10 flex flex-col overflow-hidden bg-[#05070b]">

          {/* Site identity */}
          <div className="flex h-14 flex-shrink-0 items-center gap-2.5 border-b border-white/10 px-3">
            <button
              onClick={() => router.push("/dashboard/sites")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-slate-100 active:scale-95"
              aria-label="Kembali ke daftar situs"
            >
              <ChevronLeft className="h-5 w-5 flex-shrink-0" />
              <span className="text-[11px] font-semibold">Kembali</span>
            </button>
            <div className="h-5 w-px bg-white/10 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[13px] font-bold tracking-tight text-slate-100">{siteDetails.name}</h1>
              <p className="truncate text-[10px] text-slate-500">{siteDetails.subdomain}.webjoz.com</p>
            </div>
          </div>

          {/* Visual style selector */}
          <div ref={templatePickerRef} className="flex-shrink-0 border-b border-white/10 p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Gaya Situs</p>
              {templateSaving && <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-300" />}
            </div>
            <button
              type="button"
              onClick={() => !pendingDiff && setTemplatePickerOpen((open) => !open)}
              disabled={templateSaving || !!pendingDiff}
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-left transition hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-haspopup="listbox"
              aria-expanded={templatePickerOpen}
            >
              <div className="w-12 flex-shrink-0">
                <TemplateThumbnail previewType={activeTemplatePreviewType} accent={activeTemplateAccent} active compact palette={activeDesignToken?.palette} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-slate-100">{activeTemplateName}</p>
                <p className="truncate text-[10px] text-slate-500">{activeTemplateCategory}</p>
              </div>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${templatePickerOpen ? "rotate-180" : ""}`} />
            </button>

            {templatePickerOpen && (
              <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1" role="listbox" aria-label="Pilihan gaya website">
                {/* 1. LATEST AI GENERATED (TEMPLATE_DYNAMIC) AT THE VERY TOP */}
                {dynamicTemplate && (() => {
                  const isTopActive = siteDetails.template_id === "TEMPLATE_DYNAMIC" && !activeCustomTemplate;
                  return (
                    <button
                      key="top-dynamic-template"
                      type="button"
                      onClick={() => void handleTemplateChange("TEMPLATE_DYNAMIC", latestAiDesignToken)}
                      disabled={templateSaving}
                      className={`group w-full rounded-xl border p-2 text-left transition ${
                        isTopActive
                          ? "border-violet-400 bg-violet-500/15"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
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
                            <span className="bg-violet-500/25 text-violet-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Terbaru</span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">
                            Gaya visual unik buatan AI terbaru untuk website Anda.
                          </p>
                        </div>
                        {isTopActive && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-300" />}
                      </div>
                    </button>
                  );
                })()}

                {/* 2. STATIC PRESETS */}
                {TEMPLATE_REGISTRY.filter(t => t.id !== "TEMPLATE_DYNAMIC").map((template) => {
                  const active = template.id === siteDetails.template_id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => void handleTemplateChange(template.id)}
                      disabled={templateSaving}
                      className={`group w-full rounded-xl border p-2 text-left transition ${
                        active
                          ? "border-violet-400 bg-violet-500/15"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                      }`}
                      role="option"
                      aria-selected={active}
                    >
                      <TemplateThumbnail previewType={template.previewType} accent={template.accent} active={active} />
                      <div className="mt-2 flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-bold text-slate-100">{template.name}</p>
                          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">{template.description}</p>
                        </div>
                        {active && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-300" />}
                      </div>
                    </button>
                  );
                })}

                {/* 3. DIVIDER AND CUSTOM AI GENERATED TEMPLATES LIST */}
                {customTemplates.length > 0 && (
                  <>
                    <div className="border-t border-white/10 my-2.5 pt-2" />
                    <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      Riwayat Desain AI
                    </p>
                    {(() => {
                      let hasMatchedActive = false;
                      return customTemplates.map((template) => {
                        const isMatch = siteDetails.template_id === "TEMPLATE_DYNAMIC" && 
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
                            className={`group w-full rounded-xl border p-2 text-left transition ${
                              active
                                ? "border-violet-400 bg-violet-500/15"
                                : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
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
                                  <p className="truncate text-[12px] font-bold text-slate-100">
                                    AI: {template.business_type}
                                  </p>
                                  <span className="bg-emerald-500/25 text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Hasil AI</span>
                                </div>
                                <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">
                                  Nuansa {template.mood || "custom"}. Dibuat pada {new Date(template.created_at).toLocaleDateString("id-ID")}.
                                </p>
                              </div>
                              {active && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-300" />}
                            </div>
                          </button>
                        );
                      });
                    })()}

                    {customTemplates.length < customTemplatesTotal && (
                      <div className="pt-2 px-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void fetchCustomTemplates(false);
                          }}
                          disabled={loadingTemplates}
                          className="w-full py-2.5 text-center text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors border border-dashed border-white/10 hover:border-violet-500/30 rounded-xl hover:bg-white/[0.02] disabled:opacity-60 flex items-center justify-center gap-1.5"
                        >
                          {loadingTemplates ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Memuat...
                            </>
                          ) : (
                            <>
                              Muat Lebih Banyak ({customTemplatesTotal - customTemplates.length} tersisa)
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Visual section selector dropdown */}
          <div ref={sectionDropdownRef} className="flex-shrink-0 border-b border-white/10 p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Edit Section</p>
              <span className="text-[9px] font-semibold text-slate-600">Drag untuk urutan</span>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => !pendingDiff && setSectionDropdownOpen((open) => !open)}
                disabled={!!pendingDiff}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-2 text-left transition hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={sectionDropdownOpen}
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const activeSec = SECTIONS.find(s => s.key === activeTab);
                    if (activeSec) {
                      const Icon = activeSec.icon;
                      return (
                        <>
                          <Icon className="w-4 h-4 text-violet-400" />
                          <span className="text-[13px] font-medium text-slate-200">{activeSec.label}</span>
                        </>
                      );
                    }
                    return <span className="text-[13px] font-medium text-slate-200">{activeTab}</span>;
                  })()}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${sectionDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {sectionDropdownOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#0c0f17] p-1 shadow-lg space-y-0.5" role="listbox">
                  {SECTIONS.map(({ key, label, icon: Icon, num }) => (
                    <button
                      key={key}
                      type="button"
                      draggable={BODY_SECTION_KEYS.includes(key)}
                      onDragStart={(event) => {
                        if (!BODY_SECTION_KEYS.includes(key)) return;
                        setDraggingSection(key);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", key);
                      }}
                      onDragOver={(event) => {
                        if (!draggingSection || !BODY_SECTION_KEYS.includes(key)) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        const source = event.dataTransfer.getData("text/plain") || draggingSection;
                        if (source) handleReorderSection(source, key);
                        setDraggingSection(null);
                      }}
                      onDragEnd={() => setDraggingSection(null)}
                      onClick={() => {
                        selectSection(key, true);
                        setSectionDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left transition-colors ${
                        activeTab === key
                          ? "bg-violet-600 text-white font-semibold shadow-sm"
                          : draggingSection === key
                          ? "bg-violet-500/20 text-violet-100"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`}
                      role="option"
                      aria-selected={activeTab === key}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className={`h-3.5 w-3.5 ${BODY_SECTION_KEYS.includes(key) ? "text-slate-500" : "text-slate-700"}`} />
                        <Icon className={`w-4 h-4 ${activeTab === key ? "text-white" : "text-slate-400"}`} />
                        <span className="text-[13px]">{label}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        activeTab === key ? "bg-violet-700 text-white" : "bg-white/5 text-slate-400"
                      }`}>{num}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Field Panel (scrollable) ── */}
          <div
            className="flex-1 border-t border-white/10 flex flex-col overflow-hidden [&_input]:!border-white/10 [&_textarea]:!border-white/10 [&_select]:!border-white/10 [&_input]:!bg-[#05070b] [&_textarea]:!bg-[#05070b] [&_select]:!bg-[#05070b] [&_input]:!text-slate-100 [&_textarea]:!text-slate-100 [&_select]:!text-slate-100 [&_input::placeholder]:!text-slate-700 [&_textarea::placeholder]:!text-slate-700"
            style={{ minHeight: 0 }}
          >
            <div className="px-3.5 py-2 border-b border-white/10 flex-shrink-0">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
                Edit — {SECTIONS.find(s => s.key === activeTab)?.label ?? activeTab}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 relative">
              {pendingDiff ? (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#070b12]/95 p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-100">Review AI Sedang Aktif</h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400 max-w-[200px]">
                    Silakan gunakan atau kembalikan perubahan AI pada seksi{" "}
                    <span className="font-bold text-violet-300">
                      {SECTION_META[pendingDiff.section]?.label || pendingDiff.section}
                    </span>{" "}
                    di bagian atas halaman preview terlebih dahulu.
                  </p>
                  <div className="mt-4 flex gap-2 w-full max-w-[200px]">
                    <button
                      type="button"
                      onClick={applyRegeneratedSection}
                      className="flex-1 rounded-md bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition active:scale-95 cursor-pointer"
                    >
                      Gunakan
                    </button>
                    <button
                      type="button"
                      onClick={restorePendingDiff}
                      className="flex-1 rounded-md border border-white/15 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-white/5 transition active:scale-95 cursor-pointer"
                    >
                      Kembalikan
                    </button>
                  </div>
                </div>
              ) : null}
              {quality.issues.length > 0 && (
                <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[11px] leading-relaxed text-amber-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">⚠️ {quality.issues.length} field perlu dicek</span>
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-semibold">{quality.score}%</span>
                  </div>
                  <p className="mt-1 truncate text-amber-100/75">
                    {quality.issues.slice(0, 3).map((issue) => issue.label).join(", ")}
                    {quality.issues.length > 3 ? ` +${quality.issues.length - 3} lainnya` : ""}
                  </p>
                </div>
              )}

              <SectionForms
                activeTab={activeTab}
                content={content}
                updateField={updateField}
                needsAttention={needsAttention}
                fieldClass={fieldClass}
              />

            </div>

            {/* ── AI Prompt bar inside field panel ── */}
            <div className="border-t border-white/10 px-3.5 py-2.5 flex-shrink-0 bg-[#05070b] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  AI untuk {SECTIONS.find(s => s.key === activeTab)?.label ?? activeTab}
                </span>
                {undoStack.length > 0 && (
                  <button
                    type="button"
                    onClick={undoLastRegen}
                    className="flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-white/5"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Undo
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {activeSuggestions.slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setAiInstructions(suggestion)}
                    disabled={!!pendingDiff}
                    className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-left text-[10px] font-medium text-violet-100 hover:bg-violet-400/20 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              {recentInstructions.length > 0 && (
                <div className="flex flex-wrap gap-1 border-t border-white/10 pt-2">
                  {recentInstructions.slice(0, 5).map((instruction) => (
                    <button
                      key={instruction}
                      type="button"
                      onClick={() => setAiInstructions(instruction)}
                      disabled={!!pendingDiff}
                      className="max-w-full truncate rounded-full bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 disabled:opacity-50 disabled:pointer-events-none"
                      title={instruction}
                    >
                      {instruction}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !pendingDiff) handleAiRegenerateSection(); }}
                placeholder={aiPlaceholder}
                disabled={aiLoading || !!pendingDiff}
                className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[12px] outline-none focus:border-violet-400 placeholder:text-slate-700 disabled:opacity-50"
              />
              <button
                onClick={handleAiRegenerateSection}
                disabled={aiLoading || !!pendingDiff}
                className="w-full h-9 px-3 flex items-center justify-center gap-1.5 rounded-md bg-violet-50 text-violet-700 text-[12px] font-medium hover:bg-violet-100 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {aiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="truncate">{aiLoading ? "Memproses..." : "Regenerate dengan AI"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════ RIGHT CANVAS ════ */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden min-w-0">

          {/* Canvas topbar */}
          <div className="flex h-9 flex-shrink-0 items-center gap-2 border-b border-white/10 bg-[#05070b] px-2.5">
            {/* Device switcher */}
            <button
              onClick={() => setDevice("desktop")}
              className={`flex h-6 w-7 items-center justify-center rounded-md border text-[12px] transition-colors ${
                device === "desktop" ? "bg-white text-slate-950 border-slate-200" : "border-white/10 hover:bg-white/5 text-slate-500"
              }`}
              aria-label="Preview desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`flex h-6 w-7 items-center justify-center rounded-md border text-[12px] transition-colors ${
                device === "mobile" ? "bg-white text-slate-950 border-slate-200" : "border-white/10 hover:bg-white/5 text-slate-500"
              }`}
              aria-label="Preview mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>

            {/* AI badge */}
            <span className="ml-1 flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-200">
              <Sparkles className="h-3 w-3" />
              AI aktif
            </span>

            <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
              quality.score >= 85
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                : quality.score >= 65
                ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                : "border-red-500/20 bg-red-500/10 text-red-200"
            }`} title={quality.issues.slice(0, 5).map((issue) => issue.label).join(", ")}>
              {quality.score < 100 && <span className="text-amber-200">⚠️</span>}
              Completion {quality.score}%
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Autosave status indicator */}
            {autosaveStatus !== "idle" && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                autosaveStatus === "saving" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" :
                autosaveStatus === "saved" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
                "bg-red-500/10 text-red-300 border border-red-500/20"
              }`}>
                {autosaveStatus === "saving" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                {autosaveStatus === "saved" && <Check className="w-2.5 h-2.5" />}
                {autosaveStatus === "error" && <AlertCircle className="w-2.5 h-2.5" />}
                {autosaveStatus === "saving" ? "Menyimpan..." :
                 autosaveStatus === "saved" ? "Tersimpan otomatis" :
                 "Gagal menyimpan"}
              </span>
            )}

            {/* Buka preview link */}
            <a
              href={`/s/${siteDetails.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Globe className="h-3.5 w-3.5" />
              Buka preview
            </a>

            {/* Save button */}
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="flex h-6 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-white transition-colors"
              style={{ background: "#1D9E75" }}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan Perubahan
            </button>
          </div>

          {pendingDiff && (
            <div className="flex-shrink-0 border-b border-violet-400/20 bg-[#0b0f1a] px-3 py-2">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                    <p className="text-[12px] font-bold text-slate-100">
                      Diff AI: {SECTION_META[pendingDiff.section]?.label ?? pendingDiff.section}
                    </p>
                    <span className="rounded-full bg-violet-400/10 px-2 py-0.5 text-[10px] font-semibold text-violet-200">
                      {pendingDiff.rows.length || 0} perubahan
                    </span>
                  </div>
                  <div className="mt-2 grid max-h-40 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
                    {(pendingDiff.rows.length ? pendingDiff.rows : [{ label: "Konten", before: JSON.stringify(pendingDiff.before), after: JSON.stringify(pendingDiff.after) }]).map((row, idx) => (
                      <div key={`${row.label}-${idx}`} className="rounded-md border border-white/10 bg-white/[0.03] p-2 text-[11px]">
                        <p className="mb-1 font-semibold text-slate-300">{row.label}</p>
                        <div className="grid gap-1">
                          <p className="line-clamp-2 rounded bg-red-400/10 px-2 py-1 text-red-100">
                            <span className="font-bold">Lama:</span> {row.before || "-"}
                          </p>
                          <p className="line-clamp-2 rounded bg-emerald-400/10 px-2 py-1 text-emerald-100">
                            <span className="font-bold">Baru:</span> {row.after || "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={applyRegeneratedSection}
                    className="rounded-md bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-400"
                  >
                    Gunakan ini
                  </button>
                  <button
                    type="button"
                    onClick={restorePendingDiff}
                    className="rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-white/5"
                  >
                    Kembalikan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Canvas body */}
          <div id="preview-scroll-container" className="flex-1 min-h-0 overflow-y-auto bg-slate-100 flex items-start justify-center p-4">
            {pendingDiff && (
              <style dangerouslySetInnerHTML={{ __html: `
                #preview-scroll-container div[id^="section-preview-"] {
                  transition: all 0.3s ease-in-out;
                }
                #preview-scroll-container div[id^="section-preview-"]:not(#section-preview-${pendingDiff.section}) {
                  opacity: 0.35;
                  filter: grayscale(40%) blur(0.5px);
                  pointer-events: none !important;
                  cursor: not-allowed;
                }
                #preview-scroll-container div[id="section-preview-${pendingDiff.section}"] {
                  position: relative;
                  outline: 3px solid #7c3aed;
                  outline-offset: -3px;
                  box-shadow: 0 0 25px rgba(124, 58, 237, 0.35);
                  z-index: 10;
                }
              `}} />
            )}

            {device === "mobile" ? (
              /* Premium Mobile Phone Frame Wrapper */
              <div className="relative mx-auto my-4 h-[760px] w-[375px] flex-shrink-0 rounded-[40px] border-[12px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800 transition-all duration-300">
                {/* Speaker/Notch */}
                <div className="absolute left-1/2 top-3 z-50 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-900" />
                {/* Screen container */}
                <div className="h-full w-full overflow-hidden rounded-[28px] bg-white">
                  {/* Scaled viewport trick to trigger Tailwind responsive styles */}
                  <div 
                    style={{ 
                      width: "680px", 
                      height: "181.81%", 
                      transform: "scale(0.55)", 
                      transformOrigin: "top left" 
                    }}
                    className="overflow-y-auto h-full"
                  >
                    <TemplateComponent
                      content={content}
                      design_token={designToken ?? null}
                      isEditorMode={true}
                      activeSection={activeTab}
                      onSelectSection={handlePreviewSelectSection}
                      onRegenSection={handleAiRegenerateForSection}
                    />
                  </div>
                </div>
                {/* Home Indicator line */}
                <div className="absolute bottom-2 left-1/2 z-50 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-700" />
              </div>
            ) : (
              <div
                className="bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 w-full max-w-[1228px]"
              >
                <TemplateComponent
                  content={content}
                  design_token={designToken ?? null}
                  isEditorMode={true}
                  activeSection={activeTab}
                  onSelectSection={handlePreviewSelectSection}
                  onRegenSection={handleAiRegenerateForSection}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
