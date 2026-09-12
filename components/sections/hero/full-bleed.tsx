"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";

/**
 * HeroFullBleed — Cinematic full-bleed photographic hero with dark directional overlay.
 * High-impact left-aligned typography, high-contrast CTA, and bottom-left slider indicators.
 */
export default function HeroFullBleed({
  hero: h,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const hasSecondary = Boolean(h.cta_secondary_text && h.cta_secondary_url);

  // Auto-cycle slide indicator gently every 5s if not in editor mode
  useEffect(() => {
    if (isEditorMode) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isEditorMode]);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--dt-bg, #0B0E17)",
      }}
      className="px-6 sm:px-12 md:px-16 lg:px-24 py-24 md:py-32"
    >
      {/* ── 1. Full-bleed background image ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: isEditorMode ? 2 : 0,
          overflow: "hidden",
        }}
      >
        {h.image_url || isEditorMode ? (
          <InlineImage
            section="hero"
            fieldKey="image_url"
            src={h.image_url || ""}
            alt={h.headline || "Hero background"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            className="w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `radial-gradient(ellipse at 80% 40%, color-mix(in srgb, var(--dt-primary, #6366f1) 25%, #0B0E17), #0B0E17 80%)`,
            }}
          />
        )}
      </div>

      {/* ── 2. Cinematic directional dark gradient overlays ────────────── */}
      {/* Horizontal directional overlay: dark on left for text readability, subtle on right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(90deg, rgba(8, 10, 15, 0.94) 0%, rgba(8, 10, 15, 0.82) 40%, rgba(8, 10, 15, 0.45) 75%, rgba(8, 10, 15, 0.15) 100%)`,
          pointerEvents: "none",
        }}
      />
      {/* Vertical blend: smooth fade into surrounding sections */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(to bottom, rgba(8, 10, 15, 0.6) 0%, transparent 20%, transparent 80%, var(--dt-bg, #0B0E17) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── 3. Content container (left-aligned) ────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "680px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1.5rem",
          textAlign: "left",
        }}
      >
        {/* Eyebrow / Badge */}
        {(h.eyebrow || h.badge_text) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "var(--dt-primary, #A78BFA)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <Sparkles className="size-3.5 text-primary" />
            <InlineText
              section="hero"
              fieldKey="eyebrow"
              value={h.eyebrow || h.badge_text}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ width: "100%" }}
        >
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
              fontWeight: "var(--dt-heading-weight, 700)" as React.CSSProperties["fontWeight"],
              fontStyle: "var(--dt-heading-style, normal)" as React.CSSProperties["fontStyle"],
              fontSize: "clamp(2.4rem, 5.5vw, var(--dt-hero-size, 4rem))",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "#FFFFFF",
              margin: 0,
              textShadow: "0 2px 24px rgba(0, 0, 0, 0.5)",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ width: "100%" }}
        >
          <InlineText
            section="hero"
            fieldKey="subheadline"
            value={h.subheadline}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="p"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              color: "rgba(241, 245, 249, 0.88)",
              lineHeight: 1.7,
              maxWidth: "38rem",
              margin: 0,
              textShadow: "0 1px 12px rgba(0, 0, 0, 0.4)",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* Opening Hours Badge (optional) */}
        {h.opening_hours && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <Clock className="size-3.5 text-white/70" />
            <InlineText
              section="hero"
              fieldKey="opening_hours"
              value={h.opening_hours}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </motion.div>
        )}

        {/* Action Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-3.5 pt-2"
        >
          {/* Primary CTA button (White pill / high-contrast rounded button with dark text & arrow) */}
          <a
            href={h.cta_url || "#"}
            className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-bold rounded-xl transition-all duration-300 shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "#FFFFFF",
              color: "#0F172A",
              borderRadius: "var(--dt-radius, 12px)",
              boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.2)",
              textDecoration: "none",
            }}
          >
            <InlineText
              section="hero"
              fieldKey="cta_text"
              value={h.cta_text || "Mulai Sekarang"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          {/* Secondary CTA button (Clean glass border button) */}
          {hasSecondary && (
            <a
              href={h.cta_secondary_url || "#"}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-semibold rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/15"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "var(--dt-radius, 12px)",
                textDecoration: "none",
              }}
            >
              <InlineText
                section="hero"
                fieldKey="cta_secondary_text"
                value={h.cta_secondary_text}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </a>
          )}
        </motion.div>

        {/* Hero Accessory (e.g. skill tags, social proof, etc.) */}
        <HeroAccessory
          accessory={h.accessory}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>

      {/* ── 4. Slide Pagination Indicator (Bottom Left, like in mockup) ── */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-6 sm:left-12 md:left-16 lg:left-24 flex items-center gap-2 z-20"
        style={{ pointerEvents: "auto" }}
      >
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActiveSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeSlide === i
                ? "w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* ── 5. Unsplash Photo Credit (Bottom Right) ──────────────────── */}
      {h.image_credit && (
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 md:right-16 lg:right-24 z-20">
          <PhotoCredit credit={h.image_credit} />
        </div>
      )}
    </section>
  );
}
