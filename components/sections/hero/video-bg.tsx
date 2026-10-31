"use client";
import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, Play } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * Video Background — fullscreen looping video (mp4/webm) with the hero image
 * as poster + graceful fallback. Reduced-motion users see the still poster.
 * ImageNeed: Required (poster fallback). Video: optional (video_url).
 */
export default function HeroVideoBg({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
}: HeroVariantProps) {
  const isEN = language === "en";
  const reduce = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const rawVideo = typeof h.video_url === "string" ? h.video_url.trim() : "";
  const videoUrl = /^https?:\/\//i.test(rawVideo) ? rawVideo : null;
  const useVideo = Boolean(videoUrl) && !reduce && !videoFailed;
  const ctaHref = safeHref(h.cta_url);
  const ext = isExternalHref(h.cta_url);
  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());
  const defaultCta = isEN ? "Get Started" : "Mulai Sekarang";
  const common = {
    section: "hero" as const,
    onUpdateField,
    isEditorMode,
    isSelected,
    collapseSheetForInlineEdit,
  };

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
      className="px-5 sm:px-10 md:px-16 lg:px-24 py-20 md:py-32"
    >
      {/* ── 1. Poster image (fallback + video cover) ───────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <InlineImage
          {...common}
          fieldKey="image_url"
          src={h.image_url}
          alt={h.headline || (isEN ? "Hero background" : "Latar hero")}
          isBackground
          className="h-full w-full"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>

      {/* ── 2. Looping video (pointer-events none so image stays editable) ── */}
      {useVideo && (
        <video
          key={videoUrl!}
          src={videoUrl!}
          poster={h.image_url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── 3. Readability overlays ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(90deg, rgba(6,8,14,0.92) 0%, rgba(6,8,14,0.78) 42%, rgba(6,8,14,0.35) 76%, rgba(6,8,14,0.12) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(to bottom, rgba(6,8,14,0.55) 0%, transparent 24%, transparent 74%, var(--dt-bg, #0B0E17) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 4. Content ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "720px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1.35rem",
        }}
      >
        {(h.eyebrow || isEditorMode) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-md"
            style={{
              background: "rgba(9, 13, 22, 0.6)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          >
            <Play className="size-3 fill-current" aria-hidden />
            <InlineText
              {...common}
              fieldKey="eyebrow"
              value={h.eyebrow}
              placeholder={isEN ? "Short label" : "Label singkat"}
              as="span"
            />
          </motion.div>
        )}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.08 }}
          style={{ width: "100%" }}
        >
          <InlineText
            {...common}
            fieldKey="headline"
            value={h.headline}
            as="h1"
            multiline
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight, 700)" as React.CSSProperties["fontWeight"],
              fontStyle: "var(--dt-heading-style, normal)" as React.CSSProperties["fontStyle"],
              fontSize: "clamp(2.3rem, 5.5vw, var(--dt-hero-size, 4rem))",
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              color: "#FFFFFF",
              margin: 0,
              textShadow: "0 2px 24px rgba(0,0,0,0.55)",
            }}
          />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.16 }}
          style={{ width: "100%" }}
        >
          <InlineText
            {...common}
            fieldKey="subheadline"
            value={h.subheadline}
            as="p"
            multiline
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.22rem)",
              color: "rgba(241,245,249,0.88)",
              lineHeight: 1.7,
              maxWidth: "40rem",
              margin: 0,
              textShadow: "0 1px 12px rgba(0,0,0,0.45)",
            }}
          />
        </motion.div>

        {Boolean(h.opening_hours?.trim() || isEditorMode) && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            <Clock className="size-3.5 text-white/70" aria-hidden />
            <InlineText
              {...common}
              fieldKey="opening_hours"
              value={h.opening_hours}
              placeholder={isEN ? "Set opening hours..." : "Atur jam operasional..."}
              as="span"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {(h.cta_text || isEditorMode) && (
            <a
              href={ctaHref}
              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "#FFFFFF",
                color: "#0F172A",
                borderRadius: "var(--dt-radius, 12px)",
                boxShadow: "0 12px 30px -4px rgba(0,0,0,0.45)",
                textDecoration: "none",
              }}
            >
              <InlineText {...common} fieldKey="cta_text" value={h.cta_text || defaultCta} as="span" />
              <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </a>
          )}

          {hasSecondary && (
            <a
              href={safeHref(h.cta_secondary_url, "#contact")}
              {...(isExternalHref(h.cta_secondary_url) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-semibold backdrop-blur-md transition-colors hover:bg-white/15"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: "var(--dt-radius, 12px)",
                textDecoration: "none",
              }}
            >
              <InlineText {...common} fieldKey="cta_secondary_text" value={h.cta_secondary_text} as="span" />
            </a>
          )}
        </div>
      </div>

      {h.image_credit && (
        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-10 z-20">
          <PhotoCredit
            credit={h.image_credit}
            language={language}
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
