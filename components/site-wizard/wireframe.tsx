"use client";

import React from "react";
import { WIREFRAME_STEPS } from "./constants";
import type { ChatStage } from "./types";
import { buildCssVars, loadGoogleFont } from "../templates/helpers";
import { useI18n } from "@/lib/i18n/context";

interface WireframeProps {
  businessName: string;
  businessType: string;
  businessSubType: string;
  description: string;
  chatStage: ChatStage;
  designToken?: Record<string, any> | null;
}

function isHighlighted(stage: ChatStage): boolean {
  return stage === "done";
}

export function Wireframe({ businessName, businessType, businessSubType, description, chatStage, designToken }: WireframeProps) {
  const { t } = useI18n();
  const highlight = isHighlighted(chatStage);
  const wireframeStepLabels = [
    t("dashboard.wizard.wireframeAbout", "Tentang"),
    t("dashboard.wizard.wireframeFeatures", "Keunggulan"),
    t("dashboard.wizard.wireframeContact", "Kontak"),
  ];

  const cssVars = React.useMemo(() => buildCssVars(designToken), [designToken]);

  React.useEffect(() => {
    if (designToken) {
      loadGoogleFont(designToken?.typography?.heading_font, designToken?.typography?.body_font);
    }
  }, [designToken]);

  const skeletonSubtle = designToken
    ? { background: "color-mix(in srgb, var(--dt-text) 4%, transparent)" }
    : undefined;

  const skeletonSoft = designToken
    ? { background: "color-mix(in srgb, var(--dt-text) 6%, transparent)" }
    : undefined;

  const skeletonStrong = designToken
    ? { background: "color-mix(in srgb, var(--dt-text) 8%, transparent)" }
    : undefined;

  const skeletonPanel = designToken
    ? {
        background: "color-mix(in srgb, var(--dt-text) 3.5%, transparent)",
        border: "1px solid color-mix(in srgb, var(--dt-text) 5.5%, transparent)"
      }
    : {
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.065)"
      };

  return (
    <div
      className="h-full overflow-y-auto p-4 sm:p-8 transition-colors duration-500 relative"
      style={{
        background: designToken ? "var(--dt-bg)" : "#0d0f14",
        color: designToken ? "var(--dt-text)" : "#cbd5e1",
        fontFamily: designToken ? "var(--dt-body-font)" : "inherit",
        ...cssVars
      }}
    >
      {/* ── Glowing AI Scanline Beam traversing down the canvas ── */}
      <div className="animate-canvas-scanline pointer-events-none" />

      <div className="w-full max-w-xl lg:max-w-3xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        {designToken && (
          <div
            className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full w-fit text-[11px] font-medium animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm"
            style={{
              background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)",
              color: "var(--dt-primary)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ background: "var(--dt-primary)" }}
            />
            <span>Pratinjau desain — hasil akhir sedang dibuat AI</span>
          </div>
        )}

        {/* ── Navbar Skeleton ── */}
        <header
          className="flex justify-between items-center gap-3 pb-4 sm:pb-6 transition-colors duration-500"
          style={{ borderBottom: designToken ? "1px solid var(--dt-border)" : "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {businessName ? (
              <div
                className="py-1.5 px-3 flex items-center rounded-lg text-xs sm:text-sm font-bold truncate max-w-[150px] sm:max-w-none whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-400 shadow-sm animate-skeleton-shimmer"
                style={{
                  background: designToken ? "var(--dt-primary-soft)" : "color-mix(in srgb, var(--primary) 25%, transparent)",
                  border: designToken ? "1px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)" : "1px solid color-mix(in srgb, var(--primary) 40%, transparent)",
                  color: designToken ? "var(--dt-primary)" : "white"
                }}
              >
                {businessName}
              </div>
            ) : (
              <div className="h-7 w-24 sm:w-28 rounded-lg animate-skeleton-shimmer-strong" style={skeletonStrong} />
            )}
          </div>
          <div className="flex gap-2 sm:gap-4 items-center shrink-0">
            {businessType ? (
              <div className="hidden sm:flex gap-3 items-center animate-in fade-in duration-400">
                {wireframeStepLabels.map((l, i) => (
                  <span
                    key={l}
                    className="text-[11px] font-medium transition-colors"
                    style={{ color: designToken ? "var(--dt-text-muted)" : "#94a3b8" }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            ) : (
              <div className="hidden sm:flex gap-2 items-center">
                {WIREFRAME_STEPS.map((_, i) => (
                  <div key={i} className="h-4 w-14 rounded-md animate-skeleton-shimmer" style={skeletonSoft} />
                ))}
              </div>
            )}
            <div className="h-7 sm:h-8 w-16 sm:w-24 rounded-lg animate-skeleton-shimmer-strong shrink-0" style={skeletonStrong} />
          </div>
        </header>

        {/* ── Hero Banner Skeleton (With glowing card sweep) ── */}
        <section
          className="relative rounded-3xl overflow-hidden transition-all duration-500 animate-skeleton-card-shimmer"
          style={{
            ...skeletonPanel,
            minHeight: 260,
            border: highlight
              ? (designToken ? "1px solid var(--dt-primary)" : "1px solid color-mix(in srgb, var(--primary) 45%, transparent)")
              : (designToken ? "1px solid var(--dt-border)" : "1px solid rgba(255,255,255,0.08)"),
            boxShadow: highlight
              ? (designToken ? "0 0 35px color-mix(in srgb, var(--dt-primary) 18%, transparent)" : "0 0 25px rgba(255,255,255,0.03)")
              : "none",
          }}
        >
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-12 gap-3.5 sm:gap-4.5">
            {businessType ? (
              <div
                className="h-5 w-fit px-3 flex items-center rounded-full text-[10px] font-bold uppercase tracking-widest animate-in fade-in duration-400 shadow-sm animate-skeleton-shimmer"
                style={{
                  background: designToken ? "var(--dt-primary-soft)" : "color-mix(in srgb, var(--primary) 20%, transparent)",
                  color: designToken ? "var(--dt-primary)" : "var(--primary)",
                  border: designToken ? "1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)" : "1px solid color-mix(in srgb, var(--primary) 30%, transparent)"
                }}
              >
                {(() => {
                  const categoryKeyMap: Record<string, string> = {
                    "Kuliner": "kuliner",
                    "Toko": "tokoUmkm",
                    "Toko & UMKM": "tokoUmkm",
                    "Layanan & Reservasi": "jasaBooking",
                    "Jasa & Booking": "jasaBooking",
                    "Kreatif & Profesional": "portofolioKreator",
                    "Portofolio & Kreator": "portofolioKreator",
                    "Company Profile": "company",
                    "Company": "company",
                  };
                  const typeKey = categoryKeyMap[businessType];
                  const translatedType = typeKey ? t(`dashboard.wizard.categories.${typeKey}`, businessType) : businessType;
                  const translatedSubType = businessSubType ? t(`dashboard.wizard.subtypes.${businessSubType}`, businessSubType) : "";
                  return translatedSubType || translatedType;
                })()}
              </div>
            ) : (
              <div className="h-5 w-24 rounded-full animate-skeleton-shimmer-strong" style={skeletonStrong} />
            )}

            <div className="space-y-2.5">
              {businessName ? (
                <div
                  className="min-h-10 py-1 px-3 flex items-center rounded-xl font-black text-lg sm:text-2xl truncate leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm animate-skeleton-shimmer-strong"
                  style={{
                    background: designToken ? "var(--dt-surface)" : "rgba(255,255,255,0.06)",
                    color: designToken ? "var(--dt-text)" : "white",
                    fontFamily: designToken ? "var(--dt-heading-font)" : "inherit"
                  }}
                >
                  {businessName}
                </div>
              ) : (
                <div className="h-10 w-3/4 rounded-xl animate-skeleton-shimmer-strong" style={skeletonStrong} />
              )}
              {description ? (
                <div
                  className="min-h-7 py-1 px-3 flex items-center rounded-lg text-xs animate-in fade-in duration-500 animate-skeleton-shimmer"
                  style={{
                    background: designToken ? "var(--dt-surface)" : "rgba(255,255,255,0.04)",
                    color: designToken ? "var(--dt-text-muted)" : "#cbd5e1"
                  }}
                >
                  <span className="truncate">{description.slice(0, 70)}{description.length > 70 ? "..." : ""}</span>
                </div>
              ) : (
                <div className="h-6 w-1/2 rounded-lg animate-skeleton-shimmer" style={skeletonSoft} />
              )}
            </div>

            <div className="h-4 w-2/3 rounded-md animate-skeleton-shimmer" style={skeletonSoft} />

            <div
              className="h-11 w-40 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm animate-skeleton-shimmer-strong"
              style={highlight
                ? {
                    background: designToken ? "var(--dt-primary)" : "color-mix(in srgb, var(--primary) 75%, transparent)",
                    color: designToken ? "var(--dt-primary-foreground)" : "var(--primary-foreground)",
                    border: designToken ? "1px solid var(--dt-primary)" : "1px solid color-mix(in srgb, var(--primary) 85%, transparent)"
                  }
                : { ...skeletonStrong }
              }
            >
              {highlight ? "Pesan Sekarang →" : <div className="h-full w-full rounded-xl animate-skeleton-shimmer-strong" />}
            </div>
          </div>
          
          {/* Subtle background gradient shape */}
          <div className="absolute right-0 inset-y-0 w-2/5 animate-skeleton-shimmer" style={skeletonSubtle} />
        </section>

        {/* ── Grid Cards Skeleton (Staggered Wave Shimmer) ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl space-y-3 transition-all duration-300 animate-skeleton-card-shimmer ${!designToken && description && i === 0 ? "ring-1 ring-primary/40" : ""}`}
              style={{
                ...skeletonPanel,
                animationDelay: `${i * 150}ms`,
                border: (designToken && description && i === 0) ? "1px solid var(--dt-primary)" : undefined
              }}
            >
              <div className="w-9 h-9 rounded-xl animate-skeleton-shimmer-strong" style={skeletonStrong} />
              <div className="h-3.5 w-3/4 rounded-md animate-skeleton-shimmer-strong" style={skeletonStrong} />
              <div className="h-2.5 w-full rounded-md animate-skeleton-shimmer" style={skeletonSoft} />
              <div className="h-2.5 w-2/3 rounded-md animate-skeleton-shimmer" style={skeletonSoft} />
            </div>
          ))}
        </section>

        {/* ── Story / About Section Skeleton ── */}
        <section 
          className="flex flex-col sm:flex-row gap-6 items-center p-6 sm:p-8 rounded-3xl animate-in fade-in duration-500 animate-skeleton-card-shimmer" 
          style={skeletonPanel}
        >
          <div className="flex-1 w-full space-y-3.5">
            <div className="h-6 w-2/3 rounded-lg animate-skeleton-shimmer-strong" style={skeletonStrong} />
            <div className="h-3 w-full rounded-md animate-skeleton-shimmer" style={skeletonSoft} />
            <div className="h-3 w-5/6 rounded-md animate-skeleton-shimmer" style={skeletonSoft} />
            <div className="h-3 w-4/6 rounded-md animate-skeleton-shimmer" style={skeletonSoft} />
          </div>
          <div className="w-full sm:w-36 h-32 sm:h-36 rounded-2xl shrink-0 animate-skeleton-shimmer-strong" style={skeletonStrong} />
        </section>

        {chatStage === "done" && (
          <div
            className="flex items-center gap-2 text-xs pt-2 pb-6"
            style={{ color: designToken ? "var(--dt-text-muted)" : "rgba(255,255,255,0.5)" }}
          >
            <div
              className="w-2 h-2 rounded-full animate-ping"
              style={{ background: designToken ? "var(--dt-primary)" : "currentColor" }}
            />
            <span>AI sedang menyusun tata letak & konten untuk {businessName || "bisnis Anda"}...</span>
          </div>
        )}
      </div>
    </div>
  );
}
