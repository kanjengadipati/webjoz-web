"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * Floating Card — foto besar, kartu teks "melayang" menimpa foto.
 * ImageNeed: Required (1 foto). Cocok: jasa, klinik, properti, edukasi.
 */
export default function HeroFloatingCard({
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
  const ctaHref = safeHref(h.cta_url);
  const ext = isExternalHref(h.cta_url);
  const common = { section: "hero" as const, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit };

  return (
    <section
      id="hero"
      style={{ position: "relative", background: h.background_color || "var(--dt-bg)", overflow: "hidden" }}
    >
      <div className="flex flex-col lg:block" style={{ position: "relative", minHeight: "min(88vh, 760px)" }}>
        {/* Foto */}
        <div
          className="relative h-[46vh] lg:absolute lg:inset-0 lg:h-auto"
          style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface, var(--dt-bg)))" }}
        >
          <InlineImage
            {...common}
            fieldKey="image_url"
            src={h.image_url}
            alt={h.headline || (isEN ? "Hero image" : "Gambar hero")}
            isBackground
            className="h-full w-full object-cover"
          />
          <PhotoCredit
            credit={h.image_credit}
              src={h.image_url}
            language={language}
            section="hero"
            fieldKey="image_credit.name"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            className="absolute bottom-3 right-4 z-20"
          />
        </div>

        {/* Kartu */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
          className="relative z-10 -mt-8 mx-4 p-6 sm:p-8 lg:absolute lg:left-[6%] lg:bottom-[10%] lg:mx-0 lg:mt-0 lg:max-w-[520px]"
          style={{
            background: "var(--dt-surface, var(--dt-bg))",
            color: "var(--dt-text)",
            borderRadius: "calc(var(--dt-radius, 12px) * 1.5)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          }}
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
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--dt-primary)",
                marginBottom: "0.75rem",
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
            style={{ fontFamily: "var(--dt-heading-font)", fontSize: "clamp(2rem, 4.2vw, 3.2rem)", lineHeight: 1.1, margin: 0 }}
          />
          <InlineText
            {...common}
            fieldKey="subheadline"
            value={h.subheadline}
            as="p"
            multiline
            style={{ marginTop: "1rem", color: "var(--dt-text-muted)", lineHeight: 1.6 }}
          />
          {(h.cta_text || isEditorMode) && (
            <a
              href={ctaHref}
              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 font-semibold"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-on-primary, #fff)",
                borderRadius: "var(--dt-radius, 12px)",
              }}
            >
              <InlineText {...common} fieldKey="cta_text" value={h.cta_text} />
              <ArrowRight size={18} aria-hidden />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
