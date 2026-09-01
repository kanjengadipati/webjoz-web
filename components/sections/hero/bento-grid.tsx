"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";

/**
 * Bento Grid — product launch, SaaS, conversion-focused startup.
 * Auto-animates a metric bar between 0-100 every 2s.
 * Business filter: tech/startup/product/digital businesses.
 * Stats: generalized from about.highlight_stat_* if available.
 */
import { InlineText, InlineImage } from "../../templates/shared";

export default function HeroBentoGrid({
  hero: h,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [metricValue, setMetricValue] = useState(72);
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;

  // Auto-animate metric bar
  useEffect(() => {
    const values = [72, 88, 61, 95, 79, 84];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % values.length;
      setMetricValue(values[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "98%", label: "Satisfaction" },
    { value: "10K+", label: "Users" },
    { value: "24/7", label: "Support" },
  ];

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
      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(color-mix(in srgb, var(--dt-primary) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "1rem",
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Main text card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              gridColumn: "1",
              gridRow: "1",
              background: "var(--dt-surface)",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)",
              borderRadius: "var(--dt-radius-lg)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {h.eyebrow && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.7rem",
                  background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                  color: "var(--dt-primary)",
                  borderRadius: "9999px",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
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
              </span>
            )}
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
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                lineHeight: 1.1,
                color: "var(--dt-text)",
                margin: 0,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            <InlineText
              section="hero"
              fieldKey="subheadline"
              value={h.subheadline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{ fontSize: "0.9rem", color: "var(--dt-text-muted)", lineHeight: 1.65, margin: 0 }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href={h.cta_url}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.7rem 1.4rem",
                  background: "var(--dt-primary)",
                  color: "var(--dt-primary-foreground)",
                  textDecoration: "none",
                  borderRadius: "var(--dt-radius)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
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
                    padding: "0.7rem 1.25rem",
                    color: "var(--dt-text-muted)",
                    textDecoration: "none",
                    borderRadius: "var(--dt-radius)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    border: "1px solid color-mix(in srgb, var(--dt-text) 18%, transparent)",
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
            </div>
          </motion.div>

          {/* Image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              gridColumn: "2",
              gridRow: "1 / 3",
              background: "color-mix(in srgb, var(--dt-primary) 8%, var(--dt-surface))",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)",
              borderRadius: "var(--dt-radius-lg)",
              overflow: "hidden",
              minHeight: "320px",
              position: "relative",
            }}
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
                <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 20 }}>
                  <PhotoCredit credit={h.image_credit} />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "6rem",
                    opacity: 0.1,
                    userSelect: "none",
                  }}
                >
                  ◈
                </span>
              </div>
            )}
          </motion.div>

          {/* Metric widget */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{
              gridColumn: "1",
              gridRow: "2",
              background: "var(--dt-surface)",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)",
              borderRadius: "var(--dt-radius-lg)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Stats row */}
            <div style={{ display: "flex", gap: "1rem" }}>
              {stats.map((s) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "var(--dt-primary)" }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: "0.55rem", color: "var(--dt-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
                </div>
              ))}
            </div>
            {/* Animated metric bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--dt-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Performance
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={metricValue}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--dt-primary)" }}
                  >
                    {metricValue}%
                  </motion.span>
                </AnimatePresence>
              </div>
              <div style={{ height: 6, background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", borderRadius: 9999 }}>
                <motion.div
                  animate={{ width: `${metricValue}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{
                    height: "100%",
                    background: "var(--dt-primary)",
                    borderRadius: 9999,
                  }}
                />
              </div>
            </div>
            {h.badge_text && (
              <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--dt-text-muted)" }}>
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
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
