"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/** Collage Mosaic — 3 foto asimetris. ImageNeed: Required, MinImages: 3. */
export default function HeroCollageMosaic({
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

  // Slot 0 selalu image_url (konsisten dengan carousel-filmstrip: 0 → "image_url", n → `images.${n}`)
  const imgs = (h.images ?? []).filter(Boolean);
  const slots = [h.image_url || imgs[0], imgs[1], imgs[2]];
  const keyFor = (i: number) => (i === 0 ? "image_url" : `images.${i}`);
  const aspect = ["4 / 5", "1 / 1", "1 / 1"];
  const fallbackBg = "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface, var(--dt-bg)))";

  return (
    <section id="hero" style={{ background: h.background_color || "var(--dt-bg)", overflow: "hidden" }}>
      <div
        className="mx-auto flex flex-col gap-10 px-6 py-14 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14 lg:py-24"
        style={{ maxWidth: "1240px" }}
      >
        <div>
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
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.06,
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
              maxWidth: "44ch",
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
                borderRadius: "var(--dt-radius, 12px)",
              }}
            >
              <InlineText {...common} fieldKey="cta_text" value={h.cta_text} />
              <ArrowRight size={18} aria-hidden />
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {slots.map((src, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.12 }}
              className={i === 0 ? "row-span-2" : ""}
              style={{
                overflow: "hidden",
                borderRadius: "var(--dt-radius, 16px)",
                aspectRatio: i === 0 ? undefined : aspect[i],
                minHeight: i === 0 ? "100%" : undefined,
                position: "relative",
                background: fallbackBg,
              }}
            >
              <InlineImage
                {...common}
                fieldKey={keyFor(i)}
                src={src}
                alt={`${h.headline || (isEN ? "Hero" : "Hero")} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
          <div className="col-span-2">
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
        </div>
      </div>
    </section>
  );
}
