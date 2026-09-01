"use client";
import React from "react";
import { InlineText } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function TestimonialsLogoWall({
  testimonials: t,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: TestimonialsVariantProps) {
  if (!t) return null;
  const items = t.items?.filter(i => i.logo_url) || [];
  return (
    <section id="testimonials" style={{ padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Klien Kami</span>
        <InlineText
          section="testimonials"
          fieldKey="title"
          value={t.title}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="h2"
          style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
        {t.subtitle && (
          <InlineText
            section="testimonials"
            fieldKey="subtitle"
            value={t.subtitle}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="p"
            style={{ color: "var(--dt-text-muted)", marginTop: "0.75rem", lineHeight: 1.6 }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", marginTop: "3rem", alignItems: "center" }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1.5rem", background: "var(--dt-surface)", borderRadius: "var(--dt-radius-lg)", border: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
              {item.logo_url && <img src={item.logo_url} alt={item.company || item.name} style={{ maxWidth: "100%", height: "48px", objectFit: "contain" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }} />}
              <p style={{ fontSize: "0.75rem", color: "var(--dt-text-muted)", margin: 0 }}>{item.quote}</p>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--dt-text)", margin: 0 }}>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
