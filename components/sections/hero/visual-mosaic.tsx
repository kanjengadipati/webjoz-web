"use client";
import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, Camera, Compass } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, HeroAccessory } from "../../templates/shared";
import { HeroCta, HeroImage } from "./primitives";
import { getHeroSlides } from "./images";
import { heroStrings } from "./hero-strings";

/**
 * Visual Mosaic — 05. Visual Mosaic
 *
 * Kombinasi split 50:50 dengan tipografi editorial display minimalis di kiri,
 * dan dinding mosaik foto multi-rasio asimetris di kanan.
 *
 * Peruntukan: Fotografi, Desain Interior, Arsitektur, Properti, dan Portofolio Kreatif.
 * ImageNeed: Required (min. 3 foto).
 */
export default function HeroVisualMosaic({
  hero: h,
  language,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const s = heroStrings(language);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const handleEditingStateChange = useCallback((editing: boolean) => {
    setIsInlineEditing(editing);
    onEditingStateChange?.(editing);
  }, [onEditingStateChange]);

  // Ekstraksi slide foto dari images.ts
  const slides = getHeroSlides(h, { includeHidden: Boolean(isEditorMode) });

  // Siapkan slot foto hingga 6 ubin mosaik dengan fallback gambar utama jika kurang
  const primarySrc = h.image_url || slides[0]?.src || "";
  const mosaicSlots = [0, 1, 2, 3, 4, 5].map((i) => {
    const slide = slides[i];
    return {
      index: slide?.index ?? i,
      src: slide?.src || (i === 0 ? primarySrc : ""),
      credit: slide?.credit || (i === 0 ? h.image_credit : null),
    };
  });

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "92vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex flex-col lg:grid lg:grid-cols-12 border-b border-border/40"
    >
      {/* Kolom Kiri (50% / 6 cols): Tipografi Editorial Murni & Minimalis */}
      <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-14 lg:p-20 order-2 lg:order-1 border-r border-border/30">
        {/* Micro-header / tags atas */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{h.eyebrow || (language === "en" ? "EDITORIAL • ARCHIVE" : "PORTFOLIO • STUDIO")}</span>
          </div>
          <span>{h.badge_text || "VOL. 2026"}</span>
        </div>

        {/* Center / Massive Headline Display */}
        <div className="my-12 sm:my-20">
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
              fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
              lineHeight: 0.95,
              color: "var(--dt-text)",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={handleEditingStateChange}
          />

          <div className="mt-6 max-w-md">
            <InlineText
              section="hero"
              fieldKey="subheadline"
              value={h.subheadline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{
                fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
                color: "var(--dt-text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />
          </div>

          <HeroAccessory
            accessory={h.accessory}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={handleEditingStateChange}
          />
        </div>

        {/* Footer info & CTA link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/30 text-xs">
          <HeroCta
            href={h.cta_url}
            label={h.cta_text}
            fieldKey="cta_text"
            iconSize={14}
            className="group inline-flex items-center gap-2 font-bold uppercase tracking-wider text-primary hover:opacity-80 transition-opacity"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={handleEditingStateChange}
          />

          <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
            {language === "en" ? "Curated Works & Projects" : "Karya Terkurasi"}
          </span>
        </div>
      </div>

      {/* Kolom Kanan (50% / 6 cols): Dinding Mosaik Foto Multi-Rasio */}
      <div className="lg:col-span-6 order-1 lg:order-2 bg-slate-950 p-2 sm:p-3 overflow-hidden flex items-center justify-center">
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full h-full min-h-[50vh] lg:min-h-[92vh]">
          {/* Kolom Kiri Mosaik (Slot 0, 2, 4) */}
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {/* Foto 0: Landscape sedang */}
            <div className="relative h-44 sm:h-56 lg:h-64 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <HeroImage
                src={mosaicSlots[0].src}
                alt={`${h.headline} 1`}
                credit={mosaicSlots[0].credit}
                language={language}
                fieldKey="image_url"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Foto 2: Vertikal tinggi */}
            <div className="relative flex-1 min-h-[220px] rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <HeroImage
                src={mosaicSlots[2].src}
                alt={`${h.headline} 3`}
                credit={mosaicSlots[2].credit}
                language={language}
                fieldKey="images.2"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Foto 4: Landscape kecil */}
            <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <HeroImage
                src={mosaicSlots[4].src}
                alt={`${h.headline} 5`}
                credit={mosaicSlots[4].credit}
                language={language}
                fieldKey="images.4"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Kolom Kanan Mosaik (Slot 1, 3, 5) */}
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {/* Foto 1: Vertikal tinggi */}
            <div className="relative flex-1 min-h-[240px] rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <HeroImage
                src={mosaicSlots[1].src}
                alt={`${h.headline} 2`}
                credit={mosaicSlots[1].credit}
                language={language}
                fieldKey="images.1"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Foto 3: Landscape sedang */}
            <div className="relative h-44 sm:h-52 lg:h-60 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <HeroImage
                src={mosaicSlots[3].src}
                alt={`${h.headline} 4`}
                credit={mosaicSlots[3].credit}
                language={language}
                fieldKey="images.3"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Foto 5: Kotak / Square */}
            <div className="relative h-36 sm:h-44 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <HeroImage
                src={mosaicSlots[5].src}
                alt={`${h.headline} 6`}
                credit={mosaicSlots[5].credit}
                language={language}
                fieldKey="images.5"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
