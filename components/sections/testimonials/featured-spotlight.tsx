"use client";
import React from "react";
import { Quote } from "lucide-react";
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

export default function TestimonialsFeaturedSpotlight({
  testimonials: t,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: TestimonialsVariantProps) {
  if (!t) return null;
  const featured = t.items?.[0];
  if (!featured) return null;
  return (
    <section id="testimonials" style={{ padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 5%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Testimoni</span>
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
        </div>
        <div style={{ position: "relative", background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "3rem 2.5rem", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "-1rem", left: "2rem", width: 40, height: 40, borderRadius: "50%", background: "var(--dt-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Quote style={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <InlineText section="testimonials" fieldKey="items.0.quote" value={featured.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="blockquote" style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--dt-text)", fontStyle: "italic", margin: "0 0 1.5rem" }} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: featured.avatar_color || `color-mix(in srgb, var(--dt-primary) 15%, var(--dt-bg))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--dt-text)" }}>{featured.avatar_initials || featured.name?.charAt(0)}</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <InlineText section="testimonials" fieldKey="items.0.name" value={featured.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" style={{ fontWeight: 700, color: "var(--dt-text)", fontSize: "0.9rem", margin: 0 }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              <p style={{ color: "var(--dt-text-muted)", fontSize: "0.8rem", margin: 0 }}><InlineText section="testimonials" fieldKey="items.0.role" value={featured.role ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />{featured.company ? ` · ${featured.company}` : ""}</p>
            </div>
          </div>
        </div>
        {t.items && t.items.length > 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {t.items.slice(1).map((item, idx) => (
              <div key={idx} style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)`, borderRadius: "var(--dt-radius)", padding: "1rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--dt-text-muted)", fontStyle: "italic", margin: "0 0 0.5rem", lineHeight: 1.4 }}>&ldquo;<InlineText section="testimonials" fieldKey={`items.${idx + 1}.quote`} value={item.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />&rdquo;</p>
                <InlineText section="testimonials" fieldKey={`items.${idx + 1}.name`} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--dt-text)", margin: 0 }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
