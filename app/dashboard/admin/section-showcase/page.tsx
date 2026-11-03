"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthToken } from "@/lib/auth-store";
import { useToast } from "@/components/toast-provider";
import {
  ShieldAlert,
  Layout,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Copy,
  Check,
  Sparkles,
  Search,
  Palette,
  RotateCcw,
  Sliders,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  ChevronRight,
  Maximize2,
  AlertTriangle,
  Expand,
  Minimize2,
  PanelLeft,
  PanelLeftClose,
  X,
  ArrowUp,
  Loader2,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toJpeg } from "html-to-image";
import { request } from "@/lib/api/client";
import { CartProvider } from "@/components/cart";
import { buildCssVars, loadGoogleFont } from "@/components/templates/helpers";
import type { DesignToken } from "@/components/templates/types";
import {
  SECTION_VARIANT_OPTIONS,
  getVariantLabel,
  getVariantDescription,
} from "@/components/sections/variant-registry";
import {
  loadDesignAssetsConfig,
  saveDesignAssetsConfig,
  updateCache,
  loadConfig,
  type DesignAssetsConfig,
  type VariantCritiqueResult,
} from "@/lib/design-assets-config";

// Section Components
import HeroSection from "@/components/sections/hero";
import AboutSectionInner from "@/components/sections/about";
import BenefitsSectionInner from "@/components/sections/benefits";
import FaqSectionInner from "@/components/sections/faq";
import CtaSectionInner from "@/components/sections/cta";
import ContactSectionInner from "@/components/sections/contact";
import MenuSectionInner from "@/components/sections/menu";
import CatalogSectionInner from "@/components/sections/catalog";
import TestimonialsSectionInner from "@/components/sections/testimonials";
import GallerySection from "@/components/sections/gallery";
import WorksSection from "@/components/sections/works";
import StatsSectionInner from "@/components/sections/stats";
import PartnersSectionInner from "@/components/sections/partners";
import PricingSectionInner from "@/components/sections/pricing";
import HeaderSection from "@/components/sections/header";
import FooterSection from "@/components/sections/footer";
import { BlogPostsSection } from "@/components/templates/blog-section";

import { SHOWCASE_PRESETS, MOCK_SHOWCASE_DATA, ShowcasePreset } from "./mock-data";

const SECTION_CONFIG_LIST: { id: string; name: string; icon: string }[] = [
  { id: "hero", name: "Hero", icon: "sparkles" },
  { id: "header", name: "Header", icon: "layout" },
  { id: "about", name: "About", icon: "info" },
  { id: "benefits", name: "Benefits", icon: "layers" },
  { id: "menu", name: "Menu (F&B)", icon: "utensils" },
  { id: "catalog", name: "Catalog (Produk)", icon: "shopping-bag" },
  { id: "works", name: "Works / Portfolio", icon: "briefcase" },
  { id: "gallery", name: "Gallery", icon: "image" },
  { id: "stats", name: "Stats / Numbers", icon: "bar-chart" },
  { id: "testimonials", name: "Testimonials", icon: "message-square" },
  { id: "partners", name: "Partners", icon: "users" },
  { id: "pricing", name: "Pricing", icon: "credit-card" },
  { id: "faq", name: "FAQ", icon: "help-circle" },
  { id: "cta", name: "Call to Action", icon: "megaphone" },
  { id: "contact", name: "Contact", icon: "mail" },
  { id: "footer", name: "Footer", icon: "layout" },
  { id: "blog", name: "Blog Posts", icon: "book-open" },
];

