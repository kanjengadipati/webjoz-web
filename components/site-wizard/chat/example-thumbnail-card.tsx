"use client";

import React from "react";
import { ChevronRight, Coffee, Stethoscope, ShoppingBag, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ThumbnailItem {
  labelKey: string;
  labelFallbackId: string;
  labelFallbackEn: string;
  imageUrl: string;
  headlineId: string;
  headlineEn: string;
  Icon: React.ElementType;
  showcaseIndex: number;
}

const THUMBNAIL_ITEMS: ThumbnailItem[] = [
  {
    labelKey: "dashboard.wizard.exampleTabCafe",
    labelFallbackId: "Kafe & Kuliner",
    labelFallbackEn: "Cafe & F&B",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=70",
    headlineId: "Good Coffee,\nBetter Mood",
    headlineEn: "Good Coffee,\nBetter Mood",
    Icon: Coffee,
    showcaseIndex: 0,
  },
  {
    labelKey: "dashboard.wizard.exampleTabStore",
    labelFallbackId: "Toko & Fashion",
    labelFallbackEn: "Fashion Store",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",
    headlineId: "Style\nYour Way",
    headlineEn: "Style\nYour Way",
    Icon: ShoppingBag,
    showcaseIndex: 8,
  },
  {
    labelKey: "dashboard.wizard.exampleTabClinic",
    labelFallbackId: "Klinik & Jasa",
    labelFallbackEn: "Business",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=70",
    headlineId: "Grow Your\nBusiness\nFaster",
    headlineEn: "Grow Your\nBusiness\nFaster",
    Icon: Stethoscope,
    showcaseIndex: 7,
  },
  {
    labelKey: "dashboard.wizard.exampleTabConsultant",
    labelFallbackId: "Konsultan",
    labelFallbackEn: "Portfolio",
    imageUrl:
      "https://images.unsplash.com/photo-1529912626516-e58b23f44f1d?w=400&q=70",
    headlineId: "Create.\nInspire.",
    headlineEn: "Create.\nInspire.",
    Icon: Briefcase,
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
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3.5 space-y-3"
      style={{ background: "rgba(255,255,255,0.045)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/10"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {/* Grid icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white/80"
            >
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-tight truncate">
              {t(
                "dashboard.wizard.exampleCardTitle",
                isIndonesian ? "Lihat Contoh Gratis" : "Free Design Examples"
              )}
            </p>
            <p className="text-[11px] text-white/50 leading-tight truncate">
              {t(
                "dashboard.wizard.exampleCardSubtitle",
                isIndonesian
                  ? "Pilih salah satu contoh desain untuk inspirasi"
                  : "Pick a design example for inspiration"
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="shrink-0 flex items-center gap-0.5 text-[11px] font-semibold text-white/60 hover:text-white/90 transition-colors whitespace-nowrap pt-0.5"
        >
          {isIndonesian ? "Lihat semua" : "See all"}
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {THUMBNAIL_ITEMS.map((item) => {
          const label = isIndonesian ? item.labelFallbackId : item.labelFallbackEn;
          const headline = isIndonesian ? item.headlineId : item.headlineEn;
          const Icon = item.Icon;

          return (
            <button
              key={item.labelKey}
              type="button"
              onClick={() => {
                if (onSelectTab) {
                  onSelectTab(item.showcaseIndex);
                } else {
                  onSeeAll();
                }
              }}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              {/* Image with headline overlay */}
              <div className="relative h-[90px] sm:h-[104px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)",
                  }}
                />
                {/* Headline text */}
                <div className="absolute inset-0 flex items-start p-1.5">
                  <span
                    className="text-white font-black leading-[1.15] text-[9px] sm:text-[10px] drop-shadow-md whitespace-pre-line"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {headline}
                  </span>
                </div>
              </div>

              {/* Label row */}
              <div className="flex items-center gap-1 px-1.5 py-1.5">
                <Icon className="w-2.5 h-2.5 shrink-0 text-white/50" />
                <span className="text-[9px] sm:text-[10px] font-semibold text-white/70 truncate leading-tight">
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
