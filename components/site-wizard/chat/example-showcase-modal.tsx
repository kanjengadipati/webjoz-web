"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowRight, Smartphone, Monitor } from "lucide-react";
import { Dialog, Button, SparkleGenAI } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import { SHOWCASE_ITEMS, findShowcaseSample } from "@/lib/landing-showcase-data";
import { TemplatePreview, getDesignToken } from "@/components/landing-template-showcase";
import { CURATED_SHOWCASE_TABS } from "./curated-showcase-tabs";

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

  const initialSample = useMemo(() => {
    // If a specific tab index is provided, use that
    if (typeof initialTabIndex === "number") {
      return SHOWCASE_ITEMS[initialTabIndex] ?? SHOWCASE_ITEMS[0];
    }
    if (initialBusinessType) {
      return findShowcaseSample(initialBusinessType);
    }
    return SHOWCASE_ITEMS[0];
  }, [initialBusinessType, initialTabIndex]);

  const [selectedBusinessName, setSelectedBusinessName] = useState<string>(
    initialSample.businessName
  );
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");

  // Sync when modal re-opens with a new initialTabIndex and detect mobile screen
  useEffect(() => {
    if (open) {
      setSelectedBusinessName(initialSample.businessName);
      if (typeof window !== "undefined") {
        setPreviewDevice(window.innerWidth < 640 ? "mobile" : "desktop");
      }
    }
  }, [open, initialSample]);

  const activeSample =
    SHOWCASE_ITEMS.find((item) => item.businessName === selectedBusinessName) ||
    initialSample;
  const activeToken = getDesignToken(activeSample.templateId);

  const tabs = CURATED_SHOWCASE_TABS.map((c) => ({
    ...c,
    items: c.indices.map((idx) => SHOWCASE_ITEMS[idx]).filter(Boolean),
  })).filter((c) => c.items.length > 0);

  // If ad URL targeted a specific industry outside curated tabs, prepend it
  const hasInitialInCurated = tabs.some((t) =>
    t.items.some((item) => item.businessName === initialSample.businessName)
  );
  const displayTabs =
    initialBusinessType && !hasInitialInCurated
      ? [
          {
            indices: [-1],
            labelIdKey: "dashboard.wizard.categories.kuliner" as const,
            labelFallbackId: initialSample.businessName,
            labelFallbackEn: initialSample.businessName,
            items: [initialSample],
          },
          ...tabs,
        ]
      : tabs;

  const activeTab = displayTabs.find((tab) =>
    tab.items.some((item) => item.businessName === activeSample.businessName)
  );

  const handleUseStyle = () => {
    const styleToken: Record<string, any> = {
      palette: activeToken.palette,
      typography: activeToken.typography,
      ...(activeToken.layout?.corner_radius
        ? { layout: { corner_radius: activeToken.layout.corner_radius } }
        : {}),
      mood: activeToken.mood,
      theme_mode: activeToken.theme_mode,
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
            const isActive = tab.items.some(
              (item) => item.businessName === activeSample.businessName
            );
            const label = isIndonesian ? tab.labelFallbackId : tab.labelFallbackEn;
            return (
              <Button
                key={tab.labelIdKey}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => setSelectedBusinessName(tab.items[0].businessName)}
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
              const isSelected = sample.businessName === activeSample.businessName;
              return (
                <button
                  key={sample.businessName}
                  type="button"
                  onClick={() => setSelectedBusinessName(sample.businessName)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-foreground/10 text-foreground border-foreground/25 font-semibold"
                      : "bg-transparent text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
                  }`}
                >
                  {sample.businessName}
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable Real Template Preview (0 AI tokens) */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-border/70 bg-muted/30 p-1.5 sm:p-3">
          <div
            className={`rounded-lg overflow-hidden border border-border/50 shadow-sm bg-white transition-all duration-200 ${
              previewDevice === "mobile" ? "max-w-[390px] mx-auto" : "w-full"
            }`}
          >
            <TemplatePreview
              key={`${activeSample.templateId}-${previewDevice}`}
              templateId={activeSample.templateId}
              content={activeSample.content}
              designToken={activeToken}
              scaleBase={previewDevice === "mobile" ? 390 : 1280}
              scrollable
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

