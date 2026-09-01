"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
}

export default function BenefitsClassic({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: BenefitsVariantProps) {
  const isEN = language === "en";
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section
      id="benefits"
      style={{
        ...py,
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>
            {isEN ? "Benefits" : "Keunggulan"}
          </span>
          <InlineText
            section="benefits"
            fieldKey="title"
            value={b.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {b.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                background: `linear-gradient(145deg, color-mix(in srgb, var(--dt-surface) 90%, var(--dt-primary) 10%) 0%, var(--dt-surface) 100%)`,
                border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                borderRadius: "var(--dt-radius-lg)",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflow: "hidden",
                transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = `0 12px 32px color-mix(in srgb, var(--dt-primary) 20%, transparent)`;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 40%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "none";
                el.style.transform = "none";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 18%, transparent)`;
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 30%, transparent))`,
                  opacity: 0.7,
                }}
              />

              {/* Icon or Stat */}
              {item.stat ? (
                <div>
                  <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "2rem", color: "var(--dt-primary)", margin: 0 }}>{item.stat}</p>
                  {item.stat_label && (
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)" }}>{item.stat_label}</p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    width: 46,
                    height: 46,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 20%, transparent), color-mix(in srgb, var(--dt-primary) 8%, transparent))`,
                    border: `1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)`,
                    borderRadius: "var(--dt-radius)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 16px color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                  }}
                >
                  <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                    <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" />
                  </span>
                </div>
              )}

              <InlineText
                section="benefits"
                fieldKey={"items." + idx + ".title"}
                value={item.title ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="h3"
                style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1.05rem", margin: 0, lineHeight: 1.3 }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
              <InlineText
                section="benefits"
                fieldKey={"items." + idx + ".description"}
                value={item.description ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="p"
                style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
