"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";

/**
 * Neo-Brutalist — thick borders, offset shadows, sticker-style badges.
 * Suited for: creative agency, streetwear, independent designer, newsletter.
 * Business filter: creative/fashion/design/studio businesses.
 */
export default function HeroNeoBrutalist({ hero: h, design_token }: HeroVariantProps) {
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
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
        className="grid-cols-1 lg:grid-cols-2"
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {h.eyebrow && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
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
              {h.eyebrow}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
          >
            {h.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              fontSize: "1rem",
              color: "var(--dt-text-muted)",
              lineHeight: 1.65,
              maxWidth: "28rem",
              margin: 0,
            }}
          >
            {h.subheadline}
          </motion.p>

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
              {h.cta_text} <ArrowRight style={{ width: 16, height: 16 }} />
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
                {h.cta_secondary_text}
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
              {h.badge_text}
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
                <img
                  src={h.image_url}
                  alt={h.headline}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 8, right: 8 }}>
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
