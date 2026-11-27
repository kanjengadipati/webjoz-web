"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowRight, Smartphone, Monitor, ExternalLink } from "lucide-react";
import { Dialog, Button, SparkleGenAI } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import { SHOWCASE_ITEMS, findShowcaseSample } from "@/lib/landing-showcase-data";
import { TemplatePreview, getDesignToken } from "@/components/landing-template-showcase";
import {
  useMockupShowcaseSites,
  useAllRealSitesData,
  siteHost,
} from "@/lib/mockup-showcase-sites";
import { CURATED_SHOWCASE_TABS } from "./curated-showcase-tabs";

export interface ShowcaseDisplayItem {
  id: string;
  businessName: string;
  templateId: string;
  content: any;
  designToken: any;
  isRealSite: boolean;
  siteUrl?: string;
  mood?: string | number;
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
  const { sites } = useMockupShowcaseSites();
  const realSitesData = useAllRealSitesData(sites);

  // Map category index to tab index:
  // 0: Kuliner -> Tab 0 (Kuliner)
  // 1: Jasa -> Tab 2 (Layanan & Reservasi)
  // 2: Produk -> Tab 1 (Toko Online & Retail)
  // others -> Tab 3 (Kreatif & Profesional)
  const getTabIdxForCategory = (cat?: number): number => {
    if (cat === 0) return 0;
    if (cat === 1) return 2;
    if (cat === 2) return 1;
    return 3;
  };

  const displayTabs = useMemo(() => {
    return CURATED_SHOWCASE_TABS.map((tab, tabIdx) => {
      // 1. Collect real sites for this tab
      const matchingRealSites = sites.filter((s) => {
        if (s.category !== undefined) {
          return getTabIdxForCategory(s.category) === tabIdx;
        }
        const name = s.businessName.toLowerCase();
        if (tabIdx === 0 && (name.includes("kopi") || name.includes("kuliner") || name.includes("resto"))) return true;
        if (tabIdx === 2 && (name.includes("dev") || name.includes("jasa") || name.includes("service"))) return true;
        return false;
      });

      const realItems: ShowcaseDisplayItem[] = matchingRealSites.map((s) => {
        const host = siteHost(s.url);
        const data = realSitesData[host];
        const fallback = findShowcaseSample(
          tabIdx === 0 ? "kuliner" : tabIdx === 1 ? "toko online" : tabIdx === 2 ? "jasa" : "kreatif"
        );
        const fallbackToken = getDesignToken(fallback.templateId);

        return {
          id: s.url || s.businessName,
          businessName: s.businessName,
          templateId: data?.templateId || fallback.templateId,
          content: data?.content || fallback.content,
          designToken: data?.design_token || fallbackToken,
          isRealSite: true,
          siteUrl: s.url,
          mood: s.mood || data?.design_token?.mood || fallbackToken.mood,
        };
      });

      // 2. Static curated items for this tab
      const staticItems: ShowcaseDisplayItem[] = tab.indices
        .map((idx) => SHOWCASE_ITEMS[idx])
        .filter(Boolean)
        .map((item) => ({
          id: item.businessName,
          businessName: item.businessName,
          templateId: item.templateId,
          content: item.content,
          designToken: getDesignToken(item.templateId),
          isRealSite: false,
          mood: (item as any).mood || "professional",
        }));

      return {
        ...tab,
        items: [...realItems, ...staticItems],
      };
    }).filter((t) => t.items.length > 0);
  }, [sites, realSitesData]);

