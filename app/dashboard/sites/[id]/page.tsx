"use client";

import { Dialog } from "@/components/ui/dialog";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import {
  Save, Loader2, Zap, Database,
  HelpCircle, AlertCircle,
  Monitor, Smartphone, Tablet, Layout, Globe, ChevronLeft, ChevronDown, ChevronUp, Check, GripVertical, RotateCcw,
  Eye, EyeOff, Pencil, Send, Rocket, Copy, Sun, Moon
} from "lucide-react";
import { SparkleIcon, SparkleGenAI } from "@/components/sparkle-icon";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { getTemplate, TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { getTemplateDefaultDesignToken } from "@/lib/template-defaults";
import { setEditorSiteId } from "@/components/templates/shared";
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
  isDesignTokenEqual,
  getAutoHiddenSections,
  getSectionScore
} from "./editor-utils";
import TemplateThumbnail from "./TemplateThumbnail";
import { loadGoogleFont } from "@/components/templates/helpers";
import SectionForms from "./SectionForms";
import FontPicker from "./components/FontPicker";
import PublishModal from "./modals/PublishModal";
import CongratsModal from "./modals/CongratsModal";
import { SiteSubNav } from "@/components/site-sub-nav";

import {
 type TypographyPairing,
 type ColorPattern,
 type IndustryPreset,
 getEnabledTypographyPairings,
 getEnabledColorPatterns,
 getEnabledIndustryPresets,
 getHiddenSections,
 getEnabledVariants,
} from "@/lib/design-assets-config";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";

import TypographyPairingPicker from "./components/TypographyPairingPicker";
import ColorPatternPicker from "./components/ColorPatternPicker";
import IndustryPresetPicker from "./components/IndustryPresetPicker";

