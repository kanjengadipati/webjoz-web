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

export default function BenefitsFeaturedGrid({
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
  const [featured, ...rest] = items;

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
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

        {/* Featured card (first item) — full width */}
        {featured && (
          <div
            style={{
              position: "relative",
              marginBottom: "1.25rem",
              background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, var(--dt-surface)) 0%, var(--dt-surface) 60%)`,
              border: `1px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)`,
              borderRadius: "var(--dt-radius-lg)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              overflow: "hidden",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = `0 16px 48px color-mix(in srgb, var(--dt-primary) 22%, transparent)`;
              el.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "none";
              el.style.transform = "none";
            }}
          >
            {/* Decorative glow blob */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px",
              background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 25%, transparent) 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {/* Featured badge */}
              <span style={{
                fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em",
                color: "var(--dt-bg)", background: "var(--dt-primary)",
                padding: "0.25rem 0.75rem", borderRadius: "9999px",
              }}>
                {isEN ? "Highlight" : "Unggulan"}
              </span>

              {/* Stat or icon */}
              {featured.stat ? (
                <span style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "2rem", color: "var(--dt-primary)", lineHeight: 1 }}>
                  {featured.stat}
                  {featured.stat_label && (
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--dt-text-muted)", marginLeft: "0.4rem" }}>{featured.stat_label}</span>
                  )}
                </span>
              ) : (
                <div style={{
                  width: 52, height: 52,
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 30%, transparent), color-mix(in srgb, var(--dt-primary) 10%, transparent))`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 35%, transparent)`,
                  borderRadius: "var(--dt-radius)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 20px color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
                }}>
                  <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                    <DynamicIcon name={featured.icon} defaultIcon={Star} className="w-6 h-6" />
                  </span>
                </div>
              )}
            </div>

            <InlineText
              section="benefits"
              fieldKey={"items.0.title"}
              value={featured.title ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="h3"
              style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "clamp(1.15rem, 3cqw, 1.5rem)", color: "var(--dt-text)", margin: 0, lineHeight: 1.25 }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            <InlineText
              section="benefits"
              fieldKey={"items.0.description"}
              value={featured.description ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{ color: "var(--dt-text-muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0, maxWidth: "52rem" }}
              multiline
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>
        )}

        {/* Remaining cards — 3-column grid */}
        {rest.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {rest.map((item, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  background: `linear-gradient(145deg, color-mix(in srgb, var(--dt-surface) 92%, var(--dt-primary) 8%) 0%, var(--dt-surface) 100%)`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                  borderRadius: "var(--dt-radius-lg)",
                  padding: "1.5rem",
                  display: "flex", flexDirection: "column", gap: "0.875rem",
                  overflow: "hidden",
                  transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 10px 28px color-mix(in srgb, var(--dt-primary) 18%, transparent)`;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 35%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                  el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 15%, transparent)`;
                }}
              >
                {/* Thin top accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 20%, transparent))`,
                  opacity: 0.6,
                }} />

                {item.stat ? (
                  <div>
                    <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.75rem", color: "var(--dt-primary)", margin: 0, lineHeight: 1 }}>{item.stat}</p>
                    {item.stat_label && <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: "0.25rem 0 0" }}>{item.stat_label}</p>}
                  </div>
                ) : (
                  <div style={{
                    width: 40, height: 40,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, transparent), color-mix(in srgb, var(--dt-primary) 6%, transparent))`,
                    border: `1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)`,
                    borderRadius: "var(--dt-radius)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 14px color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                  }}>
                    <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-4 h-4" />
                    </span>
                  </div>
                )}

                <InlineText
                  section="benefits"
                  fieldKey={"items." + (idx + 1) + ".title"}
                  value={item.title ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.975rem", margin: 0, lineHeight: 1.3 }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <InlineText
                  section="benefits"
                  fieldKey={"items." + (idx + 1) + ".description"}
                  value={item.description ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{ color: "var(--dt-text-muted)", fontSize: "0.835rem", lineHeight: 1.65, margin: 0 }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
