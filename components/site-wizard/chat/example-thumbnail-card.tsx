"use client";

import React from "react";
import { ChevronRight, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SHOWCASE_ITEMS } from "@/lib/landing-showcase-data";
import { CURATED_SHOWCASE_TABS } from "./curated-showcase-tabs";

interface ExampleThumbnailCardProps {
  onSeeAll: () => void;
  onSelectTab?: (showcaseIndex: number) => void;
  onDismiss?: () => void;
}

export function ExampleThumbnailCard({
  onSeeAll,
  onSelectTab,
  onDismiss,
}: ExampleThumbnailCardProps) {
  const { t, isIndonesian } = useI18n();

  return (
    <div
      className="relative rounded-2xl border border-white/15 p-3.5 space-y-2.5 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.06]"
      style={{ background: "rgba(20, 23, 30, 0.94)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Icon box */}
          <div
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.08]"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-white/75">
              <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.9" />
              <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.5" />
              <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.5" />
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.25" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-snug">
              {t("dashboard.wizard.exampleCardTitle", isIndonesian ? "Inspirasi Website" : "Website Inspiration")}
            </p>
            <p className="text-[11px] text-white/45 leading-tight truncate">
              {t("dashboard.wizard.exampleCardSubtitle", isIndonesian
                ? "Pilih gaya yang cocok buatmu"
                : "Pick a style that fits you")}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSeeAll}
            className="flex items-center gap-0.5 text-[11px] font-semibold text-white/55 hover:text-white/85 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t("dashboard.wizard.exampleCardSeeAll", isIndonesian ? "Lihat semua" : "See all")}
            <ChevronRight className="w-3 h-3" />
          </button>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label={isIndonesian ? "Tutup" : "Close"}
              title={isIndonesian ? "Tutup" : "Close"}
              className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/15 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail grid — 4 columns */}
      <div className="grid grid-cols-4 gap-1.5">
        {CURATED_SHOWCASE_TABS.map((item) => {
          const fallbackLabel = isIndonesian ? item.labelFallbackId : item.labelFallbackEn;
          const label = t(item.labelIdKey, fallbackLabel);
          const Icon = item.Icon;
          const primarySample = SHOWCASE_ITEMS[item.indices[0]];
          const thumbnailImageUrl = primarySample?.content?.hero?.image_url || item.imageUrl;

          return (
            <button
              key={item.labelIdKey}
              type="button"
              onClick={() => onSelectTab ? onSelectTab(item.indices[0]) : onSeeAll()}
              className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none"
            >
              {/* Image + artistic headline overlay */}
              <div className="relative overflow-hidden" style={{ height: 100 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailImageUrl}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark scrim — heavier at bottom for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)",
                  }}
                />

                {/* ── Artistic headline ── */}
                {/* Sub label — small tracking-widest at top-left */}
                <div
                  className="absolute top-1.5 left-1.5"
                  style={{
                    fontSize: "5.5px",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.65)",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {item.headlineSub}
                </div>

                {/* Thin horizontal rule under sub */}
                <div
                  className="absolute left-1.5"
                  style={{
                    top: "13px",
                    width: "18px",
                    height: "0.7px",
                    background: "rgba(255,255,255,0.35)",
                  }}
                />

                {/* Main word — large bold at bottom-left */}
                <div
                  className="absolute bottom-1 left-1.5 leading-none"
                  style={{
                    fontSize: "15px",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                    fontStyle: "italic",
                  }}
                >
                  {item.headlineMain}
                </div>

                {/* Accent word — rotated vertical on right edge */}
                <div
                  className="absolute"
                  style={{
                    right: "-1px",
                    bottom: "6px",
                    fontSize: "5px",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    lineHeight: 1,
                  }}
                >
                  {item.headlineAccent}
                </div>
              </div>

              {/* Label row */}
              <div
                className="flex items-center gap-1 px-2 py-1.5"
                style={{ background: "rgba(255,255,255,0.055)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Icon className="w-2.5 h-2.5 shrink-0 text-white/55" strokeWidth={1.8} />
                <span className="text-[9.5px] font-semibold text-white/65 truncate leading-tight">
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
