"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthToken } from "@/lib/auth-store";
import { useToast } from "@/components/toast-provider";
import {
  ShieldAlert,
  Search,
  Eye,
  EyeOff,
  Copy,
  Expand,
  Loader2,
  X,
  ArrowUp,
  Sliders,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
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

import { SHOWCASE_PRESETS, ShowcasePreset } from "./mock-data";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import { ShowcaseSidebar, type SectionConfigItem } from "./components/ShowcaseSidebar";
import { VariantPreviewCard } from "./components/VariantPreviewCard";
import { SectionRenderer } from "./components/SectionRenderer";

const SECTION_CONFIG_LIST: SectionConfigItem[] = [
  { id: "hero", name: "Hero" },
  { id: "header", name: "Header" },
  { id: "about", name: "About" },
  { id: "benefits", name: "Benefits" },
  { id: "menu", name: "Menu (F&B)" },
  { id: "catalog", name: "Catalog (Produk)" },
  { id: "works", name: "Works / Portfolio" },
  { id: "gallery", name: "Gallery" },
  { id: "stats", name: "Stats / Numbers" },
  { id: "testimonials", name: "Testimonials" },
  { id: "partners", name: "Partners" },
  { id: "pricing", name: "Pricing" },
  { id: "faq", name: "FAQ" },
  { id: "cta", name: "Call to Action" },
  { id: "contact", name: "Contact" },
  { id: "footer", name: "Footer" },
  { id: "blog", name: "Blog Posts" },
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
  const [, setLoadingConfig] = useState<boolean>(true);
  const [variantCritiques, setVariantCritiques] = useState<Record<string, Record<string, VariantCritiqueResult>>>({});
  const [critiquingVariant, setCritiquingVariant] = useState<{ key: string; method: "dom" | "server" } | null>(null);

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

      updateCache(updated);
      setHiddenVariants(updated.hidden_variants);

      pushToast(
        willHide
          ? `Varian "${variant}" berhasil disembunyikan.`
          : `Varian "${variant}" berhasil diaktifkan kembali.`,
        willHide ? "info" : "success"
      );

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
      silent: boolean = false,
      options?: { method?: "upload" | "screenshot" }
    ): Promise<{ ok: boolean; score?: number; rateLimited?: boolean; error?: string }> => {
      const critiqueKey = `${sectionKey}:${variantValue}`;
      if (!authToken) {
        if (!silent) pushToast("Token tidak tersedia. Harap login ulang.", "error");
        return { ok: false, error: "Token tidak tersedia" };
      }
      setCritiquingVariant({ key: critiqueKey, method: "dom" });
      try {
        let body: any;
        if (options?.method === "screenshot" && sectionKey === "hero") {
          body = { section: sectionKey, variant: variantValue, method: "screenshot" };
        } else {
          const dataUrl = await toJpeg(previewEl, {
            quality: 0.6,
            pixelRatio: 0.75,
            backgroundColor: "#ffffff",
            skipFonts: true,
          });
          body = { section: sectionKey, variant: variantValue, image: dataUrl, method: "upload" };
        }

        const res = await request<VariantCritiqueResult>(
          "/admin/ai/critique-section-variant",
          {
            method: "POST",
            body: JSON.stringify(body),
          },
          authToken,
          true,
          0,
          120_000
        );

        const result: VariantCritiqueResult = res.data;
        if (!result || typeof result.score !== "number" || result.score <= 0) {
          throw new Error(result?.verdict || "Hasil critique tidak valid (skor 0)");
        }

        setVariantCritiques((prev) => ({
          ...prev,
          [sectionKey]: {
            ...(prev[sectionKey] ?? {}),
            [variantValue]: result,
          },
        }));

        const cfg = loadConfig();
        const updatedCritiques = {
          ...(cfg.variant_critiques ?? {}),
          [sectionKey]: {
            ...((cfg.variant_critiques ?? {})[sectionKey] ?? {}),
            [variantValue]: result,
          },
        };
        const updatedCfg: DesignAssetsConfig = { ...cfg, variant_critiques: updatedCritiques };
        updateCache(updatedCfg);
        await saveDesignAssetsConfig(updatedCfg, authToken).catch(() => {});

        if (!silent) {
          pushToast(
            `Evaluasi selesai: Skor ${result.score}/100 (Tier ${result.tier}).`,
            result.tier === "S" || result.tier === "A" ? "success" : "info"
          );
        }
        return { ok: true, score: result.score };
      } catch (err: any) {
        const errMsg = err?.message || "Gagal mengevaluasi varian";
        const isRateLimit = errMsg.includes("429") || errMsg.toLowerCase().includes("quota");
        if (!silent) pushToast(errMsg, "error");
        return { ok: false, rateLimited: isRateLimit, error: errMsg };
      } finally {
        setCritiquingVariant(null);
      }
    },
    [authToken, pushToast]
  );

  // Batch critique state
  const [batchCritiquing, setBatchCritiquing] = useState<boolean>(false);
  const [batchProgressText, setBatchProgressText] = useState<string>("");
  const batchCancelRef = useRef<boolean>(false);

  // Batch Critique All Variants in Section
  const handleBatchCritiqueSection = useCallback(async () => {
    if (!authToken) {
      pushToast("Token tidak tersedia. Harap login ulang.", "error");
      return;
    }
    const currentOptions = SECTION_VARIANT_OPTIONS[selectedSection] ?? [];
    const hiddenSet = new Set(hiddenVariants[selectedSection] ?? []);
    const activeVariants = currentOptions.filter((v) => !hiddenSet.has(v.value));

    if (activeVariants.length === 0) {
      pushToast("Tidak ada varian aktif untuk dinilai.", "info");
      return;
    }

    setBatchCritiquing(true);
    batchCancelRef.current = false;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < activeVariants.length; i++) {
      if (batchCancelRef.current) break;
      const v = activeVariants[i];
      setBatchProgressText(`${i + 1}/${activeVariants.length} (${v.label})`);

      const cardEl = document.querySelector(`[data-variant-key="${selectedSection}:${v.value}"]`) as HTMLElement;
      if (!cardEl) {
        failCount++;
        continue;
      }

      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await handleCritiqueVariant(selectedSection, v.value, cardEl, true);
      if (res.ok) {
        successCount++;
      } else {
        failCount++;
        if (res.rateLimited) {
          pushToast(`Rate limit tercapai pada ${v.label}. Menghentikan batch.`, "error");
          break;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setBatchCritiquing(false);
    setBatchProgressText("");
    pushToast(`Batch selesai: ${successCount} berhasil, ${failCount} gagal/dibatalkan.`, successCount > 0 ? "success" : "info");
  }, [authToken, selectedSection, hiddenVariants, handleCritiqueVariant, pushToast]);

  // Export Critiques as JSON
  const handleExportCritiquesJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(variantCritiques, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `section-variant-critiques-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    pushToast("Data evaluasi berhasil diunduh.", "success");
  }, [variantCritiques, pushToast]);

  // Copy variant value handler
  const handleCopyVariant = useCallback((val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedVariant(val);
    setTimeout(() => setCopiedVariant(null), 2000);
  }, []);

  // Compute active design token from preset + current theme mode
  const activePreset: ShowcasePreset = useMemo(() => {
    return SHOWCASE_PRESETS.find((p) => p.id === activePresetId) ?? SHOWCASE_PRESETS[0];
  }, [activePresetId]);

  const currentToken: DesignToken = useMemo(() => {
    const base = activePreset.token;
    return {
      ...base,
      theme_mode: currentThemeMode,
      palette: {
        ...(base.palette ?? {}),
        background: currentThemeMode === "dark" ? "#0b0f19" : "#ffffff",
        surface: currentThemeMode === "dark" ? "#111827" : "#f8fafc",
        text: currentThemeMode === "dark" ? "#f9fafb" : "#0f172a",
        text_muted: currentThemeMode === "dark" ? "#94a3b8" : "#64748b",
        border: currentThemeMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      },
    };
  }, [activePreset, currentThemeMode]);

  // Load Google Fonts for active preset
  useEffect(() => {
    if (currentToken.typography?.heading_font) loadGoogleFont(currentToken.typography.heading_font);
    if (currentToken.typography?.body_font) loadGoogleFont(currentToken.typography.body_font);
  }, [currentToken]);

  // Options for currently selected section
  const allSectionOptions = useMemo(() => {
    return (SECTION_VARIANT_OPTIONS[selectedSection] ?? []).map((opt) => ({
      ...opt,
      label: getVariantLabel(selectedSection, opt.value),
      description: getVariantDescription(selectedSection, opt.value),
    }));
  }, [selectedSection]);

  // Hidden set for currently selected section
  const currentSectionHiddenSet = useMemo(() => {
    return new Set(hiddenVariants[selectedSection] ?? []);
  }, [hiddenVariants, selectedSection]);

  // Filtered variants
  const availableVariants = useMemo(() => {
    return allSectionOptions.filter((v) => {
      const isHidden = currentSectionHiddenSet.has(v.value);
      if (statusFilter === "active" && isHidden) return false;
      if (statusFilter === "hidden" && !isHidden) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchLabel = v.label.toLowerCase().includes(q);
        const matchValue = v.value.toLowerCase().includes(q);
        const matchDesc = v.description?.toLowerCase().includes(q) ?? false;
        if (!matchLabel && !matchValue && !matchDesc) return false;
      }
      return true;
    });
  }, [allSectionOptions, currentSectionHiddenSet, statusFilter, searchQuery]);

  // Jump or select variant via dropdown
  const handleSelectVariantDropdown = useCallback((variantVal: string) => {
    if (!variantVal) return;
    if (displayMode === "single") {
      setSelectedVariant(variantVal);
    } else {
      if (searchQuery.trim()) {
        setSearchQuery("");
      }
      if (currentSectionHiddenSet.has(variantVal) && statusFilter === "active") {
        setStatusFilter("all");
      }
      setTimeout(() => {
        const el = document.getElementById(`variant-card-${variantVal}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-primary", "rounded-xl", "transition-all");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-primary");
          }, 1800);
        }
      }, 60);
    }
  }, [displayMode, searchQuery, statusFilter, currentSectionHiddenSet]);

  // Reset selected variant on section change
  useEffect(() => {
    if (allSectionOptions.length > 0) {
      setSelectedVariant(allSectionOptions[0].value);
    }
  }, [selectedSection, allSectionOptions]);

  // Counts
  const totalSectionVariants = allSectionOptions.length;
  const hiddenCountForCurrentSec = currentSectionHiddenSet.size;
  const activeCountForCurrentSec = totalSectionVariants - hiddenCountForCurrentSec;

  const sectionCritiqueStats = useMemo(() => {
    const secCritiques = variantCritiques[selectedSection] ?? {};
    const values = Object.values(secCritiques);
    if (values.length === 0) return { totalCritiqued: 0, averageScore: 0 };
    const avg = Math.round(values.reduce((sum, c) => sum + (c.score || 0), 0) / values.length);
    return { totalCritiqued: values.length, averageScore: avg };
  }, [variantCritiques, selectedSection]);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-muted-foreground gap-3">
        <ShieldAlert className="size-12 text-destructive" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-foreground">Akses Khusus Superadmin</h2>
          <p className="text-sm max-w-sm">Halaman visual showcase komponen section ini hanya dapat diakses oleh akun superadmin.</p>
        </div>
      </div>
    );
  }

  const viewportWidthClass = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto shadow-md rounded-xl ring-1 ring-border/50",
    mobile: "max-w-[390px] mx-auto shadow-md rounded-2xl ring-1 ring-border/50",
  }[viewport];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:h-screen lg:overflow-hidden">
      {/* Top Consolidated Header */}
      <ShowcaseHeader
        selectedSection={selectedSection}
        activePresetId={activePresetId}
        onSelectPreset={setActivePresetId}
        currentThemeMode={currentThemeMode}
        onToggleThemeMode={setCurrentThemeMode}
        viewport={viewport}
        onSelectViewport={setViewport}
        displayMode={displayMode}
        onToggleDisplayMode={setDisplayMode}
        heroZeroState={heroZeroState}
        onToggleHeroZeroState={() => setHeroZeroState((prev) => !prev)}
        cardStyle={cardStyle}
        onChangeCardStyle={setCardStyle}
        availableVariantsCount={availableVariants.length}
      />

      {/* Main Workspace: Sidebar + Canvas Content */}
      <div className="flex flex-col lg:flex-row gap-5 p-4 lg:p-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Left Section Navigation Sidebar */}
        <ShowcaseSidebar
          sections={SECTION_CONFIG_LIST}
          selectedSection={selectedSection}
          onSelectSection={(secId) => {
            setSelectedSection(secId);
            setSearchQuery("");
          }}
          hiddenVariants={hiddenVariants}
        />

        {/* Right Preview Canvas Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          {/* Section Sub-Bar: Title, Status Tabs, Search, Actions */}
          <div className="bg-card border border-border/70 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Left: Section Name & Score */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-bold capitalize">{selectedSection}</h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                {totalSectionVariants} varian
              </span>

              {hiddenCountForCurrentSec > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium flex items-center gap-1">
                  <EyeOff className="size-3" /> {hiddenCountForCurrentSec}
                </span>
              )}

              {sectionCritiqueStats.totalCritiqued > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium flex items-center gap-1">
                  <SparkleIcon className="size-3 text-primary" /> Rerata {sectionCritiqueStats.averageScore}
                </span>
              )}
            </div>

            {/* Right: Controls & Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Segmented Status Filter */}
              <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/60 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
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
                  className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
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
                  className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    statusFilter === "hidden"
                      ? "bg-background text-destructive font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <EyeOff className="size-3 text-destructive" />
                  <span>Hidden ({hiddenCountForCurrentSec})</span>
                </button>
              </div>

              {/* Variant Selector Dropdown */}
              <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-muted/60 transition-colors px-2 py-1 rounded-lg border border-border/60">
                <Sliders className="size-3.5 text-muted-foreground shrink-0" />
                <select
                  value={displayMode === "single" ? selectedVariant : ""}
                  onChange={(e) => handleSelectVariantDropdown(e.target.value)}
                  className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden cursor-pointer max-w-[170px] sm:max-w-[240px] truncate"
                  title="Pilih atau lompat ke varian langsung dari dropdown"
                >
                  <option value="" className="bg-popover text-popover-foreground">
                    {displayMode === "single"
                      ? "Pilih varian..."
                      : `Lompat ke varian (${allSectionOptions.length})…`}
                  </option>
                  {allSectionOptions.map((v, idx) => (
                    <option key={v.value} value={v.value} className="bg-popover text-popover-foreground">
                      {currentSectionHiddenSet.has(v.value) ? "🚫 " : ""}
                      {idx + 1}. {v.label} ({v.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative w-36 sm:w-44">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari varian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-muted/40 border border-border/60 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Action: Fullscreen Section */}
              <button
                type="button"
                onClick={() => handleOpenFullscreenSection(selectedSection)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Buka semua varian dalam full screen"
              >
                <Expand className="size-3" />
                <span className="hidden sm:inline">Full Screen</span>
              </button>

              {/* Action: Batch Critique AI */}
              {displayMode === "all" && (
                <button
                  type="button"
                  disabled={batchCritiquing}
                  onClick={handleBatchCritiqueSection}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-all cursor-pointer disabled:opacity-50"
                  title="Evaluasi semua varian aktif dengan AI"
                >
                  {batchCritiquing ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      <span>{batchProgressText}...</span>
                    </>
                  ) : (
                    <>
                      <SparkleIcon className="size-3 text-primary" />
                      <span>Nilai Semua</span>
                    </>
                  )}
                </button>
              )}

              {/* Action: Export JSON */}
              <button
                type="button"
                onClick={handleExportCritiquesJSON}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60 transition-all cursor-pointer"
                title="Export JSON baseline data"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Cards Canvas Container */}
          <CartProvider
            waPhone="6281234567890"
            brandName="Webjoz Showcase"
            previewMode={true}
            primaryColor={currentToken.palette?.primary ?? "#4F46E5"}
          >
            {displayMode === "all" ? (
              <div className="space-y-6 pb-12">
                {availableVariants.map((v, index) => {
                  const isHidden = currentSectionHiddenSet.has(v.value);
                  return (
                    <div
                      key={v.value}
                      id={`variant-card-${v.value}`}
                      data-variant-key={`${selectedSection}:${v.value}`}
                    >
                      <VariantPreviewCard
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
                        onFullScreen={() => handleOpenFullscreenSection(selectedSection, v.value)}
                        critiqueData={variantCritiques[selectedSection]?.[v.value]}
                        isCritiquing={critiquingVariant?.key === `${selectedSection}:${v.value}`}
                        critiqueMethod={critiquingVariant?.key === `${selectedSection}:${v.value}` ? critiquingVariant.method : null}
                        onCritique={(el) => handleCritiqueVariant(selectedSection, v.value, el)}
                      />
                    </div>
                  );
                })}

                {availableVariants.length === 0 && (
                  <div className="bg-card border border-border/80 rounded-xl p-10 text-center text-muted-foreground space-y-2">
                    <p className="text-sm font-medium">
                      {statusFilter === "hidden"
                        ? "Tidak ada varian yang disembunyikan pada section ini."
                        : "Tidak ada varian yang cocok dengan pencarian."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      className="text-xs text-primary underline cursor-pointer"
                    >
                      Reset filter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 pb-12">
                {selectedVariant && (
                  <div id={`variant-card-${selectedVariant}`}>
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
                      onFullScreen={() => handleOpenFullscreenSection(selectedSection, selectedVariant)}
                      critiqueData={variantCritiques[selectedSection]?.[selectedVariant]}
                      isCritiquing={critiquingVariant?.key === `${selectedSection}:${selectedVariant}`}
                      critiqueMethod={critiquingVariant?.key === `${selectedSection}:${selectedVariant}` ? critiquingVariant.method : null}
                      onCritique={(el) => handleCritiqueVariant(selectedSection, selectedVariant, el)}
                    />
                  </div>
                )}
              </div>
            )}
          </CartProvider>
        </div>
      </div>

      {/* Full Screen Section Overlay */}
      {fullscreenSection && (() => {
        const fsSectionVariants = SECTION_VARIANT_OPTIONS[fullscreenSection] ?? [];
        const fsCssVars = buildCssVars(currentToken);
        return (
          <div
            className="fixed inset-0 z-[200] bg-background flex flex-col animate-in fade-in duration-200"
            style={fsCssVars as React.CSSProperties}
          >
            {/* Top Bar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border/80 bg-card/95 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold capitalize">Section: {fullscreenSection}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                  {fsSectionVariants.length} varian
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Jump dropdown */}
                <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-lg border border-border/60">
                  <ArrowUp className="size-3 text-muted-foreground" />
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const el = document.getElementById(`fs-variant-${e.target.value}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      e.target.value = "";
                    }}
                    className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
                  >
                    <option value="" disabled>Lompat ke varian…</option>
                    {fsSectionVariants.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Card style */}
                {(fullscreenSection === "catalog" || fullscreenSection === "menu") && (
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-lg border border-border/60">
                    <Sliders className="size-3 text-muted-foreground" />
                    <select
                      value={cardStyle}
                      onChange={(e) => setCardStyle(e.target.value as any)}
                      className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
                    >
                      <option value="standard">Standard</option>
                      <option value="horizontal">Horizontal</option>
                      <option value="minimal">Minimal</option>
                      <option value="overlay">Overlay</option>
                      <option value="magazine">Magazine</option>
                    </select>
                  </div>
                )}

                {/* Viewport switcher */}
                <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/60">
                  {(["desktop", "tablet", "mobile"] as const).map((vp) => (
                    <button
                      key={vp}
                      type="button"
                      onClick={() => setViewport(vp)}
                      className={`p-1 text-xs rounded-md transition-all cursor-pointer ${
                        viewport === vp
                          ? "bg-background text-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={vp}
                    >
                      {vp === "desktop" && <Monitor className="size-3.5" />}
                      {vp === "tablet" && <Tablet className="size-3.5" />}
                      {vp === "mobile" && <Smartphone className="size-3.5" />}
                    </button>
                  ))}
                </div>

                {/* Close Fullscreen */}
                <button
                  type="button"
                  onClick={() => setFullscreenSection(null)}
                  className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-muted/10">
              <CartProvider
                waPhone="6281234567890"
                brandName="Webjoz Showcase"
                previewMode={true}
                primaryColor={currentToken.palette?.primary ?? "#4F46E5"}
              >
                {fsSectionVariants.map((v, idx) => (
                  <div
                    key={v.value}
                    id={`fs-variant-${v.value}`}
                    className="space-y-2 max-w-7xl mx-auto"
                  >
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold">{v.label}</span>
                        <code className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {v.value}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyVariant(v.value)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="size-3" />
                        <span>Salin ID</span>
                      </button>
                    </div>

                    <div className="bg-background rounded-xl border border-border/80 p-3 sm:p-4 overflow-hidden shadow-xs">
                      <div className={viewportWidthClass}>
                        <SectionRenderer
                          sectionKey={fullscreenSection}
                          variantKey={v.value}
                          designToken={{
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
                          }}
                          zeroState={fullscreenSection === "hero" && heroZeroState}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CartProvider>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
