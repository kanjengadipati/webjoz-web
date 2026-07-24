"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";

/**
 * Split Editorial — photo agency, content studio, travel, digital collective.
 * Stats generalized from about.highlight_stat_* (passed via design_token extras or fallback).
 * Left: masonry image column. Right: text content + stats row.
 * Business filter: photography/studio/travel/content/media businesses.
 */
import { InlineText, InlineImage } from "../../templates/shared";

export default function HeroSplitEditorial({
  hero: h,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [activeStatIdx, setActiveStatIdx] = useState<number | null>(null);
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;

  const rawStats = h.badge_text?.includes("|")
    ? h.badge_text.split(",").map((s) => {
        const [val, label] = s.split("|");
        return { value: val?.trim() ?? "", label: label?.trim() ?? "" };
      })
    : null;

  const stats = rawStats ?? [
    { value: "—", label: "Projects" },
    { value: "—", label: "Clients" },
    { value: "—", label: "Awards" },
  ];

  const showStats = rawStats !== null;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
      className="flex-col lg:grid"
    >
      {/* Left: editorial image column */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        style={{ position: "relative", minHeight: "50vh" }}
        className="hidden lg:block"
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
              className="w-full h-full"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "grayscale(15%)",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
            <div style={{ position: "absolute", bottom: 8, left: 12, zIndex: 20 }}>
              <PhotoCredit credit={h.image_credit} />
            </div>
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
        {/* Year stamp */}
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
          padding: "clamp(3rem, 7vw, 6rem) clamp(1.5rem, 4vw, 4rem)",
          gap: "2rem",
        }}
      >
        {h.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                display: "block",
                width: "2rem",
                height: "1px",
                background: "var(--dt-primary)",
              }}
            />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--dt-primary)",
              }}
            >
              {h.eyebrow}
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
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
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
              {h.cta_secondary_text}
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </a>
          )}
        </motion.div>

        {/* Stats row — generalized from about highlight stats */}
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
            }}
          >
            {stats.map((s, i) => (
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
