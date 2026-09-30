"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
} from "lucide-react";
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
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePresetId, setActivePresetId] = useState<string>("modern-tech");
  const [currentThemeMode, setCurrentThemeMode] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);

  // Hidden variants state from platform config
  const [hiddenVariants, setHiddenVariants] = useState<Record<string, string[]>>({});
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);

  // Load config on mount
  useEffect(() => {
    if (!isSuperAdmin) return;
    setLoadingConfig(true);
    loadDesignAssetsConfig(authToken)
      .then((cfg) => {
        setHiddenVariants(cfg.hidden_variants ?? {});
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header & Sticky Control Bar */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/80 shadow-xs">
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
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6">
        {/* Left Sidebar: Section Categories */}
        <div className="w-full lg:w-64 shrink-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pilih Section</span>
              <span className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {SECTION_CONFIG_LIST.length} Sections
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 pr-1 lg:max-h-[calc(100vh-25rem)] lg:overflow-y-auto lg:overscroll-contain">
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
        <div className="flex-1 min-w-0 space-y-6">
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
                      viewportClass={viewportWidthClass}
                      copiedVariant={copiedVariant}
                      isHidden={isHidden}
                      onCopyVariant={handleCopyVariant}
                      onToggleHide={() => handleToggleVariantVisibility(selectedSection, v.value)}
                      onFocusSingle={() => {
                        setSelectedVariant(v.value);
                        setDisplayMode("single");
                      }}
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
                    viewportClass={viewportWidthClass}
                    copiedVariant={copiedVariant}
                    isHidden={currentSectionHiddenSet.has(selectedVariant)}
                    onCopyVariant={handleCopyVariant}
                    onToggleHide={() => handleToggleVariantVisibility(selectedSection, selectedVariant)}
                    isSingleFocus={true}
                  />
                )}
              </div>
            )}
          </CartProvider>
        </div>
      </div>
    </div>
  );
}

// ─── Individual Variant Card Preview Component ─────────────────────────────────
interface VariantPreviewCardProps {
  index: number;
  sectionKey: string;
  variant: { value: string; label: string; description?: string; group?: string };
  designToken: DesignToken;
  viewportClass: string;
  copiedVariant: string | null;
  isHidden: boolean;
  onCopyVariant: (val: string) => void;
  onToggleHide: () => void;
  onFocusSingle?: () => void;
  isSingleFocus?: boolean;
}

function VariantPreviewCard({
  index,
  sectionKey,
  variant,
  designToken,
  viewportClass,
  copiedVariant,
  isHidden,
  onCopyVariant,
  onToggleHide,
  onFocusSingle,
  isSingleFocus,
}: VariantPreviewCardProps) {
  // Scoped design token for this specific variant
  const sectionDesignToken = useMemo<DesignToken>(() => {
    return {
      ...designToken,
      layout: {
        ...(designToken.layout ?? {}),
        hero_style: (sectionKey === "hero" ? variant.value : designToken.layout?.hero_style) as any,
        section_variants: {
          ...((designToken.layout?.section_variants ?? {}) as any),
          [sectionKey]: variant.value,
        },
      },
    };
  }, [designToken, sectionKey, variant.value]);

  const cssVars = useMemo(() => buildCssVars(sectionDesignToken), [sectionDesignToken]);

  return (
    <div
      className={`bg-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all border ${
        isHidden
          ? "border-destructive/40 bg-card/60 ring-1 ring-destructive/20"
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
              {/* Status Badge */}
              {isHidden ? (
                <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/25 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                  <EyeOff className="size-3" /> Disembunyikan
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                  <Eye className="size-3" /> Aktif
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Component Dispatcher ──────────────────────────────────────────────────────
function RenderSectionComponent({
  sectionKey,
  variantKey,
  designToken,
}: {
  sectionKey: string;
  variantKey: string;
  designToken: DesignToken;
}) {
  const d = MOCK_SHOWCASE_DATA;

  switch (sectionKey) {
    case "hero":
      return (
        <HeroSection
          hero={d.hero as any}
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
