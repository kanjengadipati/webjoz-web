"use client";
import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, Compass, MapPin } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText, HeroAccessory } from "../../templates/shared";
import { HeroCta, HeroImage } from "./primitives";
import { heroStrings } from "./hero-strings";

/**
 * Cinematic Immersive — 04. Cinematic Immersive
 *
 * Full-bleed foto sinematik berbingkai (*contained inner-frame*) dengan
 * gradient overlay terkontrol. Kiri bawah: social proof pill dan headline monumental.
 * Kanan bawah: deskripsi ringkas dan tombol aksi kontras.
 *
 * Peruntukan: Hotel, Resort, Travel, Villa, Restoran Fine Dining, dan Hospitality.
 * ImageNeed: Required (min. 1 foto beresolusi tinggi).
 */
export default function HeroCinematicImmersive({
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

  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());

  // Foto latar belakang utama: prioritaskan image_url atau images[0]
  const bgImage = h.image_url || (Array.isArray(h.images) && h.images.length > 0 ? h.images[0] : null);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "92vh",
        background: h.background_color || "var(--dt-bg)",
      }}
      className="p-2 sm:p-5 lg:p-7 flex flex-col justify-center"
    >
      {/* Contained Framed Cinematic Window */}
      <div
        className="relative w-full min-h-[82vh] lg:min-h-[86vh] rounded-3xl overflow-hidden border flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-2xl"
        style={{
          borderColor: "color-mix(in srgb, var(--dt-primary) 20%, rgba(255, 255, 255, 0.15))",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Background photo & overlays */}
        {bgImage ? (
          <div className="absolute inset-0 z-0">
            <HeroImage
              src={bgImage}
              alt={h.headline}
              credit={h.image_credit}
              language={language}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.85)" }}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          />
        )}

        {/* Ambient Dark Gradient Overlays for perfect legibility */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Subtle inner border glow */}
        <div className="absolute inset-0 z-[2] pointer-events-none rounded-3xl ring-1 ring-inset ring-white/10" />

        {/* Top Header / Ambient Floating Bar */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white text-xs font-medium">
            <Compass className="size-3.5 text-primary" style={{ color: "var(--dt-primary)" }} />
            <span>{h.eyebrow || (language === "en" ? "Exclusive Experience" : "Pengalaman Eksklusif")}</span>
          </div>

          {(h.cta_secondary_text || isEditorMode) && (
            <HeroCta
              href={h.cta_secondary_url || "#"}
              label={h.cta_secondary_text || (language === "en" ? "Explore" : "Jelajahi")}
              fieldKey="cta_secondary_text"
              icon={null}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition-colors"
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />
          )}
        </div>

        {/* Bottom Split Content (Headline on Left, Description & CTA on Right) */}
        <div className="relative z-10 mt-auto pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 items-end gap-8 lg:gap-12">
          {/* Sisi Kiri: Social proof badge + Headline Monumental (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Social Proof Pill (Avatar stack + Happy Guests/Rating) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs"
            >
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 border border-black flex items-center justify-center text-[9px] font-bold">★</div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[9px] font-bold">✓</div>
                <div className="w-5 h-5 rounded-full bg-sky-500 border border-black flex items-center justify-center text-[9px] font-bold">♥</div>
              </div>
              <span className="font-medium text-slate-200">
                {h.badge_text || (language === "en" ? "4.9/5 · 300+ Happy Guests" : "4.9/5 · 300+ Pengunjung Puas")}
              </span>
            </motion.div>

            {/* Monumental Headline */}
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
                fontSize: "clamp(2.6rem, 6.5vw, 4.8rem)",
                lineHeight: 1.05,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                margin: 0,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />

            <HeroAccessory
              accessory={h.accessory}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={handleEditingStateChange}
            />
          </div>

          {/* Sisi Kanan: Subheadline & Tombol Aksi Kontras (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-start lg:pl-6">
            <div className="max-w-md">
              <InlineText
                section="hero"
                fieldKey="subheadline"
                value={h.subheadline}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="p"
                style={{
                  fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: 1.65,
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  margin: 0,
                }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={handleEditingStateChange}
              />
            </div>

            <div className="mt-6 flex items-center gap-4">
              <HeroCta
                href={h.cta_url}
                label={h.cta_text}
                fieldKey="cta_text"
                iconSize={15}
                className="transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 2.2rem",
                  background: "#ffffff",
                  color: "#0a0c10",
                  textDecoration: "none",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
                }}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={handleEditingStateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
