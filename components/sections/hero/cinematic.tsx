"use client";
import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HeroVariantProps } from "./types";
import { InlineText } from "../../templates/shared";
import { HeroCta, HeroImage } from "./primitives";
import { heroStrings } from "./hero-strings";

/**
 * Cinematic Hero — dark-background center headline with scattered floating
 * photo frames around it. Up to 5 photos positioned in fixed quadrants with
 * subtle random rotations for a "spread on a dark table" aesthetic.
 *
 * Cocok untuk: fotografer, videografer, creative studio, sinematografi, agensi kreatif.
 * ImageNeed: required (min 3 foto — scattered frame layout).
 */

// Deterministic float positions for each slot (up to 5 photos).
// Values are expressed as CSS position percentages + rotation angles.
const FLOAT_SLOTS: Array<{
  top?: string; bottom?: string; left?: string; right?: string;
  rotate: number; width: string; aspect: string;
}> = [
  // top-right
  { top: "5%",  right: "2%",  rotate:  6,  width: "clamp(130px,16vw,220px)", aspect: "4/3" },
  // top-right-far
  { top: "2%",  right: "22%", rotate: -4,  width: "clamp(100px,13vw,180px)", aspect: "3/4" },
  // right-mid
  { top: "42%", right: "1%",  rotate:  8,  width: "clamp(100px,12vw,170px)", aspect: "4/3" },
  // bottom-right
  { bottom: "4%", right: "10%", rotate:  3, width: "clamp(90px,11vw,155px)", aspect: "4/3" },
  // bottom-left
  { bottom: "3%", left: "1%",   rotate: -6, width: "clamp(120px,14vw,200px)", aspect: "3/4" },
  // top-left
  { top: "3%",  left: "1%",   rotate: -5,  width: "clamp(100px,12vw,170px)", aspect: "3/4" },
];

export default function HeroCinematic({
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
  const isEN = language === "en";
  const common = {
    section: "hero" as const,
    onUpdateField,
    isEditorMode,
    isSelected,
    collapseSheetForInlineEdit,
    onEditingStateChange,
  };

  // Collect all available images (image_url + images array), deduplicated
  const allImages = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    // images array first (they're meant as gallery), then image_url as fallback
    const candidates = [...(h.images ?? []), h.image_url].filter(Boolean) as string[];
    for (const img of candidates) {
      if (!seen.has(img)) { seen.add(img); result.push(img); }
    }
    return result;
  }, [h.image_url, h.images]);

  // Headline: split on first newline or " " to allow italic second line
  // If subheadline empty, use as-is (single block).
  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "min(92vh, 860px)",
        overflow: "hidden",
        background: h.background_color || "#111010",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Floating photo frames ───────────────────────────────── */}
      {FLOAT_SLOTS.map((slot, i) => {
        const src = allImages[i % Math.max(allImages.length, 1)];
        if (!src && !isEditorMode) return null;
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, scale: 0.88, rotate: slot.rotate - 8 }}
            animate={{ opacity: 1, scale: 1, rotate: slot.rotate }}
            transition={{ duration: reduce ? 0 : 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: slot.top,
              bottom: slot.bottom,
              left: slot.left,
              right: slot.right,
              width: slot.width,
              aspectRatio: slot.aspect,
              zIndex: isEditorMode ? 2 : 1,
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            {src ? (
              <img
                src={src}
                alt=""
                aria-hidden
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "color-mix(in srgb, var(--dt-primary) 12%, #1a1a1a)" }} />
            )}
          </motion.div>
        );
      })}

      {/* ── Center content ─────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "680px",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Eyebrow */}
        {(h.eyebrow || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
          >
            <InlineText
              {...common}
              fieldKey="eyebrow"
              value={h.eyebrow}
              placeholder={s.shortLabel}
              as="span"
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            />
            {/* dash decorator */}
            <span style={{ width: "2rem", height: "1px", background: "rgba(255,255,255,0.25)", flexShrink: 0 }} aria-hidden />
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ width: "100%" }}
        >
          <InlineText
            {...common}
            fieldKey="headline"
            value={h.headline}
            as="h1"
            style={{
              fontFamily: "var(--dt-heading-font, Georgia, serif)",
              fontWeight: "var(--dt-heading-weight, 700)" as React.CSSProperties["fontWeight"],
              fontStyle: "var(--dt-heading-style, normal)" as React.CSSProperties["fontStyle"],
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: 0,
            }}
          />
        </motion.div>

        {/* Subheadline */}
        {(h.subheadline || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            style={{ marginTop: "1.25rem", width: "100%" }}
          >
            <InlineText
              {...common}
              fieldKey="subheadline"
              value={h.subheadline}
              as="p"
              multiline
              style={{
                fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
                color: "rgba(241,245,249,0.60)",
                lineHeight: 1.75,
                maxWidth: "36ch",
                margin: "0 auto",
                textAlign: "center",
              }}
            />
          </motion.div>
        )}

        {/* CTA row */}
        {(h.cta_text || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
          >
            <HeroCta
              href={h.cta_url}
              label={h.cta_text || (isEN ? "Let's Make Something" : "Mulai Proyek")}
              fieldKey="cta_text"
              iconSize={15}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-primary-foreground, #fff)",
                borderRadius: "9999px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            {hasSecondary && (
              <HeroCta
                href={h.cta_secondary_url}
                label={h.cta_secondary_text}
                fieldKey="cta_secondary_text"
                iconSize={14}
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.65)",
                  padding: "0.75rem 0",
                  borderRadius: 0,
                  textDecoration: "none",
                }}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* ── Scroll indicator ───────────────────────────────────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
        }}
        aria-hidden
      >
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
          scroll
        </span>
        <div style={{ width: "1px", height: "2rem", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
      </motion.div>
    </section>
  );
}
