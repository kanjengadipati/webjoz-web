"use client";

import React from "react";
import { ChevronRight, Coffee, ShoppingBag, TrendingUp, Palette } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ThumbnailItem {
  labelShortId: string;
  labelShortEn: string;
  imageUrl: string;
  headlineId: string;
  headlineEn: string;
  Icon: React.ElementType;
  showcaseIndex: number;
}

const THUMBNAIL_ITEMS: ThumbnailItem[] = [
  {
    labelShortId: "Coffee Shop",
    labelShortEn: "Coffee Shop",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=70",
    headlineId: "Good Coffee,\nBetter Mood",
    headlineEn: "Good Coffee,\nBetter Mood",
    Icon: Coffee,
    showcaseIndex: 0,
  },
  {
    labelShortId: "Fashion Store",
    labelShortEn: "Fashion Store",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",
    headlineId: "Style\nYour Way",
    headlineEn: "Style\nYour Way",
    Icon: ShoppingBag,
    showcaseIndex: 8,
  },
  {
    labelShortId: "Business Consulting",
    labelShortEn: "Business Consulting",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=70",
    headlineId: "Grow Your\nBusiness\nFaster",
    headlineEn: "Grow Your\nBusiness\nFaster",
    Icon: TrendingUp,
    showcaseIndex: 7,
  },
  {
    labelShortId: "Portfolio",
    labelShortEn: "Portfolio",
    imageUrl:
      "https://images.unsplash.com/photo-1529912626516-e58b23f44f1d?w=400&q=70",
    headlineId: "Create.\nInspire.",
    headlineEn: "Create.\nInspire.",
    Icon: Palette,
    showcaseIndex: 1,
  },
];

interface ExampleThumbnailCardProps {
  onSeeAll: () => void;
  onSelectTab?: (showcaseIndex: number) => void;
}

export function ExampleThumbnailCard({
  onSeeAll,
  onSelectTab,
}: ExampleThumbnailCardProps) {
  const { t, isIndonesian } = useI18n();

  return (
    <div
      className="rounded-2xl border border-white/[0.09] p-3 space-y-2.5"
      style={{ background: "rgba(255,255,255,0.04)" }}
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
              {t("dashboard.wizard.exampleCardTitle", isIndonesian ? "Lihat Contoh Website" : "Browse Website Examples")}
            </p>
            <p className="text-[11px] text-white/45 leading-tight truncate">
              {t("dashboard.wizard.exampleCardSubtitle", isIndonesian
                ? "Pilih salah satu contoh desain untuk inspirasi"
                : "Pick a design example for inspiration")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="shrink-0 flex items-center gap-0.5 text-[11px] font-semibold text-white/50 hover:text-white/80 transition-colors whitespace-nowrap mt-0.5"
        >
          {isIndonesian ? "Lihat semua contoh" : "See all"}
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Thumbnail grid — 4 columns */}
      <div className="grid grid-cols-4 gap-1.5">
        {THUMBNAIL_ITEMS.map((item) => {
          const label = isIndonesian ? item.labelShortId : item.labelShortEn;
          const headline = isIndonesian ? item.headlineId : item.headlineEn;
          const Icon = item.Icon;

          return (
            <button
              key={item.labelShortEn}
              type="button"
              onClick={() => onSelectTab ? onSelectTab(item.showcaseIndex) : onSeeAll()}
              className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none"
            >
              {/* Image + headline overlay */}
              <div className="relative overflow-hidden" style={{ height: 100 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Scrim */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(160deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.5) 100%)",
                  }}
                />
                {/* Headline */}
                <div className="absolute top-1.5 left-1.5 right-1">
                  <span
                    className="text-white font-extrabold leading-[1.2] whitespace-pre-line"
                    style={{ fontSize: "9.5px", textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
                  >
                    {headline}
                  </span>
                </div>
              </div>

              {/* Label row — separate section below image */}
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

