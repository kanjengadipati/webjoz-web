"use client";
import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Building2, Users, Award, Target, Sparkles, Check } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, HeroAccessory } from "../../templates/shared";
import { HeroCta, HeroImage } from "./primitives";
import { getHeroSlides } from "./images";
import { heroStrings } from "./hero-strings";

/**
 * Bento Hero — 07. Bento Hero
 *
 * Komposisi kontemporer dengan headline terpusat di atas dan panel bento grid
 * modular di bawah: kombinasi foto tim, statistik pencapaian, misi, dan tim.
 *
 * Peruntukan: SaaS, Startup, Company Profile, dan Agensi Modern.
 * ImageNeed: Optional (memiliki kartu metrik fallback bila tanpa foto).
 */
export default function HeroBentoHero({
  hero: h,
  language,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const s = heroStrings(language);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const handleEditingStateChange = useCallback((editing: boolean) => {
    setIsInlineEditing(editing);
    onEditingStateChange?.(editing);
  }, [onEditingStateChange]);

  const slides = getHeroSlides(h, { includeHidden: Boolean(isEditorMode) });
  const photo1 = h.image_url || slides[0]?.src;
  const photo2 = slides[1]?.src || photo1;

  // Ekstraksi data statistik dari hero.stats jika ada, atau gunakan default kontekstual
  const stat1 = h.stats?.[0] || { value: "100+", label: language === "en" ? "Projects Delivered" : "Proyek Tuntas" };
  const stat2 = h.stats?.[1] || { value: "98%", label: language === "en" ? "Satisfaction Rate" : "Tingkat Kepuasan" };
  const stat3 = h.stats?.[2] || { value: "24/7", label: language === "en" ? "Client Support" : "Dukungan Klien" };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "92vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header Bagian Atas: Centered Headline & Subheadline */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center mb-12 sm:mb-16">
          {(h.eyebrow || isEditorMode) && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.9rem",
                background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                color: "var(--dt-primary)",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              <Sparkles className="size-3.5" />
              <InlineText
                section="hero"
                fieldKey="eyebrow"
                value={h.eyebrow ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={handleEditingStateChange}
              />
            </span>
          )}

          <InlineText
            section="hero"
            fieldKey="headline"
            value={h.headline}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h1"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontStyle: "var(--dt-heading-style)" as any,
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
              lineHeight: 1.12,
              color: "var(--dt-text)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={handleEditingStateChange}
          />

          <div className="mt-5 max-w-2xl">
            <InlineText
              section="hero"
              fieldKey="subheadline"
              value={h.subheadline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                color: "var(--dt-text-muted)",
                lineHeight: 1.65,
                margin: 0,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />
          </div>

          <HeroAccessory
            accessory={h.accessory}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={handleEditingStateChange}
          />

          <div className="mt-8 flex items-center justify-center gap-4">
            <HeroCta
              href={h.cta_url}
              label={h.cta_text}
              fieldKey="cta_text"
              iconSize={15}
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2rem",
                background: "var(--dt-primary)",
                color: "var(--dt-on-primary, #ffffff)",
                textDecoration: "none",
                borderRadius: "var(--dt-radius, 12px)",
                fontWeight: 700,
                fontSize: "0.9rem",
                boxShadow: "0 10px 25px -5px color-mix(in srgb, var(--dt-primary) 35%, transparent)",
              }}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />
          </div>
        </div>

        {/* Panel Bento Grid Kontemporer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Panel 1: Foto Utama (md:col-span-5, row-span-2) */}
          <div className="md:col-span-5 md:row-span-2 rounded-2xl overflow-hidden border border-border/50 shadow-md relative min-h-[220px] bg-slate-900">
            {photo1 ? (
              <HeroImage
                src={photo1}
                alt={h.headline}
                credit={h.image_credit}
                language={language}
                fieldKey="image_url"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-end p-6 bg-gradient-to-tr from-slate-950 to-slate-800 text-white">
                <Target className="size-8 text-primary mb-3" />
                <h3 className="text-lg font-bold">{h.headline}</h3>
                <p className="text-xs text-slate-300 mt-1">{h.subheadline}</p>
              </div>
            )}
          </div>

          {/* Panel 2: Kartu Statistik Gelap Kontras (md:col-span-4) */}
          <div className="md:col-span-4 rounded-2xl p-5 border border-slate-800 bg-slate-950 text-white shadow-md flex flex-col justify-between">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
              {stat1.value}
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-200">{stat1.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {language === "en" ? "Committed to delivering exceptional results in every engagement" : "Dedikasi menghadirkan kualitas terbaik pada setiap kerja sama."}
              </div>
            </div>
          </div>

          {/* Panel 3: Kartu Misi / Nilai (md:col-span-3) */}
          <div
            className="md:col-span-3 rounded-2xl p-5 border shadow-sm flex flex-col justify-between"
            style={{
              background: "var(--dt-surface, #ffffff)",
              borderColor: "color-mix(in srgb, var(--dt-primary) 15%, var(--dt-border))",
              color: "var(--dt-text)",
            }}
          >
            <div className="text-sm font-mono font-bold text-primary">01</div>
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === "en" ? "Mission" : "Misi"}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {language === "en" ? "Delivering smart, scalable solutions that elevate your brand." : "Mewujudkan solusi digital berstandar tinggi yang memperkuat bisnis Anda."}
              </div>
            </div>
          </div>

          {/* Panel 4: Kartu Aksen Brand (Warna Primary/Accent) (md:col-span-3) */}
          <div
            className="md:col-span-3 rounded-2xl p-5 shadow-md flex flex-col justify-between text-white"
            style={{
              background: "var(--dt-primary)",
            }}
          >
            <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
              {stat2.value}
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-white/95">{stat2.label}</div>
              <div className="text-[11px] text-white/80 mt-0.5">
                {language === "en" ? "Consistent positive feedback across verified clients." : "Feedback positif konsisten dari pelanggan terverifikasi."}
              </div>
            </div>
          </div>

          {/* Panel 5: Kartu Stat Tambahan (md:col-span-4) */}
          <div
            className="md:col-span-4 rounded-2xl p-5 border shadow-sm flex flex-col justify-between"
            style={{
              background: "var(--dt-surface, #ffffff)",
              borderColor: "color-mix(in srgb, var(--dt-primary) 15%, var(--dt-border))",
              color: "var(--dt-text)",
            }}
          >
            <div className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {stat3.value}
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-foreground">{stat3.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {language === "en" ? "Reliable readiness whenever you need assistance." : "Kesiapan responsif kapan pun Anda membutuhkan dukungan."}
              </div>
            </div>
          </div>

          {/* Panel 6: Foto Sekunder / Studio (md:col-span-5) */}
          <div className="md:col-span-5 rounded-2xl overflow-hidden border border-border/50 shadow-md relative min-h-[140px] bg-slate-900">
            {photo2 ? (
              <HeroImage
                src={photo2}
                alt={`${h.headline} detail`}
                credit={slides[1]?.credit || h.image_credit}
                language={language}
                fieldKey="images.1"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full p-4 flex items-center justify-between bg-muted/40 text-xs">
                <span className="font-semibold">{h.badge_text || "Modern Innovation"}</span>
                <Sparkles className="size-4 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
