"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Leaf } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";

/**
 * Natural Organic — sustainable brand, botanical, organic, health & wellness.
 * Warm earthy palette, soft SVG botanical decoration, centered layout.
 * Suited for: organic products, wellness, farm-to-table, eco brands.
 */
import { InlineText, InlineImage } from "../../templates/shared";

export default function HeroNaturalOrganic({
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
        justifyContent: "center",
        padding: "5rem 1.5rem",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
      }}
    >
      {/* SVG botanical left decoration */}
      <svg
        aria-hidden
        viewBox="0 0 200 400"
        style={{
          position: "absolute",
          left: "-2rem",
          top: "10%",
          height: "70%",
          width: "auto",
          opacity: 0.12,
          pointerEvents: "none",
          color: "var(--dt-primary)",
        }}
        fill="none"
      >
        <path d="M100 400 C100 300, 20 250, 40 150 C60 80, 130 50, 100 0" stroke="currentColor" strokeWidth="3" />
        <path d="M100 280 C80 260, 40 255, 30 230" stroke="currentColor" strokeWidth="2" />
        <path d="M100 220 C125 205, 155 215, 165 195" stroke="currentColor" strokeWidth="2" />
        <path d="M100 310 C70 295, 50 280, 45 260" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="38" cy="225" rx="18" ry="12" fill="currentColor" opacity="0.6" transform="rotate(-20 38 225)" />
        <ellipse cx="168" cy="192" rx="18" ry="12" fill="currentColor" opacity="0.6" transform="rotate(15 168 192)" />
        <ellipse cx="43" cy="258" rx="14" ry="9" fill="currentColor" opacity="0.5" transform="rotate(-30 43 258)" />
      </svg>

      {/* SVG botanical right decoration */}
      <svg
        aria-hidden
        viewBox="0 0 200 400"
        style={{
          position: "absolute",
          right: "-2rem",
          bottom: "5%",
          height: "60%",
          width: "auto",
          opacity: 0.1,
          pointerEvents: "none",
          color: "var(--dt-primary)",
          transform: "scaleX(-1) rotate(15deg)",
        }}
        fill="none"
      >
        <path d="M100 400 C100 300, 20 250, 40 150 C60 80, 130 50, 100 0" stroke="currentColor" strokeWidth="3" />
        <path d="M100 280 C80 260, 40 255, 30 230" stroke="currentColor" strokeWidth="2" />
        <path d="M100 220 C125 205, 155 215, 165 195" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="38" cy="225" rx="18" ry="12" fill="currentColor" opacity="0.6" transform="rotate(-20 38 225)" />
        <ellipse cx="168" cy="192" rx="18" ry="12" fill="currentColor" opacity="0.6" transform="rotate(15 168 192)" />
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "720px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        {(h.eyebrow || h.badge_text) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.9rem",
              background: "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface))",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)",
              borderRadius: "9999px",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--dt-primary)",
            }}
          >
            <Leaf style={{ width: 10, height: 10 }} />
            <InlineText
              section="hero"
              fieldKey="eyebrow"
              value={h.eyebrow || h.badge_text}
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
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              lineHeight: 1.15,
              color: "var(--dt-text)",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        {/* Decorative leaf divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "var(--dt-primary)",
          }}
        >
          <span style={{ display: "block", width: "2.5rem", height: "1px", background: "currentColor", opacity: 0.5 }} />
          <Leaf style={{ width: 14, height: 14 }} />
          <span style={{ display: "block", width: "2.5rem", height: "1px", background: "currentColor", opacity: 0.5 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              color: "var(--dt-text-muted)",
              lineHeight: 1.75,
              maxWidth: "34rem",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}
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
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.875rem",
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
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                color: "var(--dt-text)",
                textDecoration: "none",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "1px solid color-mix(in srgb, var(--dt-text) 22%, transparent)",
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

        {/* Opening hours if set */}
        {h.opening_hours && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{
              fontSize: "0.7rem",
              color: "var(--dt-text-muted)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Leaf style={{ width: 10, height: 10, color: "var(--dt-primary)" }} />
            <InlineText
              section="hero"
              fieldKey="opening_hours"
              value={h.opening_hours ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </motion.p>
        )}

        {/* Image below text — circular */}
        {h.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              position: "relative",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)",
              marginTop: "0.5rem",
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
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
            <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 20 }}>
              <PhotoCredit credit={h.image_credit} />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
