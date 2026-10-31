"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Plus, Trash2, Clock, Pause, Play, Sparkles } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import { getHeroSlides, commitHeroSlide, addHeroSlide, removeHeroSlide, writeHeroPatch } from "./images";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * HeroCarouselSplit — Modern 2-column hero with stable content on the left
 * and an interactive framed card slider with peek preview on the right.
 * 
 * Perfect for real estate, villas, beauty clinics, showrooms, travel packages,
 * and high-end workshops.
 */
export default function HeroCarouselSplit({
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

  const slideCount = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const safeIndex = slideCount > 0 ? Math.min(currentIndex, slideCount - 1) : 0;

  // Auto-play interval
  useEffect(() => {
    if (isEditorMode || isPaused || prefersReducedMotion || slideCount <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [isEditorMode, isPaused, prefersReducedMotion, slideCount]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slideCount <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slideCount <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const handleSelectSlide = (idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(idx >= safeIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const handleAddSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length >= 8) return;
    const fallbackImage = slides[0] ?? "";
    const fallbackCredit = slideList[0]?.credit ?? null;
    writeHeroPatch(onUpdateField as any, addHeroSlide(h, fallbackImage, fallbackCredit));
    setDirection(1);
    setCurrentIndex(slides.length);
  };

  const handleDeleteCurrentSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    const slide = slideList[safeIndex];
    if (!slide) return;
    writeHeroPatch(onUpdateField as any, removeHeroSlide(h, slide.index));
    setCurrentIndex((prev) => (prev >= slides.length - 1 ? slides.length - 2 : prev));
  };

  const isEN = language === "en";
  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());
  const defaultCta = isEN ? "Explore Now" : "Jelajahi Sekarang";
  const activeImage = slides[safeIndex] || "";

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: "relative",
        minHeight: "88vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex flex-col lg:grid lg:grid-cols-12 items-center"
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "55%",
          height: "90%",
          background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--dt-primary) 14%, transparent), transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Left Column: Content & Calls to Action ──────────────────── */}
      <div
        className="relative z-10 w-full lg:col-span-5 xl:col-span-5 flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-12 lg:py-20"
        style={{ gap: "1.5rem" }}
      >
        {/* Eyebrow / Category Pill */}
        {(h.eyebrow || h.badge_text || isEditorMode) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                color: "var(--dt-primary)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 24%, transparent)",
              }}
            >
              <Sparkles style={{ width: 12, height: 12 }} />
              <InlineText
                section="hero"
                fieldKey={h.eyebrow ? "eyebrow" : "badge_text"}
                value={h.eyebrow || h.badge_text || ""}
                placeholder={isEN ? "Featured Collection" : "Koleksi Unggulan"}
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
              fontSize: "clamp(2.25rem, 4.5vw, var(--dt-hero-size, 3.75rem))",
              lineHeight: 1.12,
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
              fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
              color: "var(--dt-text-muted)",
              lineHeight: 1.65,
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* Operating hours if present */}
        {Boolean(h.opening_hours?.trim() || isEditorMode) && (
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--dt-text-muted)" }}>
            <Clock style={{ width: 14, height: 14, color: "var(--dt-primary)" }} />
            <InlineText
              section="hero"
              fieldKey="opening_hours"
              value={h.opening_hours ?? ""}
              placeholder={isEN ? "Open daily 09:00 - 21:00" : "Buka setiap hari 09:00 - 21:00"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>
        )}

        {/* CTAs & Accessory */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 pt-2"
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

        {/* Thumbnail Slide Indicators & Pause Toggle */}
        <div className="flex items-center gap-3 pt-3">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleSelectSlide(idx, e)}
                aria-label={`Go to slide ${idx + 1}`}
                className="transition-all duration-300"
                style={{
                  width: idx === safeIndex ? 26 : 8,
                  height: 6,
                  borderRadius: 9999,
                  background: idx === safeIndex ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-text) 25%, transparent)",
                }}
              />
            ))}
          </div>

          <span className="text-xs font-mono font-medium" style={{ color: "var(--dt-text-muted)" }}>
            0{safeIndex + 1} / 0{slideCount}
          </span>

          {slideCount > 1 && !isEditorMode && (
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              className="p-1 rounded text-xs opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "var(--dt-text-muted)" }}
            >
              {isPaused ? <Play style={{ width: 12, height: 12 }} /> : <Pause style={{ width: 12, height: 12 }} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Right Column: Framed Card Slider with Peek Preview ──────── */}
      <div className="relative z-10 w-full lg:col-span-7 xl:col-span-7 px-4 sm:px-8 lg:px-6 xl:px-12 py-6 lg:py-12 flex items-center justify-center">
        <div
          className="relative w-full max-w-2xl overflow-hidden shadow-2xl"
          style={{
            height: "clamp(340px, 52vh, 580px)",
            borderRadius: "var(--dt-radius-lg)",
            border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
            background: "var(--dt-surface)",
          }}
        >
          {/* Active Slide Image */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={safeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", inset: 0 }}
            >
              <InlineImage
                section="hero"
                fieldKey={`images.${slideList[safeIndex]?.index ?? 0}`}
                src={activeImage}
                alt={h.headline || "Slide image"}
                onUpdateField={(_, __, val) => commitHeroSlide(onUpdateField, h, slideList[safeIndex]?.index ?? 0, val)}
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

              {/* Caption for active slide */}
              {(() => {
                const idx = slideList[safeIndex]?.index ?? 0;
                const caption = h.image_captions?.[idx];
                return caption ? (
                  <p className="absolute bottom-4 left-4 z-20 max-w-[70%] text-sm font-medium text-white drop-shadow">
                    {caption}
                  </p>
                ) : null;
              })()}

              {/* Gradient edge shading for visual depth */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {slideCount > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="pointer-events-auto p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md"
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="pointer-events-auto p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md"
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <ChevronRight style={{ width: 18, height: 18 }} />
              </button>
            </div>
          )}

          {/* Photo Credit Overlay */}
          <div style={{ position: "absolute", bottom: 12, right: 14, zIndex: 20 }}>
            <PhotoCredit
              credit={slideList[safeIndex]?.credit}
              src={slideList[safeIndex]?.src}
              language={language}
              section="hero"
              fieldKey={`image_credits.${slideList[safeIndex]?.index ?? 0}.name`}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
          </div>

          {/* Editor Slide Management Controls */}
          {isEditorMode && (
            <div
              className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 rounded-lg backdrop-blur-md"
              style={{
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
            {slideCount < 8 && (
              <button
                type="button"
                onClick={handleAddSlide}
                title={isEN ? "Add Slide" : "Tambah Slide"}
                className="p-1.5 rounded hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs"
              >
                <Plus style={{ width: 14, height: 14 }} />
                <span>{isEN ? "Add Slide" : "Tambah"}</span>
              </button>
            )}
              {slideCount > 1 && (
                <button
                  type="button"
                  onClick={handleDeleteCurrentSlide}
                  title={isEN ? "Delete Current Slide" : "Hapus Slide Ini"}
                  className="p-1.5 rounded hover:bg-red-500/30 text-red-300 transition-colors"
                >
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
