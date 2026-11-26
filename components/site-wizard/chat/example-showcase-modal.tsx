"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
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

  // Sync when modal re-opens with a new initialTabIndex
  useEffect(() => {
    if (open) {
      setSelectedBusinessName(initialSample.businessName);
    }
  }, [open, initialSample]);

  const activeSample =
    SHOWCASE_ITEMS.find((item) => item.businessName === selectedBusinessName) ||
    initialSample;
  const activeToken = getDesignToken(activeSample.templateId);

  const tabs = CURATED_SHOWCASE_TABS.map((c) => ({
    ...c,
    item: SHOWCASE_ITEMS[c.index],
  })).filter((c) => Boolean(c.item));

  // If ad URL targeted a specific industry outside curated tabs, prepend it
  const hasInitialInCurated = tabs.some(
    (t) => t.item.businessName === initialSample.businessName
  );
  const displayTabs =
    initialBusinessType && !hasInitialInCurated
      ? [
          {
            index: -1,
            labelIdKey: "dashboard.wizard.exampleTabCafe" as const,
            labelFallbackId: initialSample.businessName,
            labelFallbackEn: initialSample.businessName,
            item: initialSample,
          },
          ...tabs,
        ]
      : tabs;

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
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground border border-border/60">
            <SparkleGenAI className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-sm sm:text-base text-foreground truncate">
              {t("dashboard.wizard.exampleShowcaseTitle", isIndonesian ? "Contoh Hasil Website AI" : "Real AI Website Examples")}
            </span>
            <span className="block text-[11px] font-normal text-muted-foreground truncate">
              {t("dashboard.wizard.exampleShowcaseSubtitle", isIndonesian
                ? "Dibuat otomatis dalam hitungan menit — scroll untuk lihat detailnya"
                : "Generated in minutes — scroll to inspect the full layout")}
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              onStartCustom();
            }}
            className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-semibold"
          >
            {t("dashboard.wizard.exampleBtnCustomStyle", isIndonesian ? "Atur gaya sendiri" : "Pick my own style")}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleUseStyle}
            className="w-full sm:w-auto h-10 px-5 rounded-xl text-xs sm:text-sm font-bold gap-2"
          >
            <span>{t("dashboard.wizard.exampleBtnUseStyle", isIndonesian ? "Pakai gaya ini" : "Use this style")}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 h-[62dvh] sm:h-[60vh]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 pb-0.5">
          {displayTabs.map((tab) => {
            const isActive = activeSample.businessName === tab.item.businessName;
            const label = isIndonesian ? tab.labelFallbackId : tab.labelFallbackEn;
            return (
              <Button
                key={tab.item.businessName}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => setSelectedBusinessName(tab.item.businessName)}
                className="shrink-0 rounded-full h-7 px-3 text-[11px] font-semibold"
              >
                {t(tab.labelIdKey, label)}
              </Button>
            );
          })}
        </div>

        {/* Scrollable Real Template Preview (0 AI tokens) */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-border/70 bg-muted/30 p-2 sm:p-3">
          <div className="rounded-lg overflow-hidden border border-border/50 shadow-sm bg-white">
            <TemplatePreview
              templateId={activeSample.templateId}
              content={activeSample.content}
              designToken={activeToken}
              scaleBase={1280}
              scrollable
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

