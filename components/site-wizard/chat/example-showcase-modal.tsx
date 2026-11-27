"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowRight, Smartphone, Monitor, ExternalLink } from "lucide-react";
import { Dialog, Button, SparkleGenAI, Spinner } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import { TemplatePreview } from "@/components/landing-template-showcase";
import {
  useMockupShowcaseSites,
  useAllRealSitesData,
  siteHost,
  resolveSiteArchetype,
  resolveSiteBusinessName,
} from "@/lib/mockup-showcase-sites";
import {
  ARCHETYPE_ORDER,
  archetypeLabel,
  inferArchetypeFromText,
} from "@/lib/showcase-archetypes";

export interface ShowcaseSiteItem {
  id: string;
  url: string;
  businessName: string;
  archetype: string; // v2 archetype id, e.g. "food_venue"
  templateId: string;
  content: any;
  designToken: any;
  mood?: string | number;
  isLoading: boolean;
}

interface ExampleShowcaseModalProps {
  open: boolean;
  onClose: () => void;
  onUseStyle: (styleToken: Record<string, any>) => void;
  onStartCustom: () => void;
  initialBusinessType?: string;
  initialTabIndex?: number;
}

export function ExampleShowcaseModal({
  open,
  onClose,
  onUseStyle,
  onStartCustom,
  initialBusinessType,
  initialTabIndex,
}: ExampleShowcaseModalProps) {
  const { t, isIndonesian } = useI18n();
  // Curated by admin/superadmin: published sites only (GET /public/showcase-sites)
  const { sites: effectiveSites, archetypes: apiArchetypes, loading: sitesLoading } = useMockupShowcaseSites();

  const realSitesData = useAllRealSitesData(effectiveSites);

  // 1. Build all real site items dynamically
  const allItems: ShowcaseSiteItem[] = useMemo(() => {
    return effectiveSites
      .filter((s) => s.url && s.url.trim().length > 0)
      .map((s) => {
        const host = siteHost(s.url);
        const data = realSitesData[host];
        const bName = resolveSiteBusinessName(s, data);
        const arch = resolveSiteArchetype(s, data);

        return {
          id: s.url,
          url: s.url,
          businessName: bName,
          archetype: arch,
          templateId: data?.templateId || "TEMPLATE_DYNAMIC",
          content: data?.content || null,
          designToken: data?.design_token || null,
          mood: data?.design_token?.mood || "modern",
          isLoading: !data,
        };
      });
  }, [effectiveSites, realSitesData]);

  // 2. Build archetype tabs from the archetypes that actually have sites
  const tabs = useMemo(() => {
    if (allItems.length === 0) return [];

    const order = ARCHETYPE_ORDER as readonly string[];
    const present = Array.from(new Set(allItems.map((it) => it.archetype))).sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    const archetypeTabs = present.map((arch) => ({
      key: `arch-${arch}`,
      archetype: arch,
      label: archetypeLabel(arch, isIndonesian, apiArchetypes.find((a) => a.id === arch)),
      items: allItems.filter((it) => it.archetype === arch),
    }));

    if (archetypeTabs.length > 1) {
      return [
        { key: "all", archetype: "", label: isIndonesian ? "Semua" : "All", items: allItems },
        ...archetypeTabs,
      ];
    }
    return archetypeTabs;
  }, [allItems, apiArchetypes, isIndonesian]);

  // 3. Initial item calculation
  const initialItem = useMemo(() => {
    if (allItems.length === 0) return null;

    if (typeof initialTabIndex === "number") {
      if (initialTabIndex >= 0 && initialTabIndex < allItems.length) {
        return allItems[initialTabIndex];
      }
    }

    if (initialBusinessType) {
      const wanted = inferArchetypeFromText(initialBusinessType);
      const match = allItems.find((it) => it.archetype === wanted);
      if (match) return match;
    }

    return allItems[0];
  }, [allItems, initialBusinessType, initialTabIndex]);

  const [selectedId, setSelectedId] = useState<string>(() => initialItem?.id || "");
  const [activeTabKey, setActiveTabKey] = useState<string>(() => tabs[0]?.key || "all");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");

  // Sync on open
  useEffect(() => {
    if (open && initialItem) {
      setSelectedId(initialItem.id);
      const parentTab = tabs.find((t) => t.items.some((it) => it.id === initialItem.id));
      if (parentTab) setActiveTabKey(parentTab.key);

      if (typeof window !== "undefined") {
        setPreviewDevice(window.innerWidth < 640 ? "mobile" : "desktop");
      }
    }
  }, [open, initialItem, tabs]);

  const activeTab = useMemo(() => {
    return tabs.find((t) => t.key === activeTabKey) || tabs[0];
  }, [tabs, activeTabKey]);

  const activeItem = useMemo(() => {
    return allItems.find((it) => it.id === selectedId) || activeTab?.items[0] || allItems[0];
  }, [allItems, activeTab, selectedId]);

  const handleUseStyle = () => {
    if (!activeItem || !activeItem.designToken) return;
    const token = activeItem.designToken;
    const styleToken: Record<string, any> = {
      palette: token.palette,
      typography: token.typography,
      ...(token.layout?.corner_radius ? { layout: { corner_radius: token.layout.corner_radius } } : {}),
      mood: token.mood || activeItem.mood,
      theme_mode: token.theme_mode,
    };
    onClose();
    onUseStyle(styleToken);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      size="xl"
      backdrop="subtle"
      className="sm:!max-w-4xl"
      style={{ maxWidth: "min(920px, calc(100vw - 1.5rem))" }}
      title={
        <div className="flex items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground border border-border/60">
              <SparkleGenAI className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-sm sm:text-base text-foreground truncate">
                {t("dashboard.wizard.exampleShowcaseTitle", isIndonesian ? "Contoh Hasil Website AI" : "Real AI Website Examples")}
              </span>
              <span className="hidden sm:block text-[11px] font-normal text-muted-foreground truncate">
                {t("dashboard.wizard.exampleShowcaseSubtitle", isIndonesian
                  ? "Dibuat otomatis dalam hitungan menit — scroll untuk lihat detailnya"
                  : "Generated in minutes — scroll to inspect the full layout")}
              </span>
            </div>
          </div>

          {/* Device Toggle */}
          <div className="flex items-center bg-muted/80 p-0.5 rounded-lg border border-border/60 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              title={isIndonesian ? "Tampilan HP" : "Mobile view"}
              aria-label="Mobile view"
              className={`flex items-center justify-center p-1.5 rounded-md transition-all cursor-pointer ${
                previewDevice === "mobile"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              title={isIndonesian ? "Tampilan Desktop" : "Desktop view"}
              aria-label="Desktop view"
              className={`flex items-center justify-center p-1.5 rounded-md transition-all cursor-pointer ${
                previewDevice === "desktop"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      }
      footer={
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              onStartCustom();
            }}
            className="w-full sm:w-auto h-10 px-2 sm:px-4 rounded-xl text-[11px] sm:text-xs font-semibold truncate"
          >
            {t("dashboard.wizard.exampleBtnCustomStyle", isIndonesian ? "Atur sendiri" : "Pick my own style")}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleUseStyle}
            disabled={!activeItem?.designToken}
            className="w-full sm:w-auto h-10 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold gap-1.5 sm:gap-2 truncate"
          >
            <span className="truncate">{t("dashboard.wizard.exampleBtnUseStyle", isIndonesian ? "Pakai gaya ini" : "Use this style")}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 h-[72dvh] sm:h-[62vh]">
        {/* Category Tabs (if more than 1 category) */}
        {tabs.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 pb-0.5">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab?.key;
              return (
                <Button
                  key={tab.key}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => {
                    setActiveTabKey(tab.key);
                    if (tab.items[0]) setSelectedId(tab.items[0].id);
                  }}
                  className="shrink-0 rounded-full h-7 px-3 text-[11px] font-semibold"
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* Sub-pills for sites in the active tab */}
        {activeTab && activeTab.items.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {activeTab.items.map((sample) => {
              const isSelected = sample.id === activeItem?.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setSelectedId(sample.id)}
                  className={`inline-flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-foreground/10 text-foreground border-foreground/25 font-semibold"
                      : "bg-transparent text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
                  }`}
                >
                  <span>{sample.businessName}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Live Site URL pill */}
        {activeItem?.url && (
          <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground shrink-0">
            <span className="font-semibold text-foreground">
              {activeItem.businessName}
            </span>
            <a
              href={activeItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-mono font-medium hover:underline"
            >
              <span>{siteHost(activeItem.url)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Scrollable Real Template Preview */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-border/70 bg-muted/30 p-1.5 sm:p-3">
          <div
            className={`rounded-lg overflow-hidden border border-border/50 shadow-sm bg-white transition-all duration-200 min-h-[220px] flex items-center justify-center ${
              previewDevice === "mobile" ? "max-w-[390px] mx-auto w-full" : "w-full"
            }`}
          >
            {!activeItem ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2.5 text-muted-foreground">
                {sitesLoading ? <Spinner size="md" /> : null}
                <span className="text-xs">
                  {sitesLoading
                    ? isIndonesian ? "Memuat contoh website..." : "Loading examples..."
                    : isIndonesian ? "Belum ada contoh website." : "No examples yet."}
                </span>
              </div>
            ) : activeItem.isLoading || !activeItem.content ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2.5 text-muted-foreground">
                <Spinner size="md" />
                <span className="text-xs">
                  {isIndonesian ? "Memuat website..." : "Loading website..."}
                </span>
              </div>
            ) : (
              <TemplatePreview
                key={`${activeItem.id}-${previewDevice}`}
                templateId={activeItem.templateId}
                content={activeItem.content}
                designToken={activeItem.designToken}
                scaleBase={previewDevice === "mobile" ? 390 : 1280}
                scrollable
              />
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
