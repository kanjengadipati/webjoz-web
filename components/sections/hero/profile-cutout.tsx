"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HeroVariantProps } from "./types";
import { InlineText } from "../../templates/shared";
import { HeroCta, HeroImage } from "./primitives";
import { heroStrings } from "./hero-strings";

/**
 * Profile Cutout — Portofolio & Personal Hero.
 * Layout 2-kolom asimetris:
 * - Sisi Kiri: Eyebrow kategori, Nama/Headline besar display, Subheadline peran,
 *   dan Bio/Statement Card berwarna aksen kontras.
 * - Sisi Kanan: Foto figur/potret orang yang bottom-anchored, mendukung cutout PNG
 *   transparan maupun foto biasa dengan bottom fadeout mask.
 */
export default function HeroProfileCutout({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const s = heroStrings(language);
  const reduce = useReducedMotion();
  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());

  // Bio statement text: prioritizes description, falls back to subheadline
  const bioText = h.description || h.subheadline || "";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
        minHeight: "88vh",
      }}
      className="flex flex-col justify-end"
    >
      {/* Subtle ambient glow behind the portrait figure */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "min(500px, 45vw)",
          height: "min(500px, 45vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 18%, transparent) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle organic wavy or geometric backdrop accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          opacity: 0.04,
          background: "radial-gradient(ellipse at top left, var(--dt-primary) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 flex flex-col lg:grid lg:grid-cols-12 lg:items-end gap-10 lg:gap-8"
        style={{ minHeight: "85vh" }}
      >
        {/* Left Column: Personal Brand Info & Accent Bio Card (7 Cols on desktop) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col justify-center pb-6 sm:pb-12 lg:pb-16"
        >
          {/* Eyebrow / Tagline */}
          {(h.eyebrow || isEditorMode) && (
            <div className="mb-3 sm:mb-4 flex items-center gap-2.5">
              <span
                className="w-6 h-[2px] rounded-full"
                style={{ background: "var(--dt-primary)" }}
              />
              <span
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "var(--dt-primary)",
                }}
              >
                <InlineText
                  section="hero"
                  fieldKey="eyebrow"
                  value={h.eyebrow ?? ""}
                  placeholder={s.shortLabel || "PORTOFOLIO"}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            </div>
          )}

          {/* Large Headline (Personal Name / Brand Name) */}
          <InlineText
            section="hero"
            fieldKey="headline"
            value={h.headline}
            as="h1"
            multiline
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            className="tracking-tight font-black"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              color: "var(--dt-text)",
              margin: 0,
            }}
          />

          {/* Subheadline (Role / Title / Expertise) */}
          {(h.subheadline || isEditorMode) && (
            <div className="mt-3 sm:mt-4">
              <InlineText
                section="hero"
                fieldKey="subheadline"
                value={h.subheadline ?? ""}
                placeholder="Peran & Spesialisasi (cth. Graphic Designer & Video Editor)"
                as="p"
                multiline
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                className="text-base sm:text-lg lg:text-xl font-medium tracking-wide"
                style={{
                  color: "var(--dt-text-muted)",
                }}
              />
            </div>
          )}

          {/* Solid Accent Bio Statement Card (High visual anchor matching reference design) */}
          <div
            className="mt-6 sm:mt-8 p-5 sm:p-6 rounded-2xl relative shadow-lg"
            style={{
              background:
                "linear-gradient(145deg, var(--dt-primary) 0%, color-mix(in srgb, var(--dt-primary) 80%, #000 20%) 100%)",
              color: "var(--dt-on-primary, #fff)",
              borderRadius: "var(--dt-radius-lg, 1rem)",
              maxWidth: "540px",
            }}
          >
            <InlineText
              section="hero"
              fieldKey="description"
              value={bioText}
              placeholder="Tuliskan perkenalan singkat, visi, atau pitch diri Anda di sini..."
              as="p"
              multiline
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              className="text-sm sm:text-base leading-relaxed font-normal opacity-95"
            />
          </div>

          {/* Action CTAs */}
          <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            {(h.cta_text || isEditorMode) && (
              <HeroCta
                href={h.cta_url}
                label={h.cta_text}
                fieldKey="cta_text"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                style={{
                  background: "var(--dt-text)",
                  color: "var(--dt-bg)",
                  borderRadius: "var(--dt-radius, 0.75rem)",
                }}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}

            {(hasSecondary || isEditorMode) && (
              <HeroCta
                href={h.cta_secondary_url}
                label={h.cta_secondary_text}
                fieldKey="cta_secondary_text"
                icon={null}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-medium border hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
                style={{
                  borderColor: "var(--dt-border, currentColor)",
                  color: "var(--dt-text)",
                  borderRadius: "var(--dt-radius, 0.75rem)",
                }}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}

            {/* Availability Pill */}
            {h.badge_text && (
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                  color: "var(--dt-primary)",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <InlineText
                  section="hero"
                  fieldKey="badge_text"
                  value={h.badge_text}
                  placeholder="Status Ketersediaan"
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            )}
          </div>
        </motion.div>

        {/* Right Column: Bottom-Anchored Portrait / Cutout Person (5 Cols on desktop) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 relative flex items-end justify-center self-end w-full"
          style={{ minHeight: "360px" }}
        >
          <div
            className="relative w-full max-w-[420px] lg:max-w-[480px] flex items-end justify-center"
            style={{
              // Mask image fades the bottom gracefully so standard rectangular photos blend naturally
              maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
            }}
          >
            {(h.image_url || isEditorMode) ? (
              <HeroImage
                section="hero"
                fieldKey="image_url"
                src={h.image_url}
                alt={h.headline || "Foto Profil"}
                credit={h.image_credit}
                language={language}
                creditPosition={{ position: "absolute", bottom: 20, right: 8, zIndex: 20 }}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                className="w-auto max-w-full max-h-[58vh] lg:max-h-[72vh] object-contain object-bottom drop-shadow-2xl"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              />
            ) : (
              /* Fallback illustration placeholder when no image is loaded yet */
              <div
                className="w-64 h-80 rounded-t-3xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed"
                style={{
                  borderColor: "color-mix(in srgb, var(--dt-primary) 30%, transparent)",
                  background: "color-mix(in srgb, var(--dt-primary) 8%, var(--dt-bg))",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-white"
                  style={{ background: "var(--dt-primary)" }}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-[var(--dt-text)]">
                  {isEditorMode ? "Klik untuk mengunggah foto profil / cutout Anda" : "Foto Profil"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
