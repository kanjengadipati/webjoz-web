"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Zap, Shield, BarChart2, Eye, EyeOff } from "lucide-react";
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
import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";

export default function HeroTechSaaS({
  hero: h,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const hasSecondary = h.cta_secondary_text && h.cta_secondary_url;

  const dw = h.dashboard_widget;
  const isHidden = dw?.hidden === true;

  const tabLabels: Record<Tab, string> = {
    analytics: dw?.tab_analytics_label || TAB_LABELS.analytics,
    deploy: dw?.tab_deploy_label || TAB_LABELS.deploy,
    monitor: dw?.tab_monitor_label || TAB_LABELS.monitor,
  };

  // Intercept editing state so we can pause animations locally
  const handleEditingStateChange = useCallback((editing: boolean) => {
    setIsInlineEditing(editing);
    onEditingStateChange?.(editing);
  }, [onEditingStateChange]);

  // Auto-cycle tabs — pause only when inline editing inside widget is active
  useEffect(() => {
    if (isInlineEditing) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const idx = TABS.indexOf(prev);
        return TABS[(idx + 1) % TABS.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isInlineEditing]);

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
            transition={isInlineEditing ? { duration: 0 } : { duration: 0.4 }}
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
                animationPlayState: isInlineEditing ? "paused" : "running",
              }}
            />
            <InlineText
              section="hero"
              fieldKey="eyebrow"
              value={h.eyebrow ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isInlineEditing ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
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
              fontSize: "clamp(2.25rem, 6vw, var(--dt-hero-size, 4rem))",
              lineHeight: 1.1,
              color: "var(--dt-text)",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isInlineEditing ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
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
              lineHeight: 1.7,
              maxWidth: "34rem",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
          <HeroAccessory
            accessory={h.accessory}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isInlineEditing ? { duration: 0 } : { duration: 0.4, delay: 0.3 }}
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
            <InlineText
              section="hero"
              fieldKey="cta_text"
              value={h.cta_text}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            /> <ArrowRight style={{ width: 16, height: 16 }} />
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
              <InlineText
                section="hero"
                fieldKey="cta_secondary_text"
                value={h.cta_secondary_text ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              />
            </a>
          )}
        </motion.div>

        {h.badge_text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={isInlineEditing ? { duration: 0 } : { delay: 0.5 }}
            style={{ fontSize: "0.7rem", color: "var(--dt-text-muted)", margin: 0 }}
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
            />
          </motion.p>
        )}
      </div>

      {/* Dashboard preview widget */}
      {isHidden ? (
        isEditorMode && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "2.5rem",
              width: "100%",
              maxWidth: "680px",
              padding: "1rem 1.5rem",
              border: "2px dashed color-mix(in srgb, var(--dt-primary) 35%, transparent)",
              borderRadius: "var(--dt-radius-lg)",
              textAlign: "center",
              background: "color-mix(in srgb, var(--dt-surface) 60%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <EyeOff style={{ width: 14, height: 14, color: "var(--dt-text-muted)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--dt-text-muted)", fontWeight: 500 }}>
                Widget Dashboard (Tech SaaS) sedang disembunyikan
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateField?.("hero", "dashboard_widget.hidden", false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--dt-primary)",
                background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)",
                borderRadius: "9999px",
                cursor: "pointer",
              }}
            >
              <Eye style={{ width: 12, height: 12 }} /> Tampilkan Widget
            </button>
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isInlineEditing ? { duration: 0 } : { duration: 0.7, delay: 0.4 }}
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
          {/* Quick action bar in editor mode */}
          {isEditorMode && onUpdateField && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0.25rem 0.75rem",
                background: "color-mix(in srgb, var(--dt-primary) 5%, transparent)",
                borderBottom: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
              }}
            >
              <button
                type="button"
                onClick={() => onUpdateField("hero", "dashboard_widget.hidden", true)}
                title="Sembunyikan widget dashboard ini"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.65rem",
                  color: "var(--dt-text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                }}
              >
                <EyeOff style={{ width: 11, height: 11 }} /> Sembunyikan Widget
              </button>
            </div>
          )}

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
                  <InlineText
                    section="hero"
                    fieldKey={`dashboard_widget.tab_${tab}_label`}
                    value={tabLabels[tab]}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  />
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
              transition={isInlineEditing ? { duration: 0 } : { duration: 0.25 }}
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
                          transition: isInlineEditing ? "none" : "height 0.4s",
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
                  {[
                    { stepKey: "deploy_step_1", defaultVal: "Build" },
                    { stepKey: "deploy_step_2", defaultVal: "Test" },
                    { stepKey: "deploy_step_3", defaultVal: "Deploy" },
                  ].map(({ stepKey, defaultVal }, i) => {
                    const val = (dw as any)?.[stepKey] || defaultVal;
                    return (
                      <div key={stepKey} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                        <span style={{ fontSize: "0.65rem", color: "var(--dt-text-muted)", minWidth: "3.5rem", textAlign: "right" }}>
                          <InlineText
                            section="hero"
                            fieldKey={`dashboard_widget.${stepKey}`}
                            value={val}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            as="span"
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeTab === "monitor" && (
                <div style={{ display: "flex", gap: "1rem" }}>
                  {[
                    {
                      valKey: "monitor_uptime_value",
                      labelKey: "monitor_uptime_label",
                      defaultVal: "99.9%",
                      defaultLabel: "Uptime",
                    },
                    {
                      valKey: "monitor_latency_value",
                      labelKey: "monitor_latency_label",
                      defaultVal: "12ms",
                      defaultLabel: "Latency",
                    },
                    {
                      valKey: "monitor_errors_value",
                      labelKey: "monitor_errors_label",
                      defaultVal: "0",
                      defaultLabel: "Errors",
                    },
                  ].map(({ valKey, labelKey, defaultVal, defaultLabel }) => {
                    const val = (dw as any)?.[valKey] || defaultVal;
                    const lbl = (dw as any)?.[labelKey] || defaultLabel;
                    return (
                      <div
                        key={valKey}
                        style={{
                          flex: 1,
                          padding: "0.5rem 0.75rem",
                          background: "color-mix(in srgb, var(--dt-primary) 6%, transparent)",
                          borderRadius: "var(--dt-radius)",
                          border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "var(--dt-primary)" }}>
                          <InlineText
                            section="hero"
                            fieldKey={`dashboard_widget.${valKey}`}
                            value={val}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            as="span"
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          />
                        </p>
                        <p style={{ margin: 0, fontSize: "0.55rem", color: "var(--dt-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          <InlineText
                            section="hero"
                            fieldKey={`dashboard_widget.${labelKey}`}
                            value={lbl}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            as="span"
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          />
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      {/* animationPlayState is set inline on the element via isInlineEditing */}
    </section>
  );
}
