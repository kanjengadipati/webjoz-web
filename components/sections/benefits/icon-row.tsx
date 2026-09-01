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

export default function BenefitsIconRow({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: BenefitsVariantProps) {
  const isEN = language === "en";
  const items = b.items ?? [];

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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

        {/* Icon row — horizontal layout, centered */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0",
          justifyContent: "center",
        }}>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {/* Divider between items */}
              {idx > 0 && (
                <div style={{
                  width: "1px",
                  alignSelf: "stretch",
                  background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                  margin: "0",
                  flexShrink: 0,
                }} />
              )}

              <div
                style={{
                  flex: "1 1 180px",
                  minWidth: "160px",
                  maxWidth: "260px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  gap: "1rem",
                  transition: "background 0.2s",
                  borderRadius: idx === 0 ? `var(--dt-radius-lg) 0 0 var(--dt-radius-lg)` : idx === items.length - 1 ? `0 var(--dt-radius-lg) var(--dt-radius-lg) 0` : "0",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, var(--dt-primary) 6%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {/* Large icon circle */}
                {item.stat ? (
                  <div style={{
                    width: 72, height: 72,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 20%, var(--dt-surface)), color-mix(in srgb, var(--dt-primary) 8%, var(--dt-surface)))`,
                    border: `2px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)`,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                    boxShadow: `0 0 24px color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                  }}>
                    <span style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.25rem", color: "var(--dt-primary)", lineHeight: 1 }}>{item.stat}</span>
                    {item.stat_label && <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", color: "var(--dt-text-muted)", letterSpacing: "0.06em" }}>{item.stat_label}</span>}
                  </div>
                ) : (
                  <div style={{
                    width: 72, height: 72,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 20%, var(--dt-surface)), color-mix(in srgb, var(--dt-primary) 8%, var(--dt-surface)))`,
                    border: `2px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)`,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 24px color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                  }}>
                    <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-7 h-7" />
                    </span>
                  </div>
                )}

                {/* Title */}
                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".title"}
                  value={item.title ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.975rem", margin: 0, lineHeight: 1.3 }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

                {/* Description */}
                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".description"}
                  value={item.description ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{ color: "var(--dt-text-muted)", fontSize: "0.825rem", lineHeight: 1.65, margin: 0 }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
