"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Zap, Shield, BarChart2 } from "lucide-react";
import type { HeroVariantProps } from "./types";

const TABS = ["analytics", "deploy", "monitor"] as const;
type Tab = typeof TABS[number];

const TAB_ICONS: Record<Tab, React.ElementType> = {
  analytics: BarChart2,
  deploy: Zap,
  monitor: Shield,
};

const TAB_LABELS: Record<Tab, string> = {
  analytics: "Analytics",
  deploy: "Deploy",
  monitor: "Monitor",
};

/**
 * Tech SaaS — high-tech, AI, developer tools, startup.
 * Auto-cycles through dashboard tabs every 2.5s.
 * Business filter: only used for tech/startup/digital businesses.
 */
export default function HeroTechSaaS({ hero: h, design_token }: HeroVariantProps) {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;

  // Auto-cycle tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const idx = TABS.indexOf(prev);
        return TABS[(idx + 1) % TABS.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem 4rem",
        background: h.background_color || "var(--dt-bg)",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--dt-primary) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--dt-primary) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "300px",
          background: `radial-gradient(ellipse, color-mix(in srgb, var(--dt-primary) 22%, transparent), transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        {h.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0.9rem",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 35%, transparent)",
              borderRadius: "9999px",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--dt-primary)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--dt-primary)",
                display: "inline-block",
                animation: "pulse 1.5s infinite",
              }}
            />
            {h.eyebrow}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--dt-heading-font)",
            fontWeight: "var(--dt-heading-weight)" as any,
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            lineHeight: 1.1,
            color: "var(--dt-text)",
            margin: 0,
          }}
        >
          {h.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            color: "var(--dt-text-muted)",
            lineHeight: 1.7,
            maxWidth: "34rem",
            margin: 0,
          }}
        >
          {h.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          <a
            href={h.cta_url}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              background: "var(--dt-primary)",
              color: "var(--dt-primary-foreground)",
              textDecoration: "none",
              borderRadius: "var(--dt-radius)",
              fontWeight: 700,
              fontSize: "0.875rem",
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
                padding: "0.75rem 1.5rem",
                border: "1px solid color-mix(in srgb, var(--dt-text) 20%, transparent)",
                color: "var(--dt-text-muted)",
                textDecoration: "none",
                borderRadius: "var(--dt-radius)",
                fontWeight: 600,
                fontSize: "0.875rem",
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
            transition={{ delay: 0.5 }}
            style={{ fontSize: "0.7rem", color: "var(--dt-text-muted)", margin: 0 }}
          >
            {h.badge_text}
          </motion.p>
        )}
      </div>

      {/* Dashboard preview widget */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "3rem",
          width: "100%",
          maxWidth: "680px",
          background: "color-mix(in srgb, var(--dt-surface) 90%, transparent)",
          border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)",
          borderRadius: "var(--dt-radius-lg)",
          overflow: "hidden",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)",
            padding: "0 1rem",
          }}
        >
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.625rem 0.875rem",
                  fontSize: "0.65rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--dt-primary)" : "var(--dt-text-muted)",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid var(--dt-primary)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                <Icon style={{ width: 11, height: 11 }} />
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{ padding: "1.25rem 1.5rem", minHeight: "90px" }}
          >
            {activeTab === "analytics" && (
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-end" }}>
                {[65, 82, 57, 90, 73, 88, 95].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${h * 0.6}px`,
                        background: i === 6
                          ? "var(--dt-primary)"
                          : `color-mix(in srgb, var(--dt-primary) ${30 + i * 8}%, transparent)`,
                        borderRadius: "3px 3px 0 0",
                        transition: "height 0.4s",
                      }}
                    />
                    <span style={{ fontSize: "0.5rem", color: "var(--dt-text-muted)" }}>
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "deploy" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Build", "Test", "Deploy"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: i < 2 ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-primary) 40%, transparent)",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background: `color-mix(in srgb, var(--dt-primary) ${i < 2 ? 100 : 30}%, transparent)`,
                      }}
                    />
                    <span style={{ fontSize: "0.6rem", color: "var(--dt-text-muted)", width: "3rem", textAlign: "right" }}>
                      {i < 2 ? "Done" : "..."}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "monitor" && (
              <div style={{ display: "flex", gap: "1rem" }}>
                {[
                  { label: "Uptime", value: "99.9%" },
                  { label: "Latency", value: "12ms" },
                  { label: "Errors", value: "0" },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.75rem",
                      background: "color-mix(in srgb, var(--dt-primary) 6%, transparent)",
                      borderRadius: "var(--dt-radius)",
                      border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "var(--dt-primary)" }}>{m.value}</p>
                    <p style={{ margin: 0, fontSize: "0.55rem", color: "var(--dt-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </section>
  );
}
