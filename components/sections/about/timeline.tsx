import React from "react";
import { Calendar } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { AboutVariantProps } from "./classic";

export default function AboutTimeline({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const milestones = a.milestones || [];
  return (
    <section id="about" style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}><InlineText section="about" fieldKey="eyebrow" value={a.eyebrow || "Perjalanan Kami"} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
        <InlineText
          section="about"
          fieldKey="title"
          value={a.title}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="h2"
          style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
        <InlineText
          section="about"
          fieldKey="body"
          value={a.body}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          multiline={true}
          as="p"
          style={{ color: "var(--dt-text-muted)", maxWidth: "36rem", margin: "1rem auto 0", lineHeight: 1.7, whiteSpace: "pre-line" }}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "2px", height: "100%", background: `linear-gradient(to bottom, var(--dt-primary), color-mix(in srgb, var(--dt-accent) 60%, transparent))`, opacity: 0.3 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {milestones.map((m, mi) => (
            <div key={mi} style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexDirection: mi % 2 === 0 ? "row" : "row-reverse" }}>
              <div style={{ flex: 1, textAlign: mi % 2 === 0 ? "right" : "left" }}>
                <div style={{ display: "inline-block", background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "1.25rem", textAlign: "left", maxWidth: "24rem" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-primary)" }}><InlineText section="about" fieldKey={`milestones.${mi}.year`} value={m.year ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
                  <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.95rem", margin: "0.35rem 0 0" }}><InlineText section="about" fieldKey={`milestones.${mi}.title`} value={m.title ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></h3>
                  {m.description && <p style={{ color: "var(--dt-text-muted)", fontSize: "0.8rem", lineHeight: 1.5, margin: "0.35rem 0 0" }}><InlineText section="about" fieldKey={`milestones.${mi}.description`} value={m.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} multiline as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>}
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 1, width: 36, height: 36, borderRadius: "50%", background: "var(--dt-surface)", border: `2px solid var(--dt-primary)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Calendar style={{ width: 14, height: 14, color: "var(--dt-primary)" }} />
              </div>
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