export default function SectionShowcasePage() {
  const { role: userRole } = usePermissions();
  const isSuperAdmin = userRole === "superadmin";
  const authToken = useAuthToken();
  const { pushToast } = useToast();

  const [selectedSection, setSelectedSection] = useState<string>("hero");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<"all" | "single">("all");
  const [heroZeroState, setHeroZeroState] = useState<boolean>(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePresetId, setActivePresetId] = useState<string>("modern-tech");
  const [currentThemeMode, setCurrentThemeMode] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);
  const [cardStyle, setCardStyle] = useState<"standard" | "horizontal" | "minimal" | "overlay" | "magazine">("standard");
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleOpenFullscreenSection = useCallback((sectionKey: string, targetVariant?: string) => {
    setFullscreenSection(sectionKey);
    if (targetVariant) {
      setTimeout(() => {
        const el = document.getElementById(`fs-variant-${targetVariant}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, []);

  // Close fullscreen on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenSection(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hidden variants state from platform config
  const [hiddenVariants, setHiddenVariants] = useState<Record<string, string[]>>({});
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
  // Critique state
  const [variantCritiques, setVariantCritiques] = useState<Record<string, Record<string, VariantCritiqueResult>>>({});
  const [critiquingVariant, setCritiquingVariant] = useState<string | null>(null); // "section:variant"

  // Load config on mount
  useEffect(() => {
    if (!isSuperAdmin) return;
    setLoadingConfig(true);
    loadDesignAssetsConfig(authToken)
      .then((cfg) => {
        setHiddenVariants(cfg.hidden_variants ?? {});
        setVariantCritiques(cfg.variant_critiques ?? {});
      })
      .finally(() => setLoadingConfig(false));
  }, [isSuperAdmin, authToken]);

  // Toggle hide / show variant handler
  const handleToggleVariantVisibility = useCallback(
    async (section: string, variant: string) => {
      const cfg = loadConfig();
      const current = new Set((cfg.hidden_variants ?? {})[section] ?? []);
      const willHide = !current.has(variant);

      if (willHide) {
        current.add(variant);
      } else {
        current.delete(variant);
      }

      const updated: DesignAssetsConfig = {
        ...cfg,
        hidden_variants: {
          ...(cfg.hidden_variants ?? {}),
          [section]: Array.from(current),
        },
      };

      // Optimistic update
      updateCache(updated);
      setHiddenVariants(updated.hidden_variants);

      pushToast(
        willHide
          ? `Varian "${variant}" berhasil disembunyikan. AI & editor pengguna tidak akan memilihnya.`
          : `Varian "${variant}" berhasil diaktifkan kembali.`,
        willHide ? "info" : "success"
      );

      // Persist to backend API
      if (authToken) {
        try {
          await saveDesignAssetsConfig(updated, authToken);
        } catch {
          pushToast("Gagal menyimpan ke server, disimpan di cache browser.", "error");
        }
      }
    },
    [authToken, pushToast]
  );

  // Critique variant handler — captures DOM, sends to backend, updates state
  const handleCritiqueVariant = useCallback(
    async (
      sectionKey: string,
      variantValue: string,
      previewEl: HTMLElement,
      silent: boolean = false
    ): Promise<{ ok: boolean; score?: number; rateLimited?: boolean; error?: string }> => {
      const critiqueKey = `${sectionKey}:${variantValue}`;
      if (!authToken) {
        if (!silent) pushToast("Token tidak tersedia. Harap login ulang.", "error");
        return { ok: false, error: "Token tidak tersedia" };
      }
      setCritiquingVariant(critiqueKey);
      try {
        // 1. Capture preview as compressed JPEG data URI
        const dataUrl = await toJpeg(previewEl, {
          quality: 0.6,
          pixelRatio: 0.75,
          backgroundColor: "#ffffff",
          skipFonts: true,
        });

        // 2. POST to backend via standard client
        const res = await request<VariantCritiqueResult>(
          "/admin/ai/critique-section-variant",
          {
            method: "POST",
            body: JSON.stringify({ section: sectionKey, variant: variantValue, image: dataUrl }),
          },
          authToken,
          true,
          0,
          90_000 // 90s timeout for vision AI
        );

        const result: VariantCritiqueResult = res.data;
        if (!result || typeof result.score !== "number" || result.score <= 0) {
          throw new Error(result?.verdict || "Hasil critique tidak valid (skor 0)");
        }

        // 3. Update local state
        setVariantCritiques((prev) => ({
          ...prev,
          [sectionKey]: {
            ...(prev[sectionKey] ?? {}),
            [variantValue]: result,
          },
        }));

        // 4. Sync cache
        const cfg = loadConfig();
        updateCache({
          ...cfg,
          variant_critiques: {
            ...(cfg.variant_critiques ?? {}),
            [sectionKey]: {
              ...((cfg.variant_critiques ?? {})[sectionKey] ?? {}),
              [variantValue]: result,
            },
          },
        });

        if (!silent) {
          pushToast(
            `✨ Critique selesai! Skor: ${result.score}/100 · Tier ${result.tier}`,
            "success"
          );
        }
        return { ok: true, score: result.score };
      } catch (err: any) {
        const errMsg = err?.message ?? "Unknown error";
        const isRateLimit =
          err?.status === 429 ||
          errMsg.includes("429") ||
          errMsg.toLowerCase().includes("terlalu banyak permintaan") ||
          errMsg.toLowerCase().includes("rate limit") ||
          errMsg.toLowerCase().includes("quota");

        if (!silent) {
          pushToast(`Gagal critique varian: ${errMsg}`, "error");
        }
        return { ok: false, error: errMsg, rateLimited: isRateLimit };
      } finally {
        setCritiquingVariant(null);
      }
    },
    [authToken, pushToast]
  );

  const [batchCritiquing, setBatchCritiquing] = useState<boolean>(false);
  const [batchProgressText, setBatchProgressText] = useState<string>("");
  const batchCancelRef = useRef<boolean>(false);

  const handleExportCritiquesJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(variantCritiques, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "variant_critiques_seed.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    pushToast("File variant_critiques_seed.json berhasil diunduh!", "success");
  }, [variantCritiques, pushToast]);

  // Active preset token
  const activePreset = useMemo(() => {
    return SHOWCASE_PRESETS.find((p) => p.id === activePresetId) ?? SHOWCASE_PRESETS[0];
  }, [activePresetId]);

  // Dynamic token synced with theme mode
  const currentToken = useMemo<DesignToken>(() => {
    const base = activePreset.token;
    return {
      ...base,
      theme_mode: currentThemeMode,
    };
  }, [activePreset, currentThemeMode]);



  // Load Google Fonts when preset changes
  useEffect(() => {
    if (currentToken.typography?.heading_font) {
      loadGoogleFont(currentToken.typography.heading_font);
    }
    if (currentToken.typography?.body_font) {
      loadGoogleFont(currentToken.typography.body_font);
    }
  }, [currentToken]);

  // Hidden set for the currently selected section
  const currentSectionHiddenSet = useMemo(() => {
    return new Set(hiddenVariants[selectedSection] ?? []);
  }, [hiddenVariants, selectedSection]);

  // Full options for current section
  const allSectionOptions = useMemo(() => {
    return SECTION_VARIANT_OPTIONS[selectedSection] ?? [];
  }, [selectedSection]);

  const totalSectionVariants = allSectionOptions.length;
  const hiddenCountForCurrentSec = useMemo(() => {
    return allSectionOptions.filter((v) => currentSectionHiddenSet.has(v.value)).length;
  }, [allSectionOptions, currentSectionHiddenSet]);
  const activeCountForCurrentSec = totalSectionVariants - hiddenCountForCurrentSec;

  // Aesthetic critique stats for current section
  const sectionCritiqueStats = useMemo(() => {
    const critiques = variantCritiques[selectedSection] ?? {};
    const values = Object.values(critiques);
    if (values.length === 0) return null;
    const avg = Math.round(values.reduce((acc, c) => acc + c.score, 0) / values.length);
    const tierCounts = values.reduce<Record<string, number>>((acc, c) => {
      acc[c.tier] = (acc[c.tier] ?? 0) + 1;
      return acc;
    }, {});
    return {
      totalCritiqued: values.length,
      averageScore: avg,
      tierCounts,
    };
  }, [variantCritiques, selectedSection]);

  // Filtered variants for current section
  const availableVariants = useMemo(() => {
    return allSectionOptions.filter((v) => {
      const isHidden = currentSectionHiddenSet.has(v.value);
      if (statusFilter === "active" && isHidden) return false;
      if (statusFilter === "hidden" && !isHidden) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.value.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        (v.description && v.description.toLowerCase().includes(q))
      );
    });
  }, [allSectionOptions, currentSectionHiddenSet, statusFilter, searchQuery]);

  const handleBatchCritiqueSection = useCallback(async () => {
    if (batchCritiquing) return;
    if (availableVariants.length === 0) {
      pushToast("Tidak ada varian untuk dinilai.", "info");
      return;
    }

    setBatchCritiquing(true);
    batchCancelRef.current = false;
    let successCount = 0;
    let failCount = 0;
    let stoppedByRateLimit = false;

    for (let i = 0; i < availableVariants.length; i++) {
      if (batchCancelRef.current) {
        pushToast(`Batch dibatalkan. Selesai ${successCount}/${availableVariants.length} varian.`, "info");
        break;
      }
      const v = availableVariants[i];
      setBatchProgressText(`${i + 1}/${availableVariants.length}`);
      const el = document.getElementById(`preview-card-${selectedSection}-${v.value}`);
      if (!el) {
        failCount++;
        continue;
      }

      const res = await handleCritiqueVariant(selectedSection, v.value, el, true);
      if (res.ok) {
        successCount++;
      } else {
        failCount++;
        if (res.rateLimited) {
          stoppedByRateLimit = true;
          pushToast(
            `Batch dihentikan: Terkena rate limit AI (429). Coba lagi beberapa saat lagi. Selesai ${successCount} varian.`,
            "error"
          );
          break;
        }
      }
      // Brief delay to prevent burst
      await new Promise((r) => setTimeout(r, 800));
    }

    setBatchCritiquing(false);
    setBatchProgressText("");

    if (!batchCancelRef.current && !stoppedByRateLimit) {
      if (failCount === 0) {
        pushToast(
          `Batch evaluasi selesai! Semua ${successCount} varian berhasil dinilai.`,
          "success"
        );
      } else {
        pushToast(
          `Batch evaluasi selesai: ${successCount} berhasil, ${failCount} gagal dari ${availableVariants.length} varian.`,
          failCount > successCount ? "error" : "info"
        );
      }
    }
  }, [batchCritiquing, availableVariants, selectedSection, handleCritiqueVariant, pushToast]);

  // Set default selected variant when switching section
  useEffect(() => {
    const opts = SECTION_VARIANT_OPTIONS[selectedSection] ?? [];
    if (opts.length > 0) {
      setSelectedVariant(opts[0].value);
    }
  }, [selectedSection]);

  const handleCopyVariant = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedVariant(val);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground gap-4 animate-in fade-in duration-300">
        <ShieldAlert className="size-16 text-destructive opacity-80" />
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">Akses Khusus Superadmin</h2>
          <p className="text-sm max-w-sm">Halaman visual showcase komponen section ini hanya dapat diakses oleh akun superadmin.</p>
        </div>
      </div>
    );
  }

  const viewportWidthClass = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto shadow-2xl rounded-2xl ring-1 ring-border/50",
    mobile: "max-w-[390px] mx-auto shadow-2xl rounded-3xl ring-1 ring-border/50",
  }[viewport];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:pb-0">
      {/* Top Header & Sticky Control Bar — static at lg, the panes below scroll on their own */}
      <div className="sticky top-0 z-40 shrink-0 bg-card/90 backdrop-blur-md border-b border-border/80 shadow-xs lg:static">
        <div className="px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center shadow-xs">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">Section & Variant Showcase</h1>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold tracking-wide uppercase border border-primary/20">
                  Superadmin Visual Lab
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Review visual live, atur Show / Hide varian untuk AI & Editor, dan uji responsivitas tema.
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Preset Selector */}
            <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/60">
              <Palette className="size-3.5 text-muted-foreground ml-1" />
              <select
                value={activePresetId}
                onChange={(e) => setActivePresetId(e.target.value)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden py-1 px-1.5 rounded cursor-pointer"
              >
                {SHOWCASE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id} className="bg-popover text-popover-foreground">
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Style Selector (for Catalog & Menu) */}
            {(selectedSection === "catalog" || selectedSection === "menu") && (
              <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/60 animate-in fade-in">
                <Sliders className="size-3.5 text-muted-foreground ml-1" />
                <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">Gaya Kartu:</span>
                <select
                  value={cardStyle}
                  onChange={(e) => setCardStyle(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-foreground focus:outline-hidden py-1 px-1.5 rounded cursor-pointer"
                >
                  <option value="standard" className="bg-popover text-popover-foreground">Standard (Vertikal)</option>
                  <option value="horizontal" className="bg-popover text-popover-foreground">Horizontal (Baris)</option>
                  <option value="minimal" className="bg-popover text-popover-foreground">Minimal (Clean)</option>
                  <option value="overlay" className="bg-popover text-popover-foreground">Overlay (Full-bleed)</option>
                  <option value="magazine" className="bg-popover text-popover-foreground">Magazine (Editorial)</option>
                </select>
              </div>
            )}

            {/* Light / Dark Mode Toggle */}
            <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setCurrentThemeMode("light")}
                className={`p-1.5 rounded-md transition-all ${
                  currentThemeMode === "light"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tampilan Terang (Light Mode)"
              >
                <Sun className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentThemeMode("dark")}
                className={`p-1.5 rounded-md transition-all ${
                  currentThemeMode === "dark"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tampilan Gelap (Dark Mode)"
              >
                <Moon className="size-3.5" />
              </button>
            </div>

            {/* Viewport Width Toggle */}
            <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  viewport === "desktop"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Desktop 100%"
              >
                <Monitor className="size-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  viewport === "tablet"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tablet 768px"
              >
                <Tablet className="size-3.5" />
                <span className="hidden sm:inline">768px</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  viewport === "mobile"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Mobile 390px"
              >
                <Smartphone className="size-3.5" />
                <span className="hidden sm:inline">390px</span>
              </button>
            </div>

            {/* Zero-state Toggle (hero only) */}
            {selectedSection === "hero" && (
              <button
                type="button"
                onClick={() => setHeroZeroState((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  heroZeroState
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-semibold"
                    : "bg-muted/50 border-border/60 text-muted-foreground hover:text-foreground"
                }`}
                title="Render hero dengan data kosong (zero-state)"
              >
                <AlertTriangle className="size-3.5" />
                <span>Zero-state</span>
              </button>
            )}

            {/* Display Mode Toggle */}
            <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setDisplayMode("all")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  displayMode === "all"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua Varian ({availableVariants.length})
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode("single")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  displayMode === "single"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Single Focus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Left Sidebar: Section Categories */}
        <div className="w-full lg:w-64 shrink-0 space-y-4 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pilih Section</span>
              <span className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {SECTION_CONFIG_LIST.length} Sections
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 pr-1">
              {SECTION_CONFIG_LIST.map((sec) => {
                const count = (SECTION_VARIANT_OPTIONS[sec.id] ?? []).length;
                const hiddenCountForSec = (hiddenVariants[sec.id] ?? []).length;
                const isActive = selectedSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setSelectedSection(sec.id);
                      setSearchQuery("");
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span className="truncate">{sec.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {hiddenCountForSec > 0 && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                            isActive
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-destructive/15 text-destructive"
                          }`}
                          title={`${hiddenCountForSec} varian disembunyikan`}
                        >
                          -{hiddenCountForSec}
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick status summary */}
          <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center justify-between">
              <span>Status Varian Section</span>
              <span className="text-[10px] uppercase font-mono px-1 rounded bg-muted text-muted-foreground">
                {selectedSection}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <div className="font-bold text-sm">{activeCountForCurrentSec}</div>
                <div>Aktif (Dipakai AI)</div>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <div className="font-bold text-sm">{hiddenCountForCurrentSec}</div>
                <div>Disembunyikan</div>
              </div>
            </div>
          </div>

          {/* AI Aesthetic Critique Summary */}
          {sectionCritiqueStats && (
            <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs text-xs space-y-2 animate-in fade-in">
              <div className="font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3 text-purple-500" />
                  <span>Aesthetic Score</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                  {sectionCritiqueStats.totalCritiqued}/{totalSectionVariants} Dinilai
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl font-black">{sectionCritiqueStats.averageScore}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">/100 Rerata</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold font-mono">
                  {sectionCritiqueStats.tierCounts["S"] && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" title={`${sectionCritiqueStats.tierCounts["S"]} varian Tier S`}>
                      S:{sectionCritiqueStats.tierCounts["S"]}
                    </span>
                  )}
                  {sectionCritiqueStats.tierCounts["A"] && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20" title={`${sectionCritiqueStats.tierCounts["A"]} varian Tier A`}>
                      A:{sectionCritiqueStats.tierCounts["A"]}
                    </span>
                  )}
                  {sectionCritiqueStats.tierCounts["B"] && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20" title={`${sectionCritiqueStats.tierCounts["B"]} varian Tier B`}>
                      B:{sectionCritiqueStats.tierCounts["B"]}
                    </span>
                  )}
                  {sectionCritiqueStats.tierCounts["C"] && (
                    <span className="px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/20" title={`${sectionCritiqueStats.tierCounts["C"]} varian Tier C`}>
                      C:{sectionCritiqueStats.tierCounts["C"]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preset info card */}
          <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center justify-between">
              <span>Tema Aktif</span>
              <span className="text-[10px] uppercase font-mono px-1 rounded bg-muted text-muted-foreground">
                {currentThemeMode}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">{activePreset.description}</p>
            <div className="flex items-center gap-1.5 pt-1">
              {([
                currentToken.palette?.primary,
                currentToken.palette?.accent,
                currentToken.palette?.background,
                currentToken.palette?.surface,
                currentToken.palette?.text,
              ] as string[]).map((c, i) => (
                <div
                  key={i}
                  className="size-4 rounded-full border border-border/60 shadow-xs"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="pt-1 text-[11px] text-muted-foreground space-y-0.5 font-mono">
              <div>
                Font: <span className="text-foreground">{currentToken.typography?.heading_font}</span> /{" "}
                <span className="text-foreground">{currentToken.typography?.body_font}</span>
              </div>
              <div>
                Radius: <span className="text-foreground">{currentToken.layout?.corner_radius ?? "soft"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area: Variant Renderers */}
        <div className="flex-1 min-w-0 space-y-6 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          {/* Section Toolbar, Filter & Search */}
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold capitalize">Section: {selectedSection}</h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                  {totalSectionVariants} varian terdaftar
                </span>
                {hiddenCountForCurrentSec > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-semibold flex items-center gap-1">
                    <EyeOff className="size-3" /> {hiddenCountForCurrentSec} tersembunyi
                  </span>
                )}
                {sectionCritiqueStats && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold flex items-center gap-1 shadow-2xs">
                    <Sparkles className="size-3" /> Rerata: {sectionCritiqueStats.averageScore}/100
                  </span>
                )}
                {/* Full Screen Section button */}
                <button
                  type="button"
                  onClick={() => handleOpenFullscreenSection(selectedSection)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 transition-all shadow-2xs"
                  title="Buka semua varian dalam full screen (scroll)"
                >
                  <Expand className="size-3" />
                  <span>Full Screen</span>
                </button>

                {/* Batch Critique All Variants */}
                {displayMode === "all" && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={batchCritiquing}
                      onClick={handleBatchCritiqueSection}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 transition-all shadow-2xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                      title="Nilai semua varian aktif di section ini secara berurutan dengan AI Vision"
                    >
                      {batchCritiquing ? (
                        <>
                          <Loader2 className="size-3 animate-spin text-purple-600 dark:text-purple-400" />
                          <span>Menilai {batchProgressText}...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-3 text-purple-600 dark:text-purple-400" />
                          <span>Nilai Semua ({availableVariants.length})</span>
                        </>
                      )}
                    </button>
                    {batchCritiquing && (
                      <button
                        type="button"
                        onClick={() => {
                          batchCancelRef.current = true;
                        }}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-all cursor-pointer"
                        title="Batalkan evaluasi batch"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                )}

                {/* Export Baseline JSON */}
                <button
                  type="button"
                  onClick={handleExportCritiquesJSON}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-all shadow-2xs cursor-pointer"
                  title="Unduh data baseline evaluasi varian sebagai file JSON"
                >
                  <Copy className="size-3" />
                  <span>Export JSON</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {displayMode === "all"
                  ? "Semua varian dirender di bawah. Kamu bisa klik 'Sembunyikan' untuk menonaktifkan varian dari pilihan AI & Editor."
                  : "Menampilkan 1 varian terpilih untuk fokus inspeksi detail."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter (Semua / Aktif / Tersembunyi) */}
              <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    statusFilter === "all"
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Semua ({totalSectionVariants})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    statusFilter === "active"
                      ? "bg-background text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="size-3 text-emerald-500" />
                  <span>Aktif ({activeCountForCurrentSec})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("hidden")}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    statusFilter === "hidden"
                      ? "bg-background text-destructive font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <EyeOff className="size-3 text-destructive" />
                  <span>Tersembunyi ({hiddenCountForCurrentSec})</span>
                </button>
              </div>

              {/* Search Variant */}
              <div className="relative w-44 sm:w-56">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari varian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/50 border border-border/60 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Single Mode Variant Dropdown */}
              {displayMode === "single" && (
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="bg-card text-xs font-semibold text-foreground border border-border/80 rounded-lg py-1.5 px-3 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-primary shadow-xs"
                >
                  {allSectionOptions.map((v) => (
                    <option key={v.value} value={v.value}>
                      {currentSectionHiddenSet.has(v.value) ? "🚫 [Hidden] " : ""}
                      {v.label} ({v.value})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Rendering Container */}
          <CartProvider
            waPhone="6281234567890"
            brandName="Webjoz Showcase"
            previewMode={true}
            primaryColor={currentToken.palette?.primary ?? "#4F46E5"}
          >
            {displayMode === "all" ? (
              <div className="space-y-10">
                {availableVariants.map((v, index) => {
                  const isHidden = currentSectionHiddenSet.has(v.value);
                  return (
                    <VariantPreviewCard
                      key={v.value}
                      index={index + 1}
                      sectionKey={selectedSection}
                      variant={v}
                      designToken={currentToken}
                      cardStyle={cardStyle}
                      viewportClass={viewportWidthClass}
                      copiedVariant={copiedVariant}
                      isHidden={isHidden}
                      zeroState={selectedSection === "hero" && heroZeroState}
                      onCopyVariant={handleCopyVariant}
                      onToggleHide={() => handleToggleVariantVisibility(selectedSection, v.value)}
                      onFocusSingle={() => {
                        setSelectedVariant(v.value);
                        setDisplayMode("single");
                      }}
                      onFullScreen={() => handleOpenFullscreenSection(selectedSection, v.value)}
                      critiqueData={variantCritiques[selectedSection]?.[v.value]}
                      isCritiquing={critiquingVariant === `${selectedSection}:${v.value}`}
                      onCritique={(el) => handleCritiqueVariant(selectedSection, v.value, el)}
                    />
                  );
                })}

                {availableVariants.length === 0 && (
                  <div className="bg-card border border-border/80 rounded-2xl p-12 text-center text-muted-foreground space-y-2">
                    <p className="text-sm font-medium">
                      {statusFilter === "hidden"
                        ? "Tidak ada varian yang disembunyikan pada section ini."
                        : `Tidak ada varian yang cocok dengan kriteria pencarian.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      className="text-xs text-primary underline"
                    >
                      Reset filter & pencarian
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {selectedVariant && (
                  <VariantPreviewCard
                    index={1}
                    sectionKey={selectedSection}
                    variant={
                      allSectionOptions.find((v) => v.value === selectedVariant) ?? {
                        value: selectedVariant,
                        label: selectedVariant,
                      }
                    }
                    designToken={currentToken}
                    cardStyle={cardStyle}
                    viewportClass={viewportWidthClass}
                    copiedVariant={copiedVariant}
                    isHidden={currentSectionHiddenSet.has(selectedVariant)}
                    zeroState={selectedSection === "hero" && heroZeroState}
                    onCopyVariant={handleCopyVariant}
                    onToggleHide={() => handleToggleVariantVisibility(selectedSection, selectedVariant)}
                    isSingleFocus={true}
                    onFullScreen={() => handleOpenFullscreenSection(selectedSection, selectedVariant)}
                    critiqueData={variantCritiques[selectedSection]?.[selectedVariant]}
                    isCritiquing={critiquingVariant === `${selectedSection}:${selectedVariant}`}
                    onCritique={(el) => handleCritiqueVariant(selectedSection, selectedVariant, el)}
                  />
                )}
              </div>
            )}
          </CartProvider>
        </div>
      </div>

      {/* ── Full Screen Section Overlay ──────────────────────────────── */}
      {fullscreenSection && (() => {
        const fsSectionVariants = SECTION_VARIANT_OPTIONS[fullscreenSection] ?? [];
        const fsCssVars = buildCssVars(currentToken);
        return (
          <div
            className="fixed inset-0 z-[200] bg-background flex flex-col animate-in fade-in duration-200"
            style={fsCssVars as React.CSSProperties}
          >
            {/* ── Sticky top bar ── */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-border/80 bg-card/95 backdrop-blur-md shadow-xs">
              {/* Left: identity */}
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-transparent border border-indigo-500/30 flex items-center justify-center">
                  <Expand className="size-3.5 text-indigo-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold capitalize">Section: {fullscreenSection}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold uppercase border border-indigo-500/20">
                      {fsSectionVariants.length} varian
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Scroll untuk melihat semua varian. Klik nama varian untuk melompat.</p>
                </div>
              </div>

              {/* Right: controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Quick jump dropdown */}
                <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/60">
                  <ArrowUp className="size-3.5 text-muted-foreground ml-1" />
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const el = document.getElementById(`fs-variant-${e.target.value}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      e.target.value = "";
                    }}
                    className="bg-transparent text-xs font-semibold text-foreground focus:outline-hidden py-1 px-1.5 rounded cursor-pointer"
                  >
                    <option value="" disabled>Lompat ke varian…</option>
                    {fsSectionVariants.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Card style for catalog/menu */}
                {(fullscreenSection === "catalog" || fullscreenSection === "menu") && (
                  <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/60">
                    <Sliders className="size-3.5 text-muted-foreground ml-1" />
                    <select
                      value={cardStyle}
                      onChange={(e) => setCardStyle(e.target.value as any)}
                      className="bg-transparent text-xs font-semibold text-foreground focus:outline-hidden py-1 px-1.5 rounded cursor-pointer"
                    >
                      <option value="standard">Standard</option>
                      <option value="horizontal">Horizontal</option>
                      <option value="minimal">Minimal</option>
                      <option value="overlay">Overlay</option>
                      <option value="magazine">Magazine</option>
                    </select>
                  </div>
                )}

                {/* Viewport toggle */}
                <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60">
                  {(["desktop", "tablet", "mobile"] as const).map((vp) => (
                    <button
                      key={vp}
                      type="button"
                      onClick={() => setViewport(vp)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
                        viewport === vp
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {vp === "desktop" && <Monitor className="size-3.5" />}
                      {vp === "tablet" && <Tablet className="size-3.5" />}
                      {vp === "mobile" && <Smartphone className="size-3.5" />}
                      <span className="hidden sm:inline capitalize">{vp}</span>
                    </button>
                  ))}
                </div>

                {/* Theme toggle */}
                <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60">
                  <button
                    type="button"
                    onClick={() => setCurrentThemeMode("light")}
                    className={`p-1.5 rounded-md transition-all ${
                      currentThemeMode === "light" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentThemeMode("dark")}
                    className={`p-1.5 rounded-md transition-all ${
                      currentThemeMode === "dark" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="size-3.5" />
                  </button>
                </div>

                {/* Section switcher */}
                <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/60">
                  <Layers className="size-3.5 text-muted-foreground ml-1" />
                  <select
                    value={fullscreenSection}
                    onChange={(e) => handleOpenFullscreenSection(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-foreground focus:outline-hidden py-1 px-1.5 rounded cursor-pointer"
                  >
                    {SECTION_CONFIG_LIST.map((sec) => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setFullscreenSection(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 transition-all"
                  title="Tutup Full Screen (Esc)"
                >
                  <X className="size-3.5" />
                  <span>Tutup (Esc)</span>
                </button>
              </div>
            </div>

            {/* ── Scrollable content: all variants sequentially ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <CartProvider
                waPhone="6281234567890"
                brandName="Webjoz Showcase"
                previewMode={true}
                primaryColor={currentToken.palette?.primary ?? "#4F46E5"}
              >
                <div className={viewportWidthClass}>
                  {fsSectionVariants.map((v, idx) => {
                    const isHidden = (hiddenVariants[fullscreenSection] ?? []).includes(v.value);
                    const variantToken: DesignToken = {
                      ...currentToken,
                      layout: {
                        ...(currentToken.layout ?? {}),
                        hero_style: (fullscreenSection === "hero" ? v.value : currentToken.layout?.hero_style) as any,
                        card_style: (fullscreenSection === "catalog" || fullscreenSection === "menu" ? cardStyle : currentToken.layout?.card_style) as any,
                        section_variants: {
                          ...((currentToken.layout?.section_variants ?? {}) as any),
                          [fullscreenSection]: v.value,
                        },
                      },
                    };
                    const variantCssVars = buildCssVars(variantToken);
                    return (
                      <div key={v.value} id={`fs-variant-${v.value}`}>
                        {/* Variant label band */}
                        <div className={`sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-2 border-b text-xs font-medium ${
                          isHidden
                            ? "bg-destructive/10 border-destructive/30 text-destructive"
                            : "bg-card/90 border-border/60 text-muted-foreground"
                        } backdrop-blur-md`}>
                          <div className="flex items-center gap-2">
                            <span className="size-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-primary/10 text-primary border border-primary/20">{idx + 1}</span>
                            <span className="font-semibold text-foreground">{v.label}</span>
                            <code className="text-[10px] font-mono bg-muted border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded">{v.value}</code>
                            {v.group && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{v.group}</span>}
                            {isHidden && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-semibold">
                                <EyeOff className="size-2.5" /> Disembunyikan
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleVariantVisibility(fullscreenSection, v.value)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                              isHidden
                                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive border-border/60"
                            }`}
                          >
                            {isHidden ? <><Eye className="size-2.5" /> Aktifkan</> : <><EyeOff className="size-2.5" /> Sembunyikan</>}
                          </button>
                        </div>

                        {/* Variant render */}
                        <div
                          style={{
                            ...variantCssVars as React.CSSProperties,
                            backgroundColor: "var(--dt-bg, #ffffff)",
                            color: "var(--dt-text, #1e293b)",
                            fontFamily: "var(--dt-body-font, sans-serif)",
                            width: "100%",
                          }}
                        >
                          <RenderSectionComponent
                            sectionKey={fullscreenSection}
                            variantKey={v.value}
                            designToken={variantToken}
                            zeroState={fullscreenSection === "hero" && heroZeroState}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CartProvider>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Individual Variant Card Preview Component ─────────────────────────────────
interface VariantPreviewCardProps {
  index: number;
  sectionKey: string;
  variant: { value: string; label: string; description?: string; group?: string };
  designToken: DesignToken;
  cardStyle?: "standard" | "horizontal" | "minimal" | "overlay" | "magazine";
  viewportClass: string;
  copiedVariant: string | null;
  isHidden: boolean;
  zeroState?: boolean;
  onCopyVariant: (val: string) => void;
  onToggleHide: () => void;
  onFocusSingle?: () => void;
  onFullScreen?: () => void;
  isSingleFocus?: boolean;
  critiqueData?: VariantCritiqueResult;
  isCritiquing?: boolean;
  onCritique?: (el: HTMLElement) => void;
}

function VariantPreviewCard({
  index,
  sectionKey,
  variant,
  designToken,
  cardStyle,
  viewportClass,
  copiedVariant,
  isHidden,
  zeroState,
  onCopyVariant,
  onToggleHide,
  onFocusSingle,
  onFullScreen,
  isSingleFocus,
  critiqueData,
  isCritiquing = false,
  onCritique,
}: VariantPreviewCardProps) {
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [showCritiqueModal, setShowCritiqueModal] = useState<boolean>(false);

  // Scoped design token for this specific variant
  const sectionDesignToken = useMemo<DesignToken>(() => {
    return {
      ...designToken,
      layout: {
        ...(designToken.layout ?? {}),
        hero_style: (sectionKey === "hero" ? variant.value : designToken.layout?.hero_style) as any,
        card_style: (sectionKey === "catalog" || sectionKey === "menu" ? cardStyle : designToken.layout?.card_style) as any,
        section_variants: {
          ...((designToken.layout?.section_variants ?? {}) as any),
          [sectionKey]: variant.value,
        },
      },
    };
  }, [designToken, sectionKey, variant.value, cardStyle]);

  const cssVars = useMemo(() => buildCssVars(sectionDesignToken), [sectionDesignToken]);

  return (
    <div
      className={`bg-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all border ${
        isHidden
          ? "border-destructive/40 bg-card/60 ring-1 ring-destructive/20"
          : critiqueData?.tier === "C" && (critiqueData.improvements?.length ?? 0) > 0
          ? "border-destructive/30 ring-1 ring-destructive/15"
          : "border-border/90"
      }`}
    >
      {/* Header bar of the variant card */}
      <div
        className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          isHidden ? "bg-destructive/5 border-destructive/20" : "bg-muted/40 border-border/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`size-6 rounded-full border text-xs font-mono font-bold flex items-center justify-center ${
              isHidden
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-primary/10 border-primary/25 text-primary"
            }`}
          >
            {index}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-sm ${isHidden ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {variant.label}
              </span>
              <code className="text-[11px] font-mono bg-background border border-border/60 text-muted-foreground px-2 py-0.5 rounded">
                {variant.value}
              </code>
              {variant.group && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {variant.group}
                </span>
              )}
              {(sectionKey === "catalog" || sectionKey === "menu") && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold border border-primary/20">
                  card: {cardStyle || "standard"}
                </span>
              )}
              {/* Status Badge */}
              {isHidden ? (
                <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/25 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                  <EyeOff className="size-3" /> Disembunyikan
                </span>
              ) : zeroState ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                  <AlertTriangle className="size-3" /> Zero-state
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                  <Eye className="size-3" /> Aktif
                </span>
              )}

              {/* Aesthetic Score Badge (if critique exists) */}
              {critiqueData && (
                <button
                  type="button"
                  onClick={() => setShowCritiqueModal(true)}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-all hover:scale-105 cursor-pointer ${
                    critiqueData.tier === "S"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                      : critiqueData.tier === "A"
                      ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/25"
                      : critiqueData.tier === "B"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                      : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25"
                  }`}
                  title="Klik untuk melihat evaluasi detail AI Vision"
                >
                  <Sparkles className="size-2.5 text-current" />
                  <span>{critiqueData.score}/100 · Tier {critiqueData.tier}</span>
                </button>
              )}
              {/* Source badge: Vision AI vs Seed */}
              {critiqueData && (
                <span
                  className={`px-1.5 py-0.5 rounded-full border text-[9px] font-semibold flex items-center gap-0.5 ${
                    critiqueData.scored_by === "vision_ai"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25"
                  }`}
                  title={
                    critiqueData.scored_by === "vision_ai"
                      ? "Dinilai oleh Vision AI secara real-time"
                      : "Nilai dari data seed baseline"
                  }
                >
                  {critiqueData.scored_by === "vision_ai" ? "🤖 AI" : "🌱 Seed"}
                </span>
              )}
              {/* Tier C / B warning badge — only show when improvements exist and score > 0 */}
              {critiqueData && !isHidden && critiqueData.score > 0 && (critiqueData.improvements?.length ?? 0) > 0 && (critiqueData.tier === "C" || critiqueData.tier === "B") && (
                <span
                  className={`px-1.5 py-0.5 rounded-full border text-[9px] font-bold flex items-center gap-0.5 ${
                    critiqueData.tier === "C"
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}
                  title={
                    critiqueData.tier === "C"
                      ? "Skor buruk — pertimbangkan untuk disembunyikan"
                      : "Skor cukup — bisa ditingkatkan"
                  }
                >
                  {critiqueData.tier === "C" ? "⚠️ Perlu Perbaikan" : "💡 Bisa Ditingkatkan"}
                </span>
              )}
            </div>
            {variant.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{variant.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Vision Critique Button */}
          {onCritique && (
            <button
              type="button"
              disabled={isCritiquing}
              onClick={() => {
                if (previewCardRef.current) {
                  onCritique(previewCardRef.current);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-2xs ${
                isCritiquing
                  ? "bg-muted text-muted-foreground border-border/60 cursor-not-allowed opacity-80"
                  : critiqueData
                  ? "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30"
                  : "bg-primary/10 hover:bg-primary/20 text-primary border-primary/25"
              }`}
              title={
                critiqueData
                  ? "Evaluasi ulang varian ini dengan AI Vision"
                  : "Evaluasi kualitas estetika varian ini dengan AI Vision (Gemini 2.5 Flash)"
              }
            >
              {isCritiquing ? (
                <>
                  <Loader2 className="size-3 animate-spin text-primary" />
                  <span>Menilai...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3" />
                  <span>{critiqueData ? "Nilai Ulang" : "AI Critique"}</span>
                </>
              )}
            </button>
          )}

          {/* Show / Hide Toggle Button */}
          <button
            type="button"
            onClick={onToggleHide}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-2xs ${
              isHidden
                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive border-border/80"
            }`}
            title={
              isHidden
                ? "Aktifkan kembali varian ini agar bisa dipilih oleh AI & editor"
                : "Sembunyikan varian ini agar tidak dipilih oleh AI maupun editor"
            }
          >
            {isHidden ? (
              <>
                <Eye className="size-3.5 text-emerald-500" />
                <span>Aktifkan</span>
              </>
            ) : (
              <>
                <EyeOff className="size-3.5" />
                <span>Sembunyikan</span>
              </>
            )}
          </button>

          {/* Copy Variant ID */}
          <button
            type="button"
            onClick={() => onCopyVariant(variant.value)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-background hover:bg-muted border border-border/80 text-foreground transition-all shadow-2xs"
            title="Salin ID Varian"
          >
            {copiedVariant === variant.value ? (
              <>
                <Check className="size-3 text-green-500" />
                <span className="text-green-500 font-semibold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="size-3 text-muted-foreground" />
                <span>Salin ID</span>
              </>
            )}
          </button>

          {/* Focus Single Button */}
          {!isSingleFocus && onFocusSingle && (
            <button
              type="button"
              onClick={onFocusSingle}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all shadow-2xs"
              title="Fokus ke varian ini saja"
            >
              <Maximize2 className="size-3" />
              <span>Fokus</span>
            </button>
          )}

          {/* Full Screen Button */}
          {onFullScreen && (
            <button
              type="button"
              onClick={onFullScreen}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 transition-all shadow-2xs"
              title="Buka tampilan full screen"
            >
              <Expand className="size-3" />
              <span>Full Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* Warning banner when hidden */}
      {isHidden && (
        <div className="mx-4 sm:mx-6 mt-4 px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <EyeOff className="size-4 shrink-0" />
            <span>
              <strong>Varian ini dinonaktifkan:</strong> AI generator tidak akan memilih varian ini, dan disembunyikan dari dropdown editor pengguna.
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleHide}
            className="text-xs underline font-bold hover:opacity-80 shrink-0 cursor-pointer"
          >
            Aktifkan Sekarang
          </button>
        </div>
      )}

      {/* Rendered Live Component in Responsive Container */}
      <div className={`p-4 sm:p-6 overflow-x-auto ${isHidden ? "opacity-75 grayscale-[25%]" : ""}`}>
        <div className={viewportClass}>
          <div
            ref={previewCardRef}
            id={`preview-card-${sectionKey}-${variant.value}`}
            style={{
              ...cssVars,
              backgroundColor: "var(--dt-bg, #ffffff)",
              color: "var(--dt-text, #1e293b)",
              fontFamily: "var(--dt-body-font, sans-serif)",
              containerType: "inline-size",
              width: "100%",
              borderRadius: "var(--dt-radius, 8px)",
              overflow: "hidden",
              border: "1px solid var(--dt-surface, rgba(0,0,0,0.08))",
              boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
            }}
            className="transition-all duration-300"
          >
            <RenderSectionComponent
              sectionKey={sectionKey}
              variantKey={variant.value}
              designToken={sectionDesignToken}
              zeroState={zeroState}
            />
          </div>
        </div>
      </div>

      {/* Critique Detail Modal */}
      {showCritiqueModal && critiqueData && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card text-card-foreground border border-border/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500/20 via-primary/10 to-transparent border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">{variant.label}</h3>
                    <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {variant.value}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Section: <span className="capitalize font-medium text-foreground">{sectionKey}</span> · AI Vision Aesthetic Critique
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCritiqueModal(false)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1">
              {/* Overall Score Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  critiqueData.tier === "S"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : critiqueData.tier === "A"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300"
                    : critiqueData.tier === "B"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider opacity-80">Skor Keseluruhan</div>
                  <div className="text-3xl font-extrabold flex items-baseline gap-2 mt-0.5">
                    <span>{critiqueData.score}</span>
                    <span className="text-sm font-medium opacity-70">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-sm font-black uppercase tracking-wider ${
                      critiqueData.tier === "S"
                        ? "bg-emerald-500/20 border border-emerald-500/40"
                        : critiqueData.tier === "A"
                        ? "bg-blue-500/20 border border-blue-500/40"
                        : critiqueData.tier === "B"
                        ? "bg-amber-500/20 border border-amber-500/40"
                        : "bg-destructive/20 border border-destructive/40"
                    }`}
                  >
                    Tier {critiqueData.tier}
                  </span>
                  <div className="text-[11px] opacity-75 mt-1">
                    {critiqueData.tier === "S"
                      ? "World-Class Quality"
                      : critiqueData.tier === "A"
                      ? "Great Production Ready"
                      : critiqueData.tier === "B"
                      ? "Acceptable / Needs Polish"
                      : "Needs Rework"}
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Rubrik Evaluasi (4 Dimensi × 25 Poin)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Hierarchy */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Visual Hierarchy</span>
                      <span className="font-mono font-bold">{critiqueData.hierarchy} / 25</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (critiqueData.hierarchy / 25) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Alur baca, focal point & kejelasan CTA</p>
                  </div>

                  {/* Typography */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Typography & Contrast</span>
                      <span className="font-mono font-bold">{critiqueData.typography} / 25</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (critiqueData.typography / 25) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Legibility font, skala heading & kontras teks</p>
                  </div>

                  {/* Whitespace */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Whitespace & Balance</span>
                      <span className="font-mono font-bold">{critiqueData.whitespace} / 25</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (critiqueData.whitespace / 25) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Kerapian padding, ruang nafas & ritme visual</p>
                  </div>

                  {/* Polish */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Modern Polish 2026</span>
                      <span className="font-mono font-bold">{critiqueData.polish} / 25</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (critiqueData.polish / 25) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Estetika modern, micro-details & profesionalitas</p>
                  </div>
                </div>
              </div>

              {/* Verdict */}
              {critiqueData.verdict && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    AI Verdict
                  </h4>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-foreground leading-relaxed italic">
                    "{critiqueData.verdict}"
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                {critiqueData.strengths && critiqueData.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="size-3.5" /> Kelebihan Desain
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {critiqueData.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements — more prominent for Tier B/C */}
                {critiqueData.improvements && critiqueData.improvements.length > 0 && (
                  <div
                    className={`space-y-2 rounded-xl p-3 border ${
                      critiqueData.tier === "C"
                        ? "bg-destructive/5 border-destructive/20"
                        : critiqueData.tier === "B"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-transparent border-transparent p-0"
                    }`}
                  >
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        critiqueData.tier === "C"
                          ? "text-destructive"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      <TrendingUp className="size-3.5" />
                      {critiqueData.tier === "C"
                        ? "⚠️ Harus Diperbaiki"
                        : "Saran Peningkatan"}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {critiqueData.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className={`size-1.5 rounded-full mt-1.5 shrink-0 ${
                              critiqueData.tier === "C" ? "bg-destructive" : "bg-amber-500"
                            }`}
                          />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Timestamp + Source */}
              {critiqueData.critiqued_at && (
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold flex items-center gap-1 ${
                      critiqueData.scored_by === "vision_ai"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25"
                        : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25"
                    }`}
                    title={
                      critiqueData.scored_by === "vision_ai"
                        ? "Dinilai oleh Vision AI secara real-time"
                        : "Nilai dari data seed baseline"
                    }
                  >
                    {critiqueData.scored_by === "vision_ai" ? "🤖 Vision AI" : "🌱 Seed Baseline"}
                  </span>
                  <div className="text-[11px] text-muted-foreground">
                    Dievaluasi pada: {new Date(critiqueData.critiqued_at).toLocaleString("id-ID")}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border/80 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCritiqueModal(false);
                    if (previewCardRef.current && onCritique) {
                      onCritique(previewCardRef.current);
                    }
                  }}
                  disabled={isCritiquing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-all"
                >
                  <Sparkles className="size-3.5" />
                  <span>Nilai Ulang Sekarang</span>
                </button>

                {/* Quick-hide for Tier B / C only, when score > 0 and improvements exist */}
                {(critiqueData.tier === "C" || critiqueData.tier === "B") && !isHidden && critiqueData.score > 0 && (critiqueData.improvements?.length ?? 0) > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCritiqueModal(false);
                      onToggleHide();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      critiqueData.tier === "C"
                        ? "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30"
                        : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    }`}
                    title={
                      critiqueData.tier === "C"
                        ? "Sembunyikan varian ini dari produksi (skor terlalu rendah)"
                        : "Sembunyikan varian ini sementara"
                    }
                  >
                    <EyeOff className="size-3.5" />
                    <span>Sembunyikan Varian</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowCritiqueModal(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Component Dispatcher ──────────────────────────────────────────────────────
function RenderSectionComponent({
  sectionKey,
  variantKey,
  designToken,
  zeroState = false,
}: {
  sectionKey: string;
  variantKey: string;
  designToken: DesignToken;
  zeroState?: boolean;
}) {
  const d = MOCK_SHOWCASE_DATA;

  switch (sectionKey) {
    case "hero":
      return (
        <HeroSection
          hero={(zeroState ? {} : d.hero) as any}
          contact={(zeroState ? undefined : d.contact) as any}
          onSubmitLead={() => Promise.resolve()}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "header":
      return (
        <HeaderSection
          header={d.header as any}
          design_token={designToken}
          sectionOrder={["hero", "about", "benefits", "catalog", "menu", "works", "pricing", "contact"]}
          language="id"
        />
      );

    case "about":
      return (
        <AboutSectionInner
          about={d.about as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "benefits":
      return (
        <BenefitsSectionInner
          benefits={d.benefits as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "menu":
      return (
        <MenuSectionInner
          menu={d.menu as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "catalog":
      return (
        <CatalogSectionInner
          catalog={d.catalog as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "works":
      return (
        <WorksSection
          works={d.works as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "gallery":
      return (
        <GallerySection
          gallery={d.gallery as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "stats":
      return (
        <StatsSectionInner
          stats={d.stats as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "testimonials":
      return (
        <TestimonialsSectionInner
          testimonials={d.testimonials as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "partners":
      return (
        <PartnersSectionInner
          partners={d.partners as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "pricing":
      return (
        <PricingSectionInner
          pricing={d.pricing as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "faq":
      return (
        <FaqSectionInner
          faq={d.faq as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "cta":
      return (
        <CtaSectionInner
          cta={d.cta as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "contact":
      return (
        <ContactSectionInner
          contact={d.contact as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "footer":
      return (
        <FooterSection
          footer={d.footer as any}
          design_token={designToken}
          language="id"
        />
      );

    case "blog":
      return (
        <BlogPostsSection
          posts={d.blog.posts as any}
          layout={variantKey as any}
        />
      );

    default:
      return (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Section renderer belum terdaftar untuk: <code>{sectionKey}</code>
        </div>
      );
  }
}
