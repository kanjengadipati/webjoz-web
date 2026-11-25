"use client";
import React from "react";
import { InlineText, InlineImage } from "../../templates/shared";
import { testimonialsStrings } from "./testimonials-strings";
import { InlineAddTile } from "../inline-add";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  editorChrome?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  isExample?: boolean;
  locale?: string;
  language?: string;
}

export default function TestimonialsLogoWall({
  testimonials: t,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  locale,
  language,
}: TestimonialsVariantProps) {
  if (!t) return null;
  const isEN = (language || locale || "").toLowerCase().startsWith("en");
  const L = testimonialsStrings(language || locale || "id");
  // Never invent testimonials/clients on the public site — only real payload data.
  const items = t.items ?? [];
  return (
    <section id="testimonials" style={{ padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }} className="flex flex-col items-center text-center">
        {(t.eyebrow || isEditorMode) && (
          <div className="mb-2">
            <InlineText
              section="testimonials"
              fieldKey="eyebrow"
              value={t.eyebrow ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)", display: "block" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>
        )}
        <div className="w-full">
          <InlineText
            section="testimonials"
            fieldKey="title"
            value={t.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            multiline
            style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem", display: "block" }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </div>
        {(t.subtitle || isEditorMode) && (
          <div className="w-full">
            <InlineText
              section="testimonials"
              fieldKey="subtitle"
              value={t.subtitle}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              multiline
              style={{ color: "var(--dt-text-muted)", marginTop: "0.75rem", lineHeight: 1.6, display: "block" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>
        )}
        {items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", marginTop: "3rem", alignItems: "center" }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1.5rem", background: "var(--dt-surface)", borderRadius: "var(--dt-radius-lg)", border: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
              {item.logo_url || isEditorMode ? (
                <InlineImage
                  section="testimonials"
                  fieldKey={`items.${idx}.logo_url`}
                  src={item.logo_url ?? ""}
                  alt={item.company || item.name}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  style={{ maxWidth: "100%", height: "48px", objectFit: "contain" }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `color-mix(in srgb, var(--dt-primary) 15%, var(--dt-bg))`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", color: "var(--dt-primary)" }}>
                  {item.avatar_initials || (item.name ? item.name.slice(0, 2).toUpperCase() : "CO")}
                </div>
              )}
              <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={item.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" style={{ fontSize: "0.75rem", color: "var(--dt-text-muted)", margin: 0 }} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              <InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--dt-text)", margin: 0 }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </div>
          ))}
        </div>
        )}
        {isEditorMode && items.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--dt-text-muted)", fontSize: "0.8rem", marginTop: "2rem" }}>
            {L.noTestimonialsDesc}
          </p>
        )}
        {isEditorMode && onAddItem && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <InlineAddTile
              label={L.addTestimonial}
              variant="card"
              className="rounded-2xl min-h-[160px] w-full max-w-sm"
              style={{ borderRadius: "var(--dt-radius-lg)" }}
              onClick={onAddItem}
            />
          </div>
        )}
      </div>
    </section>
  );
}
