"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage } from "../../templates/shared";

/**
 * Neo-Brutalist — thick borders, offset shadows, sticker-style badges.
 * Suited for: creative agency, streetwear, independent designer, newsletter.
 * Business filter: creative/fashion/design/studio businesses.
 */
export default function HeroNeoBrutalist({
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
        display: "flex",
        alignItems: "center",
        padding: "5rem 1.5rem",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
    >
      {/* Neo-brutalist background decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "120px",
          height: "120px",
          background: "var(--dt-primary)",
          border: "3px solid var(--dt-text)",
          boxShadow: "4px 4px 0 var(--dt-text)",
          transform: "rotate(6deg)",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "3%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "var(--dt-accent, var(--dt-primary))",
          border: "3px solid var(--dt-text)",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="flex-col lg:grid"
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {h.eyebrow && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "inline-block",
                padding: "0.35rem 0.75rem",
                background: "var(--dt-primary)",
                color: "var(--dt-primary-foreground)",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "2px solid var(--dt-text)",
                boxShadow: "3px 3px 0 var(--dt-text)",
                width: "fit-content",
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
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                lineHeight: 1.0,
                color: "var(--dt-text)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
                lineHeight: 1.65,
                maxWidth: "28rem",
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
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}
          >
            <a
              href={h.cta_url}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                background: "var(--dt-primary)",
                color: "var(--dt-primary-foreground)",
                fontWeight: 800,
                fontSize: "0.85rem",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "2px solid var(--dt-text)",
                boxShadow: "4px 4px 0 var(--dt-text)",
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "2px 2px 0 var(--dt-text)";
                e.currentTarget.style.transform = "translate(2px, 2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0 var(--dt-text)";
                e.currentTarget.style.transform = "none";
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
              /> <ArrowRight style={{ width: 16, height: 16 }} />
            </a>
            {hasSecondary && (
              <a
                href={h.cta_secondary_url!}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.5rem",
                  background: "transparent",
                  color: "var(--dt-text)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  border: "2px solid var(--dt-text)",
                  boxShadow: "4px 4px 0 color-mix(in srgb, var(--dt-text) 40%, transparent)",
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "2px 2px 0 color-mix(in srgb, var(--dt-text) 40%, transparent)";
                  e.currentTarget.style.transform = "translate(2px, 2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "4px 4px 0 color-mix(in srgb, var(--dt-text) 40%, transparent)";
                  e.currentTarget.style.transform = "none";
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
              </a>
            )}
          </motion.div>

          {h.badge_text && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "inline-block",
                padding: "0.25rem 0.6rem",
                border: "1.5px solid color-mix(in srgb, var(--dt-text) 30%, transparent)",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--dt-text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                width: "fit-content",
              }}
            >
              <InlineText
                section="hero"
                fieldKey="badge_text"
                value={h.badge_text ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </motion.div>
          )}
        </div>

        {/* Right: image with brutalist frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: "relative" }}
          className="hidden lg:block"
        >
          <div
            style={{
              border: "3px solid var(--dt-text)",
              boxShadow: "8px 8px 0 var(--dt-primary)",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "4 / 5",
            }}
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
                <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 20 }}>
                  <PhotoCredit credit={h.image_credit} />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "360px",
                  background: `color-mix(in srgb, var(--dt-primary) 15%, var(--dt-bg))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontSize: "5rem",
                    fontWeight: 900,
                    color: `color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
                    textTransform: "uppercase",
                    userSelect: "none",
                  }}
                >
                  ✦
                </span>
              </div>
            )}
          </div>
          {/* Decorative sticker */}
          <div
            style={{
              position: "absolute",
              top: "-1rem",
              right: "-1rem",
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "50%",
              background: "var(--dt-primary)",
              border: "2px solid var(--dt-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.55rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--dt-primary-foreground)",
              textAlign: "center",
              lineHeight: 1.3,
              padding: "0.25rem",
              boxShadow: "2px 2px 0 var(--dt-text)",
            }}
          >
            ★<br />New
          </div>
        </motion.div>
      </div>
    </section>
  );
}
