"use client";
import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Play, ArrowRight, CheckCircle2, TrendingUp, Calendar, ChevronDown } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, HeroAccessory } from "../../templates/shared";
import { HeroCta, HeroImage, HERO_HEADING_SIZE } from "./primitives";
import { heroStrings } from "./hero-strings";

/**
 * Editorial Asymmetric — 01. Editorial Asymmetric
 *
 * Layout asimetris ala majalah digital/agensi modern.
 * Kiri: Headline display besar dengan eyebrow tag dan tombol aksi ganda.
 * Kanan: Kartu analitik/UI mockup bertumpuk asimetris sedikit keluar dari grid.
 *
 * Peruntukan: Agency, konsultan, dan bisnis profesional B2B.
 * ImageNeed: Optional (memiliki visual mockup UI bila tanpa foto).
 */
export default function HeroEditorialAsymmetric({
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

  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "90vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      {/* Background subtle editorial grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--dt-primary) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--dt-primary) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Kolom Kiri: Headline & CTA (span 6-7 cols) */}
          <div className="flex flex-col items-start lg:col-span-6 xl:col-span-7">
            {/* Eyebrow badge */}
            {(h.eyebrow || isEditorMode) && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.85rem",
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
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
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

            {/* Headline besar dengan ikon aksen */}
            <div className="relative w-full">
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
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  lineHeight: 1.08,
                  color: "var(--dt-text)",
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={handleEditingStateChange}
              />
              <span className="inline-block ml-2 text-primary opacity-80 select-none align-middle">
                <Sparkles className="size-6 sm:size-8" style={{ color: "var(--dt-primary)" }} />
              </span>
            </div>

            {/* Subheadline */}
            <div className="mt-5 max-w-xl">
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

            {/* Tombol aksi ganda */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
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
                  padding: "0.85rem 1.75rem",
                  background: "var(--dt-primary)",
                  color: "var(--dt-on-primary, #ffffff)",
                  textDecoration: "none",
                  borderRadius: "9999px",
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

              {(hasSecondary || isEditorMode) && (
                <HeroCta
                  href={h.cta_secondary_url || "#"}
                  label={h.cta_secondary_text || (language === "en" ? "Watch Video" : "Pelajari Selengkapnya")}
                  fieldKey="cta_secondary_text"
                  icon={<Play className="size-3.5 fill-current" />}
                  iconPosition="start"
                  className="transition-colors hover:bg-slate-500/10"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.85rem 1.5rem",
                    background: "var(--dt-surface, rgba(255,255,255,0.06))",
                    border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, var(--dt-border))",
                    color: "var(--dt-text)",
                    textDecoration: "none",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                  }}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={handleEditingStateChange}
                />
              )}
            </div>

            {/* Small decorative stamp badge */}
            <div className="mt-10 flex items-center gap-3 text-xs opacity-70">
              <div
                className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center font-mono font-bold"
                style={{ borderColor: "var(--dt-primary)", color: "var(--dt-primary)" }}
              >
                ★
              </div>
              <InlineText
                section="hero"
                fieldKey="badge_text"
                value={h.badge_text ?? ""}
                placeholder={language === "en" ? "Curated by verified specialists" : "Teruji & direkomendasikan klien profesional"}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                style={{ color: "var(--dt-text-muted)" }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={handleEditingStateChange}
              />
            </div>
          </div>

          {/* Kolom Kanan: Asymmetric Offset Cards (span 6-5 cols) */}
          <div className="relative lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Back Card: Main Visual / Sales Overview Chart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl p-5 shadow-2xl border overflow-hidden"
                style={{
                  background: "var(--dt-surface, #ffffff)",
                  borderColor: "color-mix(in srgb, var(--dt-primary) 18%, var(--dt-border))",
                  color: "var(--dt-text)",
                }}
              >
                {/* Header kartu atas */}
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      {language === "en" ? "Performance Overview" : "Ringkasan Performa"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-[11px] font-medium text-muted-foreground">
                    <span>{language === "en" ? "Current Period" : "Periode Berjalan"}</span>
                    <ChevronDown className="size-3" />
                  </div>
                </div>

                {/* Foto / Ilustrasi jika ada, atau bar grafis */}
                {h.image_url ? (
                  <div className="relative my-4 h-48 w-full rounded-xl overflow-hidden border border-border/50">
                    <HeroImage
                      src={h.image_url}
                      alt={h.headline}
                      credit={h.image_credit}
                      language={language}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="my-5 p-4 rounded-xl bg-muted/30 border border-border/40 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-muted-foreground">{language === "en" ? "Client Satisfaction" : "Tingkat Kepuasan"}</div>
                        <div className="text-2xl font-bold tracking-tight text-foreground">99.4%</div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <TrendingUp className="size-3.5" />
                        <span>+18.2%</span>
                      </div>
                    </div>
                    {/* Visual Bar chart mock */}
                    <div className="flex items-end justify-between gap-2 h-20 pt-4 px-2">
                      {[40, 65, 50, 85, 70, 95, 80].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div
                            className="w-full rounded-t-sm transition-all duration-500"
                            style={{
                              height: `${val}%`,
                              backgroundColor: idx === 5 ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-primary) 30%, var(--dt-muted-bg, #cbd5e1))",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metric footer */}
                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span>{h.badge_text || (language === "en" ? "Verified Delivery Standard" : "Standar Layanan Terverifikasi")}</span>
                  <span className="font-semibold text-foreground">100% Guaranteed</span>
                </div>
              </motion.div>

              {/* Front Card: Offset Tasks / Deliverables (Overlapping bottom-left outside grid) */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="relative -mt-10 sm:-mt-14 -ml-2 sm:-ml-8 w-11/12 sm:w-4/5 rounded-2xl p-4 sm:p-5 shadow-2xl border backdrop-blur-md"
                style={{
                  background: "color-mix(in srgb, var(--dt-surface, #ffffff) 92%, transparent)",
                  borderColor: "color-mix(in srgb, var(--dt-primary) 25%, var(--dt-border))",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {language === "en" ? "Key Deliverables" : "Layanan Utama"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {language === "en" ? "Live" : "Aktif"}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span className="font-medium text-foreground">{h.badge_text?.split("|")[0]?.trim() || (language === "en" ? "Consultation & Audit" : "Konsultasi & Audit")}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">DONE</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{language === "en" ? "Strategy Execution" : "Eksekusi Strategis"}</span>
                    </div>
                    <span className="text-[10px] text-primary font-mono font-semibold">IN PROGRESS</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
