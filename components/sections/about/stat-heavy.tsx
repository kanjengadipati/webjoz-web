import React from "react";
import { Award, TrendingUp, Users, Target } from "lucide-react";
import { DynamicIcon, InlineText, InlineImage } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { AboutVariantProps } from "./classic";

const statIcons = [TrendingUp, Users, Target];

export default function AboutStatHeavy({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const stats = [a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3];
  const hasAnyStat = stats.some(Boolean);
  return (
    <section id="about" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      {hasAnyStat && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {stats.map((stat, i) => {
            const keyNum = i + 1;
            if (!stat) return null;
            const Icon = statIcons[i] ?? Award;
            return (
              <div key={keyNum} style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "1.5rem 1.25rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--dt-primary)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--dt-primary)", display: "flex" }}><Icon className="w-5 h-5" /></span>
                </div>
                <p style={{ fontSize: "clamp(1.75rem, 4cqw, 2.75rem)", fontWeight: 800, color: "var(--dt-text)", margin: 0, lineHeight: 1.1, fontFamily: "var(--dt-heading-font)" }}><InlineText section="about" fieldKey={`highlight_stat_${keyNum}.value`} value={stat.value ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
                <p style={{ fontSize: "0.85rem", color: "var(--dt-text-muted)", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}><InlineText section="about" fieldKey={`highlight_stat_${keyNum}.label`} value={stat.label ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "center", alignItems: "center", maxWidth: "48rem", margin: "0 auto" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}><InlineText section="about" fieldKey="eyebrow" value={a.eyebrow || "Mengenal Kami"} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
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
      {a.image_url && (
        <div style={{ position: "relative", marginTop: "2.5rem", borderRadius: "var(--dt-radius-lg)", overflow: "hidden", maxHeight: "300px" }}>
          <InlineImage
            section="about"
            fieldKey="image_url"
            src={a.image_url}
            alt="About"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            className="w-full h-[300px]"
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
          <div style={{ position: "absolute", bottom: 4, right: 8, zIndex: 20 }}>
            <PhotoCredit credit={a.image_credit} />
          </div>
        </div>
      )}
    </section>
  );
}
