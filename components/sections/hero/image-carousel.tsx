"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Plus, Trash2, Clock } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import type { HeroVariantProps } from "./types";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";

/**
 * HeroImageCarousel — Cinematic hero section with multi-image slideshow.
 * Features:
 * - Smooth crossfade transitions with auto-play & pause on hover.
 * - Glassmorphic navigation arrows & clickable slide indicator pills.
 * - Full inline-editing for copy and slide images, with add/remove slide controls in editor mode.
 * - Respects design tokens for fonts, colors, and border radius.
 */
export default function HeroImageCarousel({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  // Resolve slides array: prioritize hero.images, then fallback to hero.image_url
  const rawImages: string[] = Array.isArray(h.images) && h.images.length > 0
    ? h.images.filter(Boolean)
    : (h.image_url ? [h.image_url] : []);

  const [slides, setSlides] = useState<string[]>(rawImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Sync state if h.images or h.image_url updates from outside
  useEffect(() => {
    const next = Array.isArray(h.images) && h.images.length > 0
      ? h.images.filter(Boolean)
      : (h.image_url ? [h.image_url] : []);
    setSlides(next);
    if (currentIndex >= next.length && next.length > 0) {
      setCurrentIndex(0);
    }
  }, [h.images, h.image_url]);

  const slideCount = slides.length;

  // Auto-play interval (disabled in editor mode to avoid disruptive changes while typing)
  useEffect(() => {
    if (isEditorMode || isPaused || slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5500);
    return () => clearInterval(interval);
  }, [isEditorMode, isPaused, slideCount]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const handleSelectSlide = (idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(idx);
  };

  const handleUpdateCurrentSlideImage = (newUrl: string) => {
    const updated = [...slides];
    updated[currentIndex] = newUrl;
    setSlides(updated);
    if (onUpdateField) {
      onUpdateField("hero", "images", updated);
      if (currentIndex === 0) {
        onUpdateField("hero", "image_url", newUrl);
      }
    }
  };

  const handleAddSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fallbackImage = h.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";
    const updated = [...slides, fallbackImage];
    setSlides(updated);
    setCurrentIndex(updated.length - 1);
    if (onUpdateField) {
      onUpdateField("hero", "images", updated);
    }
  };

  const handleDeleteCurrentSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== currentIndex);
    setSlides(updated);
    setCurrentIndex((prev) => (prev >= updated.length ? updated.length - 1 : prev));
    if (onUpdateField) {
      onUpdateField("hero", "images", updated);
      if (updated.length > 0) {
        onUpdateField("hero", "image_url", updated[0]);
      }
    }
  };

  const isEN = language === "en";
  const hasSecondary = Boolean(h.cta_secondary_text && h.cta_secondary_url);
  const defaultCta = isEN ? "Get Started" : "Mulai Sekarang";
  const activeImage = slides[currentIndex] || h.image_url || "";

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--dt-bg, #0B0E17)",
      }}
      className="px-6 sm:px-12 md:px-16 lg:px-24 py-24 md:py-32"
    >
      {/* ── 1. Slideshow Background Images ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: isEditorMode ? 2 : 0,
          overflow: "hidden",
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          {activeImage || isEditorMode ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <InlineImage
                section="hero"
                fieldKey={`slide_${currentIndex}`}
                src={activeImage}
                alt={`${h.headline || "Hero image"} (Slide ${currentIndex + 1})`}
                onUpdateField={(_, __, val) => handleUpdateCurrentSlideImage(val)}
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
            </motion.div>
          ) : (
            <div
              key="fallback-bg"
              style={{
                width: "100%",
                height: "100%",
                background: `radial-gradient(ellipse at 80% 40%, color-mix(in srgb, var(--dt-primary, #6366f1) 25%, #0B0E17), #0B0E17 80%)`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. Cinematic directional dark gradient overlays ────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(90deg, rgba(8, 10, 15, 0.94) 0%, rgba(8, 10, 15, 0.82) 42%, rgba(8, 10, 15, 0.45) 75%, rgba(8, 10, 15, 0.2) 100%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(to bottom, rgba(8, 10, 15, 0.6) 0%, transparent 25%, transparent 75%, var(--dt-bg, #0B0E17) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── 3. Content container (left-aligned) ────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1.5rem",
          textAlign: "left",
        }}
      >
        {/* Eyebrow / Badge */}
        {(h.eyebrow || h.badge_text || isEditorMode) && (
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
            <SparkleIcon className="size-3.5 text-primary" />
            <InlineText
              section="hero"
              fieldKey={h.eyebrow ? "eyebrow" : "badge_text"}
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
        {(h.opening_hours || isEditorMode) && (
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
              value={h.cta_text || defaultCta}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            <ArrowRight className="size-4 md:size-5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          {hasSecondary && (
            <a
              href={h.cta_secondary_url || "#"}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm md:text-base font-medium rounded-xl transition-all duration-300 backdrop-blur-md hover:bg-white/15 active:scale-[0.98]"
              style={{
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                background: "rgba(255, 255, 255, 0.08)",
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

        {/* Hero Accessory / Pill strip */}
        <HeroAccessory
          accessory={h.accessory}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>

      {/* ── 4. Carousel Navigation Controls & Indicators ────────────── */}
      <div className="absolute z-20 bottom-8 sm:bottom-12 right-6 sm:right-12 flex flex-col sm:flex-row items-end sm:items-center gap-4">
        {/* Editor controls: Add Slide & Delete Slide */}
        {isEditorMode && (
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white">
            <span>
              {isEN
                ? `Slide ${currentIndex + 1} of ${slideCount}`
                : `Slide ${currentIndex + 1} dari ${slideCount}`}
            </span>
            <button
              type="button"
              onClick={handleAddSlide}
              title={isEN ? "Add New Slide" : "Tambah Slide Baru"}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <Plus className="size-3.5" />
            </button>
            {slideCount > 1 && (
              <button
                type="button"
                onClick={handleDeleteCurrentSlide}
                title={isEN ? "Delete This Slide" : "Hapus Slide Ini"}
                className="p-1 hover:bg-red-500/40 text-red-300 rounded-full transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Slide pagination dots / pills */}
        {slideCount > 1 && (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleSelectSlide(idx, e)}
                aria-label={isEN ? `Go to slide ${idx + 1}` : `Menuju slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-7 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation arrows (prev/next) */}
        {slideCount > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={isEN ? "Previous slide" : "Slide sebelumnya"}
              title={isEN ? "Previous slide" : "Slide sebelumnya"}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={isEN ? "Next slide" : "Slide berikutnya"}
              title={isEN ? "Next slide" : "Slide berikutnya"}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {/* Photo credit for active image */}
      <PhotoCredit credit={h.image_credit} />
    </section>
  );
}
