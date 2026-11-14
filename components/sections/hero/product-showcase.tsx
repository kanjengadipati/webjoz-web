"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HeroVariantProps } from "./types";
import { InlineText, InlineImage } from "../../templates/shared";
import { HeroCta, HeroImage } from "./primitives";
import { heroStrings } from "./hero-strings";
import PhotoCredit from "../PhotoCredit";

/**
 * Product Showcase — editorial product-first hero.
 * Full-bleed product photo as the visual centerpiece, large editorial
 * headline bottom-left, subtle rotary stamp badge bottom-right.
 * Cocok untuk: toko online, retail fashion, produk premium, brand FMCG, e-commerce.
 * ImageNeed: required (1 foto produk utama).
 */
export default function HeroProductShowcase({
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

  // Rotary stamp text — fallback ke business-generic jika kosong
  const stampText = h.eyebrow || (isEN ? "Premium · Quality · Original" : "Produk · Pilihan · Terbaik");

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "min(92vh, 860px)",
        overflow: "hidden",
        background: h.background_color || "var(--dt-bg, #0f0f0f)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Background product image ─────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: isEditorMode ? 2 : 0 }}>
        {h.image_url || isEditorMode ? (
          <InlineImage
            section="hero"
            fieldKey="image_url"
            src={h.image_url || ""}
            alt={h.headline || s.heroImageAlt}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            className="w-full h-full"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: (h as any).image_position || "center 20%", display: "block" }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `radial-gradient(ellipse at 65% 40%, color-mix(in srgb, var(--dt-primary) 20%, #111) 0%, #0a0a0a 75%)` }} />
        )}
      </div>

      {/* ── Gradient overlays ─────────────────────────────────────── */}
      {/* Horizontal: darken left for text legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(90deg, rgba(5,5,8,0.88) 0%, rgba(5,5,8,0.60) 42%, rgba(5,5,8,0.18) 72%, rgba(5,5,8,0.05) 100%)",
        }}
      />
      {/* Top vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(5,5,8,0.50) 0%, transparent 22%)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative", zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(2rem, 5vw, 4rem) clamp(1.5rem, 6vw, 5rem) clamp(3rem, 7vw, 5rem)",
        }}
      >
        {/* Eyebrow label */}
        {(h.eyebrow || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InlineText
              {...common}
              fieldKey="eyebrow"
              value={h.eyebrow}
              placeholder={s.shortLabel}
              as="span"
              style={{
                display: "inline-block",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--dt-primary)",
                marginBottom: "1rem",
              }}
            />
          </motion.div>
        )}

        {/* Headline — big editorial */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <InlineText
            {...common}
            fieldKey="headline"
            value={h.headline}
            as="h1"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight, 700)" as React.CSSProperties["fontWeight"],
              fontStyle: "var(--dt-heading-style, normal)" as React.CSSProperties["fontStyle"],
              fontSize: "clamp(2rem, 3.8vw, 3.8rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              margin: 0,
              maxWidth: "14ch",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          />
        </motion.div>

        {/* Subheadline */}
        {(h.subheadline || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <InlineText
              {...common}
              fieldKey="subheadline"
              value={h.subheadline}
              as="p"
              multiline
              style={{
                marginTop: "1rem",
                fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
                color: "rgba(241,245,249,0.80)",
                lineHeight: 1.65,
                maxWidth: "38ch",
                textShadow: "0 1px 10px rgba(0,0,0,0.4)",
              }}
            />
          </motion.div>
        )}

        {/* CTA row */}
        {(h.cta_text || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}
          >
            <HeroCta
              href={h.cta_url}
              label={h.cta_text || (isEN ? "Shop Now" : "Lihat Produk")}
              fieldKey="cta_text"
              iconSize={16}
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm"
              style={{
                background: "#ffffff",
                color: "#0f172a",
                borderRadius: "var(--dt-radius, 10px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              }}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            {(h.cta_secondary_text || isEditorMode) && (
              <HeroCta
                href={h.cta_secondary_url}
                label={h.cta_secondary_text}
                fieldKey="cta_secondary_text"
                iconSize={15}
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: "var(--dt-radius, 10px)",
                  backdropFilter: "blur(6px)",
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

      {/* ── Rotary stamp badge (bottom-right) ─────────────────────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, rotate: -20, scale: 0.85 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 5vw, 3.5rem)",
          right: "clamp(1.5rem, 6vw, 5rem)",
          zIndex: 10,
          width: "clamp(80px, 10vw, 120px)",
          height: "clamp(80px, 10vw, 120px)",
        }}
      >
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <defs>
            <path
              id="ps-circle"
              d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
            />
          </defs>
          {/* Outer ring */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          {/* Circular text */}
          <text
            fontSize="9.5"
            fill="rgba(255,255,255,0.75)"
            fontWeight="600"
            letterSpacing="2.8"
            fontFamily="var(--dt-heading-font, sans-serif)"
            style={{ textTransform: "uppercase" }}
          >
            <textPath href="#ps-circle" startOffset="0%">
              {stampText.toUpperCase().replace(/·/g, " · ")}
            </textPath>
          </text>
          {/* Center dot */}
          <circle cx="60" cy="60" r="4" fill="rgba(255,255,255,0.5)" />
        </svg>
      </motion.div>

      {/* ── Photo credit ──────────────────────────────────────────── */}
      {h.image_credit?.name && (
        <div style={{ position: "absolute", bottom: "0.75rem", left: "clamp(1.5rem, 6vw, 5rem)", zIndex: 20 }}>
          <PhotoCredit
            credit={h.image_credit}
            section="hero"
            fieldKey="image_credit.name"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        </div>
      )}
    </section>
  );
}
