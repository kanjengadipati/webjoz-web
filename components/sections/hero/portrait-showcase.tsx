"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";

/**
 * Portrait Showcase — photographer, model, artist, studio, content creator.
 * Large portrait image column + text content. Photo stays visible on mobile
 * (stacked on top), unlike split-editorial which hides the image on mobile.
 * Business filter: photography/portrait/creative businesses.
 */
export default function HeroPortraitShowcase({
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
        minHeight: "100vh",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex flex-col lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    >
      {/* Left: portrait image column (visible on mobile too) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        style={{ position: "relative" }}
        className="min-h-[55vh] lg:min-h-0"
      >
        {h.image_url ? (
          <>
            <InlineImage
              section="hero"
              fieldKey="image_url"
              src={h.image_url}
              alt={h.headline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              className="w-full h-full max-h-[70vh] lg:max-h-none"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
            <div style={{ position: "absolute", bottom: 8, left: 12, zIndex: 20 }}>
              <PhotoCredit credit={h.image_credit} language={language} />
            </div>
            {/* Availability overlay badge on the photo */}
            <span
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                padding: "0.4rem 0.9rem",
                borderRadius: "9999px",
                fontSize: "0.66rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                zIndex: 10,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }}
              />
              {availLabel}
            </span>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(160deg, color-mix(in srgb, var(--dt-primary) 25%, var(--dt-bg)), color-mix(in srgb, var(--dt-primary) 10%, var(--dt-bg)))`,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: "1.25rem",
            right: "1.25rem",
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
              fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)",
              lineHeight: 1.05,
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
              maxWidth: "30rem",
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

        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            style={{
              display: "flex",
              gap: "2rem",
              paddingTop: "1.25rem",
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
                    fontSize: "1.25rem",
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
                    fontSize: "0.6rem",
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
