"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";

/**
 * Chronology Badge — personal-brand businesses with track record (coach,
 * mentor, consultant, author, expert). Giant years-of-experience numeral on
 * the left, role/headline/CTA on the right, remaining stats as milestone rows.
 * Uses badge_text "value|label" stats; the first stat becomes the big number.
 * Business filter: personal/consultant/creator businesses.
 */
export default function HeroChronologyBadge({
  hero: h,
  design_token,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;
  const isEN = language === "en";
  const availLabel = isEN ? "Available for work" : "Tersedia untuk kerja";
  const yearsFallback = isEN ? "Years" : "Tahun";
  const journeyFallback = isEN ? "Track record" : "Jejak karier";

  const rawStats = h.badge_text?.includes("|")
    ? h.badge_text.split(",").map((s) => {
        const [val, label] = s.split("|");
        return { value: val?.trim() ?? "", label: label?.trim() ?? "" };
      })
    : null;

  const showStats = rawStats !== null;
  const bigYear = rawStats?.[0];
  const milestones = showStats ? rawStats!.slice(1) : [];

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex flex-col lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
    >
      {/* Left: giant chronology badge */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "clamp(3rem, 6vw, 5.5rem) clamp(1.5rem, 4.5vw, 4rem)",
          minHeight: "55vh",
        }}
      >
        {/* Portrait vignette */}
        {h.image_url && (
          <div
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              width: "clamp(4rem, 8vw, 6.5rem)",
              height: "clamp(4rem, 8vw, 6.5rem)",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid var(--dt-primary)",
              zIndex: 2,
            }}
          >
            <InlineImage
              section="hero"
              fieldKey="image_url"
              src={h.image_url}
              alt={h.headline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              className="w-full h-full"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
          </div>
        )}
        {showStats && bigYear ? (
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(6rem, 14vw, 11rem)",
                lineHeight: 0.9,
                fontWeight: 900,
                fontFamily: "var(--dt-heading-font)",
                color: "var(--dt-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              {bigYear.value}
            </p>
            <p
              style={{
                margin: 0,
                marginTop: "0.75rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--dt-text-muted)",
              }}
            >
              {bigYear.label || yearsFallback}
            </p>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "20rem",
              aspectRatio: "1 / 1",
              background: `linear-gradient(160deg, color-mix(in srgb, var(--dt-primary) 30%, var(--dt-bg)), color-mix(in srgb, var(--dt-primary) 10%, var(--dt-bg)))`,
            }}
          />
        )}
        {/* Milestone rows (remaining stats) */}
        {milestones.length > 0 && (
          <div style={{ position: "relative", zIndex: 1, marginTop: "2rem", maxWidth: "22rem", width: "100%" }}>
            <p
              style={{
                margin: 0,
                marginBottom: "0.5rem",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--dt-text-muted)",
              }}
            >
              {journeyFallback}
            </p>
            {milestones.map((s, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveRow(i)}
                onMouseLeave={() => setActiveRow(null)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid color-mix(in srgb, var(--dt-text) 12%, transparent)",
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: activeRow === i ? "var(--dt-primary)" : "var(--dt-text)",
                    transition: "color 0.2s",
                    fontFamily: "var(--dt-heading-font)",
                    minWidth: "3.5rem",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--dt-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: "1.5rem",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--dt-primary-foreground)",
            background: "var(--dt-primary)",
            padding: "0.25rem 0.6rem",
          }}
        >
          {new Date().getFullYear()}
        </div>
      </motion.div>

      {/* Right: text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(3rem, 6vw, 5.5rem) clamp(1.5rem, 4.5vw, 4rem)",
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
            <span style={{ display: "block", width: "2rem", height: "1px", background: "var(--dt-primary)" }} />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
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
              fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
              lineHeight: 1.08,
              color: "var(--dt-text)",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start" }}
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
              fontSize: "1rem",
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              maxWidth: "28rem",
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
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
