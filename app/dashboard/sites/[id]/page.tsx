"use client";

import { Dialog } from "@/components/ui/dialog";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import {
  Save, Loader2, Sparkles,
  HelpCircle, AlertCircle,
  Monitor, Smartphone, Layout, Globe, ChevronLeft, ChevronDown, Check, GripVertical, RotateCcw,
  Eye, EyeOff, Pencil, Send, Rocket, Copy
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { getTemplate, TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { getTemplateDefaultDesignToken } from "@/lib/template-defaults";
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

const GOOGLE_FONTS_WHITELIST = [
  "Inter", "Roboto", "Open Sans", "Montserrat", "Lato",
  "Poppins", "Outfit", "Plus Jakarta Sans", "Work Sans", "DM Sans",
  "Playfair Display", "Merriweather", "Lora", "PT Serif",
  "Cinzel", "Cormorant Garamond", "Arvo",
  "Oswald", "Bebas Neue", "Space Grotesk"
];

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
  const [editorTab, setEditorTab] = useState<"content" | "design">("content");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [mobileView, setMobileView] = useState<"edit" | "preview">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "preview" : "edit"
  );
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const activeTabRef = useRef(activeTab);
  const shouldScrollToActiveRef = useRef(false);
  const templatePickerRef = useRef<HTMLDivElement | null>(null);
  const sectionDropdownRef = useRef<HTMLDivElement | null>(null);
  const colorRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Site details & content
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [designToken, setDesignToken] = useState<any>(null);
  const contentRef = useRef<any>(null);
  const designTokenRef = useRef<any>(null);
  const [latestAiDesignToken, setLatestAiDesignToken] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<Array<{ section: string; previousContent: any; previousDesignToken: any }>>([]);
  const [colorUndo, setColorUndo] = useState<Record<string, string>>({});
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
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

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
  const [aiDesignPromptOpen, setAiDesignPromptOpen] = useState(false);
  const [aiDesignInstructions, setAiDesignInstructions] = useState("");

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
        hero: { headline: "", subheadline: "", cta_text: "", cta_url: "", image_url: "", matra: "" },
        about: { title: "", body: "", image_url: "", icon: "" },
        benefits: { title: "", items: [] },
        testimonials: { title: "", items: [] },
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
        hero: { ...fallback.hero, ...data.hero, matra: data.hero?.matra ?? "" },
        about: { ...fallback.about, ...data.about },
        benefits: { ...fallback.benefits, ...data.benefits },
        faq: { ...fallback.faq, ...data.faq },
        cta: { ...fallback.cta, ...data.cta },
        contact: { ...fallback.contact, ...data.contact },
        footer: { ...fallback.footer, ...data.footer },
        seo: { ...fallback.seo, ...data.seo },
        // Preserve optional sections as-is
        ...(data.testimonials ? { testimonials: data.testimonials } : {}),
        ...(data.menu ? { menu: data.menu } : {}),
        ...(data.catalog ? { catalog: data.catalog } : {}),
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

  const handlePublishWithSubdomain = async (subdomain: string) => {
    if (!siteDetails || !token || !activeTenantId) return;
    try {
      setPublishing(true);
      // 1. Update subdomain
      await request(`/sites/${siteDetails.id}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: siteDetails.name,
          template_id: siteDetails.template_id,
          subdomain: subdomain,
        })
      }, token);

      // 2. Publish
      const publishRes = await request<any>(`/sites/${siteDetails.id}/publish`, {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);

      pushToast("Website berhasil dipublikasikan! 🚀", "success");
      setPublishModalOpen(false);
      if (publishRes.data) {
        setSiteDetails(publishRes.data);
      }
      setShowCongrats(true);
    } catch (err: any) {
      pushToast(err.message || "Gagal memublikasikan website", "error");
    } finally {
      setPublishing(false);
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

  // Sync favicon & page title for editor preview
  useEffect(() => {
    if (!content) return;

    const faviconUrl = content?.seo?.favicon_url;
    const siteTitle = content?.seo?.title || siteDetails?.name;

    // Save original favicon href so we can restore on unmount
    let originalFaviconHref = "";
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (link) {
      originalFaviconHref = link.href;
    }

    if (faviconUrl) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }

    const originalTitle = document.title;
    if (siteTitle) {
      document.title = `${siteTitle} — Edit`;
    }

    return () => {
      // Restore original favicon when leaving editor
      if (link && originalFaviconHref) {
        link.href = originalFaviconHref;
      }
      document.title = originalTitle;
    };
  }, [content?.seo?.favicon_url, content?.seo?.title, siteDetails?.name]);

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

  // Scroll active pill into center view
  useEffect(() => {
    const pill = document.querySelector(`[data-section-key="${activeTab}"]`) as HTMLElement | null;
    if (pill) {
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

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
    } else if (templateId !== "TEMPLATE_DYNAMIC") {
      // Static preset selected without an explicit design token (e.g. picking
      // "Noir Prestige" / "Bumi Lestari" / "Pop Riot" / "White Space" from the
      // picker) — apply that template's own default palette/typography/layout
      // instead of silently keeping the previous template's design token.
      setDesignToken(getTemplateDefaultDesignToken(templateId));
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

    if (pendingDiff.section !== "design") {
      setContent({
        ...content,
        [pendingDiff.section]: pendingDiff.after,
      });
    } else if (siteDetails) {
      setSiteDetails({
        ...siteDetails,
        template_id: "TEMPLATE_DYNAMIC",
      });
    }

    if (pendingDiff.nextDesignToken) {
      setDesignToken(pendingDiff.nextDesignToken);
      setLatestAiDesignToken(pendingDiff.nextDesignToken);
    }
    setPendingDiff(null);
    pushToast(`Hasil AI untuk ${pendingDiff.section === "design" ? "gaya situs" : pendingDiff.section} dipakai.`, "success");
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
    const currentOrder = getOrderedSections(designToken, content).filter((key) => BODY_SECTION_KEYS.includes(key));
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

  const hiddenSections: string[] = designToken?.layout?.hidden_sections ?? [];

  const toggleSectionVisibility = (key: string) => {
    // header, footer, seo cannot be hidden
    if (["header", "footer", "seo"].includes(key)) return;
    const current: string[] = designToken?.layout?.hidden_sections ?? [];
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    setDesignToken({
      ...(designToken || {}),
      layout: {
        ...(designToken?.layout || {}),
        hidden_sections: next,
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

  const handlePreviewSelectSection = useCallback((section: string) => {
    selectSection(section, false);
    if (window.innerWidth < 768) {
      setSheetExpanded(true);
    } else {
      setMobileView("edit");
    }
  }, [selectSection]);

  const handleAiRegenerateSection = () => handleAiRegenerateForSection(activeTab);

  const handleAiRegenerateDesign = async () => {
    if (!token || !activeTenantId || !siteId) return;
    if (!aiDesignInstructions.trim()) return;

    try {
      setAiLoading(true);
      const res = await request<any>("/ai/regenerate-design", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          instructions: aiDesignInstructions,
          tenant_id: activeTenantId,
        }),
      }, token);

      if (res.status === "success" && res.data?.design_token) {
        const newDesignToken = res.data.design_token;
        const diffRows = summarizeDiff(designTokenRef.current || {}, newDesignToken);
        if (diffRows.length === 0) {
          pushToast("AI belum menghasilkan perubahan gaya yang nyata.", "info");
          return;
        }

        setPendingDiff({
          section: "design",
          before: cloneData(designTokenRef.current),
          after: newDesignToken,
          previousDesignToken: cloneData(designTokenRef.current),
          nextDesignToken: newDesignToken,
          rows: diffRows,
        });

        // Temporarily apply the design token in preview
        setDesignToken(newDesignToken);

        pushToast("AI selesai mendesain ulang gaya situs. Cek hasil visual sebelum disimpan.", "success");
        setAiDesignInstructions("");
        setAiDesignPromptOpen(false);
      } else {
        throw new Error(res.message || "AI gagal memproses desain.");
      }
    } catch (err: any) {
      pushToast(err.message || "AI gagal meregenerasi gaya website.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  // Helper updates for form fields
  const updateField = (section: string, key: string, val: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: val
      }
    }));
  };

  const updateDesignTokenField = (group: "palette" | "typography" | "layout", key: string, value: any) => {
    let nextToken = { ...(designToken || {}) };

    // Switch to TEMPLATE_DYNAMIC and prefill defaults if we edit manual styles on static templates
    if (siteDetails.template_id !== "TEMPLATE_DYNAMIC") {
      const defaults = getTemplateDefaultDesignToken(siteDetails.template_id);
      nextToken = {
        ...defaults,
        ...nextToken,
        palette: { ...defaults.palette, ...(nextToken.palette || {}) },
        typography: { ...defaults.typography, ...(nextToken.typography || {}) },
        layout: { ...defaults.layout, ...(nextToken.layout || {}) }
      };
      setSiteDetails({ ...siteDetails, template_id: "TEMPLATE_DYNAMIC" });
    }

    nextToken[group] = {
      ...(nextToken[group] || {}),
      [key]: value
    };

    setDesignToken(nextToken);
  };

  const handleColorChange = (colorKey: string, value: string) => {
    const oldValue = designToken?.palette?.[colorKey] || "";
    if (oldValue && oldValue !== value) {
      setColorUndo(prev => ({ ...prev, [colorKey]: oldValue }));
    }
    updateDesignTokenField("palette", colorKey, value);
  };

  const undoColor = (colorKey: string) => {
    const oldValue = colorUndo[colorKey];
    if (oldValue) {
      updateDesignTokenField("palette", colorKey, oldValue);
      setColorUndo(prev => {
        const next = { ...prev };
        delete next[colorKey];
        return next;
      });
    }
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

  const orderedSectionKeys = getOrderedSections(designToken, content);
  const SECTIONS = orderedSectionKeys
    .filter((key) => {
      // Only show menu/catalog tabs when content actually has them
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
  const pageOrderSections = SECTIONS;
  const quality = collectQualityIssues(content);
  const issuePaths = new Set(quality.issues.map((issue) => issue.path));
  const activeSuggestions = AI_SUGGESTIONS[activeTab] ?? AI_SUGGESTIONS.hero;
  const aiPlaceholder = activeSuggestions[0] || "Buat copy lebih jelas dan meyakinkan...";
  const fieldClass = (path: string, base: string) => `${base} ${issuePaths.has(path)
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
    <div className="flex w-screen h-screen overflow-hidden bg-[#0d0f14] text-slate-100">
      {/* ── Main editor split ── */}
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
              <h1 className="truncate text-[13px] font-bold tracking-tight text-slate-100">{siteDetails.name}</h1>
            </div>
          </div>

          {/* Tab Switcher: Konten vs Desain */}
          <div className="flex border-b border-white/10 p-1 bg-white/[0.02] flex-shrink-0">
            <button
              onClick={() => setEditorTab("content")}
              className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${editorTab === "content"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              Konten
            </button>
            <button
              onClick={() => setEditorTab("design")}
              className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${editorTab === "design"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              Desain
            </button>
          </div>

          {/* Visual style selector */}
          {editorTab === "design" && (
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
                        className={`group w-full rounded-xl border p-2 text-left transition ${isTopActive
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
                        className={`group w-full rounded-xl border p-2 text-left transition ${active
                            ? "border-violet-400 bg-violet-500/15"
                            : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
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
                              className={`group w-full rounded-xl border p-2 text-left transition ${active
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

              {!templatePickerOpen && (
                <div className="mt-2 space-y-1.5">
                  {!aiDesignPromptOpen ? (
                    <button
                      type="button"
                      onClick={() => setAiDesignPromptOpen(true)}
                      disabled={aiLoading || !!pendingDiff}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-300 text-[11px] font-semibold hover:bg-violet-500/20 transition disabled:opacity-50"
                    >
                      <Sparkles className="h-3 w-3" />
                      Regenerate dengan AI
                    </button>
                  ) : (
                    <div className="space-y-1.5 rounded-lg border border-violet-500/20 bg-violet-500/5 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400">AI Design Prompt</span>
                        <button
                          type="button"
                          onClick={() => setAiDesignPromptOpen(false)}
                          className="text-[9px] text-slate-400 hover:text-slate-200"
                        >
                          Batal
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
                        className="w-full px-2 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400 placeholder:text-slate-700"
                        disabled={aiLoading || !!pendingDiff}
                      />
                      <button
                        type="button"
                        onClick={() => void handleAiRegenerateDesign()}
                        disabled={aiLoading || !aiDesignInstructions.trim() || !!pendingDiff}
                        className="w-full py-1.5 flex items-center justify-center gap-1 rounded bg-violet-600 text-white text-[11px] font-semibold hover:bg-violet-500 transition disabled:opacity-50"
                      >
                        {aiLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {aiLoading ? "Memproses..." : "Terapkan Gaya"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Section nav — persistent list */}
          <div className="flex-shrink-0 border-b border-white/10 hidden md:block">
            <div className="px-3 py-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Bagian halaman</p>
            </div>
            <div className="flex flex-col max-h-[180px] overflow-y-auto scrollbar-none">
              {SECTIONS.map(({ key, label, icon: Icon, num }) => (
                <div
                  key={key}
                  draggable={BODY_SECTION_KEYS.includes(key) && !pendingDiff}
                  onDragStart={(event) => {
                    if (!BODY_SECTION_KEYS.includes(key) || pendingDiff) return;
                    setDraggingSection(key);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", key);
                  }}
                  onDragOver={(event) => {
                    if (!draggingSection || !BODY_SECTION_KEYS.includes(key) || pendingDiff) return;
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
                  onClick={() => { if (!pendingDiff) selectSection(key, true); }}
                  className={`group flex items-center gap-2 px-3 py-[7px] cursor-pointer transition-colors ${
                    activeTab === key
                      ? "bg-violet-500/15"
                      : hiddenSections.includes(key)
                        ? "opacity-40 hover:opacity-60"
                        : "hover:bg-white/[0.03]"
                  }`}
                >
                  <GripVertical className={`h-3 w-3 shrink-0 ${BODY_SECTION_KEYS.includes(key) ? "text-slate-600" : "text-slate-800"}`} />
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${activeTab === key ? "text-violet-300" : "text-slate-500"}`} />
                  <span className={`flex-1 text-[12px] truncate ${activeTab === key ? "text-slate-100 font-medium" : hiddenSections.includes(key) ? "line-through text-slate-600" : "text-slate-400"}`}>
                    {label}
                  </span>
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
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                    activeTab === key ? "bg-violet-600/30 text-violet-200" : "bg-white/5 text-slate-500"
                  }`}>{num}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Field Panel (scrollable) ── */}
          <div
            className="flex-1 border-t border-white/10 flex flex-col overflow-hidden [&_input]:!border-white/10 [&_textarea]:!border-white/10 [&_select]:!border-white/10 [&_input]:!bg-[#05070b] [&_textarea]:!bg-[#05070b] [&_select]:!bg-[#05070b] [&_input]:!text-slate-100 [&_textarea]:!text-slate-100 [&_select]:!text-slate-100 [&_input::placeholder]:!text-slate-700 [&_textarea::placeholder]:!text-slate-700"
            style={{ minHeight: 0 }}
          >
            {editorTab === "design" ? (
              <>
                <div className="px-3.5 py-2 border-b border-white/10 flex-shrink-0">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
                    Kustomisasi Visual
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 relative bg-[#111318] text-slate-100">
                  {/* Palet Warna */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Palet Warna</p>

                    {/* Primary Color */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Warna Utama (Primary)</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                        <input
                          type="color"
                          value={designToken?.palette?.primary || "#4F46E5"}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          ref={(el) => { colorRefs.current["primary"] = el; }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full animate-fade-in" style={{ backgroundColor: designToken?.palette?.primary || "#4F46E5" }} />
                      </div>
                      <input
                        type="text"
                        value={designToken?.palette?.primary || ""}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        onClick={() => colorRefs.current["primary"]?.click()}
                        className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400 cursor-pointer"
                        placeholder="#4F46E5"
                      />
                      {colorUndo["primary"] && (
                        <button type="button" onClick={() => undoColor("primary")} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 transition-colors" title="Kembalikan warna">
                          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      )}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Warna Aksen (Accent)</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                        <input
                          type="color"
                          value={designToken?.palette?.accent || "#7C3AED"}
                          onChange={(e) => handleColorChange("accent", e.target.value)}
                          ref={(el) => { colorRefs.current["accent"] = el; }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full animate-fade-in" style={{ backgroundColor: designToken?.palette?.accent || "#7C3AED" }} />
                      </div>
                      <input
                        type="text"
                        value={designToken?.palette?.accent || ""}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                        onClick={() => colorRefs.current["accent"]?.click()}
                        className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400 cursor-pointer"
                        placeholder="#7C3AED"
                      />
                      {colorUndo["accent"] && (
                        <button type="button" onClick={() => undoColor("accent")} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 transition-colors" title="Kembalikan warna">
                          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      )}
                      </div>
                    </div>

                    {/* Background Color */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Warna Latar (Background)</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                        <input
                          type="color"
                          value={designToken?.palette?.background || "#FAF7F2"}
                          onChange={(e) => handleColorChange("background", e.target.value)}
                          ref={(el) => { colorRefs.current["background"] = el; }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full animate-fade-in" style={{ backgroundColor: designToken?.palette?.background || "#FAF7F2" }} />
                      </div>
                      <input
                        type="text"
                        value={designToken?.palette?.background || ""}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        onClick={() => colorRefs.current["background"]?.click()}
                        className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400 cursor-pointer"
                        placeholder="#FAF7F2"
                      />
                      {colorUndo["background"] && (
                        <button type="button" onClick={() => undoColor("background")} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 transition-colors" title="Kembalikan warna">
                          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      )}
                      </div>
                    </div>

                    {/* Surface Color */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Warna Permukaan (Surface)</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                        <input
                          type="color"
                          value={designToken?.palette?.surface || "#FFFFFF"}
                          onChange={(e) => handleColorChange("surface", e.target.value)}
                          ref={(el) => { colorRefs.current["surface"] = el; }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full animate-fade-in" style={{ backgroundColor: designToken?.palette?.surface || "#FFFFFF" }} />
                      </div>
                      <input
                        type="text"
                        value={designToken?.palette?.surface || ""}
                        onChange={(e) => handleColorChange("surface", e.target.value)}
                        onClick={() => colorRefs.current["surface"]?.click()}
                        className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400 cursor-pointer"
                        placeholder="#FFFFFF"
                      />
                      {colorUndo["surface"] && (
                        <button type="button" onClick={() => undoColor("surface")} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 transition-colors" title="Kembalikan warna">
                          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      )}
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Warna Teks (Text)</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                        <input
                          type="color"
                          value={designToken?.palette?.text || "#2C2C2A"}
                          onChange={(e) => handleColorChange("text", e.target.value)}
                          ref={(el) => { colorRefs.current["text"] = el; }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full animate-fade-in" style={{ backgroundColor: designToken?.palette?.text || "#2C2C2A" }} />
                      </div>
                      <input
                        type="text"
                        value={designToken?.palette?.text || ""}
                        onChange={(e) => handleColorChange("text", e.target.value)}
                        onClick={() => colorRefs.current["text"]?.click()}
                        className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400 cursor-pointer"
                        placeholder="#2C2C2A"
                      />
                      {colorUndo["text"] && (
                        <button type="button" onClick={() => undoColor("text")} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 transition-colors" title="Kembalikan warna">
                          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-2" />

                  {/* Tipografi */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tipografi (Google Fonts)</p>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Font Heading</label>
                      <select
                        value={designToken?.typography?.heading_font || "Inter"}
                        onChange={(e) => updateDesignTokenField("typography", "heading_font", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        {GOOGLE_FONTS_WHITELIST.map((font) => (
                          <option key={font} value={font} className="bg-[#111318]">
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Font Body</label>
                      <select
                        value={designToken?.typography?.body_font || "Inter"}
                        onChange={(e) => updateDesignTokenField("typography", "body_font", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        {GOOGLE_FONTS_WHITELIST.map((font) => (
                          <option key={font} value={font} className="bg-[#111318]">
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Ketebalan Heading</label>
                      <select
                        value={designToken?.typography?.heading_weight || "700"}
                        onChange={(e) => updateDesignTokenField("typography", "heading_weight", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        <option value="400" className="bg-[#111318]">Regular (400)</option>
                        <option value="500" className="bg-[#111318]">Medium (500)</option>
                        <option value="600" className="bg-[#111318]">Semi-Bold (600)</option>
                        <option value="700" className="bg-[#111318]">Bold (700)</option>
                        <option value="800" className="bg-[#111318]">Extra-Bold (800)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Ukuran Hero Title</label>
                      <select
                        value={designToken?.typography?.heading_size_hero || "3rem"}
                        onChange={(e) => updateDesignTokenField("typography", "heading_size_hero", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        <option value="2rem" className="bg-[#111318]">Kecil (2rem)</option>
                        <option value="2.5rem" className="bg-[#111318]">Sedang (2.5rem)</option>
                        <option value="3rem" className="bg-[#111318]">Besar (3rem)</option>
                        <option value="3.5rem" className="bg-[#111318]">Sangat Besar (3.5rem)</option>
                        <option value="4rem" className="bg-[#111318]">Maksimal (4rem)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-2" />

                  {/* Tata Letak & Gaya */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tata Letak & Gaya</p>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Sudut Border (Radius)</label>
                      <select
                        value={designToken?.layout?.corner_radius || "soft"}
                        onChange={(e) => updateDesignTokenField("layout", "corner_radius", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        <option value="sharp" className="bg-[#111318]">Tajam (0px)</option>
                        <option value="soft" className="bg-[#111318]">Lembut (8px)</option>
                        <option value="rounded" className="bg-[#111318]">Bulat (20px)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Jarak Seksi (Spacing)</label>
                      <select
                        value={designToken?.layout?.section_spacing || "normal"}
                        onChange={(e) => updateDesignTokenField("layout", "section_spacing", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        <option value="compact" className="bg-[#111318]">Rapat (Compact)</option>
                        <option value="normal" className="bg-[#111318]">Normal</option>
                        <option value="relaxed" className="bg-[#111318]">Longgar (Relaxed)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Gaya Hero</label>
                      <select
                        value={designToken?.layout?.hero_style || "centered"}
                        onChange={(e) => updateDesignTokenField("layout", "hero_style", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-violet-400"
                      >
                        <option value="centered" className="bg-[#111318]">Centered</option>
                        <option value="split" className="bg-[#111318]">Split Screen</option>
                        <option value="full-bleed" className="bg-[#111318]">Full Bleed</option>
                        <option value="minimal" className="bg-[#111318]">Minimalist</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="px-3.5 py-2 border-b border-white/10 flex-shrink-0 flex items-center justify-between gap-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
                    Edit — {SECTIONS.find(s => s.key === activeTab)?.label ?? activeTab}
                  </p>
                  {activeTab !== "seo" && activeTab !== "header" && activeTab !== "footer" && (
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(activeTab)}
                      title={hiddenSections.includes(activeTab) ? "Tampilkan section" : "Sembunyikan section"}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all hover:bg-white/10"
                      style={{ color: hiddenSections.includes(activeTab) ? "#f87171" : "#94a3b8" }}
                    >
                      {hiddenSections.includes(activeTab)
                        ? <><EyeOff className="w-3 h-3" /> Tersembunyi</>
                        : <><Eye className="w-3 h-3" /> Sembunyikan</>
                      }
                    </button>
                  )}
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
                    <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2.5 text-[11px] leading-relaxed text-amber-100 space-y-2">
                      <div className="flex items-center justify-between gap-2 border-b border-amber-400/10 pb-1.5">
                        <span className="font-bold">⚠️ {quality.issues.length} field perlu dicek</span>
                        <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-semibold">{quality.score}%</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {quality.issues.map((issue) => (
                          <button
                            key={issue.path}
                            type="button"
                            onClick={() => {
                              const section = issue.path.split(".")[0];
                              selectSection(section);
                              setTimeout(() => {
                                const el = document.getElementById(`field-${issue.path}`);
                                if (el) {
                                  el.focus();
                                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }, 100);
                            }}
                            className="inline-flex items-center gap-1 rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-medium text-amber-200 hover:bg-amber-400/30 active:scale-95 transition cursor-pointer"
                          >
                            <span>{issue.label}</span>
                            <span className="text-[9px] opacity-60">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <SectionForms
                    activeTab={activeTab}
                    content={content}
                    updateField={updateField}
                    needsAttention={needsAttention}
                    fieldClass={fieldClass}
                    token={token}
                    activeTenantId={activeTenantId}
                    siteId={siteId}
                  />

                </div>

                {/* ── AI Prompt bar inside field panel ── */}
                <div className="border-t border-white/10 flex-shrink-0 bg-[#111318] flex flex-col px-3.5 py-2.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                      <span className="truncate text-[10px] font-bold uppercase tracking-widest text-violet-300">
                        AI untuk {SECTIONS.find(s => s.key === activeTab)?.label ?? activeTab}
                      </span>
                    </div>
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
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !pendingDiff) handleAiRegenerateSection(); }}
                      placeholder={aiPlaceholder}
                      disabled={aiLoading || !!pendingDiff}
                      className="flex-1 h-8 px-2.5 border border-violet-500/25 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400 placeholder:text-slate-700 disabled:opacity-50"
                    />
                    <button
                      onClick={handleAiRegenerateSection}
                      disabled={aiLoading || !!pendingDiff}
                      className="h-8 px-3 flex items-center justify-center gap-1 rounded-md bg-[#7c3aed] text-white text-[11px] font-semibold hover:bg-violet-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {aiLoading ? (
                        <Loader2 className="w-3 h-3 flex-shrink-0 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                      )}
                      Regen
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* ════ RIGHT CANVAS ════ */}
        <div
          className={`absolute inset-0 z-30 flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#0d0f14] transition-transform duration-300 ease-out md:relative md:inset-auto md:z-0 md:translate-x-0 ${
            mobileView === "preview" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Mobile topbar */}
          <div className="flex md:hidden h-[52px] flex-shrink-0 items-center gap-2.5 border-b border-white/10 bg-[#111318] px-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard/sites")}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all active:scale-95"
              aria-label="Kembali"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[13px] font-bold tracking-tight text-slate-100">{siteDetails?.name}</h1>
            </div>
            <div className="flex items-center gap-1.5">
              {autosaveStatus !== "idle" && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${autosaveStatus === "saving" ? "text-amber-300" : autosaveStatus === "saved" ? "text-emerald-400" : "text-red-300"}`}>
                  {autosaveStatus === "saving" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                  {autosaveStatus === "saved" && <Check className="w-2.5 h-2.5" />}
                  {autosaveStatus === "saving" ? "Menyimpan..." : autosaveStatus === "saved" ? "Tersimpan" : "Gagal"}
                </span>
              )}
              {siteDetails?.status !== "published" && (
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="flex h-7 items-center gap-1 rounded-lg px-3 text-[11px] font-semibold text-white"
                  style={{ background: "#7c3aed" }}
                >
                  <Rocket className="w-3 h-3" />
                  Publish
                </button>
              )}
            </div>
          </div>

          {/* Canvas topbar */}
          <div className="hidden md:flex h-10 flex-shrink-0 items-center gap-2 border-b border-white/10 bg-[#0d0f14] px-3">
            {/* Device switcher */}
            <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
              <button
                onClick={() => setDevice("desktop")}
                className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device === "desktop" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                aria-label="Preview desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device === "mobile" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                aria-label="Preview mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Completion score */}
            <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${quality.score >= 85
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : quality.score >= 65
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`} title={quality.issues.slice(0, 5).map((issue) => issue.label).join(", ")}>
              {quality.score < 100 ? "⚠️" : "✓"} {quality.score}%
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Autosave status */}
            {autosaveStatus !== "idle" && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${autosaveStatus === "saving" ? "text-amber-300" :
                  autosaveStatus === "saved" ? "text-emerald-400" :
                    "text-red-300"
                }`}>
                {autosaveStatus === "saving" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                {autosaveStatus === "saved" && <Check className="w-2.5 h-2.5" />}
                {autosaveStatus === "error" && <AlertCircle className="w-2.5 h-2.5" />}
                {autosaveStatus === "saving" ? "Menyimpan..." :
                  autosaveStatus === "saved" ? "Tersimpan" :
                    "Gagal simpan"}
              </span>
            )}

            {/* Preview link */}
            <a
              href={`/s/${siteDetails.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Globe className="h-3.5 w-3.5" />
              Preview
            </a>

            {/* Save button */}
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
              style={{ background: "#1D9E75" }}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </button>
            {/* Publish button */}
            {siteDetails?.status !== "published" && (
              <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-white transition-colors hover:brightness-110"
                style={{ background: "#7c3aed" }}
              >
                <Rocket className="w-3.5 h-3.5" />
                Publikasikan
              </button>
            )}
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

          {/* Canvas body — edge-to-edge white on dark bg, like the wizard right panel */}
          <div id="preview-scroll-container" className="flex-1 min-h-0 overflow-y-auto bg-[#0d0f14] flex items-start justify-center pb-[48vh] md:pb-0"
            onScroll={() => {
              if (sheetExpanded) { setSheetExpanded(false); return; }
              const container = document.getElementById("preview-scroll-container");
              if (!container) return;
              const scrollTop = container.scrollTop;
              const containerHeight = container.clientHeight;
              const centerY = scrollTop + containerHeight / 2;
              let bestSection = activeTab;
              let bestDistance = Infinity;
              for (const sec of pageOrderSections) {
                const el = document.querySelector(`[id^="section-preview-${sec.key}"]`) as HTMLElement | null;
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const elCenter = rect.top + rect.height / 2;
                  const dist = Math.abs(elCenter - containerHeight / 2);
                  if (dist < bestDistance) { bestDistance = dist; bestSection = sec.key; }
                }
              }
              if (bestSection !== activeTab && bestDistance < containerHeight * 0.6) {
                setActiveTab(bestSection);
              }
            }}
          >
            {pendingDiff && (
              <style dangerouslySetInnerHTML={{
                __html: `
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
              /* Mobile: centered with some margin */
              <div className="relative mx-auto my-6 h-[760px] w-[375px] flex-shrink-0 rounded-[40px] border-[12px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800 transition-all duration-300">
                {/* Speaker/Notch */}
                <div className="absolute left-1/2 top-3 z-50 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-900" />
                {/* Screen container */}
                <div
                  className="h-full w-full overflow-hidden rounded-[28px] bg-white relative z-10"
                  style={{ transform: "translate3d(0, 0, 0)", isolation: "isolate" }}
                >
                  <div
                    style={{
                      width: "181.81%",
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
              /* Desktop: full width, no padding — site fills the canvas edge-to-edge */
              <div className="w-full overflow-hidden">
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

          {/* Mobile bottom sheet */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-50 flex flex-col bg-[#111318] border-t border-white/10 rounded-t-[22px] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out"
            style={{ maxHeight: sheetExpanded ? "88%" : "48%" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
              onClick={() => setSheetExpanded(!sheetExpanded)}
            >
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            {/* Section pills row */}
            <div id="mobile-section-pills" className="flex gap-1.5 px-3.5 py-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
              {pageOrderSections.map((sec) => (
                <button
                  key={sec.key}
                  data-section-key={sec.key}
                  type="button"
                  onClick={() => selectSection(sec.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-[10px] font-semibold transition-all ${
                    activeTab === sec.key
                      ? "bg-violet-500/15 border-violet-500/30 text-violet-200"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold"
                    style={{
                      background: activeTab === sec.key ? "#7c3aed" : "rgba(255,255,255,0.08)",
                      color: activeTab === sec.key ? "white" : "#64748b"
                    }}
                  >
                    {sec.num}
                  </span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Tab switcher */}
            <div className="flex mx-3.5 mt-1 rounded-[10px] p-0.5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
              <button
                type="button"
                onClick={() => setEditorTab("content")}
                className={`flex-1 h-7 flex items-center justify-center rounded-[7px] text-[11px] font-bold transition-all ${
                  editorTab === "content" ? "bg-[#7c3aed] text-white" : "text-slate-400"
                }`}
              >
                Konten
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("design")}
                className={`flex-1 h-7 flex items-center justify-center rounded-[7px] text-[11px] font-bold transition-all ${
                  editorTab === "design" ? "bg-[#7c3aed] text-white" : "text-slate-400"
                }`}
              >
                Desain
              </button>
            </div>

            {/* Quality bar (Konten tab only) */}
            {editorTab === "content" && quality.issues.length > 0 && (
              <div className="flex items-center gap-2 mx-3.5 mt-2 px-2.5 py-1.5 rounded-lg flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <span className="text-[10px] font-bold text-amber-400">{quality.score}%</span>
                <span className="flex-1 text-[9px] text-amber-200/80">{quality.issues.length} field perlu diisi</span>
                <div className="flex gap-1">
                  {quality.issues.slice(0, 4).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
                  ))}
                </div>
              </div>
            )}

            {/* Form scrollable area */}
            <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-2.5 scrollbar-none">
              {editorTab === "content" ? (
                <SectionForms
                  activeTab={activeTab}
                  content={content}
                  updateField={updateField}
                  needsAttention={needsAttention}
                  fieldClass={fieldClass}
                  token={token}
                  activeTenantId={activeTenantId}
                  siteId={siteId}
                />
              ) : (
                <div className="space-y-3 pb-2">
                  {/* Palette */}
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Palet Warna</p>
                  {["primary", "accent", "background", "surface", "text"].map((colorKey) => (
                    <div key={colorKey} className="flex items-center gap-2">
                      <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 w-20 shrink-0">
                        {colorKey === "primary" ? "Primary" : colorKey === "accent" ? "Accent" : colorKey === "background" ? "Latar" : colorKey === "surface" ? "Surface" : "Teks"}
                      </label>
                      <div className="relative w-7 h-7 rounded-md border border-white/15 overflow-hidden shrink-0">
                        <input type="color" value={designToken?.palette?.[colorKey] || "#4F46E5"}
                          onChange={(e) => handleColorChange(colorKey, e.target.value)}
                          ref={(el) => { colorRefs.current[`mobile-${colorKey}`] = el; }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        <div className="w-full h-full" style={{ backgroundColor: designToken?.palette?.[colorKey] || "#4F46E5" }} />
                      </div>
                      <input type="text" value={designToken?.palette?.[colorKey] || ""}
                        onChange={(e) => handleColorChange(colorKey, e.target.value)}
                        onClick={() => colorRefs.current[`mobile-${colorKey}`]?.click()}
                        className="flex-1 h-7 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400 cursor-pointer" />
                      {colorUndo[colorKey] && (
                        <button type="button" onClick={() => undoColor(colorKey)} className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 transition-colors" title="Kembalikan warna">
                          <RotateCcw className="h-3 w-3 text-slate-400" />
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Typography */}
                  <div className="border-t border-white/10 my-2" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Tipografi</p>
                  <div className="space-y-2">
                    <select value={designToken?.typography?.heading_font || "Inter"}
                      onChange={(e) => updateDesignTokenField("typography", "heading_font", e.target.value)}
                      className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400">
                      {GOOGLE_FONTS_WHITELIST.map((f) => <option key={f} value={f} className="bg-[#111318]">{f}</option>)}
                    </select>
                    <select value={designToken?.typography?.body_font || "Inter"}
                      onChange={(e) => updateDesignTokenField("typography", "body_font", e.target.value)}
                      className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400">
                      {GOOGLE_FONTS_WHITELIST.map((f) => <option key={f} value={f} className="bg-[#111318]">{f}</option>)}
                    </select>
                    <select value={designToken?.typography?.heading_weight || "700"}
                      onChange={(e) => updateDesignTokenField("typography", "heading_weight", e.target.value)}
                      className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400">
                      {["400", "500", "600", "700", "800"].map((w) => <option key={w} value={w} className="bg-[#111318]">Weight {w}</option>)}
                    </select>
                  </div>
                  {/* Layout */}
                  <div className="border-t border-white/10 my-2" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Tata Letak</p>
                  <select value={designToken?.layout?.corner_radius || "soft"}
                    onChange={(e) => updateDesignTokenField("layout", "corner_radius", e.target.value)}
                    className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400">
                    <option value="sharp">Tajam (0px)</option><option value="soft">Lembut (8px)</option><option value="rounded">Bulat (20px)</option>
                  </select>
                  <select value={designToken?.layout?.section_spacing || "normal"}
                    onChange={(e) => updateDesignTokenField("layout", "section_spacing", e.target.value)}
                    className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-violet-400">
                    <option value="compact">Rapat</option><option value="normal">Normal</option><option value="relaxed">Longgar</option>
                  </select>
                </div>
              )}
            </div>

            {/* AI bar sticky bottom */}
            <div className="flex-shrink-0 px-3.5 pb-3 pt-2 border-t border-white/10 bg-[#111318] space-y-1.5">
              {activeSuggestions.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {activeSuggestions.slice(0, 3).map((chip) => (
                    <button
                      key={chip} type="button"
                      onClick={() => setAiInstructions(chip)}
                      disabled={!!pendingDiff}
                      className="flex-shrink-0 px-2 py-1 rounded-full border border-violet-400/20 bg-violet-400/10 text-[9px] font-medium text-violet-100 hover:bg-violet-400/20 disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <input
                  type="text" value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !pendingDiff) handleAiRegenerateSection(); }}
                  placeholder={aiPlaceholder}
                  disabled={aiLoading || !!pendingDiff}
                  className="flex-1 h-9 px-3 border border-violet-500/25 bg-[#05070b] text-slate-100 rounded-[10px] text-[11px] outline-none focus:border-violet-400 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAiRegenerateSection}
                  disabled={aiLoading || !!pendingDiff}
                  className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#7c3aed] text-white disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop floating publish button */}
          {siteDetails?.status !== "published" && (
            <button
              type="button"
              onClick={() => setPublishModalOpen(true)}
              className="hidden md:flex absolute bottom-6 right-6 z-40 items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(124,58,237,0.35)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 active:brightness-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <Rocket className="w-4 h-4 animate-bounce" style={{ animationDuration: "2.8s" }} />
              Publikasikan Website
            </button>
          )}
        </div>

      </div>

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
          onClose={() => {
            setShowCongrats(false);
            router.push("/dashboard/sites");
          }}
        />
      )}
    </div>
  );
}

/* ── Publish Modal (Dialog) Helper ─────────────────────────────────────── */
interface PublishModalProps {
  site: {
    name: string;
    subdomain: string;
  };
  onConfirm: (subdomain: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function PublishModal({ site, onConfirm, onCancel, loading }: PublishModalProps) {
  const [subdomain, setSubdomain] = useState(() => {
    if (site.subdomain.startsWith("draft-")) return "";
    return site.subdomain;
  });

  const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(cleaned);
  };

  const isInputValid = subdomainRegex.test(subdomain);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;
    onConfirm(subdomain);
  };

  const previewDomain = subdomain.trim() ? `${subdomain.trim().toLowerCase()}.webjoz.com` : "";

  return (
    <Dialog
      open={!!site}
      onOpenChange={(open) => {
        if (!open && !loading) onCancel();
      }}
      title="Publikasikan Website"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Celebration Header Banner */}
        <div className="bg-gradient-to-tr from-[#6f6fff]/10 to-[#a855f7]/10 border border-[#6f6fff]/20 rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#6f6fff]/10 blur-2xl rounded-full pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6f6fff] to-[#a855f7] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(111,111,255,0.3)]">
            <Rocket className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h4 className="text-[13.5px] font-bold text-white leading-snug">
              Satu Langkah Lagi! 🚀
            </h4>
            <p className="text-[11.5px] text-[#9b9ba5] leading-relaxed mt-0.5">
              Website <span className="text-[#a9bcff] font-semibold">{site.name}</span> Anda siap untuk dipublikasikan ke seluruh dunia.
            </p>
          </div>
        </div>

        {/* Subdomain Input Field */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#c8c8d4] tracking-wide block">
            Nama Subdomain
          </label>
          <div
            className={`flex items-center bg-[#0b0b0d] border rounded-xl overflow-hidden transition-all duration-200 ${
              subdomain && !isInputValid
                ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/[0.01]"
                : subdomain && isInputValid
                  ? "border-[#3ddc84]/50 shadow-[0_0_10px_rgba(61,220,132,0.15)] bg-[#3ddc84]/[0.01]"
                  : "border-white/10 hover:border-white/20 focus-within:border-[#6f6fff] focus-within:shadow-[0_0_12px_rgba(111,111,255,0.2)]"
            }`}
          >
            <input
              type="text"
              value={subdomain}
              onChange={handleSubdomainChange}
              disabled={loading}
              placeholder="namaanda"
              maxLength={30}
              className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none placeholder:text-[#6b6b75] min-w-0 font-medium"
              autoFocus
            />
            <span className="px-3 py-2.5 text-[13px] text-[#8fa8ff] font-mono font-bold shrink-0 border-l border-white/[0.06] bg-white/[0.02] select-none">
              .webjoz.com
            </span>
          </div>

          {previewDomain && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-mono transition-all ${
                isInputValid
                  ? "bg-[#3ddc84]/8 text-[#5fe3a0] border border-[#3ddc84]/20"
                  : "bg-red-500/8 text-[#ff8a8a] border border-red-500/20"
              }`}
            >
              <span className="shrink-0 text-[14px]">{isInputValid ? "✓" : "⚠"}</span>
              <span className="truncate leading-none">
                {isInputValid
                  ? `Tersedia: https://${previewDomain}`
                  : "Gunakan huruf kecil, angka, atau tanda hubung (-)"}
              </span>
            </div>
          )}

          <p className="text-[11px] text-[#6b6b75] leading-relaxed mx-0.5">
            Hanya huruf kecil, angka, dan tanda hubung. Subdomain tidak bisa diubah setelah dipublikasikan.
          </p>
        </div>

        {/* Custom Domain premium upselling banner */}
        <div className="bg-[#15151c] border border-white/[0.06] hover:border-white/10 rounded-xl p-4 flex gap-3 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-[#6f6fff]/10 to-transparent blur-xl pointer-events-none" />
          <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 text-[#8fa8ff] group-hover:text-white transition-colors">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div className="space-y-1">
            <h5 className="text-[12px] font-bold text-white flex items-center gap-1.5 leading-none">
              Hubungkan Custom Domain <span className="text-[9px] px-1.5 py-0.5 bg-[#6f6fff] text-white rounded font-extrabold uppercase shrink-0 tracking-wider">Premium</span>
            </h5>
            <p className="text-[11.5px] text-[#9a9aa3] leading-relaxed">
              Ingin brand yang lebih profesional seperti <strong>domainanda.com</strong>? Anda dapat mengaturnya di{" "}
              <Link
                href="/dashboard/domains"
                className="text-[#8fa8ff] font-semibold hover:text-white underline underline-offset-2 transition-colors"
                onClick={onCancel}
              >
                Pengaturan Domain
              </Link>{" "}
              setelah website Anda live.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 text-sm border-white/10 hover:bg-white/[0.04]"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className={`flex-1 rounded-xl h-11 text-[13.5px] font-bold border-0 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isInputValid || loading
                ? "bg-[#2a2a2a] text-[#6b6b75] cursor-not-allowed"
                : "bg-gradient-to-r from-[#6f6fff] to-[#8c8cff] hover:from-[#5a5ae8] hover:to-[#7a7aff] text-white shadow-[0_4px_14px_rgba(111,111,255,0.25)] hover:shadow-[0_4px_18px_rgba(111,111,255,0.35)] transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
            disabled={loading || !isInputValid}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Meluncurkan...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 animate-bounce" style={{ animationDuration: "2.5s" }} />
                Luncurkan Website
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/* ── Congrats Celebration Modal (Dialog) Helper ──────────────────────────── */
interface CongratsModalProps {
  site: {
    name: string;
    subdomain: string;
  };
  onClose: () => void;
}

function CongratsModal({ site, onClose }: CongratsModalProps) {
  const [copied, setCopied] = useState(false);

  const displayDomain = (() => {
    const host = typeof window !== "undefined" ? window.location.host : "";
    let domainPart = "webjoz.com";
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      domainPart = host.substring(host.indexOf(".") + 1) || "webjoz.com";
    }
    return `${site.subdomain}.${domainPart}`;
  })();

  const siteUrl = (() => {
    const subdomain = site.subdomain;
    if (typeof window === "undefined") return `http://localhost:3000/s/${subdomain}`;
    const host = window.location.host;
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return `http://localhost:3000/s/${subdomain}`;
    }
    const domainPart = host.substring(host.indexOf(".") + 1);
    return `https://${subdomain}.${domainPart || "webjoz.com"}`;
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="🎉 Selamat! Website Anda Telah Live"
    >
      <div className="space-y-6 text-center py-4">
        {/* Celebration Anim/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3ddc84] to-[#6f6fff] flex items-center justify-center shadow-[0_0_30px_rgba(61,220,132,0.4)] relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
            <Rocket className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: "2.5s" }} />
          </div>
        </div>

        <div className="space-y-2 max-w-sm mx-auto">
          <h3 className="text-xl font-bold text-white tracking-tight">Website Anda Resmi Mengudara!</h3>
          <p className="text-sm text-[#9b9ba5] leading-relaxed">
            Selamat! Halaman web <span className="text-[#8fa8ff] font-semibold">{site.name}</span> Anda sekarang aktif dan dapat diakses dari mana saja di seluruh dunia.
          </p>
        </div>

        {/* Clickable Subdomain Link Box */}
        <div className="bg-[#15151c] border border-white/[0.08] rounded-2xl p-5 space-y-3.5 max-w-md mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-[#3ddc84]/10 to-transparent blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between gap-3 bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Globe className="w-4 h-4 text-[#3ddc84] shrink-0" />
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-white font-mono font-bold hover:text-[#3ddc84] hover:underline truncate block text-left"
                title="Buka Website"
              >
                {displayDomain}
              </a>
            </div>
            
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 bg-white/[0.04] border border-white/10 text-[#9b9ba5] hover:text-white hover:bg-white/[0.08] rounded-lg transition-all shrink-0 cursor-pointer flex items-center justify-center"
              title="Salin Link"
            >
              {copied ? <Check className="w-4 h-4 text-[#3ddc84]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11.5px] text-[#9b9ba5] leading-relaxed m-0 text-left">
            💡 <strong>Ingin mengecek?</strong> Klik link di atas untuk membuka website live Anda di tab baru.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 max-w-sm mx-auto pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 text-[13.5px] border-white/10 hover:bg-white/[0.04]"
            onClick={onClose}
          >
            Selesai
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-xl h-11 text-[13.5px] font-bold bg-[#6f6fff] hover:bg-[#5a5ae8] text-white border-0 cursor-pointer shadow-[0_4px_14px_rgba(111,111,255,0.3)] flex items-center justify-center gap-2"
            onClick={() => window.open(siteUrl, "_blank")}
          >
            <Globe className="w-4 h-4" /> Buka Website
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
