"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HeroVariantProps } from "./types";
import PhotoCreditList from "../PhotoCreditList";
import { InlineText, InlineImage } from "../../templates/shared";
import { getHeroSlides, commitHeroSlide } from "./images";
import { HeroCta } from "./primitives";

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

  // Slot 0 selalu image_url (konsisten dengan carousel-filmstrip: 0 → "image_url", n → `images.${n}`)
  const list = getHeroSlides(h);
  const rawLen = Array.isArray(h.images) ? h.images.length : 0;
  const idxFor = (i: number) => list[i]?.index ?? Math.max(rawLen, i);
  const tiles = [0, 1, 2]
    .map((i) => ({ src: list[i]?.src, index: idxFor(i), i }))
    .filter((t) => t.src || isEditorMode);
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
            <HeroCta
              href={h.cta_url}
              label={h.cta_text}
              fieldKey="cta_text"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 font-semibold"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-on-primary, #fff)",
                borderRadius: "var(--dt-radius, 12px)",
              }}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
        </div>

        <div className={tiles.length >= 3 ? "grid grid-cols-2 gap-3 sm:gap-4" : tiles.length === 2 ? "grid grid-cols-2 gap-3 sm:gap-4" : "grid grid-cols-1 gap-3 sm:gap-4"}>
          {tiles.map((t) => {
            const i = t.i;
            const src = t.src;
            return (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.12 }}
              className={i === 0 && tiles.length >= 3 ? "row-span-2" : ""}
              style={{
                overflow: "hidden",
                borderRadius: "var(--dt-radius, 16px)",
                aspectRatio: i === 0 && tiles.length >= 3 ? undefined : aspect[i],
                minHeight: i === 0 && tiles.length >= 3 ? "100%" : undefined,
                position: "relative",
                background: fallbackBg,
              }}
            >
              <InlineImage
                {...common}
                fieldKey={`images.${t.index}`}
                src={src}
                alt={`${h.headline || (isEN ? "Hero" : "Hero")} ${i + 1}`}
                onUpdateField={(_, __, val) => commitHeroSlide(onUpdateField, h, t.index, val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                className="h-full w-full object-cover"
              />
            </motion.div>
            );
          })}
          <div className="col-span-2">
            <PhotoCreditList items={list.slice(0, 3)} language={language} />
          </div>
        </div>
      </div>
    </section>
  );
}
