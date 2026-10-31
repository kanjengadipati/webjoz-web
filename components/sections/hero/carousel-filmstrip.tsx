"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Plus, Trash2, Sparkles, Pause, Play } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";
import PhotoCreditList from "../PhotoCreditList";
import { getHeroSlides, commitHeroSlide, addHeroSlide, removeHeroSlide, writeHeroPatch } from "./images";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * HeroCarouselFilmstrip — Cinematic horizontal drifting filmstrip marquee.
 * Features:
 * - Centered high-impact typography & CTA at the top.
 * - Continuous auto-drifting gallery cards at the bottom (infinite marquee).
 * - Smooth pause/play on hover.
 * - Accessible: respects prefers-reduced-motion (WCAG 2.2.2).
 * - Full inline-editing for copy and gallery images in editor mode.
 * 
 * Perfect for creative agencies, videographers, photographers, coffee shops,
 * studios, barbershops, and lifestyle streetwear brands.
 */
export default function HeroCarouselFilmstrip({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const slideList = getHeroSlides(h);
  const slides: string[] = slideList.map((s) => s.src);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const isEN = language === "en";
  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());
  const defaultCta = isEN ? "Get Started" : "Mulai Sekarang";

  const handleAddSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length >= 8) return;
    const fallbackImage = slides[0] ?? "";
    const fallbackCredit = slideList[0]?.credit ?? null;
    writeHeroPatch(onUpdateField as any, addHeroSlide(h, fallbackImage, fallbackCredit));
  };

  const handleDeleteSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    const slide = slideList[idx];
    if (!slide) return;
    writeHeroPatch(onUpdateField as any, removeHeroSlide(h, slide.index));
  };

  // Duplicate slides array for seamless infinite marquee loop
  const displayCards = slides.length > 0 ? (slides.length < 5 ? [...slides, ...slides, ...slides] : [...slides, ...slides]) : [];

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "92vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      className="pt-16 sm:pt-24 pb-12"
    >
      {/* Background ambient radial gradients */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "60%",
          background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 15%, transparent) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Top Block: Centered Copy & Action Calls ─────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 flex flex-col items-center gap-5">
        {/* Eyebrow */}
        {(h.eyebrow || h.badge_text || isEditorMode) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                color: "var(--dt-primary)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)",
              }}
            >
              <Sparkles style={{ width: 13, height: 13 }} />
              <InlineText
                section="hero"
                fieldKey={h.eyebrow ? "eyebrow" : "badge_text"}
                value={h.eyebrow || h.badge_text || ""}
                placeholder={isEN ? "Curated Showcase" : "Showcase Unggulan"}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
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
              fontWeight: "var(--dt-heading-weight)" as any,
              fontStyle: "var(--dt-heading-style)" as any,
              fontSize: "clamp(2.25rem, 5.5vw, var(--dt-hero-size, 4rem))",
              lineHeight: 1.1,
              color: "var(--dt-text)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl"
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
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              color: "var(--dt-text-muted)",
              lineHeight: 1.65,
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <a
            href={safeHref(h.cta_url, "#contact")}
            target={isExternalHref(h.cta_url) ? "_blank" : undefined}
            rel={isExternalHref(h.cta_url) ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--dt-primary)",
              color: "var(--dt-primary-foreground)",
              borderRadius: "var(--dt-radius)",
              textDecoration: "none",
            }}
          >
            <InlineText
              section="hero"
              fieldKey="cta_text"
              value={h.cta_text || defaultCta}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            <ArrowRight style={{ width: 16, height: 16 }} />
          </a>

          {hasSecondary && (
            <a
              href={safeHref(h.cta_secondary_url, "#about")}
              target={isExternalHref(h.cta_secondary_url) ? "_blank" : undefined}
              rel={isExternalHref(h.cta_secondary_url) ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm sm:text-base font-medium transition-colors"
              style={{
                color: "var(--dt-text)",
                background: "color-mix(in srgb, var(--dt-surface) 70%, transparent)",
                border: "1px solid color-mix(in srgb, var(--dt-text) 18%, transparent)",
                borderRadius: "var(--dt-radius)",
                textDecoration: "none",
              }}
            >
              <InlineText
                section="hero"
                fieldKey="cta_secondary_text"
                value={h.cta_secondary_text ?? ""}
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

        <HeroAccessory
          accessory={h.accessory}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>

      {/* ── Bottom Block: Continuous Drifting Filmstrip Marquee ─────── */}
      <div
        className="relative z-10 w-full mt-10 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft Left & Right Fade Masks */}
        <div
          className="absolute inset-y-0 left-0 w-16 sm:w-32 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to right, var(--dt-bg) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 sm:w-32 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to left, var(--dt-bg) 0%, transparent 100%)",
          }}
        />

        {/* Marquee Motion Container */}
        <motion.div
          animate={
            isPaused || isEditorMode || prefersReducedMotion
              ? {}
              : { x: ["0%", "-50%"] }
          }
          transition={{
            duration: Math.max(25, displayCards.length * 5),
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-4 sm:gap-6 w-max px-4"
        >
          {displayCards.map((imgUrl, idx) => {
            const originalIndex = slides.length > 0 ? idx % slides.length : 0;
            const slide = slideList[originalIndex];
            return (
              <div
                key={`${idx}-${imgUrl}`}
                className="relative group shrink-0 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  width: "clamp(240px, 22vw, 340px)",
                  height: "clamp(300px, 32vh, 420px)",
                  borderRadius: "var(--dt-radius-lg)",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
                  background: "var(--dt-surface)",
                }}
              >
                <InlineImage
                  section="hero"
                  fieldKey={`images.${slide?.index ?? 0}`}
                  src={imgUrl}
                  alt={`${h.headline} preview ${originalIndex + 1}`}
                  onUpdateField={(_, __, val) => commitHeroSlide(onUpdateField, h, slide?.index ?? 0, val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  className="w-full h-full"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />

                {/* Subtle vignette on card */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Caption for this slide */}
                {(() => {
                  const caption = h.image_captions?.[slide?.index ?? 0];
                  return caption ? (
                    <p className="absolute bottom-10 left-3 right-3 z-20 text-xs font-medium text-white drop-shadow line-clamp-2">
                      {caption}
                    </p>
                  ) : null;
                })()}

                {/* Card Number Tag */}
                <span
                  className="absolute bottom-3 left-3 text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur-md"
                  style={{
                    background: "rgba(0,0,0,0.55)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  0{originalIndex + 1}
                </span>

                {/* Editor Delete Slide Button */}
                {isEditorMode && idx < slides.length && slides.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSlide(originalIndex, e)}
                    title={isEN ? "Delete slide" : "Hapus slide"}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-colors z-30"
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Editor Controls Bar */}
        {isEditorMode && slides.length < 8 && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleAddSlide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground shadow"
            >
              <Plus style={{ width: 14, height: 14 }} />
              <span>{isEN ? "Add Filmstrip Slide" : "Tambah Foto Slide"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Slide Photo Credit */}
      <div className="relative z-10 px-6 sm:px-12 flex justify-between items-center text-xs opacity-75 mt-4">
        <PhotoCreditList items={slideList} language={language} />

        {!isEditorMode && slides.length > 1 && (
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--dt-text-muted)" }}
          >
            {isPaused ? <Play style={{ width: 12, height: 12 }} /> : <Pause style={{ width: 12, height: 12 }} />}
            <span>{isPaused ? (isEN ? "Resume drift" : "Lanjutkan") : (isEN ? "Pause drift" : "Jeda")}</span>
          </button>
        )}
      </div>
    </section>
  );
}