  // Compute the initial item to select
  const initialItem = useMemo(() => {
    if (typeof initialTabIndex === "number") {
      if (initialTabIndex >= 0 && initialTabIndex < displayTabs.length) {
        return displayTabs[initialTabIndex].items[0];
      }
      const sample = SHOWCASE_ITEMS[initialTabIndex];
      if (sample) {
        for (const tab of displayTabs) {
          const match = tab.items.find((it) => it.businessName === sample.businessName);
          if (match) return match;
        }
      }
    }
    if (initialBusinessType) {
      const lower = initialBusinessType.toLowerCase();
      let targetTabIdx = -1;
      if (lower.includes("kuliner") || lower.includes("makan") || lower.includes("kopi") || lower.includes("cafe")) {
        targetTabIdx = 0;
      } else if (lower.includes("toko") || lower.includes("produk") || lower.includes("retail") || lower.includes("fashion")) {
        targetTabIdx = 1;
      } else if (lower.includes("jasa") || lower.includes("layanan") || lower.includes("service") || lower.includes("dev") || lower.includes("software")) {
        targetTabIdx = 2;
      } else if (lower.includes("kreatif") || lower.includes("portofolio") || lower.includes("desain") || lower.includes("legal")) {
        targetTabIdx = 3;
      }
      if (targetTabIdx >= 0 && displayTabs[targetTabIdx]) {
        return displayTabs[targetTabIdx].items[0];
      }
    }
    return displayTabs[0]?.items[0];
  }, [initialBusinessType, initialTabIndex, displayTabs]);

  const [selectedId, setSelectedId] = useState<string>(() => initialItem?.id || "");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");

  // Sync when modal re-opens with a new initialTabIndex and detect mobile screen
  useEffect(() => {
    if (open && initialItem) {
      setSelectedId(initialItem.id);
      if (typeof window !== "undefined") {
        setPreviewDevice(window.innerWidth < 640 ? "mobile" : "desktop");
      }
    }
  }, [open, initialItem]);

  const activeTab = useMemo(() => {
    return displayTabs.find((tab) => tab.items.some((it) => it.id === selectedId)) || displayTabs[0];
  }, [displayTabs, selectedId]);

  const activeItem = useMemo(() => {
    return activeTab?.items.find((it) => it.id === selectedId) || activeTab?.items[0] || initialItem;
  }, [activeTab, selectedId, initialItem]);

  const handleUseStyle = () => {
    if (!activeItem) return;
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
            className="w-full sm:w-auto h-10 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold gap-1.5 sm:gap-2 truncate"
          >
            <span className="truncate">{t("dashboard.wizard.exampleBtnUseStyle", isIndonesian ? "Pakai gaya ini" : "Use this style")}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 h-[72dvh] sm:h-[62vh]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 pb-0.5">
          {displayTabs.map((tab) => {
            const isActive = tab.items.some((item) => item.id === activeItem?.id);
            const label = isIndonesian ? tab.labelFallbackId : tab.labelFallbackEn;
            return (
              <Button
                key={tab.labelIdKey}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => setSelectedId(tab.items[0]?.id || "")}
                className="shrink-0 rounded-full h-7 px-3 text-[11px] font-semibold"
              >
                {t(tab.labelIdKey, label)}
              </Button>
            );
          })}
        </div>

        {/* Sub-pills when the active category has multiple examples */}
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
                  {sample.isRealSite && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                  <span>{sample.businessName}</span>
                  {sample.isRealSite && (
                    <span className="text-[9px] font-semibold tracking-wide uppercase px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Real
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Live Site URL pill if the active item is a real generated site */}
        {activeItem?.isRealSite && activeItem?.siteUrl && (
          <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isIndonesian ? "Website hasil generate AI nyata" : "Real AI-generated site"}</span>
            </span>
            <a
              href={activeItem.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-mono font-medium hover:underline"
            >
              <span>{siteHost(activeItem.siteUrl)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Scrollable Real Template Preview */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-border/70 bg-muted/30 p-1.5 sm:p-3">
          <div
            className={`rounded-lg overflow-hidden border border-border/50 shadow-sm bg-white transition-all duration-200 ${
              previewDevice === "mobile" ? "max-w-[390px] mx-auto" : "w-full"
            }`}
          >
            {activeItem && (
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
