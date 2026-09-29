"use client";
import React from "react";
import { InlineText, InlineImage } from "../../templates/shared";
import { InlineAddTile } from "../inline-add";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
}

export default function TestimonialsLogoWall({
  testimonials: t,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
}: TestimonialsVariantProps) {
  if (!t) return null;
  // Never invent testimonials/clients on the public site — only real payload data.
  const items = t.items ?? [];
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
            Belum ada testimoni. Tambahkan data testimoni asli.
          </p>
        )}
        {isEditorMode && onAddItem && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <InlineAddTile
              label="Tambah Testimoni"
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
