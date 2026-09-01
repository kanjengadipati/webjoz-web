"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";

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

export default function BenefitsChecklist({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: BenefitsVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const isEN = language === "en";
  return (
    <section id="benefits" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 5%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "left", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{isEN ? "Benefits" : "Keunggulan"}</span>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{b.title}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {b.items?.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <hr style={{ border: "none", borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, margin: 0 }} />}
              <div style={{ display: "flex", gap: "1rem", padding: "1.25rem 0", alignItems: "flex-start" }}>
                <div style={{ color: "var(--dt-primary)", flexShrink: 0, marginTop: "0.1rem" }}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <InlineText
                      section="benefits"
                      fieldKey={"items." + idx + ".title"}
                      value={item.title ?? ""}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="h3"
                      style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1rem", margin: 0 }}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                    {item.stat && (
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`, padding: "0.15rem 0.6rem", borderRadius: "var(--dt-radius)", whiteSpace: "nowrap" }}>{item.stat}</span>
                    )}
                  </div>
                  <InlineText
                    section="benefits"
                    fieldKey={"items." + idx + ".description"}
                    value={item.description ?? ""}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}
                    multiline
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
