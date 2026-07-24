import React from "react";
import { Award } from "lucide-react";
import { DynamicIcon, InlineText, InlineImage } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { AboutVariantProps } from "./classic";

export default function AboutSplitImage({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const alignStyle = a.textAlign ? { textAlign: a.textAlign as React.CSSProperties['textAlign'] } : {};
  return (
    <section id="about" className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", ...alignStyle }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{a.eyebrow || "Mengenal Kami"}</span>
        <InlineText
          section="about"
          fieldKey="title"
          value={a.title}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="h2"
          style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", margin: 0 }}
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
          style={{ color: "var(--dt-text-muted)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>
      <div style={{ position: "relative", minHeight: "400px", borderRadius: "var(--dt-radius-lg)", overflow: "hidden" }}>
        {a.image_url ? (
          <>
            <InlineImage
              section="about"
              fieldKey="image_url"
              src={a.image_url}
              alt="About"
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              className="w-full h-full position-absolute inset-0"
              style={{ width: "100%", height: "100%", position: "absolute", inset: 0, objectFit: "cover" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
            <div style={{ position: "absolute", bottom: 4, right: 8, zIndex: 20 }}>
              <PhotoCredit credit={a.image_credit} />
            </div>
          </>
        ) : (
          <div style={{ width: "100%", height: "100%", minHeight: "400px", background: `color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))`, border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(var(--dt-primary) 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
            <div style={{ background: "var(--dt-surface)", width: "5rem", height: "5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px color-mix(in srgb, var(--dt-primary) 20%, transparent)", position: "relative", zIndex: 1 }}>
              <span style={{ color: "var(--dt-primary)" }}><DynamicIcon name={a.icon} defaultIcon={Award} className="w-8 h-8" /></span>
            </div>
            <div style={{ position: "relative", zIndex: 1, background: "color-mix(in srgb, var(--dt-surface) 50%, transparent)", backdropFilter: "blur(4px)", padding: "0.5rem 1rem", borderRadius: "2rem" }}>
              <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.9rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{a.title}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
