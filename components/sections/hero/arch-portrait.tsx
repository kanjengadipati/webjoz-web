"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/** Arch Portrait — foto berbingkai lengkung + stempel badge. ImageNeed: Required (1). */
export default function HeroArchPortrait({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const isEN = language === "en";
  const reduce = useReducedMotion();
  const common = {
    section: "hero" as const,
    onUpdateField,
    isEditorMode,
    isSelected,
    collapseSheetForInlineEdit,
  };
  const ctaHref = safeHref(h.cta_url);
  const ext = isExternalHref(h.cta_url);
  const badgeIsStats = h.badge_text?.includes("|") ?? false;

  return (
    <section id="hero" style={{ background: h.background_color || "var(--dt-bg)", overflow: "hidden" }}>
      <div
        className="mx-auto flex flex-col-reverse gap-10 px-6 py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24"
        style={{ maxWidth: "1180px", minHeight: "80vh" }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.6 }}
        >
          {(h.eyebrow || isEditorMode) && (
            <InlineText
              {...common}
              fieldKey="eyebrow"
              value={h.eyebrow}
              placeholder={isEN ? "Short label" : "Label singkat"}
              style={{
                display: "block",
                fontSize: "0.75rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--dt-primary)",
                marginBottom: "1rem",
              }}
            />
          )}
          <InlineText
            {...common}
            fieldKey="headline"
            value={h.headline}
            as="h1"
            multiline
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              lineHeight: 1.08,
              margin: 0,
              color: "var(--dt-text)",
            }}
          />
          <InlineText
            {...common}
            fieldKey="subheadline"
            value={h.subheadline}
            as="p"
            multiline
            style={{
              marginTop: "1.25rem",
              color: "var(--dt-text-muted)",
              lineHeight: 1.65,
              maxWidth: "46ch",
            }}
          />
          {(h.cta_text || isEditorMode) && (
            <a
              href={ctaHref}
              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 font-semibold"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-on-primary, #fff)",
                borderRadius: "999px",
              }}
            >
              <InlineText {...common} fieldKey="cta_text" value={h.cta_text} />
              <ArrowRight size={18} aria-hidden />
            </a>
          )}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.7 }}
          className="relative mx-auto w-full"
          style={{ maxWidth: "460px" }}
        >
          <div
            style={{
              aspectRatio: "4 / 5",
              borderRadius: "999px 999px 24px 24px",
              overflow: "hidden",
              border: "6px solid var(--dt-surface, transparent)",
              background: "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface, var(--dt-bg)))",
            }}
          >
            <InlineImage
              {...common}
              fieldKey="image_url"
              src={h.image_url}
              alt={h.headline || (isEN ? "Hero image" : "Gambar hero")}
              className="h-full w-full object-cover"
            />
          </div>
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
          {(h.badge_text && !badgeIsStats) || isEditorMode ? (
            <InlineText
              {...common}
              fieldKey="badge_text"
              value={badgeIsStats ? "" : h.badge_text}
              placeholder={isEN ? "Badge" : "Badge"}
              className="absolute -left-3 bottom-10 px-4 py-2 text-sm font-semibold"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-on-primary, #fff)",
                borderRadius: "999px",
                transform: "rotate(-6deg)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            />
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