export default function SiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

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
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobileView, setMobileView] = useState<"edit" | "preview">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "preview" : "edit"
  );
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);
  const [sectionNavCollapsed, setSectionNavCollapsed] = useState(false);
  const [aiPromptCollapsed, setAiPromptCollapsed] = useState(true);
  const activeTabRef = useRef(activeTab);
  const shouldScrollToActiveRef = useRef(false);
  const templatePickerRef = useRef<HTMLDivElement | null>(null);
  const sectionDropdownRef = useRef<HTMLDivElement | null>(null);
  const colorRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const designContentRef = useRef<HTMLDivElement | null>(null);

  // Site details & content
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [designToken, setDesignToken] = useState<any>(null);
  const contentRef = useRef<any>(null);
  const designTokenRef = useRef<any>(null);
  const [latestAiDesignToken, setLatestAiDesignToken] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<Array<{ section: string; previousContent: any; previousDesignToken: any }>>([]);

  const [globalUndo, setGlobalUndo] = useState<any[]>([]);
  const [designTokenScore, setDesignTokenScore] = useState(0);
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
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const fetchCustomTemplates = async (reset = false) => {
    if (!token || !activeTenantId || !siteId) return;
    // Only superadmin can access template library
    const role = (() => { try { return JSON.parse(atob(token.split(".")[1]))?.role } catch { } })();
    if (role !== "superadmin") return;
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
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState<"ai_regenerate" | "ai_design" | "ai_suggestion">("ai_regenerate");
  const [aiDesignInstructions, setAiDesignInstructions] = useState("");

  // Usage meter
  const [tenantUsage, setTenantUsage] = useState<{
    usage: { generate_count: number; regen_count: number };
    max_ai_generates: number;
    max_ai_regens: number;
    max_sites: number;
  } | null>(null);

  const UPGRADE_COPY: Record<string, { title: string; body: string }> = {
    ai_regenerate: {
      title: "Regenerasi AI — fitur Pro",
      body: "Regenerasi ulang konten section dengan AI tersedia tanpa batas di paket Pro.",
    },
    ai_design: {
      title: "Desain ulang dengan AI — fitur Pro",
      body: "Minta AI mengubah gaya, warna, dan layout website Anda secara instan di paket Pro.",
    },
    ai_suggestion: {
      title: "Saran instruksi AI — fitur Pro",
      body: "Gunakan saran instruksi siap pakai untuk mempercepat proses AI di paket Pro.",
    },
  };

  const requirePremium = useCallback(async (context: "ai_regenerate" | "ai_design" | "ai_suggestion", action: () => any) => {
    try {
      await action();
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        setUpgradeContext(context);
        setUpgradePromptOpen(true);
        return;
      }
      throw err;
    }
  }, []);

  // ── Inline AI prompt modal (replaces window.prompt) ─────────────────────────
  const [aiPromptModal, setAiPromptModal] = useState<{
    section: string;
    resolve: (value: string | null) => void;
  } | null>(null);
  const [aiPromptInput, setAiPromptInput] = useState("");

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

      // Fetch blog posts
      let blogPosts: any[] = [];
      try {
        const blogRes = await request<any>(`/sites/${siteId}/blog-posts`, {
          headers: { "X-Tenant-ID": activeTenantId.toString() }
        }, token);
        if (blogRes.status === "success" && Array.isArray(blogRes.data)) {
          blogPosts = blogRes.data;
        }
      } catch (e) {
        console.warn("Failed to load blog posts:", e);
      }

      // Fallback empty content scaffold if empty
      const data = stripRegeneratedMarkers(contentRes.data?.content || {});
      const fetchedDesignToken = contentRes.data?.design_token || null;
      const defaultTileStyle = (() => {
        if (!fetchedDesignToken) return "default";
        const mood = (fetchedDesignToken.mood || "").toLowerCase();
        const bg = fetchedDesignToken.palette?.background || "";
        const isDark = bg.startsWith("#") && parseInt(bg.slice(1), 16) < 0x444444;
        if (isDark || mood.includes("dark") || mood.includes("premium") || mood.includes("bold")) return "dark";
        if (mood.includes("natural") || mood.includes("warm") || mood.includes("earthy") || mood.includes("fresh")) return "light";
        return "default";
      })();
      const fallback = {
        header: { brand_name: "", nav_cta_text: "", logo_url: "", icon: "" },
        hero: { headline: "", subheadline: "", cta_text: "", cta_url: "", image_url: "", matra: "", eyebrow: "", badge_text: "", cta_secondary_text: "", opening_hours: "", launch_label: "" },
        about: { title: "", body: "", image_url: "", icon: "" },
        benefits: { title: "", items: [] },
        testimonials: { title: "", items: [] },
        // NOTE: faq is intentionally NOT in the fallback — it is an optional section.
        cta: { headline: "", button_text: "", button_url: "" },
        contact: { title: "", address: "", phone: "", email: "", show_lead_form: true, show_map: true, map_tile_style: defaultTileStyle },
        footer: { brand_name: "", tagline: "", copyright_text: "" },
        seo: { title: "", description: "", favicon_url: "", og_image_url: "" }
      };

      const siteName: string = siteRes.data?.name || "Bisnis Kami";
      const finalContent = {
        ...fallback,
        ...data,
        header: { ...fallback.header, ...data.header },
        hero: { ...fallback.hero, ...data.hero, matra: data.hero?.matra ?? "" },
        about: {
          ...fallback.about,
          ...data.about,
          // Defensive: ensure body is never blank after DB load
          body: data.about?.body || `${siteName} hadir untuk memberikan layanan terbaik bagi Anda. Kami berkomitmen menghadirkan pengalaman yang memuaskan dan terpercaya bagi setiap pelanggan.`,
        },
        benefits: {
          ...fallback.benefits,
          ...data.benefits,
          // Defensive: ensure benefit cards are never empty after DB load
          items: (data.benefits?.items && data.benefits.items.length > 0)
            ? data.benefits.items
            : [
                { title: "Layanan Terpercaya", description: `${siteName} mengutamakan kepuasan pelanggan dalam setiap langkah pelayanan.`, icon: "shield" },
                { title: "Pengalaman Teruji", description: "Sudah melayani banyak pelanggan dengan hasil yang konsisten dan memuaskan.", icon: "star" },
                { title: "Mudah Dihubungi", description: "Tim kami siap membantu Anda kapan saja melalui berbagai saluran komunikasi.", icon: "message-circle" },
              ],
        },
        // Preserve optional sections as-is (only include when present in fetched data)
        ...(data.faq ? { faq: { title: "", items: [], ...data.faq } } : {}),
        cta: { ...fallback.cta, ...data.cta },
        contact: { ...fallback.contact, ...data.contact },
        footer: {
          ...fallback.footer,
          ...data.footer,
          tagline: data.footer?.tagline || `Layanan terbaik dari ${siteName} untuk Anda.`,
        },
        seo: { ...fallback.seo, ...data.seo },
        // Preserve optional sections as-is
        ...(data.testimonials ? { testimonials: data.testimonials } : {}),
        ...(data.menu ? { menu: data.menu } : {}),
        ...(data.catalog ? { catalog: data.catalog } : {}),
        blog: blogPosts.length > 0 ? { posts: blogPosts } : undefined,
      };

      setContent(finalContent);

      // Load design token if available
      let resolvedDesignToken = fetchedDesignToken;
      if (fetchedDesignToken) {
        // Auto-hide optional sections (FAQ, Gallery, Testimoni, etc.) whose
        // content arrays are empty, so the editor canvas stays uncluttered.
        // The user can reveal any section via the eye icon in the sidebar.
        // NOTE: We don't auto-hide based on section_order alone — a user who
        // deliberately reveals a section and adds content must not lose it
        // on reload. section_order is enforced by filterEmptySections on
        // the live site, not here.
        const existingHidden: string[] = fetchedDesignToken?.layout?.hidden_sections ?? [];
        const autoHide = getAutoHiddenSections(finalContent, existingHidden);
        if (autoHide.length > 0) {
          resolvedDesignToken = {
            ...fetchedDesignToken,
            layout: {
              ...(fetchedDesignToken.layout ?? {}),
              hidden_sections: [...existingHidden, ...autoHide],
            },
          };
        }
        setDesignToken(resolvedDesignToken);
        setLatestAiDesignToken(resolvedDesignToken);
      }
      setDesignTokenScore(contentRes.data?.design_token_score ?? (fetchedDesignToken ? 100 : 0));

      // Save initial loaded state for comparison
      lastSavedRef.current = {
        content: finalContent,
        designToken: resolvedDesignToken,
        siteDetails: siteRes.data
      };

      // Fetch custom templates library
      void fetchCustomTemplates(true);

      // Fetch usage data
      try {
        const usageRes = await request<any>(`/tenants/${activeTenantId}/usage`, {}, token);
        if (usageRes.status === "success" && usageRes.data) {
          setTenantUsage(usageRes.data);
        }
      } catch {
        // silently fail — usage meter is non-critical
      }

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

  // Sync page title for editor preview (favicon not shown during preview)
  useEffect(() => {
    if (!content) return;

    const siteTitle = content?.seo?.title || siteDetails?.name;

    const originalTitle = document.title;
    if (siteTitle) {
      document.title = `${siteTitle} — Edit`;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [content?.seo?.title, siteDetails?.name]);

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
    const currentOrder = getOrderedSections(designToken, content, getHiddenSections()).filter((key) => BODY_SECTION_KEYS.includes(key));
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

  const refreshTenantUsage = useCallback(async () => {
    if (!token || !activeTenantId) return;
    try {
      const usageRes = await request<any>(`/tenants/${activeTenantId}/usage`, {}, token);
      if (usageRes.status === "success" && usageRes.data) {
        setTenantUsage(usageRes.data);
      }
    } catch {
      // silently fail — usage meter is non-critical
    }
  }, [token, activeTenantId]);

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
      const input = await new Promise<string | null>((resolve) => {
        setAiPromptInput("");
        setAiPromptModal({ section, resolve });
      });
      if (!input || !input.trim()) return;
      instructions = input;
    }

    try {
      setAiLoading(true);
      const currentVariant = designTokenRef.current?.layout?.section_variants?.[section];
      const res = await request<any>("/ai/regenerate-section", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          section: section,
          instructions: instructions,
          tenant_id: activeTenantId,
          section_variant: currentVariant || "",
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
        void refreshTenantUsage();
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
      setSheetCollapsed(false);
      setSheetExpanded(true);
    } else {
      setMobileView("edit");
    }
  }, [selectSection]);

  const handleAiRegenerateSection = () => handleAiRegenerateForSection(activeTab);
  const handleRegenWithPremiumCheck = useCallback((section: string) => {
    requirePremium("ai_regenerate", () => handleAiRegenerateForSection(section));
  }, [requirePremium, handleAiRegenerateForSection]);

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
        setLatestAiDesignToken(newDesignToken);
        if (res.data.design_token_score != null) {
          setDesignTokenScore(res.data.design_token_score);
        }

        pushToast("AI selesai mendesain ulang gaya situs. Cek hasil visual sebelum disimpan.", "success");
        setAiDesignInstructions("");
        setAiDesignPromptOpen(false);
        void refreshTenantUsage();
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
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      let next = { ...(prev || {}) };

      // Switch to TEMPLATE_DYNAMIC and prefill defaults if we edit manual styles on static templates
      if (siteDetails.template_id !== "TEMPLATE_DYNAMIC") {
        const defaults = getTemplateDefaultDesignToken(siteDetails.template_id);
        next = {
          ...defaults,
          ...next,
          palette: { ...defaults.palette, ...(next.palette || {}) },
          typography: { ...defaults.typography, ...(next.typography || {}) },
          layout: { ...defaults.layout, ...(next.layout || {}) }
        };
        setSiteDetails({ ...siteDetails, template_id: "TEMPLATE_DYNAMIC" });
      }

      next[group] = {
        ...(next[group] || {}),
        [key]: value
      };

      return next;
    });
  };

  const updateSectionVariant = (section: string, value: string) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = prev ? JSON.parse(JSON.stringify(prev)) : {};
      next.layout = {
        ...(next.layout || {}),
        section_variants: {
          ...(next.layout?.section_variants || {}),
          [section]: value,
        },
      };
      return next;
    });

    // If using a legacy template, switch to dynamic engine so the section component renders the variant
    if (siteDetails.template_id !== "TEMPLATE_DYNAMIC") {
      const defaults = getTemplateDefaultDesignToken(siteDetails.template_id);
      setDesignToken((prev: any) => {
        const next = prev ? JSON.parse(JSON.stringify(prev)) : {};
        next.palette = { ...defaults.palette, ...(next.palette || {}) };
        next.typography = { ...defaults.typography, ...(next.typography || {}) };
        next.theme_mode = defaults.theme_mode;
        return next;
      });
      setSiteDetails({ ...siteDetails, template_id: "TEMPLATE_DYNAMIC" });
    }
  };

  const pushGlobalUndo = () => {
    if (!designToken) return;
    setGlobalUndo(prev => [JSON.parse(JSON.stringify(designToken)), ...prev].slice(0, 3));
  };

  const handleGlobalUndo = () => {
    if (!globalUndo.length) return;
    const [prev, ...rest] = globalUndo;
    setDesignToken(prev);
    setGlobalUndo(rest);
  };

  const applyTypographyBatch = (fields: Record<string, any>) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = { ...(prev || {}) };
      next.typography = { ...(next.typography || {}), ...fields };
      return next;
    });
  };

  const applyColorPattern = (pattern: ColorPattern) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = { ...(prev || {}) };
      next.palette = { ...(next.palette || {}), ...pattern.palette };
      if (pattern.theme_mode) {
        next.theme_mode = pattern.theme_mode;
      }
      return next;
    });
  };

  const applyIndustryPreset = (preset: IndustryPreset) => {
    const pairing = getEnabledTypographyPairings().find((p) => p.id === preset.pairing_id);
    const pattern = getEnabledColorPatterns().find((p) => p.id === preset.pattern_id);
    if (!pairing || !pattern) return;
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = { ...(prev || {}) };
      next.palette = { ...(next.palette || {}), ...pattern.palette };
      if (pattern.theme_mode) {
        next.theme_mode = pattern.theme_mode;
      }
      next.typography = {
        ...(next.typography || {}),
        heading_font: pairing.heading_font,
        body_font: pairing.body_font,
        heading_weight: pairing.heading_weight,
        heading_size_hero: pairing.heading_size_hero,
        heading_style: pairing.heading_style ?? "normal",
        heading_transform: pairing.heading_transform ?? "none",
        heading_tracking: pairing.heading_tracking ?? "normal",
      };
      return next;
    });
  };

  const handleColorChange = (colorKey: string, value: string) => {
    updateDesignTokenField("palette", colorKey, value);
  };

  // Inform shared NavMenu of the current siteId so the Blog nav link
  // resolves to /preview/[id]/blog instead of an absolute /blog.
  // Must be unconditional — placed before any early returns.
  React.useEffect(() => {
    setEditorSiteId(siteId);
    return () => setEditorSiteId(null);
  }, [siteId]);

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
          className={`absolute inset-0 z-20 flex h-full w-full flex-shrink-0 flex-col overflow-hidden border-r bg-[#111318] shadow-xl transition-transform duration-300 ease-out md:relative md:inset-auto md:z-10 md:w-[380px] md:translate-x-0 ${mobileView === "preview" ? "-translate-x-full" : "translate-x-0"
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
                ? "bg-primary text-primary-foreground shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200"
                }`}
            >
              Konten
            </button>
            <button
              onClick={() => setEditorTab("design")}
              className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${editorTab === "design"
                ? "bg-primary text-primary-foreground shadow-sm font-bold"
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
                {templateSaving && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
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
                          ? "border-primary bg-primary/15"
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
                          ? "border-primary bg-primary/15"
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
                          {active && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />}
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
                                ? "border-primary bg-primary/15"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              void fetchCustomTemplates(false);
                            }}
                            disabled={loadingTemplates}
                            className="w-full py-2.5 text-center text-[11px] font-bold text-primary hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 rounded-xl hover:bg-white/[0.02] disabled:opacity-60 flex items-center justify-center gap-1.5"
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
                      onClick={() => {
                        requirePremium("ai_design", () => setAiDesignPromptOpen(true));
                      }}
                      disabled={aiLoading || !!pendingDiff}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition disabled:opacity-50"
                    >
                      <SparkleGenAI className="h-[18px] w-[18px]" />
                      Regenerate dengan AI
                    </button>
                  ) : (
                    <div className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary">AI Design Prompt</span>
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
                        className="w-full px-2 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60 placeholder:text-slate-700"
                        disabled={aiLoading || !!pendingDiff}
                      />
                      <button
                        type="button"
                        onClick={() => void handleAiRegenerateDesign()}
                        disabled={aiLoading || !aiDesignInstructions.trim() || !!pendingDiff}
                        className="w-full py-1.5 flex items-center justify-center gap-1 rounded bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {aiLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <SparkleGenAI className="w-[18px] h-[18px]" />
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
                    className={`group flex items-center gap-2 px-3 py-[7px] cursor-pointer transition-colors ${activeTab === key
                        ? "bg-primary/15"
                        : hiddenSections.includes(key)
                          ? "opacity-40 hover:opacity-60"
                          : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <GripVertical className={`h-3 w-3 shrink-0 ${BODY_SECTION_KEYS.includes(key) ? "text-slate-600" : "text-slate-800"}`} />
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${activeTab === key ? "text-primary" : "text-slate-500"}`} />
                    <span className={`flex-1 text-[12px] truncate ${activeTab === key ? "text-slate-100 font-medium" : hiddenSections.includes(key) ? "line-through text-slate-600" : "text-slate-400"}`}>
                      {label}
                    </span>
                    {key === "seo" && !(activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise") && (
                      <span className="text-[7px] px-1 py-0.5 bg-primary/30 text-primary rounded font-extrabold uppercase tracking-wider leading-none ml-1">
                        Pro
                      </span>
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
                      {["header", "footer", "seo"].includes(key) ? null : (() => {
                        const score = getSectionScore(content, key);
                        if (score >= 100) return null;
                        const color = score >= 85 ? "bg-emerald-500" : score >= 65 ? "bg-amber-500" : "bg-red-500";
                        return <div className={`w-1.5 h-1.5 rounded-full ${color}`} title={`Kualitas: ${score}%`} />;
                      })()}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${activeTab === key ? "bg-primary/30 text-primary" : "bg-white/5 text-slate-500"
                        }`}>{num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <div ref={designContentRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 relative bg-[#111318] text-slate-100">
                  {/* Palet Warna */}
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
                          if (latestAiDesignToken.theme_mode) {
                            next.theme_mode = latestAiDesignToken.theme_mode;
                          }
                          return next;
                        });
                      }}
                    />

                    <div className="border-t border-white/10 my-2" />

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
                          className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60 cursor-pointer"
                          placeholder="#4F46E5"
                        />
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
                          className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60 cursor-pointer"
                          placeholder="#7C3AED"
                        />
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
                          className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60 cursor-pointer"
                          placeholder="#FAF7F2"
                        />
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
                          className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60 cursor-pointer"
                          placeholder="#FFFFFF"
                        />
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
                          className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60 cursor-pointer"
                          placeholder="#2C2C2A"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-2" />

                  {/* Paket Tampilan */}
                  <IndustryPresetPicker
                    designToken={designToken}
                    aiDesignToken={latestAiDesignToken}
                    designTokenScore={designTokenScore}
                    onApply={applyIndustryPreset}
                    onRestoreAi={() => {
                      if (!latestAiDesignToken?.palette || !latestAiDesignToken?.typography) return;
                      pushGlobalUndo();
                      setDesignToken((prev: any) => {
                        const next = { ...(prev || {}) };
                        next.palette = { ...(next.palette || {}), ...latestAiDesignToken.palette };
                        if (latestAiDesignToken.theme_mode) {
                          next.theme_mode = latestAiDesignToken.theme_mode;
                        }
                        next.typography = { ...(next.typography || {}), ...latestAiDesignToken.typography };
                        return next;
                      });
                    }}
                  />

                  <div className="border-t border-white/10 my-2" />

                  {/* Tipografi */}
                  <TypographyPairingPicker
                    designToken={designToken}
                    aiDesignToken={latestAiDesignToken}
                    designTokenScore={designTokenScore}
                    onApply={(pairing) => {
                      applyTypographyBatch({
                        heading_font: pairing.heading_font,
                        body_font: pairing.body_font,
                        heading_weight: pairing.heading_weight,
                        heading_size_hero: pairing.heading_size_hero,
                        heading_style: pairing.heading_style ?? "normal",
                        heading_transform: pairing.heading_transform ?? "none",
                        heading_tracking: pairing.heading_tracking ?? "normal",
                      });
                    }}
                    onRestoreAi={() => {
                      if (!latestAiDesignToken?.typography) return;
                      pushGlobalUndo();
                      setDesignToken((prev: any) => {
                        const next = { ...(prev || {}) };
                        next.typography = { ...(next.typography || {}), ...latestAiDesignToken.typography };
                        return next;
                      });
                    }}
                    onFieldChange={(section, field, value) => updateDesignTokenField(section as any, field, value)}
                  />

                  <div className="border-t border-white/10 my-2" />

                  {/* Tata Letak & Gaya */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tata Letak & Gaya</p>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Sudut Border (Radius)</label>
                      <select
                        value={designToken?.layout?.corner_radius || "soft"}
                        onChange={(e) => updateDesignTokenField("layout", "corner_radius", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
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
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
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
                        className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
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
                  <div className="flex items-center gap-1">
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
                    <button
                      type="button"
                      onClick={() => setSectionNavCollapsed(v => !v)}
                      title={sectionNavCollapsed ? "Tampilkan Bagian Halaman" : "Perluas area edit"}
                      className="flex items-center justify-center w-6 h-6 rounded transition-all hover:bg-white/10 text-slate-500 hover:text-slate-300"
                    >
                      {sectionNavCollapsed
                        ? <ChevronDown className="w-3.5 h-3.5" />
                        : <ChevronUp className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 relative">
                  {pendingDiff ? (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#070b12]/95 p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <SparkleGenAI className="h-9 w-9 animate-pulse" />
                      </div>
                      <h4 className="text-[14px] font-bold text-slate-100">Review AI Sedang Aktif</h4>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400 max-w-[200px]">
                        Silakan gunakan atau kembalikan perubahan AI pada seksi{" "}
                        <span className="font-bold text-primary">
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
                    isPremium={isPremium}
                    onUpgradeRequired={() => setUpgradePromptOpen(true)}
                    designToken={designToken}
                    updateDesignTokenLayout={(key, value) => updateDesignTokenField("layout", key, value)}
                    onAiSuccess={refreshTenantUsage}
                  />

                  {/* Variasi tampilan per section */}
                  {SECTION_VARIANT_OPTIONS[activeTab] && (() => {
                    const allVars = SECTION_VARIANT_OPTIONS[activeTab];
                    const enabledOpts = allVars.filter(opt => getEnabledVariants(activeTab, allVars.map(o => o.value)).includes(opt.value));
                    if (enabledOpts.length <= 1) return null;
                    return (
                      <div className="pt-3 border-t border-white/10 space-y-1.5">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Variasi Tampilan</p>
                        <select
                          value={designToken?.layout?.section_variants?.[activeTab] || enabledOpts[0].value}
                          onChange={(e) => updateSectionVariant(activeTab, e.target.value)}
                          className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60"
                        >
                          {(() => {
                            const groups: { label?: string; options: typeof enabledOpts }[] = [];
                            let cur: { label?: string; options: typeof enabledOpts } | null = null;
                            for (const opt of enabledOpts) {
                              if (opt.group) {
                                if (!cur || cur.label !== opt.group) { cur = { label: opt.group, options: [] }; groups.push(cur); }
                                cur.options.push(opt);
                              } else { cur = null; groups.push({ options: [opt] }); }
                            }
                            return groups.map((g) =>
                              g.label ? (
                                <optgroup key={g.label} label={g.label}>
                                  {g.options.map(o => <option key={o.value} value={o.value} className="bg-[#111318]">{o.label}</option>)}
                                </optgroup>
                              ) : (
                                g.options.map(o => <option key={o.value} value={o.value} className="bg-[#111318]">{o.label}</option>)
                              )
                            );
                          })()}
                        </select>
                      </div>
                    );
                  })()}

                </div>

                {/* ── Usage Meter ── */}
                {tenantUsage && (
                  <div className="border-t border-white/10 px-3.5 py-2.5 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Database className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        AI Usage
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Generate</span>
                          <span className="font-semibold text-slate-200">
                            {tenantUsage.usage.generate_count} / {tenantUsage.max_ai_generates <= 0 ? "∞" : tenantUsage.max_ai_generates}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{
                              width: tenantUsage.max_ai_generates <= 0
                                ? 100
                                : Math.min((tenantUsage.usage.generate_count / tenantUsage.max_ai_generates) * 100, 100),
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Regenerasi</span>
                          <span className="font-semibold text-slate-200">
                            {tenantUsage.usage.regen_count} / {tenantUsage.max_ai_regens <= 0 ? "∞" : tenantUsage.max_ai_regens}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all duration-500"
                            style={{
                              width: tenantUsage.max_ai_regens <= 0
                                ? 100
                                : Math.min((tenantUsage.usage.regen_count / tenantUsage.max_ai_regens) * 100, 100),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── AI Prompt bar inside field panel ── */}
                <div className={`border-t border-white/10 flex-shrink-0 bg-[#111318] flex flex-col px-3.5 transition-all duration-300 ${aiPromptCollapsed ? 'py-2' : 'py-2.5 space-y-2'}`}>
                  <div
                    onClick={aiPromptCollapsed ? () => setAiPromptCollapsed(false) : undefined}
                    className={`flex items-center justify-between gap-2 ${aiPromptCollapsed ? 'cursor-pointer select-none' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <SparkleGenAI className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="truncate text-[10px] font-bold uppercase tracking-widest text-primary">
                        AI untuk {SECTIONS.find(s => s.key === activeTab)?.label ?? activeTab}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {undoStack.length > 0 && !aiPromptCollapsed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            undoLastRegen();
                          }}
                          className="flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-white/5"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Undo
                        </button>
                      )}
                      {!aiPromptCollapsed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAiPromptCollapsed(true);
                          }}
                          title="Sembunyikan AI Prompt"
                          className="flex items-center justify-center w-6 h-6 rounded transition-all hover:bg-white/10 text-slate-500 hover:text-slate-300"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {!aiPromptCollapsed && (
                    <>
                      <div className="flex flex-wrap gap-1">
                        {activeSuggestions.slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              requirePremium("ai_suggestion", () => setAiInstructions(suggestion));
                            }}
                            disabled={!!pendingDiff}
                            className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-left text-[10px] font-medium text-primary hover:bg-primary/20 disabled:opacity-50 disabled:pointer-events-none"
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !pendingDiff) {
                              requirePremium("ai_regenerate", handleAiRegenerateSection);
                            }
                          }}
                          placeholder={aiPlaceholder}
                          disabled={aiLoading || !!pendingDiff}
                          className="flex-1 h-8 px-2.5 border border-primary bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60 placeholder:text-slate-700 disabled:opacity-50"
                        />
                        <button
                          onClick={() => {
                            requirePremium("ai_regenerate", handleAiRegenerateSection);
                          }}
                          disabled={aiLoading || !!pendingDiff}
                          className="h-8 px-3 flex items-center justify-center gap-1 rounded-md bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {aiLoading ? (
                            <Loader2 className="w-3 h-3 flex-shrink-0 animate-spin" />
                          ) : (
                            <SparkleGenAI className="w-[18px] h-[18px] flex-shrink-0" />
                          )}
                          Regen
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

        </div>

        {/* ════ RIGHT CANVAS ════ */}
        <div
          className={`absolute inset-0 z-30 flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#0d0f14] transition-transform duration-300 ease-out md:relative md:inset-auto md:z-0 md:translate-x-0 ${mobileView === "preview" ? "translate-x-0" : "translate-x-full"
            }`}
          style={{
            // Mobile: float above the bottom sheet drawer
            // Desktop: float just above the sticky publish footer (~56px = 3.5rem)
            "--floating-bottom-mobile": sheetCollapsed ? "3.5rem" : sheetExpanded ? "90vh" : "50vh",
            "--floating-bottom-desktop": "5rem",
          } as React.CSSProperties}
        >          {/* Mobile topbar */}
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
              {siteDetails?.status === "published" ? (
                <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="flex h-7 items-center gap-1 rounded-lg px-3 text-[11px] font-semibold text-primary-foreground"
                  style={{ background: "var(--primary)" }}
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
              <div className="relative group">
                <button
                  onClick={() => setDevice("desktop")}
                  className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device === "desktop" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  aria-label="Preview desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <span className="pointer-events-none absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Desktop
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={() => setDevice("tablet")}
                  className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device === "tablet" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  aria-label="Preview tablet"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <span className="pointer-events-none absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Tablet
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={() => setDevice("mobile")}
                  className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device === "mobile" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  aria-label="Preview mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <span className="pointer-events-none absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Mobile
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-5 w-px bg-white/10" />

            {/* Theme toggle */}
            <div className="relative group">
              <button
                onClick={() => {
                  pushGlobalUndo();
                  setDesignToken((prev: any) => ({
                    ...(prev || {}),
                    theme_mode: prev?.theme_mode === 'dark' ? 'light' : 'dark',
                  }));
                }}
                className={`flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium transition-colors ${designToken?.theme_mode === 'dark'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                aria-label="Toggle dark mode"
              >
                {designToken?.theme_mode === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {designToken?.theme_mode === 'dark' ? 'Light' : 'Dark'}
              </button>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {designToken?.theme_mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              </span>
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

            {/* Global undo */}
            {globalUndo.length > 0 && (
              <button
                type="button"
                onClick={handleGlobalUndo}
                className="flex h-6 items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 text-[10px] font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Undo perubahan terakhir"
              >
                <RotateCcw className="h-3 w-3" />
                Undo
              </button>
            )}

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

            {/* Preview link — opens draft content */}
            <a
              href={`/preview/${siteId}`}
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
              className="flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:brightness-110 disabled:opacity-60"
              style={{ background: "var(--primary)" }}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </button>
            {/* Publish button / Live badge — right side */}
            {siteDetails?.status === "published" ? (
              <button
                type="button"
                onClick={() => {
                  if (!siteDetails?.subdomain) return;
                  const host = typeof window !== "undefined" ? window.location.host : "webjoz.com";
                  const domainPart = host.includes("localhost") || host.includes("127.0.0.1")
                    ? "webjoz.com"
                    : host.substring(host.indexOf(".") + 1);
                  window.open(`https://${siteDetails.subdomain}.${domainPart}`, "_blank");
                }}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Live
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:brightness-110"
                style={{ background: "var(--primary)" }}
              >
                <Rocket className="w-3.5 h-3.5" />
                Publikasikan
              </button>
            )}

            {/* Confirm apply to live modal */}
            {confirmPublishOpen && siteDetails && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111318] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                      <Rocket className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-100">Terapkan Perubahan ke Live?</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Pengunjung situs akan segera melihat versi terbaru.</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    Semua perubahan draf yang sudah disimpan akan diterapkan ke website live{" "}
                    <span className="font-semibold text-emerald-400">{siteDetails.subdomain}.webjoz.com</span>.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setConfirmPublishOpen(false)}
                      className="flex-1 rounded-xl border border-white/10 py-2 text-[12px] font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={publishing}
                      onClick={async () => {
                        setConfirmPublishOpen(false);
                        await handlePublishWithSubdomain(siteDetails.subdomain);
                      }}
                      className="flex-1 rounded-xl bg-emerald-600 py-2 text-[12px] font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-60"
                    >
                      {publishing ? "Menerapkan..." : "Ya, Terapkan"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {pendingDiff && (
            <div className="flex-shrink-0 border-b border-primary/20 bg-[#0b0f1a] px-3 py-2">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <SparkleGenAI className="h-5 w-5 text-primary" />
                    <p className="text-[12px] font-bold text-slate-100">
                      Diff AI: {SECTION_META[pendingDiff.section]?.label ?? pendingDiff.section}
                    </p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
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

          {/* ── AI Loading bar ── */}
          {aiLoading && !pendingDiff && (
            <div className="flex-shrink-0 border-b border-primary/20 bg-[#0b0f1a] px-4 py-2.5 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-slate-200">AI sedang memproses...</p>
                <div className="h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden max-w-xs">
                  <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          )}

          {/* Canvas body — edge-to-edge white on dark bg, like the wizard right panel */}
          <div id="preview-scroll-container" className="flex-1 min-h-0 overflow-y-auto bg-[#0d0f14] flex items-start justify-center pb-[48vh] md:pb-24"
            onClick={(e) => {
              // Collapse sheet when user taps the preview area on mobile
              const target = e.target as HTMLElement;
              const isSheet = target.closest('[data-mobile-sheet]');
              if (!isSheet && window.innerWidth < 768 && !sheetCollapsed) {
                setSheetCollapsed(true);
                setSheetExpanded(false);
              }
            }}
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
                  outline: 3px solid var(--primary);
                  outline-offset: -3px;
                  box-shadow: 0 0 25px color-mix(in srgb, var(--primary) 35%, transparent);
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
                      editorSiteId={siteId}
                      activeSection={activeTab}
                      onSelectSection={handlePreviewSelectSection}
                      onRegenSection={handleRegenWithPremiumCheck}
                      onSubmitLead={async () => { }}
                      isPremium={activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise"}
                    />
                  </div>
                </div>
                {/* Home Indicator line */}
                <div className="absolute bottom-2 left-1/2 z-50 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-700" />
              </div>
            ) : device === "tablet" ? (
              /* Tablet: centered with some margin */
              <div className="relative mx-auto my-6 h-[900px] w-[768px] flex-shrink-0 rounded-[24px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800 transition-all duration-300">
                {/* Camera notch */}
                <div className="absolute left-1/2 top-2 z-50 h-3 w-16 -translate-x-1/2 rounded-full bg-slate-900" />
                {/* Screen container */}
                <div
                  className="h-full w-full overflow-hidden rounded-[14px] bg-white relative z-10"
                  style={{ transform: "translate3d(0, 0, 0)", isolation: "isolate" }}
                >
                  <div
                    style={{
                      width: "150%",
                      height: "150%",
                      transform: "scale(0.667)",
                      transformOrigin: "top left"
                    }}
                    className="overflow-y-auto h-full"
                  >
                    <TemplateComponent
                      content={content}
                      design_token={designToken ?? null}
                      isEditorMode={true}
                      editorSiteId={siteId}
                      activeSection={activeTab}
                      onSelectSection={handlePreviewSelectSection}
                      onRegenSection={handleRegenWithPremiumCheck}
                      onSubmitLead={async () => { }}
                      isPremium={activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise"}
                    />
                  </div>
                </div>
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
                  onRegenSection={handleRegenWithPremiumCheck}
                  onSubmitLead={async () => { }}
                  isPremium={activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise"}
                />
              </div>
            )}
          </div>

          {/* Mobile bottom sheet */}
          <div
            data-mobile-sheet
            className="md:hidden absolute bottom-0 left-0 right-0 z-50 flex flex-col bg-[#111318] border-t border-white/10 rounded-t-[22px] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out overflow-hidden"
            style={{ maxHeight: sheetCollapsed ? "52px" : sheetExpanded ? "88%" : "48%" }}
          >
            {/* Drag handle / collapse bar — also shows section title when collapsed */}
            <div
              className="flex items-center justify-between px-4 pt-2.5 pb-2 flex-shrink-0 cursor-pointer select-none"
              onClick={() => {
                if (sheetCollapsed) {
                  setSheetCollapsed(false);
                } else {
                  setSheetExpanded(!sheetExpanded);
                }
              }}
            >
              {sheetCollapsed ? (
                <>
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    {pageOrderSections.find(s => s.key === activeTab)?.label ?? activeTab}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-9 h-1 rounded-full bg-white/20" />
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </>
              ) : (
                <div className="flex w-full justify-center">
                  <div className="w-9 h-1 rounded-full bg-white/20" />
                </div>
              )}
            </div>

            {/* Section pills row */}
            <div id="mobile-section-pills" className="flex gap-1.5 px-3.5 py-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
              {pageOrderSections.map((sec) => (
                <button
                  key={sec.key}
                  data-section-key={sec.key}
                  type="button"
                  onClick={() => selectSection(sec.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-[10px] font-semibold transition-all ${activeTab === sec.key
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold"
                    style={{
                      background: activeTab === sec.key ? "var(--primary)" : "rgba(255,255,255,0.08)",
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
                className={`flex-1 h-7 flex items-center justify-center rounded-[7px] text-[11px] font-bold transition-all ${editorTab === "content" ? "bg-primary text-primary-foreground" : "text-slate-400"
                  }`}
              >
                Konten
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("design")}
                className={`flex-1 h-7 flex items-center justify-center rounded-[7px] text-[11px] font-bold transition-all ${editorTab === "design" ? "bg-primary text-primary-foreground" : "text-slate-400"
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
                <>
                <SectionForms
                  activeTab={activeTab}
                  content={content}
                  updateField={updateField}
                  needsAttention={needsAttention}
                  fieldClass={fieldClass}
                  token={token}
                  activeTenantId={activeTenantId}
                  siteId={siteId}
                  isPremium={isPremium}
                  onUpgradeRequired={() => setUpgradePromptOpen(true)}
                  designToken={designToken}
                  updateDesignTokenLayout={(key, value) => updateDesignTokenField("layout", key, value)}
                  onAiSuccess={refreshTenantUsage}
                />
                {/* Variasi tampilan per section */}
                {SECTION_VARIANT_OPTIONS[activeTab] && (() => {
                  const allVars = SECTION_VARIANT_OPTIONS[activeTab];
                  const enabledOpts = allVars.filter(opt => getEnabledVariants(activeTab, allVars.map(o => o.value)).includes(opt.value));
                  if (enabledOpts.length <= 1) return null;
                  return (
                    <div className="pt-3 border-t border-white/10 space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Variasi Tampilan</p>
                      <select
                        value={designToken?.layout?.section_variants?.[activeTab] || enabledOpts[0].value}
                        onChange={(e) => updateSectionVariant(activeTab, e.target.value)}
                        className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60"
                      >
                        {(() => {
                          const groups: { label?: string; options: typeof enabledOpts }[] = [];
                          let cur: { label?: string; options: typeof enabledOpts } | null = null;
                          for (const opt of enabledOpts) {
                            if (opt.group) {
                              if (!cur || cur.label !== opt.group) { cur = { label: opt.group, options: [] }; groups.push(cur); }
                              cur.options.push(opt);
                            } else { cur = null; groups.push({ options: [opt] }); }
                          }
                          return groups.map((g) =>
                            g.label ? (
                              <optgroup key={g.label} label={g.label}>
                                {g.options.map(o => <option key={o.value} value={o.value} className="bg-[#111318]">{o.label}</option>)}
                              </optgroup>
                            ) : (
                              g.options.map(o => <option key={o.value} value={o.value} className="bg-[#111318]">{o.label}</option>)
                            )
                          );
                        })()}
                      </select>
                    </div>
                  );
                })()}
                </>
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
                        className="flex-1 h-7 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60 cursor-pointer" />
                    </div>
                  ))}
                  {/* Typography */}
                  <div className="border-t border-white/10 my-2" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Tipografi</p>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <FontPicker
                        value={designToken?.typography?.heading_font || "Inter"}
                        onChange={(v) => updateDesignTokenField("typography", "heading_font", v)}
                      />
                    </div>
                    <div className="space-y-1">
                      <FontPicker
                        value={designToken?.typography?.body_font || "Inter"}
                        onChange={(v) => updateDesignTokenField("typography", "body_font", v)}
                      />
                    </div>
                    <select value={designToken?.typography?.heading_weight || "700"}
                      onChange={(e) => updateDesignTokenField("typography", "heading_weight", e.target.value)}
                      className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60">
                      {["400", "500", "600", "700", "800"].map((w) => <option key={w} value={w} className="bg-[#111318]">Weight {w}</option>)}
                    </select>
                    <select value={designToken?.typography?.heading_size_hero || "3rem"}
                      onChange={(e) => updateDesignTokenField("typography", "heading_size_hero", e.target.value)}
                      className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60 text-[11px]">
                      <option value="2rem" className="bg-[#111318]">Ukuran Hero: Kecil</option>
                      <option value="2.5rem" className="bg-[#111318]">Ukuran Hero: Sedang</option>
                      <option value="3rem" className="bg-[#111318]">Ukuran Hero: Besar</option>
                      <option value="3.5rem" className="bg-[#111318]">Ukuran Hero: Sangat Besar</option>
                      <option value="4rem" className="bg-[#111318]">Ukuran Hero: Maksimal</option>
                    </select>
                  </div>
                  {/* Layout */}
                  <div className="border-t border-white/10 my-2" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Tata Letak</p>
                  <select value={designToken?.layout?.corner_radius || "soft"}
                    onChange={(e) => updateDesignTokenField("layout", "corner_radius", e.target.value)}
                    className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60">
                    <option value="sharp">Tajam (0px)</option><option value="soft">Lembut (8px)</option><option value="rounded">Bulat (20px)</option>
                  </select>
                  <select value={designToken?.layout?.section_spacing || "normal"}
                    onChange={(e) => updateDesignTokenField("layout", "section_spacing", e.target.value)}
                    className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60">
                    <option value="compact">Rapat</option><option value="normal">Normal</option><option value="relaxed">Longgar</option>
                  </select>
                  <select value={designToken?.layout?.hero_style || "centered"}
                    onChange={(e) => updateDesignTokenField("layout", "hero_style", e.target.value)}
                    className="w-full h-8 px-2 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[11px] outline-none focus:border-primary/60">
                    <option value="centered" className="bg-[#111318]">Hero: Centered</option>
                    <option value="split" className="bg-[#111318]">Hero: Split Screen</option>
                    <option value="full-bleed" className="bg-[#111318]">Hero: Full Bleed</option>
                    <option value="minimal" className="bg-[#111318]">Hero: Minimalist</option>
                  </select>
                <div className="border-t border-white/10 my-2" />
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
                      onClick={() => {
                        requirePremium("ai_suggestion", () => setAiInstructions(chip));
                      }}
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
                  type="text" value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !pendingDiff) {
                      requirePremium("ai_regenerate", handleAiRegenerateSection);
                    }
                  }}
                  placeholder={aiPlaceholder}
                  disabled={aiLoading || !!pendingDiff}
                  className="flex-1 h-9 px-3 border border-primary/25 bg-[#05070b] text-slate-100 rounded-[10px] text-[11px] outline-none focus:border-primary/60 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    requirePremium("ai_regenerate", handleAiRegenerateSection);
                  }}
                  disabled={aiLoading || !!pendingDiff}
                  className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SparkleGenAI className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        {/* Desktop sticky publish footer — inside canvas */}
        <div className="hidden md:flex flex-shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#0d0f14]/95 backdrop-blur px-6 py-1">
          <SiteSubNav siteId={siteId!} compact />
          <div className="flex items-center gap-3 flex-shrink-0">
            {siteDetails?.status === "published" ? (
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-emerald-400 font-medium">Live</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Draft</span>
            )}
            {siteDetails?.status === "published" ? (
              <button
                type="button"
                onClick={() => setConfirmPublishOpen(true)}
                disabled={publishing}
                className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_35%,transparent)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 disabled:opacity-70"
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
                className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_35%,transparent)] transition-all hover:scale-105 active:scale-95 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #000))" }}
              >
                <Rocket className="w-4 h-4 animate-bounce" style={{ animationDuration: "2.8s" }} />
                Publikasikan
              </button>
            )}
          </div>
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

      {/* ── Upgrade Prompt Modal ── */}
      <Dialog
        open={upgradePromptOpen}
        onOpenChange={setUpgradePromptOpen}
        title={UPGRADE_COPY[upgradeContext]?.title || "Fitur AI Only untuk Pro"}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-11 text-[13.5px] border-white/10 hover:bg-white/[0.04]"
              onClick={() => setUpgradePromptOpen(false)}
            >
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
            <p className="text-[14px] font-semibold text-slate-100">{UPGRADE_COPY[upgradeContext]?.body || "Fitur AI hanya tersedia untuk pengguna Pro."}</p>
            <p className="text-[12px] text-slate-400 mt-1">Dengan Pro, kamu bisa menggunakan AI Generate untuk konten, gambar, SEO, dan desain website.</p>
          </div>
        </div>
      </Dialog>

      {/* ── AI Prompt Modal (replaces window.prompt) ── */}
      {aiPromptModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-150"
          onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <SparkleGenAI className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-100 leading-tight">
                  Instruksi AI
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Apa yang ingin kamu ubah di bagian <span className="font-semibold text-primary capitalize">{SECTION_META[aiPromptModal.section]?.label ?? aiPromptModal.section}</span>?
                </p>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <input
                autoFocus
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && aiPromptInput.trim()) {
                    aiPromptModal.resolve(aiPromptInput.trim());
                    setAiPromptModal(null);
                  }
                  if (e.key === "Escape") {
                    aiPromptModal.resolve(null);
                    setAiPromptModal(null);
                  }
                }}
                placeholder={`cth. "buat lebih persuasif dan emosional"`}
                className="w-full px-4 py-3 border border-white/10 bg-[#05070b] text-slate-100 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-slate-600 transition-all"
              />
              {/* Quick suggestion chips */}
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

            {/* Actions */}
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
                onClick={() => {
                  if (!aiPromptInput.trim()) return;
                  aiPromptModal.resolve(aiPromptInput.trim());
                  setAiPromptModal(null);
                }}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_14px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
              >
                <SparkleGenAI className="h-5 w-5" />
                Generate AI
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}


