"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";

/**
 * Personal Billboard — personal-brand/portfolio businesses (photographer,
 * designer, studio, consultant). Poster-style typography: huge name-driven
 * headline, role in the eyebrow, availability pill, inline stats row.
 * Business filter: kreatif/personal-brand businesses.
 */
export default function HeroPersonalBillboard({
  hero: h,
  design_token,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [activeStatIdx, setActiveStatIdx] = useState<number | null>(null);
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;
  const isEN = language === "en";
  const availLabel = isEN ? "Available for work" : "Tersedia untuk kerja";

  const rawStats = h.badge_text?.includes("|")
    ? h.badge_text.split(",").map((s) => {
        const [val, label] = s.split("|");
        return { value: val?.trim() ?? "", label: label?.trim() ?? "" };
      })
    : null;

  const showStats = rawStats !== null;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
    >
      {/* Faint billboard backdrop image */}
      {h.image_url && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <InlineImage
            section="hero"
            fieldKey="image_url"
            src={h.image_url}
            alt={h.headline}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            className="w-full h-full"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.09, mixBlendMode: "luminosity" }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
          <div style={{ position: "absolute", bottom: 4, right: 8, zIndex: 20 }}>
            <PhotoCredit credit={h.image_credit} language={language} />
          </div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-8%",
          width: "55%",
          height: "85%",
          background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 22%, transparent), transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-18%",
          left: "-6%",
          width: "40%",
          height: "65%",
          background: `radial-gradient(circle, color-mix(in srgb, var(--dt-accent) 14%, transparent), transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "68rem",
          margin: "0 auto",
          width: "100%",
          padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}
      >
        {h.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span style={{ display: "block", width: "2.5rem", height: "1px", background: "var(--dt-primary)" }} />
            <span
              style={{
                fontSize: "clamp(0.6rem, 1.2vw, 0.7rem)",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--dt-primary)",
              }}
            >
              <InlineText
                section="hero"
                fieldKey="eyebrow"
                value={h.eyebrow ?? ""}
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
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
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "var(--dt-text)",
              margin: 0,
              maxWidth: "17ch",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
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
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              maxWidth: "34rem",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
          <HeroAccessory
            accessory={h.accessory}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "fit-content",
              background: "color-mix(in srgb, var(--dt-primary) 12%, var(--dt-bg))",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 35%, transparent)",
              color: "var(--dt-text)",
              padding: "0.4rem 0.9rem",
              borderRadius: "9999px",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--dt-primary)", display: "inline-block", flexShrink: 0 }}
            />
            {availLabel}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.5rem" }}
        >
          <a
            href={h.cta_url}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2.25rem",
              background: "var(--dt-primary)",
              color: "var(--dt-primary-foreground)",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              borderRadius: "var(--dt-radius)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <InlineText
              section="hero"
              fieldKey="cta_text"
              value={h.cta_text}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            /> <ArrowRight style={{ width: 15, height: 15 }} />
          </a>
          {hasSecondary && (
            <a
              href={h.cta_secondary_url!}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "var(--dt-text)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
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
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </a>
          )}
        </motion.div>

        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            style={{
              display: "flex",
              gap: "clamp(1.5rem, 4vw, 3rem)",
              paddingTop: "1.75rem",
              marginTop: "1rem",
              borderTop: "1px solid color-mix(in srgb, var(--dt-text) 12%, transparent)",
              flexWrap: "wrap",
            }}
          >
            {rawStats!.map((s, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveStatIdx(i)}
                onMouseLeave={() => setActiveStatIdx(null)}
                style={{ cursor: "default" }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    fontWeight: 800,
                    color: activeStatIdx === i ? "var(--dt-primary)" : "var(--dt-text)",
                    transition: "color 0.2s",
                    fontFamily: "var(--dt-heading-font)",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.62rem",
                    color: "var(--dt-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
