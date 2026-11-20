"use client";
import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Layers, Sparkles, TrendingUp, Users, ShieldCheck, Activity, Cpu } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, HeroAccessory } from "../../templates/shared";
import { HeroCta, HeroImage, HERO_HEADING_SIZE } from "./primitives";
import { heroStrings } from "./hero-strings";
import { getHeroSlides } from "./images";

/**
 * Floating Layers — 02. Floating Layers
 *
 * Perspektif 3D dinamis dengan kartu visual bertumpuk: dashboard analitik,
 * mobile preview widget, dan highlight fitur produk.
 *
 * Peruntukan: SaaS, Software, Startup, dan Teknologi.
 * ImageNeed: Optional.
 */
export default function HeroFloatingLayers({
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
  const dw = (h.dashboard_widget || {}) as Record<string, any>;
  const slides = getHeroSlides(h, { includeHidden: Boolean(isEditorMode) });
  const backImage = (dw.screen_image as string) || (slides.length > 1 ? slides[1]?.src : null);

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
        minHeight: "92vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      {/* Dynamic ambient radial glows */}
      <div
        className="absolute top-1/4 right-10 -z-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: "color-mix(in srgb, var(--dt-primary) 30%, transparent)" }}
      />
      <div
        className="absolute bottom-10 left-1/3 -z-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "color-mix(in srgb, var(--dt-accent, #6366f1) 25%, transparent)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Kolom Kiri: Headline & CTA (lg:col-span-6) */}
          <div className="flex flex-col items-start lg:col-span-6">
            {(h.eyebrow || isEditorMode) && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.85rem",
                  background: "color-mix(in srgb, var(--dt-primary) 15%, transparent)",
                  color: "var(--dt-primary)",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)",
                }}
              >
                <Layers className="size-3.5" />
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
                lineHeight: 1.1,
                color: "var(--dt-text)",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />

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
                  padding: "0.85rem 1.85rem",
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

              {(hasSecondary || isEditorMode) && (
                <HeroCta
                  href={h.cta_secondary_url || "#"}
                  label={h.cta_secondary_text || (language === "en" ? "Explore Features" : "Pelajari Fitur")}
                  fieldKey="cta_secondary_text"
                  icon={null}
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
                    borderRadius: "var(--dt-radius, 12px)",
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

            {/* Partner logos / tech badge strip */}
            <div className="mt-12 pt-6 border-t border-border/40 w-full">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <InlineText
                  section="hero"
                  fieldKey="dashboard_widget.partner_title"
                  value={(dw.partner_title as string) ?? ""}
                  placeholder={language === "en" ? "Compatible with modern platforms" : "Terintegrasi dengan ekosistem digital"}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={handleEditingStateChange}
                />
              </div>
              <div className="flex items-center gap-6 text-xs font-semibold text-muted-foreground opacity-75 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-primary" />
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.tag_1"
                    value={(dw.tag_1 as string) ?? ""}
                    placeholder="API First"
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.tag_2"
                    value={(dw.tag_2 as string) ?? ""}
                    placeholder="Enterprise Ready"
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="size-3.5 text-amber-500" />
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.tag_3"
                    value={(dw.tag_3 as string) ?? ""}
                    placeholder="99.9% Uptime"
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: 3D Isometric Floating Layers Stack (lg:col-span-6) */}
          <div className="relative lg:col-span-6 flex justify-center items-center py-6">
            <div className="relative w-full max-w-lg perspective-[1200px]">
              {/* Back Layer: Slanted Dark Dashboard Screen */}
              <motion.div
                initial={{ opacity: 0, rotateX: 12, rotateY: -16, y: -20 }}
                animate={{ opacity: 1, rotateX: 10, rotateY: -14, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full rounded-2xl p-5 shadow-2xl border bg-slate-950 text-slate-100 border-slate-800/80"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)",
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <InlineText
                      section="hero"
                      fieldKey="dashboard_widget.app_label"
                      value={(dw.app_label as string) ?? ""}
                      placeholder="cloud-dashboard.app"
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      className="text-[11px] font-mono text-slate-400 ml-2"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={handleEditingStateChange}
                    />
                  </div>
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.revenue_value"
                    value={(dw.revenue_value as string) ?? ""}
                    placeholder="$75,340"
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    className="text-xs font-bold text-emerald-400"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </div>

                {/* Dashboard Screen Content: Secondary Photo Slot or Chart Mock */}
                {(backImage || isEditorMode) ? (
                  <div className="mt-4 relative h-36 w-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/90 shadow-inner">
                    <HeroImage
                      src={backImage}
                      alt={h.headline || "Screen preview"}
                      credit={slides[1]?.credit || null}
                      language={language}
                      fieldKey="dashboard_widget.screen_image"
                      overlayPosition="center"
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  /* Dashboard Chart Mock */
                  <div className="mt-4 h-32 rounded-xl bg-slate-900/80 p-3 border border-slate-800/60 flex items-end justify-between gap-2">
                    {[30, 45, 60, 40, 75, 90, 85, 100].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div
                          className="w-full rounded-t-sm"
                          style={{
                            height: `${v}%`,
                            background: i >= 5 ? "var(--dt-primary, #3b82f6)" : "#334155",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Mid Layer: Front Floating Glass/Light Card */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 6, rotateY: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 4, rotateY: -6 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative -mt-24 ml-4 sm:ml-8 w-11/12 rounded-2xl p-5 sm:p-6 shadow-2xl border backdrop-blur-xl"
                style={{
                  background: "color-mix(in srgb, var(--dt-surface, #ffffff) 95%, transparent)",
                  borderColor: "color-mix(in srgb, var(--dt-primary) 30%, var(--dt-border))",
                  color: "var(--dt-text)",
                  boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.35)",
                }}
              >
                {/* Image showcase inside card if provided or in editor mode */}
                {(h.image_url || isEditorMode) ? (
                  <div className="relative mb-4 h-40 w-full rounded-xl overflow-hidden border border-border/40">
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
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                        style={{ background: "linear-gradient(135deg, var(--dt-primary), #8b5cf6)" }}
                      >
                        <Sparkles className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{h.headline?.slice(0, 24)}...</div>
                        <InlineText
                          section="hero"
                          fieldKey="dashboard_widget.status_label"
                          value={(dw.status_label as string) ?? ""}
                          placeholder={language === "en" ? "Production Verified" : "Terverifikasi Siap Pakai"}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="div"
                          className="text-xs text-muted-foreground"
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={handleEditingStateChange}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <TrendingUp className="size-3.5" />
                      <InlineText
                        section="hero"
                        fieldKey="dashboard_widget.badge_growth"
                        value={(dw.badge_growth as string) ?? ""}
                        placeholder="+1282%"
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={handleEditingStateChange}
                      />
                    </div>
                  </div>
                )}

                {/* Avatar stack + Social proof pill */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">A</div>
                      <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">B</div>
                      <div className="w-7 h-7 rounded-full bg-pink-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">C</div>
                    </div>
                    <InlineText
                      section="hero"
                      fieldKey="badge_text"
                      value={h.badge_text ?? ""}
                      placeholder={language === "en" ? "Trusted by 200+ clients" : "Dipercaya 200+ pelaku bisnis"}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      className="text-xs font-semibold"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={handleEditingStateChange}
                    />
                  </div>
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.rating_value"
                    value={(dw.rating_value as string) ?? ""}
                    placeholder="4.9/5.0"
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    className="text-xs font-mono text-primary font-bold"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </div>
              </motion.div>

              {/* Bottom Layer: Floating Mobile Widget / Process Steps */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="absolute -bottom-6 -right-2 sm:-right-4 w-48 sm:w-56 rounded-2xl p-4 shadow-2xl border bg-slate-900 text-slate-100 border-slate-800"
                style={{
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.45)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.analytics_label"
                    value={(dw.analytics_label as string) ?? ""}
                    placeholder={language === "en" ? "Total Analytics" : "Total Analitik"}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    className="text-[10px] uppercase font-mono tracking-wider text-slate-400"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <InlineText
                  section="hero"
                  fieldKey="dashboard_widget.analytics_value"
                  value={(dw.analytics_value as string) ?? ""}
                  placeholder="524,860"
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="div"
                  className="text-lg font-bold font-mono text-white tracking-tight"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={handleEditingStateChange}
                />
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="size-3 shrink-0" />
                  <InlineText
                    section="hero"
                    fieldKey="dashboard_widget.analytics_growth"
                    value={(dw.analytics_growth as string) ?? ""}
                    placeholder={language === "en" ? "+34.2% this month" : "+34.2% bulan ini"}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
