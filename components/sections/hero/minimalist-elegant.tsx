"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";

/**
 * Minimalist Elegant — warm, sophisticated, luxury feel.
 * Suited for: architecture, fashion, wellness, premium services.
 * Layout: full-width editorial with large serif headline + side image column.
 */
import { InlineText, InlineImage } from "../../templates/shared";

export default function HeroMinimalistElegant({
  hero: h,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;

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
      {/* Left: text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(3rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem)",
          gap: "1.75rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {h.eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--dt-primary)",
            }}
          >
            {h.eyebrow}
          </motion.span>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--dt-text)",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* Thin divider */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            height: 1,
            width: "3rem",
            background: "var(--dt-primary)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
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
              fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              maxWidth: "32rem",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
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
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
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
            /> <ArrowRight style={{ width: 14, height: 14 }} />
          </a>
          {hasSecondary && (
            <a
              href={h.cta_secondary_url!}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.875rem 1.5rem",
                color: "var(--dt-text)",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                border: "1px solid color-mix(in srgb, var(--dt-text) 25%, transparent)",
              }}
            >
              {h.cta_secondary_text}
            </a>
          )}
        </motion.div>

        {h.badge_text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: "0.7rem", color: "var(--dt-text-muted)", margin: 0 }}
          >
            {h.badge_text}
          </motion.p>
        )}
      </div>

      {/* Right: image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
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
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
            <div style={{ position: "absolute", bottom: 8, right: 12, zIndex: 20 }}>
              <PhotoCredit credit={h.image_credit} />
            </div>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, var(--dt-bg)), color-mix(in srgb, var(--dt-primary) 6%, var(--dt-bg)))`,
            }}
          />
        )}
      </motion.div>
    </section>
  );
}
