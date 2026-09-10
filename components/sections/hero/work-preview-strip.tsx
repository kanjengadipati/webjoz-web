"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";

/**
 * Work Preview Strip — studio, design/creative studio, agency, developer.
 * Compact hero text on top + a bold horizontal strip of featured-work tiles
 * below (derived from badge_text "value|label" stats, e.g. "8+ Tahun|350+
 * Proyek|98% Puas"). Works without a gallery section — self-contained.
 * Business filter: studio/creative/agency/developer businesses.
 */
export default function HeroWorkPreviewStrip({
  hero: h,
  design_token,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;
  const isEN = language === "en";
  const stripLabel = isEN ? "Featured Work" : "Karya Unggulan";

  const rawStats = h.badge_text?.includes("|")
    ? h.badge_text.split(",").map((s) => {
        const [val, label] = s.split("|");
        return { value: val?.trim() ?? "", label: label?.trim() ?? "" };
      })
    : null;

  const showStrip = rawStats !== null && rawStats.length > 0;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
    >
      {/* Faint background image */}
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
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, mixBlendMode: "luminosity" }}
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
          top: "-12%",
          right: "-6%",
          width: "50%",
          height: "70%",
          background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 18%, transparent), transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "72rem",
          margin: "0 auto",
          width: "100%",
          padding: "clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem) clamp(2.5rem, 5vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          gap: "2.25rem",
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
              fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
              lineHeight: 1.05,
              color: "var(--dt-text)",
              margin: 0,
              maxWidth: "18ch",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start" }}
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
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              maxWidth: "36rem",
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
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={h.cta_url}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: "var(--dt-primary)",
                color: "var(--dt-primary-foreground)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                borderRadius: "var(--dt-radius)",
              }}
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
          </div>
        </motion.div>

        {showStrip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ marginTop: "1rem" }}
          >
            <p
              style={{
                margin: 0,
                marginBottom: "0.75rem",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--dt-text-muted)",
              }}
            >
              {stripLabel}
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{
                gap: "1rem",
              }}
            >
              {rawStats!.map((s, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActiveTile(i)}
                  onMouseLeave={() => setActiveTile(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1.25rem 1.5rem",
                    background: "var(--dt-surface)",
                    border: "1px solid color-mix(in srgb, var(--dt-text) 12%, transparent)",
                    borderRadius: "var(--dt-radius)",
                    cursor: "default",
                    transition: "border-color 0.2s, transform 0.2s",
                    borderColor: activeTile === i ? "var(--dt-primary)" : undefined,
                    transform: activeTile === i ? "translateY(-2px)" : undefined,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--dt-primary)",
                      fontFamily: "var(--dt-heading-font)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                        fontWeight: 800,
                        color: "var(--dt-text)",
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
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
